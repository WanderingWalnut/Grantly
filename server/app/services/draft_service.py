from __future__ import annotations

import asyncio
import io
import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

import google.generativeai as genai
import httpx
from pypdf import PdfReader

from app.core.config import settings


class DraftGenerationError(RuntimeError):
    """Raised when draft generation fails."""


@dataclass(slots=True)
class DraftGenerationResult:
    answers: Dict[str, Any]
    model_name: str
    used_tokens: Optional[int] = None


async def _download_pdf(pdf_url: str) -> bytes:
    timeout = settings.http_timeout_seconds
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.get(pdf_url)
        response.raise_for_status()
        return response.content


def _extract_pdf_text(pdf_bytes: bytes, max_chars: int = 15000) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    chunks: list[str] = []
    for page in reader.pages:
        text = page.extract_text() or ""
        chunks.append(text.strip())
        if sum(len(chunk) for chunk in chunks) >= max_chars:
            break
    combined = "\n\n".join(chunks)
    return combined[:max_chars]


def _build_prompt(pdf_text: str, organization_summary: str) -> str:
    return f"""
You are an expert grant writer helping draft responses for the Community Facility Enhancement Program (CFEP) Small Sample Application.

Please read the following information carefully and produce a structured JSON object that captures the answers for each question in the application.

Organization Summary:
{organization_summary}

Application PDF Extract:
{pdf_text}

Instructions:
1. Return *only* valid JSON (no markdown fences).
2. Use a top-level object with keys:
   - "organization_fit": summary of why the organization qualifies.
   - "project_overview": detailed description matching the application prompts.
   - "funding_details": object with requested amount, matching contributions, funding sources.
   - "timeline": key milestones with dates.
   - "community_benefits": narrative of community impact.
   - "attachments_needed": array of strings listing documents to prepare.
   - "open_questions": array of outstanding items the organization must clarify.
3. Where a question has no explicit answer in the PDF or organization summary, provide your best assumption and note that it is inferred.
4. Keep values concise but specific so they can be copied into the real application.
"""


def _invoke_gemini(prompt: str) -> DraftGenerationResult:
    api_key = settings.gemini_api_key
    if not api_key:
        raise DraftGenerationError("GEMINI_API_KEY is not configured.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        generation_config={
            "temperature": 0.2,
            "response_mime_type": "application/json",
        },
    )

    response = model.generate_content(prompt)

    if not response:
        raise DraftGenerationError("Empty response from Gemini.")

    raw_text = response.text or ""
    if not raw_text and response.candidates:
        raw_text = "".join(
            part.text
            for candidate in response.candidates
            for part in getattr(candidate.content, "parts", [])
            if getattr(part, "text", None)
        )

    if not raw_text:
        raise DraftGenerationError("Gemini response did not contain text.")

    try:
        answers = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise DraftGenerationError("Failed to decode Gemini JSON output.") from exc

    usage = getattr(response, "usage_metadata", None)
    total_tokens = getattr(usage, "total_token_count", None) if usage else None

    return DraftGenerationResult(
        answers=answers,
        model_name=getattr(response, "model_version", "gemini-1.5-flash"),
        used_tokens=total_tokens,
    )


async def generate_draft_from_pdf(pdf_url: str, organization_summary: str) -> DraftGenerationResult:
    pdf_bytes = await _download_pdf(pdf_url)
    pdf_text = await asyncio.get_event_loop().run_in_executor(None, _extract_pdf_text, pdf_bytes)

    prompt = _build_prompt(pdf_text, organization_summary)
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, _invoke_gemini, prompt)
    return result

