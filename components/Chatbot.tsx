"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

import { createPortal } from "react-dom";

export function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey there! 👋 I'm Anish's AI assistant. Ask me anything about his skills, experience, projects, or how to get in touch!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.error || "Sorry, something went wrong. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Floating toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--color-neon)] to-[var(--color-cyan)] text-black shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_50px_rgba(0,255,136,0.5)] transition-shadow duration-300 cursor-pointer"
            aria-label="Open chat"
            id="chatbot-toggle-open"
          >
            <MessageCircle size={24} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[var(--color-neon)] opacity-30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[999] w-[calc(100vw-3rem)] sm:w-[400px] h-[520px] flex flex-col glass-card overflow-hidden shadow-[0_0_60px_rgba(0,255,136,0.1)]"
            id="chatbot-panel"
          >
            {/* Terminal-style header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-black/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[var(--color-neon)]" />
                  ai_assistant.sh
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--color-neon)] hover:bg-[rgba(0,255,136,0.05)] transition-all cursor-pointer"
                aria-label="Close chat"
                id="chatbot-toggle-close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      message.role === "user"
                        ? "bg-[rgba(0,229,255,0.1)] border-[rgba(0,229,255,0.2)] text-[var(--color-cyan)]"
                        : "bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.2)] text-[var(--color-neon)]"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm font-mono leading-relaxed ${
                      message.role === "user"
                        ? "bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.15)] text-[var(--foreground)]"
                        : "bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.1)] text-[var(--foreground)]"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] text-[var(--color-neon)]">
                    <Bot size={14} />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.1)] flex items-center gap-1.5">
                    <Loader2 size={14} className="animate-spin text-[var(--color-neon)]" />
                    <span className="text-xs font-mono text-[var(--muted)]">thinking</span>
                    <span className="chatbot-typing-dots text-[var(--color-neon)] font-mono text-xs">...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-[var(--border)] bg-black/20 shrink-0">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neon)] font-mono text-sm opacity-60">
                    &gt;
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Anish..."
                    disabled={isLoading}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg pl-7 pr-3 py-2.5 text-sm font-mono outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] placeholder:text-[var(--muted)]/40 text-[var(--foreground)] disabled:opacity-50"
                    id="chatbot-input"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-neon)] text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shrink-0 cursor-pointer"
                  aria-label="Send message"
                  id="chatbot-send"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] font-mono text-[var(--muted)] opacity-40 text-center mt-2">
                Powered by Gemini AI • Responses may not always be accurate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
