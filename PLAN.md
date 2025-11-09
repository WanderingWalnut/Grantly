 # FastAPI Grant Finder — Hackathon Plan
 
 Goal: Ship a minimal, modular FastAPI service that returns structured, relevant, currently open Government of Canada grants for a nonprofit org. Start with mock data, then swap to Perplexity Search API.
 
 ---
 
 ## Folder Structure (minimal, modular)
 
 ```
 app/
   main.py                    # FastAPI app + startup
   core/
     config.py                # Settings (env, mode, API keys)
   models/
     schemas.py               # Pydantic request/response models
   routers/
     grants.py                # /api/grants endpoints
   services/
     grant_finder_service.py  # Orchestrates query -> results
     perplexity_client.py     # Thin Perplexity API client
     parsing/
       grants_parser.py       # Parse/normalize results to Grant model
   data/
     samples/
       grants_sample.json     # Mock data used in mock mode
 ```
 
 Notes:
 - Keep code small and composable: router -> service -> client/parser.
 - One service entrypoint: `GrantFinderService.find_grants()` returns `List[Grant]`.
 
 ---
 
 ## Milestones (optimize for speed)
 
 - Milestone A (mock, 60–90m):
   - Scaffold FastAPI, models, router, service in mock mode.
   - Return filtered results from `data/samples/grants_sample.json`.
   - Ship a working POST `/api/grants/search`.
 - Milestone B (live, +60–90m):
   - Add `PerplexityClient` and prompt builder.
   - Parse JSON result; fallback to heuristic parsing.
   - Toggle via `GRANT_FINDER_MODE=live` without code changes.
 
 ---
 
 ## Dependencies
 
 - FastAPI, Uvicorn, httpx, pydantic, pydantic-settings (or python-dotenv), orjson (optional), tenacity (optional retry)
 
 Example:
 ```
 pip install fastapi uvicorn httpx pydantic-settings orjson tenacity
 ```
 
 ---
 
 ## Config and Modes
 
 - Env-driven settings (12-factor):
   - `GRANT_FINDER_MODE`: `mock` | `live` (default: `mock`)
   - `PERPLEXITY_API_KEY`: your key (already provided)
   - `PERPLEXITY_MODEL`: `sonar-small-online` (default) or other online model
   - `PERPLEXITY_BASE_URL`: `https://api.perplexity.ai`
   - `HTTP_TIMEOUT_SECONDS`: default 20
 
 Example `.env`:
 ```
 GRANT_FINDER_MODE=mock
 PERPLEXITY_API_KEY=sk-...
 PERPLEXITY_MODEL=sonar-small-online
 PERPLEXITY_BASE_URL=https://api.perplexity.ai
 HTTP_TIMEOUT_SECONDS=20
 ```
 
 Behavior:
 - Mock mode: read `data/samples/grants_sample.json`, apply simple filters (NAICS, province, deadline not passed).
 - Live mode: call Perplexity, expect JSON back; normalize to `Grant` schema.
 
 ---
 
 ## API Surface
 
 - POST `/api/grants/search` → returns structured grants
 
 ### Request Model (simplified for hackathon)
 ```python
 class Address(BaseModel):
     street: str | None = None
     city: str | None = None
     province: str | None = None  # e.g., "ON"
     postal_code: str | None = None
     country: str | None = "CA"
 
 class OrganizationInfo(BaseModel):
     legal_name: str
     operating_name: str | None = None
     cra_business_number: str | None = None
     org_structure: Literal["nonprofit", "charity", "coop", "other"] | None = None
     naics_code: str | None = None
     sector_tags: list[str] | None = None
     website: AnyUrl | None = None
     address: Address | None = None
     contact_email: EmailStr | None = None
 
 class GrantFilters(BaseModel):
     province: str | None = None
     min_amount: int | None = None
     deadline_before: date | None = None
     max_results: int = 10
 
 class GrantsSearchRequest(BaseModel):
     organization: OrganizationInfo
     filters: GrantFilters | None = None
 ```
 
 ### Response Model
 ```python
 class Grant(BaseModel):
     title: str
     link: AnyUrl
     summary: str | None = None
     eligibility: str | None = None
     deadline: date | None = None
     amount_min: int | None = None
     amount_max: int | None = None
     currency: str | None = "CAD"
     sponsor: str | None = "Government of Canada"
     program: str | None = None
     region: str | None = None
     tags: list[str] | None = None
     source_citations: list[AnyUrl] | None = None
 
 class GrantsSearchResponse(BaseModel):
     mode: Literal["mock", "live"]
     count: int
     results: list[Grant]
     generated_at: datetime
 ```
 
 ---
 
 ## Router and Flow
 
 - `routers/grants.py`
   - POST `/api/grants/search` → calls `GrantFinderService.find_grants(req.organization, req.filters)`.
 - `services/grant_finder_service.py`
   - If mode = mock → `load_sample()`, filter, return.
   - If mode = live → build prompt, `PerplexityClient.search(...)`, parse via `grants_parser.py`, return.
 
 Pseudocode:
 ```python
 def find_grants(org: OrganizationInfo, filters: GrantFilters | None) -> list[Grant]:
     if settings.mode == "mock":
         data = load_json("app/data/samples/grants_sample.json")
         return filter_and_normalize(data, org, filters)
     raw = perplexity.search(build_prompt(org, filters))
     return parse_to_grants(raw)
 ```
 
 ---
 
 ## Perplexity Integration (live mode)
 
 Strategy: Use Perplexity Chat Completions with online model and force JSON output with a lightweight schema. Ask for citations and Canada-only results that are currently open.
 
 Endpoint (typical): `POST {PERPLEXITY_BASE_URL}/chat/completions`
 
 Headers:
 - `Authorization: Bearer {PERPLEXITY_API_KEY}`
 - `Content-Type: application/json`
 
 Body (example):
 ```json
 {
   "model": "sonar-small-online",
   "temperature": 0.1,
   "return_citations": true,
   "messages": [
     {"role": "system", "content": "You return only valid JSON with fields: title, link, summary, eligibility, deadline (YYYY-MM-DD or null), amount_min, amount_max, currency='CAD'. Only include currently open Government of Canada programs. Exclude provincial/municipal and closed calls."},
     {"role": "user", "content": "Org: {legal_name}, NAICS: {naics}, Province: {province}. Find up to {k} matching open grants. Respond as JSON array only."}
   ]
 }
 ```
 
 Parsing:
 - Preferred: The model returns a JSON array; parse with `json.loads`.
 - Fallback: Extract first JSON array substring via regex and parse.
 - Map citations from response to `source_citations` when available.
 
 Client sketch (`services/perplexity_client.py`):
 ```python
 async def search(prompt: str) -> dict:
     payload = { ... messages=[{"role":"system",...},{"role":"user","content":prompt}] }
     async with httpx.AsyncClient(timeout=settings.timeout) as client:
         r = await client.post(url, headers=headers, json=payload)
         r.raise_for_status()
         return r.json()
 ```
 
 Prompt builder (`grant_finder_service.py`):
 ```python
 def build_prompt(org, filters) -> str:
     return f"""
     Organization:
     - Legal name: {org.legal_name}
     - NAICS: {org.naics_code}
     - Province: {org.address.province if org.address else None}
     - Structure: {org.org_structure}
 
     Task: List currently open Government of Canada funding programs for nonprofits.
     Output: JSON array with keys [title, link, summary, eligibility, deadline, amount_min, amount_max, currency].
     Only include open federal programs; exclude provincial/municipal and closed items.
     Limit: {filters.max_results if filters else 10}
     """
 ```
 
 Retries and safety:
 - Use 2–3 retries with exponential backoff (tenacity).
 - Timeout 20s.
 
 ---
 
 ## Mock Data (starter)
 
 `app/data/samples/grants_sample.json` (example content):
 ```json
 [
   {
     "title": "Canada Summer Jobs",
     "link": "https://www.canada.ca/en/employment-social-development/services/funding/canada-summer-jobs.html",
     "summary": "Wage subsidies to help employers create summer job opportunities for youth.",
     "eligibility": "Not-for-profit employers and public sector; private sector with restrictions.",
     "deadline": null,
     "amount_min": 0,
     "amount_max": 300000,
     "currency": "CAD",
     "sponsor": "Government of Canada",
     "program": "Canada Summer Jobs",
     "region": "National",
     "tags": ["youth", "employment"],
     "source_citations": [
       "https://www.canada.ca/en/employment-social-development/services/funding/canada-summer-jobs.html"
     ]
   },
   {
     "title": "New Horizons for Seniors Program",
     "link": "https://www.canada.ca/en/employment-social-development/services/funding/new-horizons-seniors-community-based.html",
     "summary": "Funding for projects that make a difference in the lives of seniors.",
     "eligibility": "Non-profits, municipalities, Indigenous organizations, and others.",
     "deadline": null,
     "amount_min": 1000,
     "amount_max": 25000,
     "currency": "CAD",
     "sponsor": "Government of Canada",
     "program": "NHSP",
     "region": "National",
     "tags": ["seniors", "community"],
     "source_citations": [
       "https://www.canada.ca/en/employment-social-development/services/funding/new-horizons-seniors-community-based.html"
     ]
   },
   {
     "title": "Investment Readiness Program",
     "link": "https://ised-isde.canada.ca/site/strategic-policy-sector/en/social-innovation-social-finance-strategy/investment-readiness-program",
     "summary": "Supports social purpose organizations to become investment ready.",
     "eligibility": "Nonprofits, charities, co-ops, and social enterprises.",
     "deadline": null,
     "amount_min": 10000,
     "amount_max": 75000,
     "currency": "CAD",
     "sponsor": "Government of Canada",
     "program": "IRP",
     "region": "National",
     "tags": ["social finance", "capacity building"],
     "source_citations": [
       "https://ised-isde.canada.ca/site/strategic-policy-sector/en/social-innovation-social-finance-strategy/investment-readiness-program"
     ]
   }
 ]
 ```
 
 Filtering (mock):
 - If `filters.province` set → keep `region` matching or "National".
 - If `filters.deadline_before` set → drop items with deadline >= date (or keep null as TBD).
 - If `naics_code` present → boost/keep grants with matching tags.
 
 ---
 
 ## File Stubs (what to create)
 
 - `app/main.py`: create app, include router
 - `app/core/config.py`: Pydantic settings, env loading
 - `app/models/schemas.py`: request/response models
 - `app/routers/grants.py`: endpoint wiring
 - `app/services/grant_finder_service.py`: business logic (mock/live)
 - `app/services/perplexity_client.py`: HTTP client wrapper
 - `app/services/parsing/grants_parser.py`: normalize and validate output
 
 Minimal `app/main.py`:
 ```python
 from fastapi import FastAPI
 from app.routers.grants import router as grants_router
 
 app = FastAPI(title="Grantly API")
 app.include_router(grants_router, prefix="/api/grants", tags=["grants"])
 ```
 
 Minimal `app/routers/grants.py`:
 ```python
 from fastapi import APIRouter, Depends
 from app.models.schemas import GrantsSearchRequest, GrantsSearchResponse
 from app.services.grant_finder_service import GrantFinderService
 from app.core.config import settings
 
 router = APIRouter()
 
 @router.post("/search", response_model=GrantsSearchResponse)
 async def search_grants(payload: GrantsSearchRequest):
     svc = GrantFinderService(settings)
     results = await svc.find_grants(payload.organization, payload.filters)
     return {
         "mode": settings.mode,
         "count": len(results),
         "results": results,
         "generated_at": datetime.utcnow(),
     }
 ```
 
 ---
 
 ## Example Requests
 
 cURL:
 ```
 curl -X POST http://localhost:8000/api/grants/search \
   -H 'Content-Type: application/json' \
   -d '{
     "organization": {
       "legal_name": "Example Nonprofit",
       "naics_code": "813110",
       "address": {"province": "ON"}
     },
     "filters": {"max_results": 5}
   }'
 ```
 
 Expected Response (mock):
 ```json
 {
   "mode": "mock",
   "count": 3,
   "results": [ {"title": "Canada Summer Jobs", "link": "https://...", "deadline": null, ...} ],
   "generated_at": "2025-01-01T12:00:00Z"
 }
 ```
 
 ---
 
 ## Prompts and Guardrails (live)
 
 - System: “Return ONLY valid JSON array with fields [title, link, summary, eligibility, deadline, amount_min, amount_max, currency]. Only include currently open Government of Canada programs. Include citations.”
 - User: Include NAICS, province, and max_results; ask to exclude provincial/municipal.
 - Add `search_domain_filter` via prompt text (e.g., `site:canada.ca OR site:ised-isde.canada.ca`).
 - Use low temperature (0.1–0.2) to reduce variance.
 
 ---
 
 ## Validation and Parsing
 
 - `grants_parser.py` responsibilities:
   - Validate JSON types; coerce dates to ISO; infer `currency=CAD`.
   - Clamp `amount_min <= amount_max`; swap if inverted.
   - Drop items missing `title` or `link`.
   - Attach `source_citations` from Perplexity response if present.
 
 ---
 
 ## Run / Dev Loop
 
 - Dev: `uvicorn app.main:app --reload`
 - Toggle mode via `.env` without code changes.
 - Add a handful of mock entries to test filters.
 
 ---
 
 ## Nice-to-haves (time permitting)
 
 - Basic in-memory LRU cache of last queries for 5 minutes.
 - Simple scoring/ranking by keyword match vs. org NAICS/tags.
 - Dockerfile + `make dev`.
 - JSON logging (uvicorn + app).
 
 ---
 
 ## Task List (for Claude)
 
 - [ ] Create folders and stub files as above
 - [ ] Implement `config.py` with env + defaults
 - [ ] Add `schemas.py` with models in this plan
 - [ ] Implement `grants.py` router with `/search`
 - [ ] Add `grants_sample.json` and mock filter logic
 - [ ] Wire `GrantFinderService.find_grants()` (mock first)
 - [ ] Add `PerplexityClient` with chat completions call
 - [ ] Add prompt builder and parser; return `Grant[]`
 - [ ] Toggle mode via `GRANT_FINDER_MODE`
 - [ ] Test with cURL in both modes
 
 ---
 
 ## Notes
 
 - This plan keeps the core small and swappable. Mock mode ships fast; live mode is an additive replace of the data source only. No database or auth is required for hackathon scope.
