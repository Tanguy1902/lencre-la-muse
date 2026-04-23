"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ToastData {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, variant?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, variant: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container des toasts */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-5 py-3.5 shadow-lg backdrop-blur-md animate-[slideInRight_300ms_ease-out] ${
              toast.variant === "success"
                ? "border-green-200 bg-green-50/95 text-green-800"
                : toast.variant === "error"
                ? "border-red-200 bg-red-50/95 text-red-800"
                : "border-outline-variant bg-surface-container-lowest/95 text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toast.variant === "success"
                ? "check_circle"
                : toast.variant === "error"
                ? "error"
                : "info"}
            </span>
            <span className="font-sans text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-2 opacity-60 transition-opacity hover:opacity-100"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
