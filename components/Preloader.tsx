"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const fullText = "Initializing system...";

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      }
    }, 60);

    const timer = setTimeout(() => {
      clearInterval(typeInterval);
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0a0f]"
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          
          {/* Scanning line */}
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-neon)] to-transparent opacity-30"
          />
          
          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Hex loader */}
            <div className="relative w-20 h-20 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 border-2 border-transparent border-t-[var(--color-neon)] rounded-full"
                style={{ boxShadow: "0 0 15px rgba(0, 255, 136, 0.2)" }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-2 border-2 border-transparent border-b-[var(--color-cyan)] rounded-full opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-[var(--color-neon)] font-mono text-lg font-bold"
                >
                  AK
                </motion.span>
              </div>
            </div>

            {/* Typing text */}
            <div className="font-mono text-sm text-[var(--color-neon)] mb-2 h-5">
              <span>{text}</span>
              <span className="animate-pulse">█</span>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-[var(--border)] rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[var(--color-neon)] to-[var(--color-cyan)]"
                style={{ boxShadow: "0 0 10px rgba(0, 255, 136, 0.3)" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
