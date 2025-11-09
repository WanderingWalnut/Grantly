from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
import re
from typing import Any, Dict
from urllib.parse import urljoin

from browserbase import Browserbase
from playwright.async_api import (
    BrowserContext,
    Error as PlaywrightError,
    Locator,
    Page,
    TimeoutError as PlaywrightTimeout,
    async_playwright,
)

from app.core.config import settings

logger = logging.getLogger(__name__)


class BrowserbaseConfigurationError(RuntimeError):
    """Raised when Browserbase configuration is missing or invalid."""


class PdfLinkNotFoundError(RuntimeError):
    """Raised when the target PDF link cannot be located."""


@dataclass(slots=True)
class BrowserbaseSession:
    """Lightweight representation of a Browserbase session."""

    id: str
    connect_url: str
    live_view_url: str


async def create_session() -> BrowserbaseSession:
    """
    Create a Browserbase session using the official SDK.

    Returns:
        BrowserbaseSession: Session metadata needed to connect and share Live View.

    Raises:
        BrowserbaseConfigurationError: When API credentials are missing.
        RuntimeError: When the created session is missing required fields.
    """
    api_key = settings.browserbase_api_key
    if not api_key:
        raise BrowserbaseConfigurationError("BROWSERBASE_API_KEY is not configured.")

    bb = Browserbase(api_key=api_key)

    def _create_session() -> Any:
        session_kwargs: Dict[str, Any] = {"keep_alive": True}
        if settings.browserbase_project_id:
            session_kwargs["project_id"] = settings.browserbase_project_id
        if settings.browserbase_region:
            session_kwargs["region"] = settings.browserbase_region
        return bb.sessions.create(**session_kwargs)

    session = await asyncio.to_thread(_create_session)

    session_id = getattr(session, "id", None)
    connect_url = getattr(session, "connect_url", None)
    live_view_url = getattr(session, "live_view_url", None)

    if not session_id or not connect_url:
        raise RuntimeError("Browserbase session is missing required fields.")

    if not live_view_url:
        live_view_url = f"https://browserbase.com/sessions/{session_id}"

    return BrowserbaseSession(
        id=session_id,
        connect_url=connect_url,
        live_view_url=live_view_url,
    )


async def _locate_pdf_link(page: Page) -> Locator:
    """Return a locator that targets the CFEP PDF link."""
    link_by_role = page.get_by_role("link", name=re.compile("CFEP Small Sample Application", re.IGNORECASE))
    if await link_by_role.count() > 0:
        return link_by_role.first

    primary = page.get_by_text("CFEP Small Sample Application", exact=False)
    if await primary.count() > 0:
        return primary.first

    fallback = page.locator("a[href$='.pdf']")
    if await fallback.count() > 0:
        return fallback.first

    raise PdfLinkNotFoundError("PDF link not found on the grant page.")


async def _derive_pdf_url(page: Page, grant_url: str, locator: Locator) -> str:
    """Extract the PDF URL from the provided locator, falling back to scanning anchors."""
    href = None
    try:
        href = await locator.get_attribute("href")
    except PlaywrightError:
        logger.debug("Failed to read href from CFEP link.", exc_info=True)

    if href:
        normalized = urljoin(grant_url, href)
        if normalized.lower().endswith(".pdf"):
            return normalized

    anchors = await page.eval_on_selector_all(
        "a[href]",
        """elements => elements
            .map(element => element.getAttribute('href'))
            .filter(href => href && /cfep|sample|community/i.test(href))""",
    )

    for anchor in anchors or []:
        if not anchor:
            continue
        normalized = urljoin(grant_url, anchor)
        if normalized.lower().endswith(".pdf"):
            return normalized

    raise PdfLinkNotFoundError("PDF link not found on the grant page.")


async def _click_and_capture_pdf_url(
    context: BrowserContext,
    page: Page,
    locator: Locator,
    fallback_pdf_url: str,
) -> str:
    """
    Click the PDF link and attempt to capture the final URL after the click.

    Returns:
        str: Final URL observed after the click (defaults to fallback_pdf_url).
    """
    try:
        await locator.scroll_into_view_if_needed(timeout=5_000)
    except PlaywrightTimeout:
        logger.debug("scroll_into_view_if_needed timed out; attempting manual scroll.", exc_info=True)
        try:
            handle = await locator.element_handle()
            if handle:
                await page.evaluate(
                    "(element) => element.scrollIntoView({behavior: 'smooth', block: 'center'})",
                    handle,
                )
                await page.wait_for_timeout(500)
        except PlaywrightError:
            logger.debug("Manual scroll fallback failed.", exc_info=True)

    try:
        async with context.expect_page(timeout=3_000) as new_page_info:
            await locator.click()
        new_page = await new_page_info.value
        try:
            await new_page.wait_for_load_state("load", timeout=5_000)
        except PlaywrightTimeout:
            logger.debug("Timeout while waiting for PDF page to finish loading.", exc_info=True)
        new_url = new_page.url or fallback_pdf_url
        if new_url.lower().endswith(".pdf"):
            return new_url
        return fallback_pdf_url
    except PlaywrightTimeout:
        logger.debug("No new page opened after clicking CFEP PDF link; checking current page.")
        try:
            await page.wait_for_load_state("networkidle", timeout=3_000)
        except PlaywrightTimeout:
            logger.debug("Timeout while waiting for current page after PDF click.", exc_info=True)
        current_url = page.url
        if current_url.lower().endswith(".pdf"):
            return current_url
        return fallback_pdf_url
    except PlaywrightError as exc:
        logger.warning("Failed to click CFEP PDF link: %s", exc)
        return fallback_pdf_url


async def _ensure_step_four_expanded(page: Page) -> None:
    """Ensure the Step 4 accordion section is expanded so the PDF link is visible."""
    try:
        step_button = page.get_by_role("button", name=re.compile(r"Step\s*4", re.IGNORECASE))
        if await step_button.count() == 0:
            return
        button = step_button.first
        expanded = await button.get_attribute("aria-expanded")
        if not expanded or expanded.lower() != "true":
            await button.click()
            await page.wait_for_timeout(300)
    except PlaywrightError:
        logger.debug("Unable to expand Step 4 accordion.", exc_info=True)


async def get_pdf_link_from_grant_page(grant_url: str) -> Dict[str, str]:
    """
    Launch a Browserbase session, load the grant page, and extract the PDF link.

    Args:
        grant_url: Fully qualified URL to the Government of Alberta grant page.

    Returns:
        dict: Session metadata and the resolved PDF URL.

    Raises:
        PdfLinkNotFoundError: When no matching PDF link is found.
        BrowserbaseConfigurationError: When Browserbase credentials are missing.
    """
    session = await create_session()

    async with async_playwright() as playwright:
        browser = await playwright.chromium.connect_over_cdp(session.connect_url)
        try:
            try:
                context = browser.contexts[0]
            except IndexError as exc:
                raise RuntimeError("No contexts available in the Browserbase session.") from exc

            page = context.pages[0] if context.pages else await context.new_page()

            await page.goto(grant_url, wait_until="networkidle")
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight / 2)")
            await page.wait_for_timeout(1_000)
            await _ensure_step_four_expanded(page)

            locator = await _locate_pdf_link(page)
            pdf_link = await _derive_pdf_url(page, grant_url, locator)
            pdf_link = await _click_and_capture_pdf_url(context, page, locator, pdf_link)

            return {
                "session_id": session.id,
                "live_view_url": session.live_view_url,
                "pdf_link": pdf_link,
            }
        except PdfLinkNotFoundError:
            logger.warning("Failed to locate CFEP PDF link for url=%s", grant_url)
            raise
        except (PlaywrightTimeout, PlaywrightError) as exc:
            logger.error("Playwright error while scraping grant page: %s", exc)
            raise
        finally:
            try:
                await browser.close()
            except Exception:
                logger.debug("Failed to close Playwright browser cleanly.", exc_info=True)
