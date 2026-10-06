# CHANGELOG

## Unreleased

### Changed

- Compact top banner (about half the previous height): smaller title, a
  one-line description with the links beside it.

### Changed

- The intentionally failing widget is now behind an "Error demo" toggle (off
  by default) and clearly labelled as an intentional demo, instead of always
  showing an unexplained error card. Its message text now matches the card
  body size.
- Dashboard loads ignore stale results when the widget set changes mid-load.

### Added

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
- Temporary vendored tarball of the toolkit (v0.1.0) until it is published to
  npm.

### Changed

- Blue brand theme: gradient header banner, tinted page, blue-first chart
  palette and card accents, in light and dark.
- Donate card shrunk to 75% and recoloured to match the theme.

### Removed

- The "Live demo" label above the title.
