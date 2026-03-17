"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  // Since we're going for a permanently dark cyber theme, 
  // this toggle is more decorative but can still switch
  return (
    <button
      className="p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--border)] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.05)] text-[var(--muted)] hover:text-[var(--color-neon)] transition-all"
      aria-label="Toggle Theme"
      title="System theme"
    >
      <Moon size={18} />
    </button>
  );
}
