from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException
import httpx

from app.core.config import settings
from app.models.schemas import GrantsSearchRequest, GrantsSearchResponse
from app.services.grant_finder_service import GrantFinderService

router = APIRouter()


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

