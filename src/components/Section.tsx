import type { ReactElement, ReactNode } from 'react';

interface SectionProps {
  readonly id: string;
  readonly title: string;
  /** Shown under the heading. Leave it out when a dialog carries the text. */
  readonly description?: string;
  /**
   * The heading stays in the page for screen readers but is not drawn (the
   * tab's introduction opens in a dialog instead).
   */
  readonly hideHeading?: boolean;
  readonly children: ReactNode;
}

export function Section({
  id,
  title,
  description,
  hideHeading = false,
  children,
}: SectionProps): ReactElement {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className={
          hideHeading
            ? 'sr-only'
            : 'text-2xl font-bold text-brand-700 dark:text-brand-200'
        }
      >
        {title}
      </h2>
      {description === undefined || hideHeading ? null : (
        <p className="mt-1 mb-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
