# CHANGELOG

## Unreleased

### Changed (toolkit 0.4.1)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.4.1`.
- The dashboard loads with `useWidgets`: placeholders first, then each card
  fills in as its own provider resolves (staggered fake latency per widget),
  replacing the single `resolveWidgets` call.
- Widgets set a 12-column `width` (KPI tiles 3, charts 6, products table 8,
  and so on), fixing cramped tables.
- New "Most popular products" widget; "Most popular products", "Orders by
  country" and "Recent orders" have a detail view (eye button) with search,
  filters, sorting and paging.
- American English text ("minimize").
- The detail dialog stays centered under Tailwind's preflight margin reset
  (fixed in toolkit 0.4.1, so no CSS workaround is needed).

### Fixed

- The locale switcher now changes the currency symbol everywhere: the KPI and
  chart payloads set `currency` (the toolkit defaults to USD without it), and
  the "Recent orders" table formats totals with `formatValue` instead of
  hard-coded `$` strings.

### Changed

- Compact top banner (about half the previous height): smaller title, a
  one-line description with the links beside it.
- "Fill rows" is now the toolkit's per-widget `fill` setting instead of a CSS
  override in the demo: each widget definition sets `fill: 'both'`, and the
  toggle ("Fill widgets") removes it to show the default layout.
- The toolkit now comes from npm (`@richardmcquiston01/dashboard-widgets-toolkit`
  `^0.2.0`, which adds `fill`) instead of a vendored tarball.
- The intentionally failing widget is now behind an "Error demo" toggle (off
  by default) and clearly labelled as an intentional demo, instead of always
  showing an unexplained error card. Its message text now matches the card
  body size.
- Dashboard loads ignore stale results when the widget set changes mid-load.
- Blue brand theme: gradient header banner, tinted page, blue-first chart
  palette and card accents, in light and dark.
- Donate card shrunk to 75% and recoloured to match the theme.

### Added

- README screenshots of the demo (light and dark, in `docs/`).
- Vite + React + TypeScript + Tailwind CSS single page app demonstrating
  `@richardmcquiston01/dashboard-widgets-toolkit`: interactive dashboard
  (all widget kinds, empty and error states, persisted layout), locale and
  theme switchers, and a payload validation playground.
- Tabs (Interactive dashboard, Overview, Payload validation, Use it in your
  app) with arrow-key navigation and URL hash deep links.
- Fixed header (title and tabs) that folds away its description and links on
  scroll while keeping the title and tabs visible.
- Floating jump-to-top button and a copyright footer.
- "Fill rows" toggle (on by default) that equalises card heights and packs
  the grid densely, removing gaps beside tall widgets.
- Floating "Buy Me a Coffee" donate card.
- `vercel.json` for Vercel deployment.
- Live demo URL (https://dashboard-widgets-toolkit-demo.vercel.app/) in the
  README.

### Removed

- The vendored toolkit tarball (`vendor/`).
- The "Live demo" label above the title.
