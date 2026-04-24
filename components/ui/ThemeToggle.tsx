"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
      aria-label="Hanova endrika"
    >
      <span className={`material-symbols-outlined transition-all duration-500 ${theme === 'dark' ? 'rotate-180 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`}>
        light_mode
      </span>
      <span className={`material-symbols-outlined absolute transition-all duration-500 ${theme === 'light' ? 'rotate-180 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`}>
        dark_mode
      </span>
    </button>
  );
}
