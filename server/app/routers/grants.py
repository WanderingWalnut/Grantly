from __future__ import annotations

from datetime import datetime
import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel, Field, HttpUrl

from app.core.config import settings
from app.models.schemas import GrantsSearchRequest, GrantsSearchResponse
from app.services.browserbase_service import (
    BrowserbaseConfigurationError,
    PdfLinkNotFoundError,
    get_pdf_link_from_grant_page,
)
from app.services.draft_service import DraftGenerationError, generate_draft_from_pdf
from app.services.grant_finder_service import GrantFinderService


logger = logging.getLogger(__name__)

router = APIRouter()


class GrantPdfRequest(BaseModel):
    grant_url: HttpUrl


class GrantPdfResponse(BaseModel):
    session_id: str
    live_view_url: HttpUrl
    pdf_link: HttpUrl


class GrantDraftRequest(BaseModel):
    pdf_link: HttpUrl
    organization_summary: str = Field(
        ...,
        description="Short description of the organization and project context to guide the draft responses.",
        min_length=10,
    )


class GrantDraftResponse(BaseModel):
    draft: Dict[str, Any]
    model: str
    generated_at: datetime
    tokens_used: Optional[int] = None


@router.post("/pdf-link", response_model=GrantPdfResponse, tags=["grants"])
async def fetch_grant_pdf_link(payload: GrantPdfRequest) -> GrantPdfResponse:
    try:
        result = await get_pdf_link_from_grant_page(str(payload.grant_url))
    except PdfLinkNotFoundError as exc:
        raise HTTPException(status_code=404, detail="PDF link not found") from exc
    except BrowserbaseConfigurationError as exc:
        raise HTTPException(status_code=500, detail="Browserbase is not configured") from exc
    except Exception as exc:
        logger.exception("Unexpected error while retrieving PDF link for %s", payload.grant_url)
        raise HTTPException(status_code=500, detail="Failed to retrieve PDF link") from exc
    return GrantPdfResponse(**result)


@router.post("/draft", response_model=GrantDraftResponse, tags=["grants"])
async def generate_grant_draft(payload: GrantDraftRequest) -> GrantDraftResponse:
    try:
        draft_result = await generate_draft_from_pdf(str(payload.pdf_link), payload.organization_summary)
    except DraftGenerationError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Failed to download PDF for drafting.") from exc
    except Exception as exc:
        logger.exception("Unexpected error while generating grant draft for %s", payload.pdf_link)
        raise HTTPException(status_code=500, detail="Failed to generate draft responses.") from exc

    return GrantDraftResponse(
        draft=draft_result.answers,
        model=draft_result.model_name,
        generated_at=datetime.utcnow(),
        tokens_used=draft_result.used_tokens,
    )


@router.post("/search", response_model=GrantsSearchResponse, tags=["grants"])
async def search_grants(payload: GrantsSearchRequest) -> GrantsSearchResponse:
    service = GrantFinderService(settings)
    try:
        grants = await service.find_grants(payload.organization, payload.filters)
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except httpx.HTTPStatusError as exc:
        detail = {
            "message": "Perplexity API returned an error.",
            "status_code": exc.response.status_code,
            "response_text": exc.response.text,
        }
        raise HTTPException(status_code=502, detail=detail) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Error contacting Perplexity API: {exc}",
        ) from exc

    return GrantsSearchResponse(
        mode=settings.mode,
        count=len(grants),
        results=grants,
        generated_at=datetime.utcnow(),
    )

