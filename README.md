# Dashboard Widgets Toolkit Demo

- Author: Richard McQuiston
- Website: https://richardmcquiston.com/

## Overview

Single Page Application (SPA) demo page demonstrating the features of the dashboard-widgets NPM package.

**Live demo:** https://dashboard-widgets-toolkit-demo.vercel.app/

<p align="center">
  <a href="https://dashboard-widgets-toolkit-demo.vercel.app/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./docs/screenshot-dark.png" />
      <img
        src="./docs/screenshot-light.png"
        alt="The demo's interactive dashboard: a blue header with tabs, then KPI, gauge, text and bar-chart widgets laid out in a grid with equal-height cards."
        width="900"
      />
    </picture>
  </a>
</p>

## Getting Started

### Prerequisites

- Node.js 20+ and npm.

### Installation

```bash
npm install
```

The demo uses the published
[`@richardmcquiston01/dashboard-widgets-toolkit`](https://www.npmjs.com/package/@richardmcquiston01/dashboard-widgets-toolkit)
package (`^0.2.0`).

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
- **Fill widgets** toggle: every widget definition in
  [`src/data/widgets.ts`](./src/data/widgets.ts) sets the toolkit's per-widget
  `fill: 'both'`, so cards stretch to their row's height and take the columns
  left over in their row. The toggle drops `fill` from the definitions to show
  the default layout (cards only as big as their content).
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
