import { useState, type ReactElement } from 'react';

import { CautionIcon } from './icons';
import { Playground } from './Playground';
import { SettingsDialog } from './SettingsDialog';

/**
 * A floating button (above the jump-to-top button) that opens the payload
 * validation playground in a dialog.
 */
export function ValidationLauncher(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label="Payload validation"
        title="Payload validation: try a payload and see its field-level errors"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-5 z-50 flex size-11 items-center justify-center rounded-full bg-accent-500 text-brand-900 shadow-lg transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
      >
        <CautionIcon className="size-5" />
      </button>
      <SettingsDialog
        open={open}
        title="Payload validation"
        closeLabel="Close payload validation"
        onClose={() => setOpen(false)}
      >
        <p className="mb-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Providers can return plain JSON, so a server can resolve widgets and a
          client can validate them. Edit the payload to see field-level errors.
        </p>
        <Playground />
      </SettingsDialog>
    </>
  );
}
