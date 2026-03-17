"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { MapPin, Mail, Phone, User, Send, CheckCircle2, Terminal, AlertCircle } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function ContactTab() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "captcha_required">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Load Turnstile script
  useEffect(() => {
    if (document.getElementById("cf-turnstile-script")) return;
    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
    script.async = true;
    document.head.appendChild(script);

    (window as unknown as Record<string, unknown>).onTurnstileLoad = () => {
      if (turnstileRef.current && window.turnstile) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAAAzySGqHKR-tmtnV", // Reusing your existing Turnstile key
          theme: "dark",
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
        });
      }
    };

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!turnstileToken) {
      setSubmitStatus("captcha_required");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Reset Turnstile
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-black">
          <span className="text-[var(--foreground)]">Get in </span>
          <span className="neon-text">Touch</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          <span className="text-[var(--color-neon)] opacity-60">&gt;</span> send a message or find me here
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Map */}
          <div className="glass-card overflow-hidden h-56 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.4116518118076!2d80.5601243150813!3d28.887208982318023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a1aacb908ebbb3%3A0xc3f3453b3beebacb!2sDhangadhi%2C%20Nepal!5e0!3m2!1sen!2sus!4v1677610034636!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.3) brightness(0.8)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>

          {/* Contact Cards */}
          <div className="space-y-4">
            {[
              { icon: <MapPin size={18} />, label: "Address", value: "Ratopool 02, Dhangadhi, Kailali, Nepal 10900" },
              { icon: <Mail size={18} />, label: "Email", value: "info@anishkhatri.com", href: "mailto:info@anishkhatri.com" },
              { icon: <Phone size={18} />, label: "Phone", value: "+1 234 714 6102", href: "tel:+12347146102" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-card p-4 flex items-center gap-4 group hover:border-[rgba(0,255,136,0.2)] transition-all"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.1)] text-[var(--color-neon)] group-hover:shadow-[0_0_12px_var(--color-neon-glow)] transition-shadow shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] block">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-neon)] transition-colors truncate block">{item.value}</a>
                  ) : (
                    <span className="text-sm font-medium text-[var(--foreground)] truncate block">{item.value}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 lg:p-8"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-[var(--muted)] ml-3">
              <Terminal size={12} className="inline mr-1" /> contact_form.sh
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2 block">
                <span className="text-[var(--color-neon)]">$</span> name
              </label>
              <div className="relative">
                <User className="absolute top-3.5 left-4 text-[var(--muted)]" size={16} />
                <input
                  type="text"
                  placeholder="Your full name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg pl-11 pr-4 py-3 text-sm font-mono outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] placeholder:text-[var(--muted)]/50 text-[var(--foreground)]"
                />
              </div>
              {errors.name && <span className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</span>}
            </div>

            <div>
              <label className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2 block">
                <span className="text-[var(--color-neon)]">$</span> email
              </label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-4 text-[var(--muted)]" size={16} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register("email", { required: "Email is required", pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email" } })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg pl-11 pr-4 py-3 text-sm font-mono outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] placeholder:text-[var(--muted)]/50 text-[var(--foreground)]"
                />
              </div>
              {errors.email && <span className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</span>}
            </div>

            <div>
              <label className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2 block">
                <span className="text-[var(--color-neon)]">$</span> message
              </label>
              <textarea
                placeholder="Type your message here..."
                rows={5}
                {...register("message", { required: "Message is required" })}
                className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] resize-none placeholder:text-[var(--muted)]/50 text-[var(--foreground)]"
              />
              {errors.message && <span className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.message.message}</span>}
            </div>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(0,255,136,0.06)] text-[var(--color-neon)] border border-[rgba(0,255,136,0.2)] px-4 py-3 rounded-lg flex items-center gap-3 font-mono text-sm"
              >
                <CheckCircle2 size={18} /> Message sent successfully!
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(255,50,50,0.06)] text-red-400 border border-[rgba(255,50,50,0.2)] px-4 py-3 rounded-lg font-mono text-sm"
              >
                Failed to send. Please try again.
              </motion.div>
            )}

            {submitStatus === "captcha_required" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(255,200,50,0.06)] text-yellow-500 border border-[rgba(255,200,50,0.2)] px-4 py-3 rounded-lg font-mono text-sm flex items-center gap-2"
              >
                <AlertCircle size={16} /> Please complete the captcha to proceed.
              </motion.div>
            )}

            {/* Turnstile Widget */}
            <div className="flex justify-center">
              <div ref={turnstileRef} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[var(--color-neon)] text-black font-mono font-bold text-sm hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> SEND MESSAGE
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
