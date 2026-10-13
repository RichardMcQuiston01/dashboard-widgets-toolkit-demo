import type { ReactElement } from 'react';

import type { CellFormatter } from '@richardmcquiston01/dashboard-widgets-toolkit/react';

const BADGE_CLASSES: Readonly<Record<string, string>> = {
  active:
    'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100',
  review:
    'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100',
  paused: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
};

const DOT_CLASSES: Readonly<Record<string, string>> = {
  active: 'bg-emerald-600 dark:bg-emerald-300',
  review: 'bg-amber-600 dark:bg-amber-300',
  paused: 'bg-slate-500 dark:bg-slate-300',
};

/**
 * The `statusBadge` formatter for a `custom` column: a pill with a colored dot
 * and the cell's text. The toolkit keeps the text as visually hidden text too,
 * so the pill is hidden from assistive technology to avoid saying it twice.
 */
export const statusBadge: CellFormatter = ({ text, value }): ReactElement => {
  const status: string = typeof value === 'string' ? value : 'paused';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_CLASSES[status] ?? BADGE_CLASSES['paused']}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[status] ?? DOT_CLASSES['paused']}`}
      />
      {text}
    </span>
  );
};
