"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Lock, User, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin-token", data.token);
        router.push("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background artifacts */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,255,136,0.1)] border border-[var(--color-neon)] flex items-center justify-center mb-4 neon-shadow">
            <Terminal className="text-[var(--color-neon)]" size={30} />
          </div>
          <h1 className="text-2xl font-black neon-text uppercase tracking-tighter">System Login</h1>
          <p className="font-mono text-[var(--muted)] text-xs mt-2">ACCESS RESTRICTED TO PERSONNEL ONLY</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest block pl-1">Identifier</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg py-3 pl-10 pr-4 outline-none transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest block pl-1">Credentials</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-[var(--border)] focus:border-[var(--color-neon)] rounded-lg py-3 pl-10 pr-4 outline-none transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-neon)] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_var(--color-neon-glow)] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "INITIALIZING..." : (
              <>
                <LogIn size={18} /> AUTHENTICATE
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
