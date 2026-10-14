# Solfa Scanner

**Point your phone at a page of sol-fa. Hear it sing.**

Many choirs learn their music from tonic sol-fa sheets: do, re, mi on paper,
no staff, no piano needed. Solfa Scanner turns a photo of one of those sheets
into audio, so you can practise your part at home before rehearsal.

## How it works

1. **Snap** a photo of the sheet.
2. **Fix** whatever the scanner misread. Printed notation is messy, so you stay in control.
3. **Play** it back. A rule-based grammar parser turns your corrected notation
   into a structured song, and the app plays it.

> 🚧 Work in progress.
## Prerequisites

- Node.js >= 20 + npm >= 10
- Python >= 3.11 (via conda `web-dev` env)

## Getting started

```bash
git clone <repo-url>
cd solfa-scanner
```

**Frontend (React):**

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

**Backend (Python/FastAPI):**

```bash
conda activate web-dev
pip install -e packages/sdm -e packages/parser -e apps/api
npm run py:api
```

Runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

## Common commands

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the frontend dev server            |
| `npm run build`     | Build the frontend for production        |
| `npm run py:api`    | Start the Python backend (hot reload)    |
| `npm run lint`      | Lint frontend code with ESLint           |
| `npm run format`    | Format code with Prettier                |
| `npm run typecheck` | Type-check the frontend                  |
| `mypy sdm/`         | Type-check SDM package (in packages/sdm) |
| `ruff check sdm/`   | Lint SDM package (in packages/sdm)       |

## Project structure

```
solfa-scanner/
  apps/
    web/            # React + Vite frontend (TypeScript)
    api/            # Python backend (FastAPI) — src-layout
  packages/
    sdm/            # Song Data Model (Pydantic schemas)
    parser/         # Rule-based sol-fa grammar parser (Python)
  docs/
    project-context.md
```

- `packages/sdm` is shared between backend and frontend (as JSON).
- `packages/parser` is imported only by `apps/api`.

## Code style

**Frontend:** ESLint (flat config) + Prettier, enforced at the repo root.
**Backend:** mypy (strict) + ruff, configured per-package in `pyproject.toml`.
