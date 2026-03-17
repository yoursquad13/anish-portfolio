"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Briefcase, Code, Terminal, Server, Globe, Cpu, 
  ExternalLink, Building2, Layout, ShieldAlert, Bug, Loader2
} from "lucide-react";
import type { ClientItem } from "@/lib/data";

const skills = [
  { name: "Frontend Development", level: 95, color: "var(--color-neon)" },
  { name: "Backend Development", level: 85, color: "var(--color-cyan)" },
  { name: "Security Research", level: 90, color: "var(--color-magenta)" },
  { name: "UI/UX Design", level: 80, color: "var(--color-neon)" },
  { name: "DevOps", level: 75, color: "var(--color-cyan)" },
];

export function ResumeTab() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-20 pb-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-black">
          <span className="text-[var(--foreground)]">My </span>
          <span className="neon-text">Resume</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          <span className="text-[var(--color-neon)] opacity-60 font-bold">&gt;</span> experience && education && skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Education */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center text-[var(--color-neon)]">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Education</h3>
          </div>

          <div className="space-y-6 relative pl-8 border-l border-[var(--border)]">
            {[
              { year: "2017 - 2019", title: "Higher Study", institution: "National Academy of Science and Technology", desc: "Completed my higher studies in Science and Computer technology with good grades and moral character." },
              { year: "2005 - 2017", title: "Primary School", institution: "Glee Academy School", desc: "Completed my basic schooling from Glee Academy with good grades and moral character." },
              { year: "Ongoing", title: "Online Courses", institution: "Udemy", desc: "Completed multiple online courses about web development and ethical hacking." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative glass-card p-6 group hover:border-[rgba(0,255,136,0.2)] transition-all"
              >
                <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-[var(--color-neon)] border-4 border-[#0a0a0f] z-10 group-hover:shadow-[0_0_10px_var(--color-neon-glow)] transition-shadow" />
                <span className="text-[10px] font-mono font-bold text-[var(--color-neon)] bg-[rgba(0,255,136,0.1)] px-3 py-1 rounded inline-block mb-3 border border-[rgba(0,255,136,0.1)]">
                  {item.year}
                </span>
                <p className="text-xs font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">{item.institution}</p>
                <h4 className="text-lg font-bold mb-3 uppercase">{item.title}</h4>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-mono">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] flex items-center justify-center text-[var(--color-cyan)]">
              <Briefcase size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Experience</h3>
          </div>

          <div className="space-y-6 relative pl-8 border-l border-[var(--border)]">
            {[
              { year: "Apr 2017 - Present", title: "Founder / Web Developer", institution: "Ziwee", desc: "I created this website and have been working on it to make it even better everyday." },
              { year: "Nov 2019", title: "Security Researcher", institution: "Alibaba Security", desc: "Found multiple high severity security vulnerabilities and was mentioned in their hall of fame." },
              { year: "Oct 2018 - Present", title: "Security / Development", institution: "SafSocial", desc: "Working with the development and security of SafSocial. Managed to fix multiple security vulnerabilities." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative glass-card p-6 group hover:border-[rgba(0,229,255,0.2)] transition-all"
              >
                <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-[var(--color-cyan)] border-4 border-[#0a0a0f] z-10 group-hover:shadow-[0_0_10px_var(--color-cyan-glow)] transition-shadow" />
                <span className="text-[10px] font-mono font-bold text-[var(--color-cyan)] bg-[rgba(0,229,255,0.1)] px-3 py-1 rounded inline-block mb-3 border border-[rgba(0,229,255,0.1)]">
                  {item.year}
                </span>
                <p className="text-xs font-mono text-[var(--muted)] mb-1 uppercase tracking-widest">{item.institution}</p>
                <h4 className="text-lg font-bold mb-3 uppercase">{item.title}</h4>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-mono">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Significant <span className="neon-text">Clients</span></h3>
          <p className="text-sm text-[var(--muted)] font-mono leading-relaxed">
            I have worked directly for Companies below or helped them through their bug bounty program.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[var(--color-neon)]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.map((client, i) => (
              <motion.a
                key={client.id}
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5, borderColor: "var(--color-neon)" }}
                transition={{ delay: i * 0.05 }}
                className="glass-card flex items-center justify-center p-6 grayscale transition-all hover:grayscale-0 hover:bg-[rgba(0,255,136,0.02)] h-24"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain filter brightness-90 contrast-125" />
              </motion.a>
            ))}
            {clients.length === 0 && !loading && (
              <div className="col-span-full text-center py-10 font-mono text-xs opacity-20 border border-dashed border-[var(--border)] rounded-xl">
                NO CLIENTS LISTED YET
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,0,255,0.1)] border border-[rgba(255,0,255,0.2)] flex items-center justify-center text-[var(--color-magenta)]">
              <Code size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Technical Skills</h3>
          </div>
          <div className="space-y-6">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-[var(--foreground)]">
                  <span>{skill.name}</span>
                  <span className="text-[var(--color-neon)]">{skill.level}%</span>
                </div>
                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.03)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ backgroundColor: skill.color }}
                    className="h-full relative shadow-[0_0_10px_rgba(0,255,136,0.2)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center text-[var(--color-neon)]">
              <Cpu size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Layout className="text-[var(--color-neon)]" />, title: "UI/UX Design", desc: "Creating modern and sleek interfaces." },
              { icon: <Globe className="text-[var(--color-cyan)]" />, title: "Web Dev", desc: "Fullstack high-performance apps." },
              { icon: <ShieldAlert className="text-red-400" />, title: "Cyber Security", desc: "Expert vulnerability assessment." },
              { icon: <Bug className="text-[var(--color-magenta)]" />, title: "Bug Bounty", desc: "Security research & reporting." },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col gap-3 group hover:border-[rgba(0,255,136,0.1)] transition-all bg-[#111118]"
              >
                <div className="w-10 h-10 rounded-lg bg-black/50 border border-[var(--border)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {service.icon}
                </div>
                <h4 className="font-bold text-sm uppercase">{service.title}</h4>
                <p className="text-[10px] font-mono text-[var(--muted)] leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
