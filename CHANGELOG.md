# CHANGELOG

## Unreleased

### Added (toolkit 0.29.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.29.0` ("Pages,
  the rest").
- **Swipe between pages.** On a touch screen, swipe left or right on the
  dashboard to change page (Overview, Sales & traffic, Catalog). It never starts
  on a button, link, field, drag handle or a table that scrolls sideways, so
  scrolling and tapping work as before. Nothing to enable: it is on for any paged
  dashboard.
- **Drag a card onto a page tab.** While customizing, drag a card by its handle
  over another page's tab: the tab is outlined (solid when the page has room,
  dashed when the drop would be refused) and releasing moves the card there, the
  same move as the Arrange menu's "Move to page".
- **Release far-away pages.** The dashboard now loads with
  `loadWhen: 'visible'`, so a page's widgets load the first time the page is
  shown, and `release(farPageWidgetKeys(...))` drops the data of a page two pages
  away. Go from Overview to Catalog and back and Overview's cards load again;
  going to a neighbouring page and back does not.

### Added (toolkit 0.28.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.28.0` ("Detail
  view, the rest").
- **Recent orders** detail view is now in server mode: `loadDetail` receives the
  `query` and answers one page plus `totalRows` (the demo's `queryRows` stands in
  for a database, after a short delay). It offers `pageSizes: [10, 25, 50]` and
  `columnVisibility`; the toolkit remembers the pages already loaded, so going
  back to one shows it at once (marked busy) while it is asked again. Its
  Download CSV button asks `onExportDetail` for every matching row and leaves
  out hidden columns. The open view's page size and hidden columns appear in the
  URL (`size`, `hide`).
- **Revenue by month** now has `detail: true`: its detail view is the chart's
  data as a searchable, sortable table, with no loader (`deriveDetailData` for
  charts). **Most popular products** gained a Columns menu.

### Added (toolkit 0.27.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.27.0` (0.26.0
  added Export; 0.27.0 adds Freshness).
- **Freshness.** Each loaded card says how old its data is ("Updated 2 minutes
  ago", kept current by the toolkit) and has a refresh button (`freshness`,
  `onRefresh={refresh}`). A new **Simulate outage** toggle makes Revenue, Refund
  rate and Revenue by month fail: refresh one and the card keeps its last good
  data with a "Couldn't refresh. Showing data from ..." badge instead of turning
  into an error card. A card that has never loaded still shows the error card.
- **Export.** `exportFormats={['csv', 'svg', 'png']}` adds download buttons:
  CSV on tables, bar lists and charts, SVG and PNG on charts (legend, title and
  description included, painted as on screen), and a Download CSV button in the
  detail dialogs (all rows matching the search and filters, not just the page).
  `onExportError` logs a failed download to the console.
- **Print.** Printing the page (or "Save as PDF") hides the controls and keeps
  each card whole, from the toolkit's built-in print stylesheet.
- The Use it in your app tab shows the new props.

### Added (toolkit 0.25.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.25.0`.
- **Dashboard filters.** A **Sales channel** filter bar sits above the cards
  (`useDashboardFilters`, `Dashboard` `filters` / `filterValues` /
  `onFilterChange`, and the same filters and values passed to `useWidgets`).
  Only Revenue and Revenue by month name the filter, so only they reload (keeping
  what they show until the new data arrives); the other widgets declare
  `filters: []`. The providers read `options.filters`.
- The Use it in your app tab shows the wiring.

### Added (toolkit 0.22.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.22.0`.
- **Field types.** A new **Wholesale accounts** table on the Catalog page shows
  the column field types: an `image` logo, an `email` link, a `url` link that
  opens in a new tab, a `color` swatch and a `custom` status badge (the
  `statusBadge` formatter, registered with `WidgetSettingsProvider`'s
  `formatters`, with `onFormatterError` logging a missing or failing one).
- **Remembered page and Revert after a reload.** The dashboard now passes
  `stored.activePage` / `stored.setActivePage` and `stored.backup` /
  `stored.setBackup` to `Dashboard`: a reload returns to the page you were on,
  and a reload in the middle of Customize keeps Revert changes working.
- The Use it in your app tab shows both.

### Added (toolkit 0.20.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.20.0`.
- **Theme controls.** Settings gains the toolkit's `highContrast` and `mono`
  presets (replacing the demo's own high-contrast palette), a **Compact
  density** switch (`themePresets.compact`, combined with any palette) and a
  live **Theme check** that shows `checkTheme` warnings for the current choice,
  for example when a custom accent is too pale to read as a link on white.
- The dashboard now takes the theme through its `theme` prop instead of a
  hand-written `<style>` and scope attribute.

### Changed

- The separate **Theme: light / dark** button is gone from the toolbar: light or
  dark **Mode** is now a choice in Settings, above the Color theme picker (every
  color theme has a light and a dark version).

### Changed (README)

- README screenshots (light and dark) refreshed: they now show the Catalog page
  with Most popular products as bars and Recent orders beside a clone of itself
  as a line chart, and the current header and toolbar (no Theme button).

### Added (toolkit 0.19.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.19.0`.
- **Detail view deep links.** The open detail dialog is kept in the URL
  (`?widget=recent-orders&sort=total:desc&page=2`): reloading or sharing the
  link opens the same view. Opening and closing push history entries so Back
  closes the dialog; search, sort and paging replace the current entry. An
  unknown widget in the link opens nothing. The tab stays in the hash, and
  changing tabs no longer drops the query string. The Usage tab shows the wiring.

### Added (toolkit 0.17.0 and 0.18.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.18.0`.
- **Provider-supplied view.** Revenue has a **Trend** view (a line chart of the
  month's daily revenue) beside its **Total**. The provider is called with
  `options.view` and returns the chart; the demo passes `viewValues`
  (`viewValuesFromLayout`) to `useWidgets`, and the Usage tab shows it.
- **Drag and drop.** `draggable` on the dashboard puts a grip on each card while
  customizing: pointer, touch and keyboard reordering, with the move buttons kept.
- Adding or deleting a clone no longer reloads every card (toolkit 0.18.0).

### Added (toolkit 0.15.0 and 0.16.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.16.0`.
- **Alternate views.** Most popular products can show as a table, bars or a bar
  chart of units sold; Recent orders as a table, bars or a line chart of order
  totals. Pick one in the **View** field of the Options dialog; switching never
  reloads the data.
- **Clones.** Each card's Arrange menu (while customizing) has **Duplicate**,
  which makes a copy with its own view, width, title and option values (for
  example Recent orders as a table and as a chart side by side, or Most popular
  products filtered two ways). Its Options dialog opens straight away and has
  **Delete this widget**. The demo adds `withClones` to the definitions it gives
  `useWidgets`; the Usage tab shows the wiring. Store policy (`locked: true`)
  can't be duplicated, and Duplicate is disabled when a page has no room.

### Changed (toolkit 0.14.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.14.0`. The
  Settings dialog's own "Widget options" panel is gone: each card's Arrange menu
  has an **Options…** item (while customizing) that opens the toolkit's Options
  dialog for the widget's title, width, Grow to fill and declared options, with
  confirmations on Apply, Discard, Reset to defaults and Revert to before
  editing. The choices are saved in the layout, so the demo no longer keeps its
  own copy in localStorage (`dwt-demo-options`), and feeds them to the providers
  with `optionValuesFromLayout`.
- Width limits (`minWidth` / `maxWidth`) on Revenue, Refund rate, Most popular
  products and Recent orders; Store policy (`locked: true`) is locked against
  options. The Usage tab shows the wiring.

### Added (toolkit 0.13.0)

- A **Color theme** picker in Settings: Brand blue (this demo's palette),
  Toolkit default, Forest, Sunset, High contrast and a Custom accent color. Each
  theme is built with the toolkit's `createTheme` ([`src/data/themes.ts`](./src/data/themes.ts)),
  scoped to the dashboard with a `data-dwt-theme` attribute, and works in light
  and dark mode. The choice is saved in this browser. The demo's own palette
  moved out of `index.css` into the Brand blue theme, so the demo now uses the
  same API a consumer would.
- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.13.0`.

### Changed (toolkit 0.12.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.12.0`. Each
  card's edit controls (move up, down, to page, hide) are one **Arrange** icon
  that opens a floating menu, so the card header stays on a single row. Minimize
  stays its own button.

### Changed

- The toolkit's page controls: **Move to page** is now an icon that opens a
  small floating menu, Delete page is a trash icon, the cards' edit controls no
  longer cover their titles, and Escape in the Add page name field removes the
  page you just added (toolkit 0.11.2).
- A **Settings** gear button opens a modal with the locale and the "Widget
  options" panel, replacing the always-visible locale select and options
  panel. Escape, the close button or a click on the backdrop closes it.
- The edit-mode toggle reads "Edit controls: behind Customize / always shown",
  which says what each state does (the old "Customize button: off" looked like
  the controls were switched off).

### Changed (toolkit 0.11.2)

Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.12.0` and shows
everything added since 0.7.0:

- **Locked widgets**: "Sync status" is pinned (`locked: { move: true }`, it can
  still be hidden or minimized) and "Store policy" is fully locked. An
  "Administrator" toggle passes `overrideLocks`.
- **Edit mode**: `editMode="toggle"` gives the Customize / Done toolbar with
  Reset and Revert. A toggle switches back to the always-on controls, and the
  old "Reset layout" button is gone (the toolbar has Reset).
- **Pages**: the dashboard starts with three pages (Overview, Sales & traffic,
  Catalog). While customizing you can add, rename, move and delete pages and
  move a widget to another page. A "Pages" toggle switches to a single page.
- **Declared options**: six widgets declare options (rows shown, months,
  period, filters, a text filter, columns). A "Widget options" panel lets you
  change them; providers receive the resolved values and only the changed
  widget reloads. Sort and column options use `apply: 'client'`, and the
  products table's header starts sorted by its sort option.
- **Storage adapters**: the layout is saved with `useStoredLayout` and
  `createLayoutPersistence` over a `localStorage` adapter
  ([`src/data/localStorageAdapter.ts`](./src/data/localStorageAdapter.ts)) with
  an in-memory fallback. A status line shows saving and errors, and a change
  made in another tab is offered with ✓ / X. The old `dwt-demo-layout` key is
  no longer read.

### Changed (toolkit 0.7.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.7.0`, which lets
  `TABLE` cells carry a sort `value`. The demo's tables don't need it yet.

### Changed (toolkit 0.6.0)

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.6.0`.
- "Most popular products" and "Recent orders" set `tableControls: true`, so
  their cards have a search box and sortable headers. They search the rows the
  card shows; the eye button still opens the full list.

### Changed (toolkit 0.5.0)

- README screenshots refreshed (light and dark) to show the 12-column layout and
  the new products table, with the floating donate card hidden.

- Now uses `@richardmcquiston01/dashboard-widgets-toolkit` `^0.5.0`.
- The dashboard loads with `useWidgets`: placeholders first, then each card
  fills in as its own provider resolves (staggered fake latency per widget),
  replacing the single `resolveWidgets` call.
- Widgets set a 12-column `width` (KPI tiles 3, charts 6, products table 8,
  and so on), fixing cramped tables.
- New "Most popular products" widget; "Most popular products", "Orders by
  country" and "Recent orders" have a detail view (eye button) with search,
  filters, sorting and paging.
- `loadDetail` returns `undefined` for widgets it has no extra data for, so a
  complete table or bar list falls back to its own card data (toolkit 0.5.0).
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
