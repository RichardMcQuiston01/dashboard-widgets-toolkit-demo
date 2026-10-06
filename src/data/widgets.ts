import {
  defineWidget,
  emptyWidget,
  type WidgetContext,
  type WidgetDefinition,
  type WidgetProviders,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

/** Context handed to every provider; the demo lets viewers change it. */
export interface ShopContext extends WidgetContext {
  readonly shopName: string;
  readonly currency: string;
  /** Bumps on each refresh so the demo numbers visibly change. */
  readonly refreshCount: number;
}

/** Key of the widget whose provider intentionally fails. */
export const ERROR_DEMO_KEY = 'flaky';

export const widgetDefinitions: readonly WidgetDefinition[] = [
  defineWidget({
    key: 'revenue',
    title: 'Revenue',
    kind: 'KPI',
    fill: 'both',
    sortOrder: 10,
  }),
  defineWidget({
    key: 'refunds',
    title: 'Refund rate',
    kind: 'KPI',
    fill: 'both',
    sortOrder: 20,
  }),
  defineWidget({
    key: 'storage',
    title: 'Storage used',
    kind: 'GAUGE',
    fill: 'both',
    sortOrder: 30,
  }),
  defineWidget({
    key: 'status',
    title: 'Sync status',
    kind: 'TEXT',
    fill: 'both',
    sortOrder: 40,
  }),
  defineWidget({
    key: 'monthly',
    title: 'Revenue by month',
    kind: 'GRAPH',
    fill: 'both',
    sortOrder: 50,
    defaultSize: 'large',
  }),
  defineWidget({
    key: 'traffic',
    title: 'Views per day',
    kind: 'GRAPH',
    fill: 'both',
    sortOrder: 60,
    defaultSize: 'large',
  }),
  defineWidget({
    key: 'countries',
    title: 'Orders by country',
    kind: 'BAR_LIST',
    fill: 'both',
    sortOrder: 70,
  }),
  defineWidget({
    key: 'low-stock',
    title: 'Low stock',
    kind: 'ALERT_LIST',
    fill: 'both',
    sortOrder: 80,
  }),
  defineWidget({
    key: 'recent-orders',
    title: 'Recent orders',
    kind: 'TABLE',
    fill: 'both',
    sortOrder: 90,
    defaultSize: 'large',
  }),
  defineWidget({
    key: 'reviews',
    title: 'New reviews',
    kind: 'TABLE',
    fill: 'both',
    sortOrder: 100,
  }),
  defineWidget({
    key: ERROR_DEMO_KEY,
    title: 'Error handling demo',
    description:
      'Intentional: this provider always throws, so you can see one failing widget reported on its own card while the rest of the dashboard keeps working.',
    kind: 'KPI',
    fill: 'both',
    sortOrder: 110,
  }),
];

const MONTHS: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Small deterministic pseudo-random wobble so refreshes change the data. */
function wobble(seed: number, spread: number): number {
  const raw: number = Math.sin(seed * 12.9898) * 43758.5453;
  return (raw - Math.floor(raw) - 0.5) * 2 * spread;
}

export const widgetProviders: WidgetProviders<ShopContext> = {
  revenue: ({ refreshCount }) => {
    const current: number = 18420 + wobble(refreshCount + 1, 2500);
    return {
      kind: 'KPI',
      value: Math.round(current * 100) / 100,
      previous: 16200,
      format: 'currency',
      label: 'Revenue this month',
      hint: 'vs. last month',
    };
  },
  refunds: ({ refreshCount }) => ({
    kind: 'KPI',
    value: Math.max(0.005, 0.021 + wobble(refreshCount + 2, 0.008)),
    previous: 0.018,
    format: 'percent',
    label: 'Refund rate',
    higherIsBetter: false,
  }),
  storage: ({ refreshCount }) => ({
    kind: 'GAUGE',
    value: Math.round(62 + wobble(refreshCount + 3, 10)),
    max: 100,
    label: 'GB of 100 GB used',
  }),
  status: ({ shopName }) => ({
    kind: 'TEXT',
    value: 'All channels in sync',
    label: shopName,
  }),
  monthly: ({ refreshCount }) => ({
    kind: 'GRAPH',
    chartType: 'bar',
    valueFormat: 'currency',
    xLabel: 'Month',
    series: [
      {
        name: 'Revenue',
        points: MONTHS.slice(0, 8).map((label, index) => ({
          label,
          value: Math.round(
            9000 + index * 1100 + wobble(index + refreshCount, 1500)
          ),
        })),
      },
    ],
  }),
  traffic: ({ refreshCount }) => ({
    kind: 'GRAPH',
    chartType: 'line',
    valueFormat: 'number',
    xLabel: 'Day',
    series: [
      {
        name: 'Views',
        points: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
          (label, index) => ({
            label,
            value: Math.round(
              1200 + index * 90 + wobble(index + refreshCount, 300)
            ),
          })
        ),
      },
      {
        name: 'Visitors',
        points: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
          (label, index) => ({
            label,
            value: Math.round(
              700 + index * 50 + wobble(index + refreshCount + 9, 200)
            ),
          })
        ),
      },
    ],
  }),
  countries: () => ({
    kind: 'BAR_LIST',
    total: 412,
    items: [
      { label: 'United States', value: 188 },
      { label: 'United Kingdom', value: 76 },
      { label: 'Canada', value: 52 },
      { label: 'Germany', value: 38 },
      { label: 'Australia', value: 24 },
    ],
  }),
  'low-stock': () => ({
    kind: 'ALERT_LIST',
    total: 7,
    emptyText: 'Nothing low on stock.',
    items: [
      {
        title: 'Ceramic mug, blue',
        valueLabel: '2 left',
        detail: 'SKU MUG-BL',
      },
      { title: 'Linen tote bag', valueLabel: '3 left', detail: 'SKU TOT-LN' },
      { title: 'Brass bookmark', valueLabel: '1 left', detail: 'SKU BKM-BR' },
    ],
  }),
  'recent-orders': () => ({
    kind: 'TABLE',
    columns: [
      { label: 'Order' },
      { label: 'Customer' },
      { label: 'Total', numeric: true },
    ],
    rows: [
      [{ text: '#1042' }, { text: 'Ada L.' }, { text: '$84.00' }],
      [{ text: '#1041' }, { text: 'Grace H.' }, { text: '$32.50' }],
      [{ text: '#1040' }, { text: 'Alan T.' }, { text: '$129.99' }],
      [{ text: '#1039' }, { text: 'Linus T.' }, { text: '$18.00' }],
    ],
    footer: 'Showing 4 of 412 orders',
  }),
  reviews: () => emptyWidget('No new reviews this week.'),
  [ERROR_DEMO_KEY]: () => {
    throw new Error('Simulated failure: upstream analytics API returned 503.');
  },
};
