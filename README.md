# Dashboard Widgets Toolkit Demo

- Author: Richard McQuiston
- Website: https://richardmcquiston.com/

## Overview

Single Page Application (SPA) demo page demonstrating the features of the dashboard-widgets NPM package.

**Live demo:** https://dashboard-widgets-toolkit-demo.vercel.app/

## Getting Started

### Prerequisites

- Node.js 20+ and npm.

### Installation

```bash
npm install
```

> `@richardmcquiston01/dashboard-widgets-toolkit` is not on npm yet, so
> `package.json` installs the packed tarball in [`vendor/`](./vendor). Once
> the package is published, replace it with `npm install
@richardmcquiston01/dashboard-widgets-toolkit` and delete `vendor/`.

### Usage

```bash
npm run dev          # local dev server
npm run build        # type-check and build to dist/
npm run preview      # serve the production build
npm run format:check # Prettier
```

### Examples

The demo is a Vite + React + TypeScript + Tailwind CSS single page app with
four tabs (deep-linkable, e.g. `#validation`) under a header that keeps the title and tabs
in view while the description and links fold away as you scroll,
a floating jump-to-top button and a copyright footer:

- **Interactive dashboard** tab: all seven widget kinds plus an empty state,
  resolved with `resolveWidgets`. Move, hide and minimise cards; the layout
  persists in `localStorage`.
- **Error demo** toggle (off by default): adds a clearly labelled widget whose
  provider intentionally throws, showing that one failure stays on its own
  card (with a Retry button) while the rest of the dashboard keeps working.
- **Locale switcher**: formats numbers and currency per locale. Providers
  receive the locale and currency in their context and set `currency` on
  `KPI` and `GRAPH` payloads (the toolkit defaults to USD otherwise).
- **Fill rows**: stretches cards to equal height per row and packs them
  densely. The toolkit grid aligns cards to the start, so this is a few lines
  of CSS in [`src/index.css`](./src/index.css) (`align-items: stretch` and
  `grid-auto-flow: dense` on `.dwt-grid`). Toggle it off to see the default.
- **Light / dark theme** (blue brand palette via `--dwt-*` custom properties)
  and a **Refresh** that re-runs the providers.
- **Overview** tab: what the toolkit is, its features and widget kinds.
- **Payload validation** tab, a playground: `validateWidgetData` with
  field-level errors.

Widgets and simulated providers live in
[`src/data/widgets.ts`](./src/data/widgets.ts).

## Deployment

Deployed to Vercel (framework preset: Vite, build `npm run build`, output
`dist`; see [`vercel.json`](./vercel.json)). Feature branches merge into `dev`
through pull requests; `dev` merges into `main` after testing.

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## License

Apache 2

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
