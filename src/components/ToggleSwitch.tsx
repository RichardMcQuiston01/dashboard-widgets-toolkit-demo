import { useId, type ReactElement } from 'react';

interface ToggleSwitchProps {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  /** A line under the label that says what the switch does. */
  readonly hint?: string;
  /** The label stays for screen readers but is not drawn (a toolbar switch). */
  readonly hideLabel?: boolean;
  /** Tooltip of the whole control. */
  readonly title?: string;
}

/**
 * An on/off switch: a button with `role="switch"`, so it is announced with its
 * state and works with Space and Enter.
 */
export function ToggleSwitch({
  label,
  checked,
  onChange,
  hint,
  hideLabel = false,
  title,
}: ToggleSwitchProps): ReactElement {
  const labelId: string = useId();
  const hintId: string = useId();
  return (
    <div
      className="flex items-center gap-3"
      {...(title === undefined ? {} : { title })}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        {...(hint === undefined ? {} : { 'aria-describedby': hintId })}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-brand-300 bg-brand-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 aria-checked:border-brand-600 aria-checked:bg-brand-600 dark:border-brand-600 dark:bg-brand-800 dark:aria-checked:bg-brand-500"
      >
        <span
          aria-hidden="true"
          className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={hideLabel ? 'sr-only' : 'text-sm'}>
        <span id={labelId} className="font-medium">
          {label}
        </span>
        {hint === undefined ? null : (
          <span
            id={hintId}
            className="block text-xs text-slate-600 dark:text-slate-400"
          >
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}
