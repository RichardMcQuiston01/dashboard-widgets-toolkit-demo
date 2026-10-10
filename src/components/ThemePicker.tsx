import { useId, type ReactElement } from 'react';

import {
  THEME_PRESETS,
  presetSwatches,
  type ThemeChoice,
  type ThemePresetId,
} from '../data/themes';

interface ThemePickerProps {
  readonly choice: ThemeChoice;
  /** Message from `createTheme` when the current choice is invalid. */
  readonly error: string | null;
  readonly onChange: (next: ThemeChoice) => void;
}

/** Radio cards for the color theme, plus a color input for the custom accent. */
export function ThemePicker({
  choice,
  error,
  onChange,
}: ThemePickerProps): ReactElement {
  const accentId: string = useId();

  return (
    <fieldset className="mb-5">
      <legend className="mb-2 text-sm font-semibold text-brand-700 dark:text-brand-200">
        Color theme
      </legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {THEME_PRESETS.map((preset) => {
          const isSelected: boolean = choice.presetId === preset.id;
          return (
            <label
              key={preset.id}
              className="flex cursor-pointer items-start gap-2 rounded-md border border-brand-200 bg-white p-2.5 text-sm has-[:checked]:border-brand-600 has-[:checked]:ring-2 has-[:checked]:ring-brand-600/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600 dark:border-brand-700 dark:bg-brand-900 dark:has-[:checked]:border-brand-300 dark:has-[:checked]:ring-brand-300/40"
            >
              <input
                type="radio"
                name="color-theme"
                value={preset.id}
                checked={isSelected}
                onChange={() =>
                  onChange({
                    ...choice,
                    presetId: preset.id as ThemePresetId,
                  })
                }
                className="mt-1"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-medium">
                  {preset.label}
                  <span className="flex gap-0.5" aria-hidden="true">
                    {presetSwatches(preset.id, choice.accent).map(
                      (color, index) => (
                        <span
                          key={`${color}-${index}`}
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </span>
                </span>
                <span className="block text-slate-600 dark:text-slate-400">
                  {preset.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {choice.presetId === 'custom' && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <label htmlFor={accentId}>Accent color</label>
          <input
            id={accentId}
            type="color"
            value={choice.accent}
            onChange={(event) =>
              onChange({ ...choice, accent: event.target.value })
            }
            className="h-8 w-12 cursor-pointer rounded border border-brand-200 bg-white dark:border-brand-700"
          />
          <code className="text-slate-600 dark:text-slate-400">
            {choice.accent}
          </code>
        </div>
      )}
      {error !== null && (
        <p
          role="alert"
          className="mt-2 text-sm text-rose-700 dark:text-rose-300"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
