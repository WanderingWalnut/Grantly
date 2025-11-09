# Grantly

Fast, AI-assisted grant preparation for Canadian nonprofits powered by FastAPI, React, Browserbase, and Google Gemini.

## Highlights

- **Grant discovery**: Browserbase + Playwright sessions capture program PDFs and metadata, feeding a React matches dashboard that caches results locally.
- **Draft generation**: FastAPI service downloads grant PDFs, extracts text with `pypdf`, and prompts Google Gemini using a shared organization profile to produce structured answers for CFEP applications.
- **Review workspace**: Editors adjust AI drafts, inspect Browserbase session details, and export submissions within an interactive React UI backed by a global application context.

## Quick Start

```bash
pip install -r server/requirements.txt
pnpm install --prefix client
```

Configure environment variables (Browserbase, Gemini, Supabase) in `server/.env` and `client/.env`, then run the FastAPI backend and React dev server in parallel. Once running, use the Matches page to launch a Browserbase session and generate drafts for review.
