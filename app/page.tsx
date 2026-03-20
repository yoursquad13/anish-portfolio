"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { HomeTab } from "@/components/tabs/HomeTab";
import { ResumeTab } from "@/components/tabs/ResumeTab";
import { PhotosTab } from "@/components/tabs/PhotosTab";
import { BlogTab } from "@/components/tabs/BlogTab";
import { ContactTab } from "@/components/tabs/ContactTab";
import { PayTab } from "@/components/tabs/PayTab";
import { Particles } from "@/components/Particles";
import { Chatbot } from "@/components/Chatbot";

export type TabType = "Home" | "Resume" | "Photos" | "Blog" | "Pay" | "Contact";

const HASH_TO_TAB: Record<string, TabType> = {
  "": "Home",
  home: "Home",
  resume: "Resume",
  photos: "Photos",
  blog: "Blog",
  pay: "Pay",
  contact: "Contact",
};

const TAB_TO_HASH: Record<TabType, string> = {
  Home: "",
  Resume: "resume",
  Photos: "photos",
  Blog: "blog",
  Pay: "pay",
  Contact: "contact",
};

function getTabFromHash(): TabType {
  if (typeof window === "undefined") return "Home";
  const hash = window.location.hash.replace("#", "").toLowerCase();
  return HASH_TO_TAB[hash] || "Home";
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabType>("Home");
  const [isLoaded, setIsLoaded] = useState(false);

  // Read hash on initial load
  useEffect(() => {
    setActiveTab(getTabFromHash());
    setIsLoaded(true);
  }, []);

  // Listen for browser back/forward (popstate)
  useEffect(() => {
    const onHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Wrap setActiveTab to also update the URL hash
  const handleSetActiveTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    const hash = TAB_TO_HASH[tab];
    window.history.pushState(null, "", hash ? `#${hash}` : window.location.pathname);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "Home": return <HomeTab />;
      case "Resume": return <ResumeTab />;
      case "Photos": return <PhotosTab />;
      case "Blog": return <BlogTab />;
      case "Pay": return <PayTab />;
      case "Contact": return <ContactTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300 grid-bg scanlines">
      
      {/* Floating particles */}
      <Particles />

      {/* Background glows */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.06),transparent_70%)] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.04),transparent_70%)] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.02),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex justify-between items-center bg-[rgba(10,10,15,0.8)] backdrop-blur-xl border-b border-[var(--border)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--color-neon)] pulse-glow" />
          <span className="text-lg font-bold font-mono tracking-tight text-[var(--foreground)]">
            anish<span className="neon-text">.</span>khatri
          </span>
          <span className="text-xs font-mono text-[var(--muted)] ml-2 hidden sm:inline">// portfolio v3.0</span>
        </motion.div>
        <div className="flex items-center gap-6">
          <Navigation activeTab={activeTab} setActiveTab={handleSetActiveTab} />
          <MobileNav activeTab={activeTab} setActiveTab={handleSetActiveTab} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-[var(--border)] bg-[rgba(10,10,15,0.6)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-mono text-[var(--muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon)] inline-block" />
            <span>© {new Date().getFullYear()} Anish Khatri</span>
          </div>
          <div className="text-xs font-mono text-[var(--muted)]">
            <span className="text-[var(--color-neon)] opacity-60">&gt;</span> All rights reserved
          </div>
        </div>
      </footer>
    </div>

    {/* AI Chatbot - outside overflow-hidden container so fixed positioning works */}
    <Chatbot />
    </>
  );
}
