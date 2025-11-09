from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.main import app as fastapi_app
from app.services.browserbase_service import PdfLinkNotFoundError


@pytest.mark.asyncio
async def test_fetch_pdf_link_success(monkeypatch: pytest.MonkeyPatch) -> None:
    async def _fake_get_pdf_link(grant_url: str) -> dict[str, str]:
        return {
            "session_id": "session-123",
            "live_view_url": "https://browserbase.com/sessions/session-123",
            "pdf_link": "https://www.alberta.ca/cfep-small-sample.pdf",
        }

    monkeypatch.setattr(
        "app.services.browserbase_service.get_pdf_link_from_grant_page",
        _fake_get_pdf_link,
    )

    async with AsyncClient(app=fastapi_app, base_url="http://test") as client:
        response = await client.post(
            "/api/grants/pdf-link",
            json={"grant_url": "https://www.alberta.ca/community-facility-enhancement-program-small"},
        )

    assert response.status_code == 200
    assert response.json() == {
        "session_id": "session-123",
        "live_view_url": "https://browserbase.com/sessions/session-123",
        "pdf_link": "https://www.alberta.ca/cfep-small-sample.pdf",
    }


@pytest.mark.asyncio
async def test_fetch_pdf_link_not_found(monkeypatch: pytest.MonkeyPatch) -> None:
    async def _fake_get_pdf_link(_: str) -> dict[str, str]:
        raise PdfLinkNotFoundError("missing")

    monkeypatch.setattr(
        "app.services.browserbase_service.get_pdf_link_from_grant_page",
        _fake_get_pdf_link,
    )

    async with AsyncClient(app=fastapi_app, base_url="http://test") as client:
        response = await client.post(
            "/api/grants/pdf-link",
            json={"grant_url": "https://www.alberta.ca/community-facility-enhancement-program-small"},
        )

    assert response.status_code == 404
    assert response.json() == {"detail": "PDF link not found"}

