from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import Any, Dict
from urllib.parse import urljoin

from browserbase import Browserbase
from playwright.async_api import (
    Error as PlaywrightError,
    TimeoutError as PlaywrightTimeout,
    Page,
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


async def _resolve_pdf_href(page: Page, grant_url: str) -> str:
    locator = page.get_by_text("CFEP Small Sample", exact=False)
    try:
        href = await locator.first.get_attribute("href")
    except PlaywrightError:
        href = None

    if href:
        return urljoin(grant_url, href)

    anchors = await page.eval_on_selector_all(
        "a",
        "elements => elements.map(element => element.getAttribute('href'))",
    )

    for anchor in anchors or []:
        if not anchor:
            continue
        normalized = urljoin(grant_url, anchor)
        if normalized.lower().endswith(".pdf"):
            return normalized

    raise PdfLinkNotFoundError("PDF link not found on the grant page.")


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

            pdf_link = await _resolve_pdf_href(page, grant_url)

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
