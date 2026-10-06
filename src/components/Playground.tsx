import { validateWidgetData } from '@richardmcquiston01/dashboard-widgets-toolkit';
import { useState, type ReactElement } from 'react';

const SAMPLE_PAYLOAD: string = JSON.stringify(
  {
    kind: 'KPI',
    value: 'twelve',
    previous: 10,
    format: 'currency',
    label: 'Revenue',
  },
  null,
  2
);

type Outcome =
  | { readonly status: 'ok'; readonly message: string }
  | { readonly status: 'error'; readonly message: string };

function check(rawJson: string): Outcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error: unknown) {
    const reason: string =
      error instanceof Error ? error.message : String(error);
    return { status: 'error', message: `Not valid JSON: ${reason}` };
  }
  const result = validateWidgetData(parsed, { widgetKey: 'playground' });
  return result.ok
    ? {
        status: 'ok',
        message: `Valid ${'kind' in result.value ? result.value.kind : 'empty-state'} payload.`,
      }
    : { status: 'error', message: result.error };
}

export function Playground(): ReactElement {
  const [rawJson, setRawJson] = useState<string>(SAMPLE_PAYLOAD);
  const outcome: Outcome = check(rawJson);
  const isOk: boolean = outcome.status === 'ok';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="text-sm font-medium">Widget payload (JSON)</span>
        <textarea
          value={rawJson}
          onChange={(event) => setRawJson(event.target.value)}
          spellCheck={false}
          rows={12}
          className="mt-1 w-full rounded-md border border-brand-200 bg-white p-3 font-mono text-sm dark:border-brand-700 dark:bg-brand-900"
        />
      </label>
      <div role="status" aria-live="polite">
        <p className="text-sm font-medium">Result of validateWidgetData()</p>
        <p
          className={`mt-1 rounded-md border p-3 text-sm ${
            isOk
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
              : 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200'
          }`}
        >
          {outcome.message}
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Validation errors name the widget, kind and field, so a bad API
          response is easy to trace. Try changing <code>value</code> to a
          number, or the <code>kind</code> to <code>GAUGE</code>.
        </p>
      </div>
    </div>
  );
}
