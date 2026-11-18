/**
 * A pretend orders API, so the adapter example can use real-looking `fetch`
 * code without a network or a real service. `fixtureFetch` answers like
 * `fetch`: a promise of a `Response`, after some latency, that rejects when
 * the signal aborts, and that is a 503 while the outage demo is on.
 */

export type ApiOrderStatus = 'paid' | 'pending' | 'refunded';

export interface ApiOrder {
  readonly id: number;
  readonly customer: string;
  readonly status: ApiOrderStatus;
  readonly totalCents: number;
  /** ISO 8601. */
  readonly createdAt: string;
}

export interface OrdersApiResponse {
  /** Counts the requests the fixture has answered, so the demo can show sharing. */
  readonly requestNumber: number;
  readonly orders: readonly ApiOrder[];
}

const CUSTOMERS: readonly string[] = [
  'Ada L.',
  'Grace H.',
  'Alan T.',
  'Linus T.',
  'Margaret H.',
  'Dennis R.',
];

const STATUSES: readonly ApiOrderStatus[] = [
  'paid',
  'paid',
  'pending',
  'paid',
  'refunded',
  'paid',
  'pending',
  'paid',
  'refunded',
  'paid',
];

/** Ten deterministic orders, newest first. */
const ORDERS: readonly ApiOrder[] = STATUSES.map((status, index): ApiOrder => ({
  id: 5120 - index,
  customer: CUSTOMERS[index % CUSTOMERS.length] ?? 'Guest',
  status,
  totalCents: 1_800 + ((index * 3_713) % 14_000),
  createdAt: new Date(
    Date.UTC(2026, 10, 17 - index, 9 + index, 30)
  ).toISOString(),
}));

const LATENCY_MS = 700;

let requestNumber = 0;
let down = false;

/** Makes the fixture answer 503, as if the upstream API were down. */
export function setFixtureApiDown(isDown: boolean): void {
  down = isDown;
}

/** Like `fetch(url, { signal })`, for the one URL this fixture serves. */
export function fixtureFetch(
  url: string,
  init: { readonly signal: AbortSignal }
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    const { signal } = init;
    if (signal.aborted) {
      reject(new DOMException('The request was aborted.', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      requestNumber += 1;
      if (down) {
        resolve(
          new Response('{}', { status: 503, statusText: 'Service Unavailable' })
        );
        return;
      }
      const limit: number = Number(
        new URL(url, 'https://fixture.invalid').searchParams.get('limit') ?? 10
      );
      const body: OrdersApiResponse = {
        requestNumber,
        orders: ORDERS.slice(0, Number.isFinite(limit) ? limit : 10),
      };
      resolve(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }, LATENCY_MS);
    function onAbort(): void {
      clearTimeout(timer);
      reject(new DOMException('The request was aborted.', 'AbortError'));
    }
    signal.addEventListener('abort', onAbort, { once: true });
  });
}
