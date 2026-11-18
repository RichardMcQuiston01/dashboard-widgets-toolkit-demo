import {
  defineAdapter,
  defineWidget,
  formatValue,
  toAlertList,
  toBarList,
  toKpi,
  toTable,
  type DataSource,
  type Mapper,
  type WidgetDefinition,
  type WidgetProviders,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

import {
  fixtureFetch,
  type ApiOrder,
  type ApiOrderStatus,
  type OrdersApiResponse,
} from './fixtureApi';
import type { ShopContext } from './widgets';

/**
 * The adapter example. One `DataSource` says how to get the orders (a `fetch`,
 * here against a local fixture), and four mappers (pure functions) say how to
 * turn the same response into a table, a KPI, a bar list and an alert list.
 * `defineAdapter` makes a provider from each pair, and because the source has a
 * `scope`, the four cards share one request when they load together. Press the
 * dashboard's Refresh button and every card says it came from the same request.
 */
export const ordersSource: DataSource<ShopContext, OrdersApiResponse> = {
  id: 'orders-api',
  // Everything that changes the request; the same string shares one load.
  scope: (context) => context.shopName,
  async load(context, { signal }) {
    const response: Response = await fixtureFetch(
      `/api/orders?limit=10&shop=${encodeURIComponent(context.shopName)}`,
      { signal }
    );
    if (!response.ok) {
      throw new Error(
        `Orders API returned ${response.status} ${response.statusText}.`
      );
    }
    return (await response.json()) as OrdersApiResponse;
  },
};

const STATUS_LABELS: Readonly<Record<ApiOrderStatus, string>> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
};

function money(cents: number, context: ShopContext): string {
  return formatValue(cents / 100, 'currency', {
    locale: context.locale,
    currency: context.currency,
  });
}

const latestOrders: Mapper<OrdersApiResponse, 'TABLE', ShopContext> = (
  raw,
  context
) =>
  toTable(
    raw.orders,
    [
      { label: 'Order', cell: (order) => ({ text: `#${order.id}` }) },
      { label: 'Customer', cell: (order) => ({ text: order.customer }) },
      {
        label: 'Status',
        cell: (order) => ({ text: STATUS_LABELS[order.status] }),
      },
      {
        label: 'Total',
        numeric: true,
        cell: (order) => ({
          text: money(order.totalCents, context),
          value: order.totalCents,
        }),
      },
    ],
    {
      footer: `From API request ${raw.requestNumber}`,
      emptyText: 'The orders API returned no orders.',
    }
  );

const paidRevenue: Mapper<OrdersApiResponse, 'KPI', ShopContext> = (raw) =>
  toKpi({
    label: 'Paid orders',
    value:
      raw.orders
        .filter((order) => order.status === 'paid')
        .reduce((sum, order) => sum + order.totalCents, 0) / 100,
    format: 'currency',
    hint: `From API request ${raw.requestNumber}`,
  });

const ordersByStatus: Mapper<OrdersApiResponse, 'BAR_LIST', ShopContext> = (
  raw
) =>
  toBarList(
    (Object.keys(STATUS_LABELS) as ApiOrderStatus[]).map((status) => ({
      status,
      count: raw.orders.filter((order) => order.status === status).length,
    })),
    {
      label: (entry) => STATUS_LABELS[entry.status],
      value: (entry) => entry.count,
    },
    { emptyText: 'The orders API returned no orders.' }
  );

const refundedOrders: Mapper<OrdersApiResponse, 'ALERT_LIST', ShopContext> = (
  raw,
  context
) => {
  const refunded: readonly ApiOrder[] = raw.orders.filter(
    (order) => order.status === 'refunded'
  );
  return toAlertList(
    refunded,
    {
      title: (order) => `Order #${order.id}`,
      valueLabel: (order) => money(order.totalCents, context),
      detail: (order) => `${order.customer} · request ${raw.requestNumber}`,
    },
    { emptyText: 'No refunded orders.' }
  );
};

/** The widgets that read the orders API. */
export const apiWidgetDefinitions: readonly WidgetDefinition[] = [
  defineWidget({
    key: 'api-orders',
    filters: [],
    title: 'Latest orders (API)',
    description: 'A table from the orders API, mapped by toTable.',
    kind: 'TABLE',
    fill: 'both',
    sortOrder: 200,
    width: 8,
  }),
  defineWidget({
    key: 'api-paid',
    filters: [],
    title: 'Paid orders (API)',
    description: 'The same response as a KPI.',
    kind: 'KPI',
    fill: 'both',
    sortOrder: 210,
    width: 4,
  }),
  defineWidget({
    key: 'api-status',
    filters: [],
    title: 'Orders by status (API)',
    description: 'The same response as a bar list.',
    kind: 'BAR_LIST',
    fill: 'both',
    sortOrder: 220,
    width: 6,
  }),
  defineWidget({
    key: 'api-refunded',
    filters: [],
    title: 'Refunded orders (API)',
    description: 'The same response as an alert list.',
    kind: 'ALERT_LIST',
    fill: 'both',
    sortOrder: 230,
    width: 6,
  }),
];

/** Each widget's provider: the shared source plus its own mapper. */
export const apiProviders: WidgetProviders<ShopContext> = {
  'api-orders': defineAdapter('TABLE', ordersSource, latestOrders),
  'api-paid': defineAdapter('KPI', ordersSource, paidRevenue),
  'api-status': defineAdapter('BAR_LIST', ordersSource, ordersByStatus),
  'api-refunded': defineAdapter('ALERT_LIST', ordersSource, refundedOrders),
};
