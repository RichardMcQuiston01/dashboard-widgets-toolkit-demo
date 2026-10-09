import {
  DATE_RANGE_PRESETS,
  resolveOptionValues,
  type OptionValue,
  type WidgetDefinition,
  type WidgetOption,
} from '@richardmcquiston01/dashboard-widgets-toolkit';
import { useId, type ReactElement } from 'react';

/** Chosen option values by widget key, then option key. */
export type ChosenOptions = Readonly<
  Record<string, Readonly<Record<string, unknown>>>
>;

interface OptionsPanelProps {
  readonly definitions: readonly WidgetDefinition[];
  readonly chosen: ChosenOptions;
  readonly onChange: (
    widgetKey: string,
    optionKey: string,
    value: unknown
  ) => void;
  readonly onReset: () => void;
}

const fieldClass: string =
  'rounded-md border border-brand-200 bg-white px-2 py-1 text-sm dark:border-brand-700 dark:bg-brand-900';

function presetLabel(value: string): string {
  return DATE_RANGE_PRESETS.find((preset) => preset === value) ?? value;
}

interface OptionFieldProps {
  readonly option: WidgetOption;
  readonly value: OptionValue | undefined;
  /** What the viewer chose, before resolving (a date range stays a preset). */
  readonly chosen: unknown;
  readonly onChange: (value: unknown) => void;
}

/**
 * One control per declared option. The toolkit has no options dialog yet, so
 * the demo draws its own from the definitions: the choice reaches the provider
 * (or is applied to the payload) and only widgets whose values changed reload.
 */
function OptionField({
  option,
  value,
  chosen,
  onChange,
}: OptionFieldProps): ReactElement {
  const id: string = useId();
  switch (option.type) {
    case 'choice':
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          {option.label}
          <select
            id={id}
            className={fieldClass}
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
          >
            {option.choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>
      );
    case 'number':
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          {option.label}
          <input
            id={id}
            type="number"
            className={`${fieldClass} w-20`}
            min={option.min}
            max={option.max}
            step={option.step ?? 1}
            value={Number(value)}
            onChange={(event) => onChange(event.target.valueAsNumber)}
          />
        </label>
      );
    case 'boolean':
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
          />
          {option.label}
        </label>
      );
    case 'text':
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          {option.label}
          <input
            id={id}
            type="text"
            className={`${fieldClass} w-36`}
            maxLength={option.maxLength}
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      );
    case 'dateRange': {
      const presets =
        option.presets ??
        DATE_RANGE_PRESETS.map((preset) => ({
          value: preset,
          label: presetLabel(preset),
        }));
      // Resolved values are intervals; the form works with the preset keys.
      const current: string = String(value);
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          {option.label}
          <select
            id={id}
            className={fieldClass}
            value={typeof chosen === 'string' ? chosen : option.default}
            onChange={(event) => onChange(event.target.value)}
          >
            {presets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {current}
          </span>
        </label>
      );
    }
    case 'color':
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          {option.label}
          <input
            id={id}
            type="color"
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      );
    case 'sort': {
      const current: string = typeof value === 'string' ? value : '';
      return (
        <label className="flex items-center gap-2 text-sm" htmlFor={id}>
          {option.label}
          <select
            id={id}
            className={fieldClass}
            value={current}
            onChange={(event) => onChange(event.target.value)}
          >
            {option.default === undefined && <option value="">None</option>}
            {option.columns.flatMap((column) => [
              <option key={`${column.key}:asc`} value={`${column.key}:asc`}>
                {column.label} ↑
              </option>,
              <option key={`${column.key}:desc`} value={`${column.key}:desc`}>
                {column.label} ↓
              </option>,
            ])}
          </select>
        </label>
      );
    }
    case 'columns': {
      const shown: readonly string[] = Array.isArray(value)
        ? (value as readonly string[])
        : option.columns.map((column) => column.key);
      return (
        <fieldset className="flex items-center gap-3 text-sm">
          <legend className="sr-only">{option.label}</legend>
          <span aria-hidden="true">{option.label}</span>
          {option.columns.map((column) => (
            <label key={column.key} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={shown.includes(column.key)}
                onChange={(event) => {
                  const next: string[] = option.columns
                    .map((candidate) => candidate.key)
                    .filter((key) =>
                      key === column.key
                        ? event.target.checked
                        : shown.includes(key)
                    );
                  // A table needs at least one column.
                  if (next.length > 0) onChange(next);
                }}
              />
              {column.label}
            </label>
          ))}
        </fieldset>
      );
    }
  }
}

export function OptionsPanel({
  definitions,
  chosen,
  onChange,
  onReset,
}: OptionsPanelProps): ReactElement {
  const withOptions: readonly WidgetDefinition[] = definitions.filter(
    (definition) => (definition.options?.length ?? 0) > 0
  );
  return (
    <section aria-labelledby="widget-options-heading">
      <h3
        id="widget-options-heading"
        className="text-base font-semibold text-brand-700 dark:text-brand-200"
      >
        Widget options ({withOptions.length} widgets)
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Each widget declares its options with defaults. The provider receives
        the resolved values (rows shown, period, filters); sorting and column
        choices marked <code>apply: &apos;client&apos;</code> are applied by the
        toolkit without calling the provider again. Changing a value reloads
        only that widget.
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {withOptions.map((definition) => {
          const resolved = resolveOptionValues(
            definition,
            chosen[definition.key]
          );
          return (
            <fieldset
              key={definition.key}
              className="rounded-md border border-brand-100 p-3 dark:border-brand-800"
            >
              <legend className="px-1 text-sm font-semibold text-brand-700 dark:text-brand-200">
                {definition.title}
              </legend>
              <div className="flex flex-col gap-2">
                {(definition.options ?? []).map((option) => (
                  <OptionField
                    key={option.key}
                    option={option}
                    value={resolved[option.key]}
                    chosen={chosen[definition.key]?.[option.key]}
                    onChange={(value) =>
                      onChange(definition.key, option.key, value)
                    }
                  />
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800"
      >
        Reset options to defaults
      </button>
    </section>
  );
}
