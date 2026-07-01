# TalkControl

![version](https://img.shields.io/github/package-json/v/sfeir-open-source/talk-control?color=blue)
![license](https://img.shields.io/github/license/sfeir-open-source/talk-control)
![open issues](https://img.shields.io/github/issues-raw/sfeir-open-source/talk-control)
![CI develop](https://github.com/sfeir-open-source/talk-control/actions/workflows/develop.yml/badge.svg?branch=develop)

TalkControl lets speakers remotely control their slideshow from any device — phone, tablet, or second screen — via a web interface synchronized with the presentation.

## Requirements

- **Node.js 24** (LTS)
- npm 10+

## Getting started

```bash
npm install --legacy-peer-deps
npm start
```

Then open a browser at **http://localhost:3000** (controller).

The app starts three services in parallel:

| Service    | Port | Description                                |
| ---------- | ---- | ------------------------------------------ |
| Controller | 3000 | Remote control interface (Vite dev server) |
| Server     | 3001 | Express 5 WebSocket server                 |
| Showcase   | 3002 | Static file server for the presentation    |

## Development

```bash
# Run in watch mode
npm run test:watch

# Unit + integration tests (Vitest, jsdom)
npm test

# Web component tests (Vitest browser mode, Playwright)
npm run test:components

# End-to-end tests (Playwright)
npm run test:e2e

# Build for production
npm run build

# Lint (ESLint 9 flat config)
npm run lint

# Coverage report
npm run coverage
```

## Documentation

```bash
npm run docs:dev    # Local VitePress dev server
npm run docs:build  # Build static docs
```

## Tech stack

| Concern  | Tool                                        |
| -------- | ------------------------------------------- |
| Runtime  | Node.js 24 LTS                              |
| Language | TypeScript (strict)                         |
| Bundler  | Vite 5                                      |
| Server   | Express 5 + Socket.IO 4                     |
| Tests    | Vitest 4 (jsdom + browser mode), Playwright |
| Linter   | ESLint 9 flat config                        |
| Docs     | VitePress                                   |

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions and pull request guidelines.
Issues: [github.com/sfeir-open-source/talk-control/issues](https://github.com/sfeir-open-source/talk-control/issues)

## Troubleshoot

**`Error: listen EADDRINUSE :::3001`** — another process holds the port:

```bash
lsof -i :3001
kill -9 <PID>
```
