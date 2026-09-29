'use client';

import React, { useEffect, useRef } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * A modal confirmation, on the native `<dialog>`, which already traps focus,
 * closes on Escape, and returns focus to whatever opened it.
 */
const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel,
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;

    if (open && !dialog?.open) {
      dialog?.showModal();
    } else if (!open && dialog?.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-dialog-title"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();

        if (!busy) {
          onCancel();
        }
      }}
    >
      <h2 id="confirm-dialog-title" className="mt-0 mb-2 text-lg">
        {title}
      </h2>
      <div className="mb-6 text-sm text-muted-foreground [&_p]:mb-2">
        {children}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant={destructive ? 'destructive' : 'default'}
          size="sm"
          onClick={onConfirm}
          disabled={busy}
          autoFocus
        >
          {busy && <ReloadIcon className="mr-2 size-3.5 animate-spin" />}
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
