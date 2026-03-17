"use client";

import { TabType } from "@/app/page";
import { cn } from "@/lib/utils";

const tabs: TabType[] = ["Home", "Resume", "Photos", "Blog", "Pay", "Contact"];

export function Navigation({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) {
  return (
    <nav className="hidden md:flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-2 text-sm font-mono font-medium transition-all duration-300 relative rounded-lg",
            activeTab === tab
              ? "text-[var(--color-neon)] bg-[rgba(0,255,136,0.08)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.03)]"
          )}
        >
          {activeTab === tab && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[var(--color-neon)] rounded-full shadow-[0_0_8px_var(--color-neon-glow)]" />
          )}
          {tab}
        </button>
      ))}
    </nav>
  );
}
