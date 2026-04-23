"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Hamafy",
  cancelLabel = "Hanafoana",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  // Bloquer le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-primary/10 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] animate-[slideUp_300ms_ease-out]">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
            variant === "danger" 
              ? "bg-red-50 text-red-600" 
              : "bg-surface-container text-primary"
          }`}>
            <span className="material-symbols-outlined text-[28px]">
              {variant === "danger" ? "warning" : "help"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="mb-2 font-serif text-2xl font-medium text-primary">
            {title}
          </h3>
          <p className="font-sans text-sm leading-relaxed text-on-surface-variant/70">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-outline-variant px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest transition-colors disabled:opacity-50 ${
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-primary text-on-primary hover:bg-primary/90"
            }`}
          >
            {isLoading && (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
