"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { RuneButton } from "./RuneButton";

type ScrollModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Lore scroll. Built on the native <dialog>, which gives us a focus trap,
 * Escape to close and focus return to the opener without extra code.
 */
export function ScrollModal({ open, onClose, title, children, footer }: Readonly<ScrollModalProps>) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    } else if (!open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={onClose}
      className="m-auto w-[min(92vw,40rem)] rounded-lg border-2 border-crypt-border bg-crypt p-0 text-parchment backdrop:bg-void/80"
    >
      <div className="p-6">
        <h2 id={titleId} className="mb-3 text-xl font-semibold text-candle">
          {title}
        </h2>
        <div>{children}</div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="text-sm text-parchment-dim">{footer}</div>
          <RuneButton variant="ghost" onClick={onClose}>
            Close scroll
          </RuneButton>
        </div>
      </div>
    </dialog>
  );
}
