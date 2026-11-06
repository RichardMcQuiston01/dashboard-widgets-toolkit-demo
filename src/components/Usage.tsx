import type { ReactElement } from 'react';

/** Install, define, load, store and render: the code a consumer writes. */
export function Usage(): ReactElement {
  return (
    <>
      <pre className="overflow-x-auto rounded-md bg-brand-900 p-4 text-sm text-brand-100">
        <code>{`npm install @richardmcquiston01/dashboard-widgets-toolkit

import { defineWidget, createLayoutPersistence, optionValuesFromLayout, viewValuesFromLayout, withClones, parseDetailLink, withDetailLink, farPageWidgetKeys } from '@richardmcquiston01/dashboard-widgets-toolkit';
import { Dashboard, useWidgets, useStoredLayout } from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import '@richardmcquiston01/dashboard-widgets-toolkit/styles.css';`}</code>
      </pre>
      <h3 className="mt-6 text-lg font-semibold text-brand-700 dark:text-brand-200">
        Declare options, lock a widget, store the layout
      </h3>
      <pre className="mt-2 overflow-x-auto rounded-md bg-brand-900 p-4 text-sm text-brand-100">
        <code>{`const topProducts = defineWidget({
  key: 'top-products',
  title: 'Most popular products',
  kind: 'TABLE',
  locked: { move: true }, // pinned; still hideable
  minWidth: 6, // viewers can resize it, but not below half the row
  options: [
    { key: 'limit', type: 'number', label: 'Rows', min: 3, max: 10, default: 5 },
    { key: 'order', type: 'sort', label: 'Order by', apply: 'client',
columns: [{ key: 'c2', label: 'Sold' }], default: 'c2:desc' },
  ],
});

// Providers get the resolved options; only changed widgets reload.
const providers = {
  'top-products': (context, definition, { options }) => load(options.limit),
};
// Bring your own storage: an adapter has get, set, remove and subscribe.
const persistence = createLayoutPersistence(withFallback(localStorageAdapter, memoryAdapter()));
const stored = useStoredLayout({ persistence, scope, definitions, defaultLayout });
// stored.activePage and stored.backup go to Dashboard too (see below): a reload
// returns to the same page, and Revert still works after a reload mid-edit.

// The Options dialog saves each viewer's title, width, view and option values
// in the layout, and Duplicate adds clones. Clones are widgets too: add them to
// the definitions so they load through their original's provider.
const all = useMemo(
  () => withClones(definitions, stored.layout),
  [definitions, stored.layout.clones]
);
const optionValues = useMemo(
  () => optionValuesFromLayout(all, stored.layout),
  [all, stored.layout]
);
// A view your provider supplies (no convert) loads when chosen: the provider
// gets options.view, so pass the viewers' choices too.
const viewValues = useMemo(
  () => viewValuesFromLayout(all, stored.layout),
  [all, stored.layout]
);
// Dashboard filters (a store, a period) are yours to keep: state, the URL or
// storage. Widgets name the filters they use (filters: ['channel'], [] = none)
// and providers read options.filters; only those widgets reload on a change.
const filterState = useDashboardFilters(filters);
const { widgets, refresh, release, gridRef } = useWidgets(all, providers, context, {
  loadWhen: 'visible', // a widget loads when its card first shows (wrap Dashboard in <div ref={gridRef}>)
  optionValues,
  viewValues,
  filters,
  filterValues: filterState.values,
});
// Optional: drop the data of pages the viewer left far behind. It loads again
// when they return to that page (from your cache first, if you pass one).
useEffect(() => {
  release(farPageWidgetKeys(all, stored.layout, stored.activePage ?? firstPageKey, 1));
}, [release, all, stored.layout, stored.activePage]);

// Keep the open detail view in the URL (?widget=orders&sort=total:desc&page=2):
// parse it against the definitions, write it back with withDetailLink.
const detail = useMemo(() => {
  const parsed = parseDetailLink(search, all);
  return parsed.ok ? (parsed.value ?? null) : null;
}, [search, all]);

// Table columns can say how their cells are shown (email, url, image, color,
// custom). A custom column names a formatter you register once; a missing or
// failing one shows the cell's text and reports through onFormatterError.
const accounts = {
  kind: 'TABLE',
  columns: [
    { label: 'Contact', type: 'email' },
    { label: 'Logo', type: 'image' },
    { label: 'Status', type: 'custom', formatter: 'statusBadge' },
  ],
  rows: [[
    { text: 'Ann Lee', value: 'ann@acme.example' },
    { text: 'Acme logo', value: '/logos/acme.svg' },
    { text: 'Active', value: 'active' },
  ]],
};
// <WidgetSettingsProvider formatters={{ statusBadge: ({ text, value }) => <Badge status={value}>{text}</Badge> }}>

// Freshness: "Updated 2 minutes ago" and a refresh button on each card. A
// failed refresh keeps the last good data and says so. Export: download
// buttons on tables, bar lists and charts, and CSV in the detail view.
<Dashboard
  widgets={widgets}
  freshness
  onRefresh={refresh}
  exportFormats={['csv', 'svg', 'png']}
  layout={stored.layout}
  onLayoutChange={stored.setLayout}
  editMode="toggle"
  draggable
  filters={filters}
  filterValues={filterState.values}
  onFilterChange={filterState.setValues}
  activePage={stored.activePage}
  onActivePageChange={stored.setActivePage}
  backup={stored.backup}
  onBackup={stored.setBackup}
  detail={detail}
  onDetailChange={(next, reason) => {
    const query = withDetailLink(location.search, next);
    const url = (query === '' ? location.pathname : '?' + query) + location.hash;
    if (reason === 'query') history.replaceState(null, '', url);
    else history.pushState(null, '', url);
    setSearch(location.search);
  }}
/>`}</code>
      </pre>
    </>
  );
}
