import type React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  actions,
  initialFocusRef,
}: ModalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousActiveRef.current = document.activeElement as HTMLElement;

    const focusTarget = initialFocusRef?.current;
    if (focusTarget) {
      focusTarget.focus();
    } else {
      containerRef.current?.focus();
    }

    const getFocusableElements = () => {
      if (!containerRef.current) return [] as HTMLElement[];
      const selector =
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
      return Array.from(containerRef.current.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled")
      );
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousActiveRef.current?.focus();
    };
  }, [initialFocusRef, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Pencereyi kapat"
        className="absolute inset-0 bg-slate-200/80 backdrop-blur dark:bg-slate-950/70"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={containerRef}
        className={cn(
          "relative z-10 w-full max-w-xl rounded-2xl border",
          "border-slate-200/70 bg-white/95 p-6 shadow-2xl",
          "dark:border-white/10 dark:bg-slate-950/90"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            className="rounded-lg border border-slate-200/70 px-2 py-1 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {actions ? <div className="mt-6 flex justify-end gap-2">{actions}</div> : null}
      </div>
    </div>
  );
};

export default Modal;
