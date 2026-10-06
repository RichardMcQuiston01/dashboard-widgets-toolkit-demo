# Dashboard Widgets Toolkit Demo

- Author: Richard McQuiston
- Website: https://richardmcquiston.com/

## Overview

Single Page Application (SPA) demo page demonstrating the features of the dashboard-widgets NPM package.

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

The demo is a Vite + React + TypeScript + Tailwind CSS single page app:

- **Interactive dashboard**: all seven widget kinds, an empty state and a
  failing provider, resolved with `resolveWidgets`. Move, hide and minimise
  cards; the layout persists in `localStorage`.
- **Locale switcher**: formats numbers and currency per locale.
- **Light / dark theme** and a **Refresh** that re-runs the providers.
- **Payload validation playground**: `validateWidgetData` with field-level
  errors.

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
