"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Calendar, ArrowUpRight, Loader2 } from "lucide-react";

interface BlogItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
}

export function BlogTab() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-black">
          <span className="text-[var(--foreground)]">Latest </span>
          <span className="neon-text">Posts</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          <span className="text-[var(--color-neon)] opacity-60">&gt;</span> security research & writeups
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[var(--color-neon)]" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group hover:border-[rgba(0,255,136,0.2)] transition-all duration-300 flex flex-col h-full bg-[#111118]"
            >
              {post.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[rgba(0,255,136,0.08)] text-[var(--color-neon)] border border-[rgba(0,255,136,0.15)]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--muted)] font-mono">
                    <Calendar size={12} /> {post.date}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-[var(--foreground)] group-hover:text-[var(--color-neon)] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed flex-1 font-mono">{post.excerpt}</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-mono text-[var(--color-neon)] group-hover:gap-2 transition-all">
                  Read more <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* See All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pt-4"
      >
        <a
          href="https://blog.anishkhatri.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group px-8 py-3 rounded-xl border border-[var(--border)] hover:border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.03)] hover:bg-[rgba(0,255,136,0.08)] text-[var(--foreground)] hover:text-[var(--color-neon)] font-mono font-bold text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]"
        >
          SEE ALL BLOGS <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </div>
  );
}
