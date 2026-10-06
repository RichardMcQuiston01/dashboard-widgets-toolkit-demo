import type { ReactElement } from 'react';

const linkClass: string =
  'underline decoration-brand-300 underline-offset-2 hover:text-white';

export function Footer(): ReactElement {
  return (
    <footer className="bg-brand-900 text-sm text-brand-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; 2026 Richard McQuiston. All rights reserved. Licensed under
          Apache 2.0.
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <a
            className={linkClass}
            href="https://richardmcquiston.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            richardmcquiston.com
          </a>
          <a
            className={linkClass}
            href="https://github.com/RichardMcQuiston01/dashboard-widgets-toolkit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Toolkit on GitHub
          </a>
          <a
            className={linkClass}
            href="https://github.com/RichardMcQuiston01/dashboard-widgets-toolkit-demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo source
          </a>
        </p>
      </div>
    </footer>
  );
}
