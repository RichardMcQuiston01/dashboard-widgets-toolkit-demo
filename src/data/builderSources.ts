import {
  defineSource,
  exposeOption,
  newWidget,
  parseDefinitions,
  serializeDefinitions,
  updateWidget,
  type SourceDescription,
} from '@richardmcquiston01/dashboard-widgets-toolkit/builder';
import type { WidgetDefinition } from '@richardmcquiston01/dashboard-widgets-toolkit';

/**
 * What the Widget Builder may combine. Each description sits beside a provider
 * the demo already registers (same key) and says what that provider returns
 * and what it can be asked for. Nothing here loads data: an administrator can
 * only pick among these choices, never invent a query. The `sample` is what the
 * preview draws, so the form works without calling a provider.
 */
export const builderSources: readonly SourceDescription[] = [
  defineSource({
    key: 'countries',
    label: 'Orders by country',
    description: 'Orders in the last 12 months, by shipping country.',
    kind: 'BAR_LIST',
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
    detail: true,
    sample: {
      kind: 'BAR_LIST',
      total: 412,
      items: [
        { label: 'United States', value: 188 },
        { label: 'United Kingdom', value: 76 },
        { label: 'Canada', value: 52 },
        { label: 'Germany', value: 38 },
        { label: 'Australia', value: 24 },
      ],
    },
  }),
  defineSource({
    key: 'recent-orders',
    label: 'Recent orders',
    description: 'The latest orders, with a detail view of every order.',
    kind: 'TABLE',
    columns: [
      { label: 'Order' },
      { label: 'Customer' },
      { label: 'Total', numeric: true },
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
    // The demo's detail loader answers one page at a time, like a server.
    detail: { mode: 'server' },
    sample: {
      kind: 'TABLE',
      columns: [
        { label: 'Order' },
        { label: 'Customer' },
        { label: 'Total', numeric: true },
      ],
      rows: [
        [
          { text: '#1041' },
          { text: 'Maya Okafor' },
          { text: '$84.99', value: 84.99 },
        ],
        [
          { text: '#1040' },
          { text: 'Liam Becker' },
          { text: '$32.50', value: 32.5 },
        ],
        [
          { text: '#1039' },
          { text: 'Sofia Rossi' },
          { text: '$127.00', value: 127 },
        ],
        [
          { text: '#1038' },
          { text: 'Maya Okafor' },
          { text: '$19.99', value: 19.99 },
        ],
      ],
    },
  }),
  defineSource({
    key: 'low-stock',
    label: 'Low stock',
    description: 'Items running out, most urgent first.',
    kind: 'ALERT_LIST',
    options: [
      {
        key: 'criticalOnly',
        type: 'boolean',
        label: 'Only items with 2 or fewer left',
        default: false,
      },
    ],
    sample: {
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
    },
  }),
];

export function findBuilderSource(key: string): SourceDescription | undefined {
  return builderSources.find((source) => source.key === key);
}

const STORAGE_KEY = 'dwt-demo:builder-widgets';

/** What reading the stored widgets found. */
export interface StoredBuilderWidgets {
  readonly definitions: readonly WidgetDefinition[];
  /** Stored rows that were left out, each with the reason. */
  readonly skipped: readonly { readonly key: string; readonly error: string }[];
  /** Set when storage could not be read or the saved text is unusable. */
  readonly error?: string;
}

/**
 * The two widgets a first visit starts with, made with the builder functions
 * (the same calls the editor makes), so there is something to open and change.
 */
export function exampleBuilderWidgets(): readonly WidgetDefinition[] {
  const examples: WidgetDefinition[] = [];
  const countries = findBuilderSource('countries');
  if (countries !== undefined) {
    const created = newWidget(countries, {
      key: 'builder-top-countries',
      title: 'Top 3 countries',
    });
    if (created.ok) {
      const exposed = exposeOption(countries, created.value, 'limit', {
        label: 'Countries shown',
        default: 3,
      });
      const widened = exposed.ok
        ? updateWidget(countries, exposed.value, { width: 6, detail: true })
        : exposed;
      if (widened.ok) examples.push(widened.value);
    }
  }
  const lowStock = findBuilderSource('low-stock');
  if (lowStock !== undefined) {
    const created = newWidget(lowStock, {
      key: 'builder-critical-stock',
      title: 'Critical stock',
    });
    if (created.ok) {
      const exposed = exposeOption(lowStock, created.value, 'criticalOnly', {
        default: true,
      });
      const sized = exposed.ok
        ? updateWidget(lowStock, exposed.value, { width: 6 })
        : exposed;
      if (sized.ok) examples.push(sized.value);
    }
  }
  return examples;
}

/**
 * Reads the saved widgets from this browser. The text is untrusted data: each
 * row is checked against the registered sources, and one that no longer fits
 * is skipped with its reason instead of drawing a broken card.
 */
export function readBuilderWidgets(): StoredBuilderWidgets {
  let text: string | null;
  try {
    text = window.localStorage.getItem(STORAGE_KEY);
  } catch (cause: unknown) {
    return {
      definitions: exampleBuilderWidgets(),
      skipped: [],
      error: `Could not read "${STORAGE_KEY}" from localStorage: ${String(cause)}`,
    };
  }
  if (text === null) {
    return { definitions: exampleBuilderWidgets(), skipped: [] };
  }
  const parsed = parseDefinitions(text, builderSources);
  if (!parsed.ok) {
    return {
      definitions: exampleBuilderWidgets(),
      skipped: [],
      error: `The saved widgets could not be read, so the examples are shown: ${parsed.error}`,
    };
  }
  return {
    definitions: parsed.value.definitions,
    skipped: parsed.value.skipped,
  };
}

/** Saves the widgets in this browser. Returns a message when that fails. */
export function writeBuilderWidgets(
  definitions: readonly WidgetDefinition[]
): string | undefined {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeDefinitions(definitions));
    return undefined;
  } catch (cause: unknown) {
    return `Could not save to localStorage: ${String(cause)}`;
  }
}

/** Forgets the saved widgets, so the examples come back. */
export function clearBuilderWidgets(): string | undefined {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return undefined;
  } catch (cause: unknown) {
    return `Could not clear localStorage: ${String(cause)}`;
  }
}
