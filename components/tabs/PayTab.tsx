"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  CreditCard, Bitcoin, User, Mail, DollarSign, Send,
  CheckCircle2, AlertCircle, Terminal, Copy, Check,
  Wallet, ArrowRight, Shield
} from "lucide-react";

type PaymentMethod = "stripe" | "crypto";

type FormData = {
  name: string;
  email: string;
  amount: string;
};

type WalletItem = {
  id: string;
  name: string;
  symbol: string;
  address: string;
  network: string;
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

export function PayTab() {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const amount = watch("amount");

  useEffect(() => {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then((data) => {
        setWallets(data);
        if (data.length > 0) setSelectedWallet(data[0]);
      })
      .catch(console.error);
  }, []);

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
          sitekey: "0x4AAAAAAAzySGqHKR-tmtnV",
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

  const copyToClipboard = useCallback((wallet: WalletItem) => {
    navigator.clipboard.writeText(wallet.address);
    setCopiedId(wallet.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const headersWithTurnstile: Record<string, string> = { ...headers };
    if (turnstileToken) headersWithTurnstile["x-turnstile-token"] = turnstileToken;

    try {
      // Send email notification (no Turnstile — token is single-use, reserved for checkout)
      await fetch("/api/payment-notify", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          method: paymentMethod,
          amount: data.amount,
          currency: "USD",
          walletName: selectedWallet?.name,
        }),
      });

      if (paymentMethod === "stripe") {
        // Create Stripe Checkout session (with Turnstile verification)
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: headersWithTurnstile,
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            amount: parseFloat(data.amount),
            currency: "usd",
          }),
        });

        const result = await res.json();
        if (result.url) {
          window.location.href = result.url;
          return;
        }
        setSubmitStatus("error");
      } else {
        // Crypto: just show success, user copies wallet address
        setSubmitStatus("success");
        reset();
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
          <span className="text-[var(--foreground)]">Make a </span>
          <span className="neon-text">Payment</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          <span className="text-[var(--color-neon)] opacity-60">&gt;</span> pay securely via card, apple pay, google pay, or crypto
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Payment Method Selector + Crypto Wallets */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Method Toggle */}
          <div className="glass-card p-2 flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("stripe")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                paymentMethod === "stripe"
                  ? "bg-[rgba(0,255,136,0.1)] text-[var(--color-neon)] border border-[rgba(0,255,136,0.3)] shadow-[0_0_20px_rgba(0,255,136,0.1)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <CreditCard size={18} />
              <span className="hidden sm:inline">Card / Wallet</span>
              <span className="sm:hidden">Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("crypto")}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                paymentMethod === "crypto"
                  ? "bg-[rgba(0,255,136,0.1)] text-[var(--color-neon)] border border-[rgba(0,255,136,0.3)] shadow-[0_0_20px_rgba(0,255,136,0.1)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <Bitcoin size={18} />
              <span>Crypto</span>
            </button>
          </div>

          {/* Info Cards */}
          <AnimatePresence mode="wait">
            {paymentMethod === "stripe" ? (
              <motion.div
                key="stripe-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="glass-card p-5 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.1)] text-[var(--color-neon)]">
                      <Shield size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] block">Secure Payment</span>
                      <span className="text-sm font-medium text-[var(--foreground)]">Powered by Stripe</span>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-[var(--muted)] leading-relaxed">
                    You&apos;ll be securely redirected to Stripe Checkout where you can pay using <span className="text-[var(--color-neon)]">Credit/Debit Card</span>, <span className="text-[var(--color-neon)]">Apple Pay</span>, or <span className="text-[var(--color-neon)]">Google Pay</span>.
                  </p>
                </div>

                {/* Accepted methods */}
                <div className="glass-card p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] block mb-3">Accepted Methods</span>
                  <div className="flex gap-3 flex-wrap">
                    {["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"].map((m) => (
                      <span key={m} className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="crypto-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {wallets.length === 0 ? (
                  <div className="glass-card p-6 text-center">
                    <Wallet className="mx-auto mb-3 text-[var(--muted)]" size={32} />
                    <p className="text-sm font-mono text-[var(--muted)]">No crypto wallets configured yet.</p>
                  </div>
                ) : (
                  wallets.map((wallet) => (
                    <motion.div
                      key={wallet.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`glass-card p-4 cursor-pointer transition-all duration-300 group ${
                        selectedWallet?.id === wallet.id
                          ? "border-[rgba(0,255,136,0.3)] shadow-[0_0_15px_rgba(0,255,136,0.05)]"
                          : "hover:border-[rgba(0,255,136,0.15)]"
                      }`}
                      onClick={() => setSelectedWallet(wallet)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.1)] text-[var(--color-neon)] font-mono font-bold text-xs">
                            {wallet.symbol}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[var(--foreground)] block">{wallet.name}</span>
                            {wallet.network && (
                              <span className="text-[10px] font-mono text-[var(--muted)]">{wallet.network}</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(wallet); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.15)] text-[var(--color-neon)] text-xs font-mono hover:bg-[rgba(0,255,136,0.12)] transition-all"
                        >
                          {copiedId === wallet.id ? <Check size={14} /> : <Copy size={14} />}
                          {copiedId === wallet.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="bg-[var(--background)] rounded-lg px-3 py-2 mt-2 border border-[var(--border)]">
                        <code className="text-[11px] font-mono text-[var(--muted)] break-all select-all">{wallet.address}</code>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Payment Form */}
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
              <Terminal size={12} className="inline mr-1" /> payment_form.sh
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
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

            {/* Email */}
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

            {/* Amount */}
            <div>
              <label className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-2 block">
                <span className="text-[var(--color-neon)]">$</span> amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute top-3.5 left-4 text-[var(--muted)]" size={16} />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  {...register("amount", { required: "Amount is required", min: { value: 1, message: "Minimum $1" } })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg pl-11 pr-4 py-3 text-sm font-mono outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] placeholder:text-[var(--muted)]/50 text-[var(--foreground)]"
                />
              </div>
              {errors.amount && <span className="text-red-400 text-xs font-mono mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.amount.message}</span>}
            </div>

            {/* Turnstile Widget */}
            <div className="flex justify-center">
              <div ref={turnstileRef} />
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(0,255,136,0.06)] text-[var(--color-neon)] border border-[rgba(0,255,136,0.2)] px-4 py-3 rounded-lg flex items-center gap-3 font-mono text-sm"
              >
                <CheckCircle2 size={18} />
                {paymentMethod === "crypto"
                  ? "Payment details sent! Please transfer to the wallet address shown."
                  : "Redirecting to payment..."}
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[rgba(255,50,50,0.06)] text-red-400 border border-[rgba(255,50,50,0.2)] px-4 py-3 rounded-lg font-mono text-sm"
              >
                Something went wrong. Please try again.
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[var(--color-neon)] text-black font-mono font-bold text-sm hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : paymentMethod === "stripe" ? (
                <>
                  <CreditCard size={16} />
                  PAY {amount ? `$${amount}` : ""} WITH STRIPE
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <Send size={16} />
                  CONFIRM & NOTIFY
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
