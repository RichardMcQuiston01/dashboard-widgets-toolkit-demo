import type { ReactElement, ReactNode } from 'react';

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export function Section({
  id,
  title,
  description,
  children,
}: SectionProps): ReactElement {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="text-2xl font-bold text-brand-700 dark:text-brand-200"
      >
        {title}
      </h2>
      <p className="mt-1 mb-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {children}
    </section>
  );
}
