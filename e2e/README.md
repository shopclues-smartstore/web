# E2E Tests (Playwright)

## Setup

Install browsers once (required before first run):

```bash
PLAYWRIGHT_BROWSERS_PATH=./.playwright-browsers npx playwright install chromium
```

Browsers are stored in `.playwright-browsers/` (gitignored). Or install all: `npx playwright install`

## Commands

| Command | Description |
|---------|-------------|
| `npm run e2e` | Run e2e tests with mocked API (builds app, starts preview, runs tests) |
| `npm run e2e:real` | Run e2e tests against real API (starts server + app, requires DB/Redis/Mongo) |
| `npm run e2e:ui` | Run with Playwright UI (debug mode) |
| `npm run e2e:headed` | Run with visible browser |

## Real API mode (`e2e:real`)

Requires the server's dependencies (Postgres, Redis, MongoDB) to be running. From the repo root:

```bash
cd server && ./scripts/infra-up.sh   # or docker-compose up -d
cd web && npm run e2e:real
```

The script starts the server from `../server`, builds the app with `VITE_API_URL=http://localhost:3000`, then runs tests. The success test hits the real signup endpoint; error/loading tests still use mocks.

## How it works

- Tests live in `e2e/*.spec.ts`
- Playwright starts `npm run build && npm run preview` before tests
- App is served at `http://localhost:4173`
- API calls can be mocked via `page.route()` (see signup.spec.ts)
- Use `data-testid` for stable selectors; prefer `getByRole` / `getByLabel`
