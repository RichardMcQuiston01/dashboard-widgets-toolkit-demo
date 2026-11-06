import type { ReactElement } from 'react';

import { Usage } from './Usage';

interface WidgetTypeInfo {
  readonly kind: string;
  readonly description: string;
}

const WIDGET_TYPES: readonly WidgetTypeInfo[] = [
  { kind: 'TEXT', description: 'A count or status as text.' },
  {
    kind: 'KPI',
    description: 'Stat tile with the change versus the previous period.',
  },
  { kind: 'GAUGE', description: 'A meter, such as quota used.' },
  { kind: 'TABLE', description: 'Small data tables with optional links.' },
  {
    kind: 'BAR_LIST',
    description: 'Ranked breakdowns such as orders by country.',
  },
  {
    kind: 'ALERT_LIST',
    description: 'Low stock, stale listings, expiring soon.',
  },
  {
    kind: 'GRAPH',
    description: 'Accessible SVG bar and line charts with a table view.',
  },
];

const FEATURES: readonly string[] = [
  'Typed widget definitions and plain-JSON payloads, validated with field-level error messages (the caution button at the lower left checks a payload of your own).',
  'One failing provider never breaks the dashboard; it renders as an error card with a retry.',
  'Per-viewer layout (order, hide, minimize, drag and drop) with pure functions you persist wherever you like.',
  'Customize / Done edit mode with Reset and Revert, and locked widgets (pinned, or locked against hiding and minimizing) that administrators can override.',
  'Pages of widgets: a page bar for two or more pages, per-page capacity in rows, moving a widget to another page, and loading only the page in view.',
  'Declared options with defaults: providers receive the resolved values, only the changed widget reloads, and sort and column choices can be applied client-side.',
  'Alternate views of a widget, clones of a widget, and an Options dialog for each viewer’s title, width, view and option values.',
  'Dashboard filters (a period, a store) that only reload the widgets that use them.',
  'A detail view for tables, bar lists and charts: search, column filters, sorting, paging, in memory or on your server, with the open view kept in the URL.',
  'Downloads: CSV for cards and the detail view, SVG and PNG for charts, and a clean printed report.',
  'Freshness: each card says how old its data is, with a refresh button, and a failed refresh keeps the last good data.',
  'Storage adapters and useStoredLayout: bring any store (localStorage here), get debounced saves, other-tab updates and conflict handling.',
  'A Widget Builder for administrators and, within a policy, for viewers.',
  'Intl-based formatting for numbers, currency and percent, with KPI deltas.',
  'Accessible renderers: charts have a title, description, keyboard tooltip and "View as table".',
  'Theming with --dwt-* custom properties, with contrast checks and presets, or your own (Tailwind) classes.',
];

export function Overview(): ReactElement {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-brand-700 dark:text-brand-200">
            Overview
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            A framework-agnostic dashboard widget toolkit. The core is
            runtime-neutral (Node, Bun, browsers); the React renderers are an
            optional entry point. The package never fetches or stores anything:
            you register a provider per widget key and plug in a storage adapter
            for each viewer&apos;s layout.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-200">
            Widget types
          </h3>
          <dl className="mt-2 divide-y divide-brand-100 rounded-lg border border-brand-200 bg-white dark:divide-brand-800 dark:border-brand-800 dark:bg-brand-900">
            {WIDGET_TYPES.map((item) => (
              <div key={item.kind} className="flex gap-4 px-4 py-2.5 text-sm">
                <dt className="w-28 shrink-0 font-mono font-semibold text-brand-600 dark:text-brand-300">
                  {item.kind}
                </dt>
                <dd className="text-slate-700 dark:text-slate-300">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <section aria-labelledby="usage-heading" className="mt-12">
        <h2
          id="usage-heading"
          className="text-2xl font-bold text-brand-700 dark:text-brand-200"
        >
          Use it in your app
        </h2>
        <p className="mt-1 mb-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Install the package, define widgets, register a provider per key,
          store the layout and render.
        </p>
        <Usage />
      </section>
    </div>
  );
}
