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
        alt="The demo's interactive dashboard on its Catalog page: a blue header with tabs, controls for settings, pages, edit mode, locks and errors, a Customize button and page bar, then Most popular products shown as bars, Recent orders as a table beside a clone of it shown as a line chart, and an empty New reviews card on a 12-column grid."
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
package (`^0.12.0`).

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
  loaded with the `useWidgets` hook so each card fills in on its own as its
  data arrives (the demo gives every provider a different fake latency).
  Move, hide and minimize cards (minimized cards wait in a "Minimized:" bar);
  the layout persists in `localStorage` through a storage adapter.
- **Widget widths** on a 12-column grid: each definition sets `width` (for
  example 3 for the KPI tiles, 6 for charts, 8 for the products table).
- **Detail view**: the eye button on "Most popular products", "Orders by
  country" and "Recent orders" opens a dialog with search, column filters,
  sortable headers and paging. The demo's `loadDetail` returns the full rows;
  a real app would query its database there.
- **Table controls**: "Most popular products" and "Recent orders" set
  `tableControls: true`, giving the card itself a search box and sortable
  headers over the rows it shows (the eye button opens the full list).
- **Freshness**: each card shows "Updated 2 minutes ago" and has a refresh
  button. **Simulate outage** makes Revenue, Refund rate and Revenue by month
  fail, so refreshing one shows a failed refresh keeping the last good data
  with a badge instead of an error card.
- **Export and print**: download buttons on tables, bar lists and charts (CSV,
  and SVG or PNG for charts), a Download CSV button in the detail dialogs, and a
  print stylesheet for a clean "Save as PDF".
- **Detail view, the rest**: "Recent orders" opens a server-mode detail view
  (the demo's loader plays the server, with a delay) with a **Rows per page**
  choice (10, 25, 50) and a **Columns** menu; pages already loaded come back at
  once when you return to them, and the page size and hidden columns are in the
  URL (`size`, `hide`). "Revenue by month" (a chart) opens a detail table built
  from its own data, and "Most popular products" has a Columns menu.
- **Widget Builder** (its own tab): make widgets from a form. Pick one of three
  described data sources, choose which options viewers get and their defaults,
  add views, set the width and lock, and watch a preview drawn from sample data.
  Changes the source can't serve are refused with a reason; saved widgets are
  JSON in this browser and load through the demo's own providers.
  Switch to **Viewer** to see the same screen under a policy (allowed sources, a
  widget quota, only some fields editable): the server's check, `validateViewerSave`,
  refuses anything more, and a button tries to cheat it.
- **Pages**: the three pages swipe on a touch screen, a card dragged by its
  handle onto another page's tab moves there (while customizing), and a page two
  away from the one in view is released and loads again when you come back
  (`loadWhen: 'visible'`, `release`, `farPageWidgetKeys`).
- **Error demo** toggle (off by default): adds a clearly labelled widget whose
  provider intentionally throws, showing that one failure stays on its own
  card (with a Retry button) while the rest of the dashboard keeps working.
- **Settings** (gear button): a modal with the light / dark mode, the color theme
  picker and the locale switcher.
- **Locale switcher** (in Settings): formats numbers and currency per locale. Providers
  receive the locale and currency in their context and set `currency` on
  `KPI` and `GRAPH` payloads (the toolkit defaults to USD otherwise).
- **Fill widgets** toggle: every widget definition in
  [`src/data/widgets.ts`](./src/data/widgets.ts) sets the toolkit's per-widget
  `fill: 'both'`, so cards stretch to their row's height and take the columns
  left over in their row. The toggle drops `fill` from the definitions to show
  the default layout (cards only as big as their content).
- **Light / dark mode** (in Settings; blue brand palette via `--dwt-*` custom properties)
  and a **Refresh** that re-runs the providers.
- **Color theme picker** (Settings): presets (including the toolkit's
  `highContrast` and `mono`), a custom accent and a Compact density switch,
  each built with `createTheme` and passed to `Dashboard` as `theme`. A live
  Theme check lists the `checkTheme` contrast and color-vision warnings.
- **Field types**: the Wholesale accounts table on the Catalog page shows
  `image`, `email`, `url`, `color` and `custom` (status badge) columns.
- **Remembered page and Revert**: a reload returns to the page you were on, and
  Revert changes still works after a reload in the middle of Customize.
- **Customize / Done edit mode**: the Arrange icon on each card (a menu with
  Move earlier, Move later, Move to page and Hide) shows only after pressing
  Customize, with Reset layout and Revert changes in the toolbar. A
  toggle returns to the always-on controls.
- **Locked widgets**: "Sync status" is pinned (it can still be hidden or
  minimized) and "Store policy" cannot be moved, hidden or minimized. The
  "Administrator" toggle passes `overrideLocks`.
- **Pages**: three pages with a page bar (shown for two or more pages). While
  customizing, add, rename, move and delete pages, and move a widget to another
  page; the "Pages" toggle switches to a single page.
- **Declared options and the Options dialog**: six widgets declare options with
  defaults (rows shown, months, period, a text filter, columns, sort). Press
  Customize, open a card's Arrange icon and choose **Options…** to change its
  title, width (Most popular products and Recent orders can't go below half the
  row; the KPI tiles can't go above half), whether it grows to fill its row, and
  its declared options. Apply, Discard, Reset to defaults and Revert to before
  editing each ask first. The choices are saved in the layout (localStorage), and
  only the widgets whose values changed reload. Store policy is locked against
  options until you switch on Administrator.
- **Alternate views and clones**: Most popular products and Recent orders
  declare `views` (bars, a chart), chosen in the Options dialog's **View**
  field. **Duplicate** in the Arrange menu makes a clone with its own view,
  width, title and options, loaded through the original's provider; **Delete
  this widget** in the clone's dialog removes it. Store policy can't be
  duplicated, and a page with no room disables Duplicate.
- **Views your provider supplies**: Revenue can show as the **Total** (the KPI)
  or a **Trend** (a line chart). The Trend is not converted from the KPI: the
  provider is called with `options.view` and returns a chart, and only the view
  on show loads.
- **Shareable detail views**: the open detail dialog lives in the URL, for
  example `/?widget=recent-orders&sort=total:desc&page=2#dashboard`. Opening and
  closing a dialog add history entries (Back closes it), while searching,
  sorting and paging update the address in place. Reload or share the link and
  the same view opens. The demo uses `parseDetailLink` and `withDetailLink`
  from the toolkit; the tab stays in the hash.
- **Drag and drop**: while customizing, each card has a grip next to its Arrange
  icon. Drag it with a mouse or finger, or use the keyboard (Space or Enter to
  pick up, arrow keys to move, Space or Enter to drop, Escape to cancel). The
  move buttons in the Arrange menu still work.
- **Storage adapters**: the layout is saved with `useStoredLayout` over a
  `localStorage` adapter ([`src/data/localStorageAdapter.ts`](./src/data/localStorageAdapter.ts))
  with an in-memory fallback; changes made in another tab are offered with a
  ✓ / X prompt.
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

[**Donate via PayPal**](https://www.paypal.com/ncp/payment/3PW7XW8F4ZSTG), or scan:

<a href="https://www.paypal.com/ncp/payment/3PW7XW8F4ZSTG"><img src="./donate.png" alt="Donate via PayPal" width="180"></a>

## License

Apache 2

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
