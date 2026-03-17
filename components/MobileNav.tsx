"use client";

import { TabType } from "@/app/page";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const tabs: TabType[] = ["Home", "Resume", "Photos", "Blog", "Pay", "Contact"];

export function MobileNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-[var(--foreground)] hover:text-[var(--color-neon)] transition-colors"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-[var(--border)] z-50"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setOpen(false); }}
                className={`w-full text-left px-6 py-4 font-mono text-sm border-b border-[var(--border)] transition-colors ${
                  activeTab === tab
                    ? "text-[var(--color-neon)] bg-[rgba(0,255,136,0.05)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <span className="text-[var(--color-neon)] opacity-40 mr-2">&gt;</span>
                {tab}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
