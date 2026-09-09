# Solfa Scanner

Photograph tonic sol-fa notation, correct any misreads, and play it back as audio.

## Prerequisites

- Node.js >= 20
- npm >= 10

## Getting started

```bash
git clone <repo-url>
cd solfa-scanner
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Common commands

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the web dev server         |
| `npm run build`        | Build the web app for production |
| `npm run lint`         | Lint all code with ESLint        |
| `npm run lint:fix`     | Auto-fix lint issues             |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check code is formatted          |
| `npm run typecheck`    | Type-check all packages          |

## Project structure

```
solfa-scanner/
  apps/
    web/            # React + Vite frontend
    api/            # Node backend (Express/Fastify)
  packages/
    sdm/            # Shared Song Data Model types + zod validation
    parser/         # Rule-based sol-fa grammar parser
  docs/
    project-context.md   # Project overview and requirements
```

This is an npm workspaces monorepo. Workspaces are defined in the root `package.json`.

## Code style

ESLint (flat config, ESLint 9) + Prettier are configured at the repo root and enforced on all workspaces. Run `npm run lint && npm run format:check` before pushing.
