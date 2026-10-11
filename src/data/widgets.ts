import {
  defineWidget,
  emptyWidget,
  formatValue,
  type DetailData,
  type WidgetContext,
  type WidgetDefinition,
  type WidgetProvider,
  type WidgetProviders,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

/** Context handed to every provider; the demo lets viewers change it. */
export interface ShopContext extends WidgetContext {
  readonly shopName: string;
  readonly currency: string;
  /** BCP 47 locale used to format values the demo builds as text. */
  readonly locale: string;
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
    width: 3,
    maxWidth: 6,
  }),
  defineWidget({
    key: 'refunds',
    title: 'Refund rate',
    kind: 'KPI',
    fill: 'both',
    sortOrder: 20,
    width: 3,
    maxWidth: 6,
  }),
  defineWidget({
    key: 'storage',
    title: 'Storage used',
    kind: 'GAUGE',
    fill: 'both',
    sortOrder: 30,
    width: 3,
  }),
  defineWidget({
    key: 'status',
    title: 'Sync status',
    description:
      'Locked in place: viewers can hide or minimize it, not move it.',
    kind: 'TEXT',
    fill: 'both',
    sortOrder: 40,
    width: 3,
    locked: { move: true },
  }),
  defineWidget({
    key: 'policy',
    title: 'Store policy',
    description: 'Fully locked: it cannot be moved, hidden or minimized.',
    kind: 'TEXT',
    fill: 'both',
    sortOrder: 45,
    width: 12,
    locked: true,
  }),
  defineWidget({
    key: 'monthly',
    title: 'Revenue by month',
    kind: 'GRAPH',
    fill: 'both',
    sortOrder: 50,
    width: 6,
    options: [
      {
        key: 'months',
        type: 'choice',
        label: 'Months shown',
        choices: [
          { value: '4', label: 'Last 4' },
          { value: '6', label: 'Last 6' },
          { value: '8', label: 'Last 8' },
        ],
        default: '8',
      },
    ],
  }),
  defineWidget({
    key: 'traffic',
    title: 'Views per day',
    kind: 'GRAPH',
    fill: 'both',
    sortOrder: 60,
    width: 6,
    options: [
      {
        key: 'period',
        type: 'dateRange',
        label: 'Period',
        presets: [
          { value: 'last7', label: 'Last 7 days' },
          { value: 'last30', label: 'Last 30 days' },
          { value: 'thisMonth', label: 'This month' },
        ],
        default: 'last7',
      },
    ],
  }),
  defineWidget({
    key: 'top-products',
    title: 'Most popular products',
    description: 'By units sold in the last 12 months.',
    kind: 'TABLE',
    fill: 'both',
    sortOrder: 65,
    width: 8,
    minWidth: 6,
    detail: { pageSize: 10 },
    tableControls: true,
    // Other ways to show the same rows. The cells carry numeric `value`s, which
    // the conversions read; switching views never reloads.
    baseViewLabel: 'Table',
    views: [
      {
        key: 'bars',
        label: 'Bars',
        kind: 'BAR_LIST',
        convert: { type: 'tableToBarList', label: 1, value: 2 },
      },
      {
        key: 'chart',
        label: 'Bar chart',
        kind: 'GRAPH',
        convert: {
          type: 'tableToGraph',
          label: 1,
          values: [2],
          chartType: 'bar',
        },
      },
    ],
    options: [
      {
        key: 'limit',
        type: 'number',
        label: 'Rows in the card',
        min: 3,
        max: 10,
        default: 5,
      },
      {
        key: 'order',
        type: 'sort',
        label: 'Order by',
        columns: [
          { key: 'c1', label: 'Product' },
          { key: 'c2', label: 'Sold' },
          { key: 'c3', label: 'Revenue' },
        ],
        default: 'c2:desc',
        apply: 'client',
      },
    ],
  }),
  defineWidget({
    key: 'countries',
    title: 'Orders by country',
    kind: 'BAR_LIST',
    fill: 'both',
    sortOrder: 70,
    width: 4,
    detail: true,
    options: [
      {
        key: 'limit',
        type: 'number',
        label: 'Countries shown',
        min: 3,
        max: 8,
        default: 5,
      },
      {
        key: 'order',
        type: 'sort',
        label: 'Order by',
        columns: [
          { key: 'value', label: 'Orders' },
          { key: 'label', label: 'Country' },
        ],
        default: 'value:desc',
        apply: 'client',
      },
    ],
  }),
  defineWidget({
    key: 'low-stock',
    title: 'Low stock',
    kind: 'ALERT_LIST',
    fill: 'both',
    sortOrder: 80,
    width: 3,
    options: [
      {
        key: 'criticalOnly',
        type: 'boolean',
        label: 'Only items with 2 or fewer left',
        default: false,
      },
    ],
  }),
  defineWidget({
    key: 'recent-orders',
    title: 'Recent orders',
    kind: 'TABLE',
    fill: 'both',
    sortOrder: 90,
    width: 6,
    minWidth: 6,
    detail: { title: 'All orders', pageSize: 10 },
    tableControls: true,
    views: [
      {
        key: 'bars',
        label: 'Bars',
        kind: 'BAR_LIST',
        convert: { type: 'tableToBarList', label: 0, value: 2 },
      },
      {
        key: 'line',
        label: 'Line chart',
        kind: 'GRAPH',
        convert: {
          type: 'tableToGraph',
          label: 0,
          values: [2],
          chartType: 'line',
          valueFormat: 'currency',
        },
      },
    ],
    options: [
      {
        key: 'customer',
        type: 'text',
        label: 'Customer contains',
        maxLength: 40,
        default: '',
      },
      {
        key: 'columns',
        type: 'columns',
        label: 'Columns',
        columns: [
          { key: 'c0', label: 'Order' },
          { key: 'c1', label: 'Customer' },
          { key: 'c2', label: 'Total' },
        ],
        default: ['c0', 'c1', 'c2'],
        apply: 'client',
      },
    ],
  }),
  defineWidget({
    key: 'reviews',
    title: 'New reviews',
    kind: 'TABLE',
    fill: 'both',
    sortOrder: 100,
    width: 3,
  }),
  defineWidget({
    key: ERROR_DEMO_KEY,
    title: 'Error handling demo',
    description:
      'Intentional: this provider always throws, so you can see one failing widget reported on its own card while the rest of the dashboard keeps working.',
    kind: 'KPI',
    fill: 'both',
    sortOrder: 110,
    width: 4,
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

const PRODUCTS: readonly (readonly [string, number, number])[] = [
  ['Bauble Jig STL File – 2.5" Ornament Engraving Holder', 7, 1.58],
  ['Cork Batch Engraving Alignment Fixture', 6, 4.07],
  ['Round Coaster Jig STL File – 3D Print Laser Holder', 6, 1.92],
  ['Ink Pad Holder for Junk Journal STL – 3D Print Organizer', 5, 3.83],
  ['Bookmark Laser Engraving Jig STL File', 5, 2.4],
  ['Cricut Joy Marker Holder – 48 Pen Tiered Organizer', 4, 5.25],
  ['5 40mm Coin Holder for Batch Engraving', 4, 2.1],
  ['Pen Blank Rotary Jig', 4, 3.0],
  ['Keychain Blank Alignment Tray', 3, 1.5],
  ['Slate Coaster Registration Jig', 3, 2.75],
  ['Wine Stopper Engraving Cradle', 3, 3.2],
  ['Ornament Slice Engraving Template', 3, 1.99],
  ['Dog Tag Batch Fixture', 2, 2.6],
  ['Cutting Board Engraving Guide', 2, 4.5],
  ['Business Card Holder Jig', 2, 1.75],
  ['Tumbler Rotary Support Stand', 2, 6.1],
  ['Magnet Blank Batch Tray', 2, 1.4],
  ['Leather Patch Alignment Jig', 2, 2.2],
  ['Bottle Opener Engraving Holder', 1, 3.3],
  ['Domino Engraving Fixture', 1, 1.2],
  ['Playing Card Batch Jig', 1, 2.0],
  ['Phone Case Engraving Cradle', 1, 3.9],
  ['Guitar Pick Holder Jig', 1, 1.1],
  ['Wooden Spoon Engraving Rest', 1, 2.8],
  ['Luggage Tag Alignment Tray', 1, 1.9],
  ['Cookie Cutter Template Holder', 1, 2.3],
  ['Mini Notebook Cover Fixture', 1, 3.1],
  ['Slate Ornament Registration Jig', 1, 1.6],
  ['Bag Tag Batch Fixture', 1, 2.4],
  ['Compact Mirror Engraving Cradle', 1, 2.7],
];

const ORDER_COUNT = 412;

const COUNTRIES: readonly (readonly [string, number])[] = [
  ['United States', 188],
  ['United Kingdom', 76],
  ['Canada', 52],
  ['Germany', 38],
  ['Australia', 24],
  ['France', 15],
  ['Netherlands', 11],
  ['Japan', 8],
];

const CUSTOMERS: readonly string[] = [
  'Ada L.',
  'Grace H.',
  'Alan T.',
  'Linus T.',
  'Margaret H.',
  'Dennis R.',
  'Barbara L.',
  'Ken T.',
];

/** Fifty-odd deterministic recent orders (newest first). */
function recentOrders(): readonly (readonly [string, string, number])[] {
  return Array.from({ length: 52 }, (_, index) => {
    const customer: string = CUSTOMERS[index % CUSTOMERS.length] ?? 'Guest';
    const total: number =
      Math.round((12 + ((index * 37) % 140) + (index % 3) * 0.99) * 100) / 100;
    return [`#${ORDER_COUNT - index + 629}`, customer, total] as const;
  });
}

const baseProviders: WidgetProviders<ShopContext> = {
  'top-products': ({ currency, locale }, _definition, { options }) => {
    // `limit` is the provider's; `order` is applied by the toolkit, so the
    // rows carry a sort `value` for the Sold and Revenue columns.
    const limit: number =
      typeof options['limit'] === 'number' ? options['limit'] : 5;
    return {
      kind: 'TABLE',
      columns: [
        { label: '#', numeric: true },
        { label: 'Product' },
        { label: 'Sold', numeric: true },
        { label: 'Revenue', numeric: true },
      ],
      rows: PRODUCTS.slice(0, limit).map(([name, sold, price], index) => [
        { text: String(index + 1), value: index + 1 },
        { text: name, value: name },
        { text: String(sold), value: sold },
        {
          text: formatValue(sold * price, 'currency', { locale, currency }),
          value: sold * price,
        },
      ]),
      footer: `and ${PRODUCTS.length - limit} more`,
    };
  },
  revenue: ({ refreshCount, currency }) => {
    const current: number = 18420 + wobble(refreshCount + 1, 2500);
    return {
      kind: 'KPI',
      value: Math.round(current * 100) / 100,
      previous: 16200,
      format: 'currency',
      currency,
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
  policy: () => ({
    kind: 'TEXT',
    value: '30-day returns',
    label: 'Set by the store owner',
  }),
  monthly: ({ refreshCount, currency }, _definition, { options }) => {
    const months: number = Number(options['months'] ?? 8);
    return {
      kind: 'GRAPH',
      chartType: 'bar',
      valueFormat: 'currency',
      currency,
      xLabel: 'Month',
      series: [
        {
          name: 'Revenue',
          points: MONTHS.slice(0, months).map((label, index) => ({
            label,
            value: Math.round(
              9000 + index * 1100 + wobble(index + refreshCount, 1500)
            ),
          })),
        },
      ],
    };
  },
  traffic: ({ refreshCount }, _definition, { options }) => ({
    kind: 'GRAPH',
    chartType: 'line',
    valueFormat: 'number',
    // The provider always receives the date range as an interval.
    xLabel: `Day (${String(options['period'] ?? '')})`,
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
  countries: (_context, _definition, { options }) => ({
    kind: 'BAR_LIST',
    total: ORDER_COUNT,
    items: COUNTRIES.slice(0, Number(options['limit'] ?? 5)).map(
      ([label, value]) => ({ label, value })
    ),
  }),
  'low-stock': (_context, _definition, { options }) => {
    const items = [
      { title: 'Ceramic mug, blue', left: 2, sku: 'MUG-BL' },
      { title: 'Linen tote bag', left: 3, sku: 'TOT-LN' },
      { title: 'Brass bookmark', left: 1, sku: 'BKM-BR' },
    ].filter((item) => options['criticalOnly'] !== true || item.left <= 2);
    return {
      kind: 'ALERT_LIST',
      total: options['criticalOnly'] === true ? items.length : 7,
      emptyText: 'Nothing low on stock.',
      items: items.map((item) => ({
        title: item.title,
        valueLabel: `${item.left} left`,
        detail: `SKU ${item.sku}`,
      })),
    };
  },
  'recent-orders': ({ currency, locale }, _definition, { options }) => {
    // `customer` filters here; `columns` is applied by the toolkit.
    const needle: string = String(options['customer'] ?? '')
      .trim()
      .toLowerCase();
    const matches = recentOrders().filter(([, customer]) =>
      customer.toLowerCase().includes(needle)
    );
    return {
      kind: 'TABLE',
      columns: [
        { label: 'Order' },
        { label: 'Customer' },
        { label: 'Total', numeric: true },
      ],
      rows: matches.slice(0, 4).map(([orderId, customer, total]) => [
        { text: orderId },
        { text: customer },
        {
          text: formatValue(total, 'currency', { locale, currency }),
          value: total,
        },
      ]),
      footer: `Showing ${Math.min(4, matches.length)} of ${matches.length} orders`,
    };
  },
  reviews: () => emptyWidget('No new reviews this week.'),
  [ERROR_DEMO_KEY]: () => {
    throw new Error('Simulated failure: upstream analytics API returned 503.');
  },
};

/** Pretend network latency per widget, so cards fill in one by one. */
const LATENCY_MS: Readonly<Record<string, number>> = {
  revenue: 300,
  refunds: 450,
  storage: 600,
  status: 250,
  policy: 200,
  monthly: 900,
  traffic: 1200,
  'top-products': 800,
  countries: 700,
  'low-stock': 1000,
  'recent-orders': 1100,
  reviews: 500,
  [ERROR_DEMO_KEY]: 1400,
};

/** Resolves after `milliseconds`, or rejects as soon as `signal` aborts. */
function delay(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Loading was canceled.'));
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, milliseconds);
    function onAbort(): void {
      clearTimeout(timer);
      reject(new Error('Loading was canceled.'));
    }
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

function withLatency(
  providers: WidgetProviders<ShopContext>
): WidgetProviders<ShopContext> {
  return Object.fromEntries(
    Object.entries(providers).map(([key, provider]) => {
      const slowProvider: WidgetProvider<ShopContext> = async (
        context,
        definition,
        options
      ) => {
        await delay(LATENCY_MS[key] ?? 500, options.signal);
        return provider(context, definition, options);
      };
      return [key, slowProvider];
    })
  );
}

export const widgetProviders: WidgetProviders<ShopContext> =
  withLatency(baseProviders);

/**
 * The full data behind each "View" button. A real app would query its
 * database here; the toolkit only asks for the rows.
 */
export async function loadWidgetDetail(
  key: string,
  { currency, locale }: Pick<ShopContext, 'currency' | 'locale'>,
  signal: AbortSignal
): Promise<DetailData | undefined> {
  await delay(500, signal);
  const money = (amount: number): string =>
    formatValue(amount, 'currency', { locale, currency });
  switch (key) {
    case 'top-products':
      return {
        columns: [
          { key: 'rank', label: '#', numeric: true },
          { key: 'product', label: 'Product', filterable: true },
          { key: 'sold', label: 'Sold', numeric: true },
          { key: 'revenue', label: 'Revenue', numeric: true },
        ],
        rows: PRODUCTS.map(([name, sold, price], index) => [
          { text: String(index + 1), value: index + 1 },
          { text: name, value: name },
          { text: String(sold), value: sold },
          { text: money(sold * price), value: sold * price },
        ]),
      };
    case 'recent-orders':
      return {
        columns: [
          { key: 'order', label: 'Order' },
          { key: 'customer', label: 'Customer', filterable: true },
          { key: 'total', label: 'Total', numeric: true },
        ],
        rows: recentOrders().map(([orderId, customer, total]) => [
          { text: orderId },
          { text: customer },
          { text: money(total), value: total },
        ]),
      };
    case 'countries':
      return {
        columns: [
          { key: 'country', label: 'Country', filterable: true },
          { key: 'orders', label: 'Orders', numeric: true },
          { key: 'share', label: 'Share', numeric: true },
        ],
        rows: COUNTRIES.map(([country, orders]) => [
          { text: country },
          { text: String(orders), value: orders },
          {
            text: formatValue(orders / ORDER_COUNT, 'percent', { locale }),
            value: orders / ORDER_COUNT,
          },
        ]),
      };
    default:
      // No extra data: a complete TABLE or BAR_LIST shows its own card data.
      return undefined;
  }
}
