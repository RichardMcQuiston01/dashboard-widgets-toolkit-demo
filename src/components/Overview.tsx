import type { ReactElement } from 'react';

interface WidgetKindInfo {
  readonly kind: string;
  readonly description: string;
}

const WIDGET_KINDS: readonly WidgetKindInfo[] = [
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
  'Typed widget definitions and plain-JSON payloads, validated with field-level error messages.',
  'One failing provider never breaks the dashboard; it renders as an error card with a retry.',
  'Per-viewer layout (order, hide, minimize) with pure functions you persist wherever you like.',
  'Intl-based formatting for numbers, currency and percent, with KPI deltas.',
  'Accessible renderers: charts have a title, description, keyboard tooltip and "View as table".',
  'Unstyled by default; theme with --dwt-* custom properties or your own (Tailwind) classes.',
];

export function Overview(): ReactElement {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold text-brand-700 dark:text-brand-200">
          Overview
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          A framework-agnostic dashboard widget toolkit. The core is
          runtime-neutral (Node, Bun, browsers); the React renderers are an
          optional entry point. The package never fetches or stores anything:
          you register a provider per widget key and persist each viewer&apos;s
          layout yourself.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-200">
          Widget kinds
        </h3>
        <dl className="mt-2 divide-y divide-brand-100 rounded-lg border border-brand-200 bg-white dark:divide-brand-800 dark:border-brand-800 dark:bg-brand-900">
          {WIDGET_KINDS.map((item) => (
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
  );
}
