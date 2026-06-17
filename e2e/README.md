# TalkControl E2E Tests — Playwright

This directory contains Playwright end-to-end tests for TalkControl.

## Structure

```
e2e/
├── fixtures/
│   └── index.html        # Minimal HTML fixture representing the controller UI
├── 01-smoke.spec.js      # Basic page load and element presence
├── 02-navigation.spec.js # Navigation button behaviour (prev/next)
├── 03-accessibility.spec.js # Accessibility attributes (lang, aria, headings)
├── 04-components.spec.js # Layout and component presence
└── README.md
```

## Design decisions

The E2E tests use **static HTML fixtures** rather than spinning up the full app (webpack + Express + socket.io). This keeps the test suite:

- Fast (no server startup overhead)
- Self-contained (no port conflicts)
- Reliable in CI (no network dependencies)

The fixture at `e2e/fixtures/index.html` represents the TalkControl controller UI structure with functional navigation logic.

## Running the tests

```bash
# Run all E2E tests
npm run test:e2e

# Open the HTML report after a run
npm run test:e2e:report
```

## Requirements

- Node 20+ (tested with v20.10.0 and v22.x)
- Playwright 1.61+, Chromium browser

Browser binaries are installed via:
```bash
npx playwright install chromium --with-deps
```

## Known issues

None. All 24 tests pass on the current fixture-based approach.

## Future work

When the full app server is integrated, replace the `file://` approach with a `webServer` config in `playwright.config.js` pointing to the webpack dev server.
