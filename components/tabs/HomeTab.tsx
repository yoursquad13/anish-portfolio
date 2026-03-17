"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Twitter, Linkedin, Instagram, MapPin, Mail, Phone, Globe, Terminal, User, Shield, Code, Cpu } from "lucide-react";

const socialLinks = [
  { icon: <Instagram size={20} />, href: "https://www.instagram.com/anishkhatri10/", label: "Instagram" },
  { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/anishkhatri10", label: "LinkedIn" },
  { icon: <Twitter size={20} />, href: "https://x.com/_AnishKhatri_", label: "Twitter" },
  { icon: <Github size={20} />, href: "https://github.com/yoursquad13", label: "GitHub" },
];

const infoCards = [
  { icon: <MapPin size={18} className="text-red-400" />, label: "Location", value: "Dhangadhi, Nepal 🇳🇵" },
  { icon: <Mail size={18} className="text-[var(--color-neon)]" />, label: "Email", value: "info@anishkhatri.com" },
  { icon: <Phone size={18} className="text-[var(--color-cyan)]" />, label: "Phone", value: "+1 234 714 6102" },
  { icon: <Globe size={18} className="text-[var(--color-magenta)]" />, label: "Website", value: "anishkhatri.com" },
];

export function HomeTab() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative group"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-[var(--color-neon)] via-[var(--color-cyan)] to-[var(--color-magenta)] rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-64 h-64 lg:w-72 lg:h-72 rounded-3xl overflow-hidden border border-[var(--border)] bg-[#111118] neon-border p-2">
            <Image
              src="/profile.jpg"
              alt="Anish Khatri"
              fill
              className="object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
              priority
            />
            {/* Animated status dot */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[rgba(0,255,136,0.3)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-neon)]"></span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[var(--color-neon)]">ACTIVE</span>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.2)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon)] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-[var(--color-neon)] uppercase tracking-wider">Available for hire</span>
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter"
            >
              Hi, I'm <span className="neon-text italic">Anish</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl font-mono text-[var(--muted)] flex items-center justify-center lg:justify-start gap-3"
            >
              <span className="text-[var(--color-neon)]">&gt;</span> Freelance Web Developer & Security Researcher
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[var(--muted)] leading-relaxed max-w-xl text-lg font-mono font-light opacity-80"
          >
            I am a tireless seeker of knowledge, occasional purveyor of wisdom, and also, coincidentally, a Web Developer. Check out my blog for some of my recent works.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-4 pt-4"
          >
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className="w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--color-neon)] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.05)] hover:shadow-[0_0_15px_rgba(0,255,136,0.1)] transition-all duration-300 active:scale-90"
              >
                {social.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="glass-card p-5 group flex items-start gap-4 hover:border-[var(--border)] transition-all bg-[#0f0f15]"
          >
            <div className="w-10 h-10 rounded-lg bg-black/40 border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] block">{card.label}</span>
              <p className="font-bold text-sm text-[var(--foreground)] truncate">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* About Shell Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card bg-[#0d0d12] overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)] bg-black/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[10px] font-mono text-[var(--muted)] ml-3 flex items-center gap-1.5">
            <Terminal size={12} /> ~/anish/about.sh
          </span>
        </div>
        <div className="p-8 font-mono space-y-8 text-sm lg:text-base leading-relaxed">
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-[var(--color-neon)] shrink-0">$</span>
              <span className="text-white">cat about.txt</span>
            </div>
            <p className="text-[var(--muted)] pl-6 max-w-4xl text-sm lg:text-base">
              Passionate web developer with expertise in building modern, secure, and performant web applications. Experienced in security research with recognitions from major tech companies including Alibaba and Facebook. Always pushing the boundaries of what's possible on the web.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-[var(--color-neon)] shrink-0">$</span>
              <span className="text-white">whoami</span>
            </div>
            <div className="pl-6 flex flex-wrap gap-y-3 gap-x-6">
              <div className="flex items-center gap-2 text-[var(--color-cyan)] text-xs lg:text-sm">
                <User size={14} /> anish@khatri
              </div>
              <div className="text-[var(--muted)]">~</div>
              <div className="flex items-center gap-2 text-[var(--color-neon)] text-xs lg:text-sm">
                <Code size={14} /> Freelancer
              </div>
              <div className="text-[var(--muted)]">|</div>
              <div className="flex items-center gap-2 text-[var(--color-magenta)] text-xs lg:text-sm">
                <Cpu size={14} /> Web Developer
              </div>
              <div className="text-[var(--muted)]">|</div>
              <div className="flex items-center gap-2 text-[var(--color-cyan)] text-xs lg:text-sm">
                <Shield size={14} /> Security Researcher
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-[var(--color-neon)] shrink-0">$</span>
            <span className="cursor-blink"></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
