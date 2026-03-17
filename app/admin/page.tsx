"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Plus, Trash2, Image as ImageIcon, Briefcase, 
  FileText, Upload, Link as LinkIcon, Check, X, AlertCircle, ChevronRight, Terminal as TerminalIcon, Wallet
} from "lucide-react";
import type { PhotoItem, BlogItem, ClientItem, WalletItem } from "@/lib/data";

type Tab = "photos" | "blogs" | "clients" | "wallets";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [wallets, setWallets] = useState<WalletItem[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" as "success" | "error" | "info" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async (authToken: string) => {
    try {
      const [phRes, blRes, clRes, wlRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/blogs"),
        fetch("/api/clients"),
        fetch("/api/wallets"),
      ]);
      if (phRes.ok) setPhotos(await phRes.json());
      if (blRes.ok) setBlogs(await blRes.json());
      if (clRes.ok) setClients(await clRes.json());
      if (wlRes.ok) setWallets(await wlRes.json());
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin-token");
    if (!savedToken) {
      router.push("/admin/login");
    } else {
      setToken(savedToken);
      fetchItems(savedToken).finally(() => setLoading(false));
    }
  }, [router, fetchItems]);

  const showMsg = (text: string, type: "success" | "error" | "info" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "info" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (type === "photos") setPhotos(photos.filter(p => p.id !== id));
        if (type === "blogs") setBlogs(blogs.filter(b => b.id !== id));
        if (type === "clients") setClients(clients.filter(c => c.id !== id));
        if (type === "wallets" as Tab) setWallets(wallets.filter(w => w.id !== id));
        showMsg("Item deleted successfully");
      }
    } catch {
      showMsg("Failed to delete", "error");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        callback(data.url);
        showMsg("File uploaded");
      } else {
        showMsg(data.error || "Upload failed", "error");
      }
    } catch {
      showMsg("Upload failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const src = formData.get("src") as string;
    const alt = formData.get("alt") as string;

    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ src, alt }),
      });
      if (res.ok) {
        setPhotos([...photos, await res.json()]);
        setIsAdding(false);
        showMsg("Photo added");
      }
    } catch {
      showMsg("Failed to add", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      image: formData.get("image") as string,
      link: formData.get("link") as string,
      date: formData.get("date") as string || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setBlogs([await res.json(), ...blogs]);
        setIsAdding(false);
        showMsg("Blog preview added");
      }
    } catch {
      showMsg("Failed to add", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      logo: formData.get("logo") as string,
      website: formData.get("website") as string,
    };

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setClients([...clients, await res.json()]);
        setIsAdding(false);
        showMsg("Client added");
      }
    } catch {
      showMsg("Failed to add", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      symbol: formData.get("symbol") as string,
      address: formData.get("address") as string,
      network: formData.get("network") as string,
    };

    try {
      const res = await fetch("/api/wallets", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setWallets([...wallets, await res.json()]);
        setIsAdding(false);
        showMsg("Wallet added");
      }
    } catch {
      showMsg("Failed to add", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e8] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border)] flex flex-col p-6 hidden lg:flex bg-[#0d0d14]">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-8 h-8 rounded bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center">
            <TerminalIcon size={16} className="text-[var(--color-neon)]" />
          </div>
          <span className="font-black tracking-tighter text-lg uppercase">Admin Shell</span>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { id: "photos", icon: <ImageIcon size={18} />, label: "Photos" },
            { id: "blogs", icon: <FileText size={18} />, label: "Blogs" },
            { id: "clients", icon: <Briefcase size={18} />, label: "Clients" },
            { id: "wallets", icon: <Wallet size={18} />, label: "Wallets" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-mono text-xs uppercase tracking-widest ${
                activeTab === item.id 
                ? "bg-[rgba(0,255,136,0.1)] text-[var(--color-neon)] border border-l-4 border-l-[var(--color-neon)] border-[var(--border)]" 
                : "text-[var(--muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-mono text-xs uppercase tracking-widest"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black neon-text uppercase tracking-tighter flex items-center gap-3">
              Manage {activeTab} <ChevronRight className="opacity-30" />
            </h1>
            <p className="text-[var(--muted)] font-mono text-xs mt-1">Sudo privileges granted for system updates</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-neon)] text-black font-black text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_var(--color-neon-glow)] active:scale-95"
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* Message toast */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`fixed top-10 right-10 z-[100] px-6 py-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
                message.type === "error" ? "bg-red-500/10 border-red-500/40 text-red-400" : "bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.2)] text-[var(--color-neon)]"
              }`}
            >
              {message.type === "error" ? <AlertCircle size={20} /> : <Check size={20} />}
              <span className="font-mono text-sm font-bold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Form Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card w-full max-w-lg p-8 relative"
              >
                <button 
                  onClick={() => setIsAdding(false)}
                  className="absolute top-4 right-4 text-[var(--muted)] hover:text-white"
                >
                  <X size={24} />
                </button>

                <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <TerminalIcon className="text-[var(--color-neon)]" size={18} /> New {activeTab === "photos" ? "Photo Entry" : activeTab === "blogs" ? "Blog Preview" : activeTab === "wallets" ? "Crypto Wallet" : "Client Reference"}
                </h2>

                {activeTab === "photos" && (
                  <form onSubmit={handleAddPhoto} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Image Source (URL or Upload)</label>
                      <div className="flex gap-2">
                        <input name="src" className="admin-input flex-1" placeholder="https://..." required id="photo-src-input" />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white/5 border border-[var(--border)] p-3 rounded-lg hover:bg-white/10"
                        >
                          <Upload size={18} />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleUpload(e, (url) => {
                            const input = document.getElementById('photo-src-input') as HTMLInputElement;
                            if (input) input.value = window.location.origin + url;
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Alt Text / Label</label>
                      <input name="alt" className="admin-input" placeholder="e.g. Portrait session" />
                    </div>
                    <button disabled={submitting} type="submit" className="admin-btn">
                      {submitting ? "Processing..." : "Deploy to Gallery"}
                    </button>
                  </form>
                )}

                {activeTab === "blogs" && (
                  <form onSubmit={handleAddBlog} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Post Title</label>
                      <input name="title" className="admin-input" required placeholder="Stored XSS in..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Category</label>
                        <input name="category" className="admin-input" required placeholder="SECURITY" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Display Date</label>
                        <input name="date" className="admin-input" placeholder="e.g. Oct 12" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Source Link (Redirect URL)</label>
                      <input name="link" className="admin-input" required placeholder="https://blog.anishkhatri.com/..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Preview Image (Optional)</label>
                      <input name="image" className="admin-input" placeholder="https://..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Slug/Excerpt</label>
                      <textarea name="excerpt" className="admin-input min-h-[80px]" required placeholder="Short description..."></textarea>
                    </div>
                    <button disabled={submitting} type="submit" className="admin-btn">
                      {submitting ? "Processing..." : "Publish Preview"}
                    </button>
                  </form>
                )}

                {activeTab === "clients" && (
                  <form onSubmit={handleAddClient} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Company Name</label>
                      <input name="name" className="admin-input" required placeholder="Google / Facebook" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Logo Source (URL or Upload)</label>
                      <div className="flex gap-2">
                        <input name="logo" className="admin-input flex-1" required id="client-logo-input" placeholder="https://..." />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white/5 border border-[var(--border)] p-3 rounded-lg hover:bg-white/10">
                          <Upload size={18} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
                          const input = document.getElementById('client-logo-input') as HTMLInputElement;
                          if (input) input.value = window.location.origin + url;
                        })} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Website URL</label>
                      <input name="website" className="admin-input" required placeholder="https://..." />
                    </div>
                    <button disabled={submitting} type="submit" className="admin-btn">
                      {submitting ? "Processing..." : "Add to Resume"}
                    </button>
                  </form>
                )}

                {activeTab === "wallets" && (
                  <form onSubmit={handleAddWallet} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Cryptocurrency Name</label>
                      <input name="name" className="admin-input" required placeholder="Bitcoin" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Symbol</label>
                        <input name="symbol" className="admin-input" required placeholder="BTC" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Network</label>
                        <input name="network" className="admin-input" placeholder="Bitcoin Mainnet" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest pl-1">Wallet Address</label>
                      <textarea name="address" className="admin-input min-h-[60px]" required placeholder="0x... or bc1..." />
                    </div>
                    <button disabled={submitting} type="submit" className="admin-btn">
                      {submitting ? "Processing..." : "Add Wallet"}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Data Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === "photos" && (
            photos.map((photo) => (
              <motion.div key={photo.id} layout className="glass-card group flex flex-col h-full bg-[#111118]">
                <div className="relative aspect-video bg-black overflow-hidden m-2 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => handleDelete("photos", photo.id)} className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                      <Trash2 size={20} />
                    </button>
                    <a href={photo.src} target="_blank" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[var(--color-neon)] hover:text-black transition-colors">
                      <LinkIcon size={20} />
                    </a>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <p className="text-[10px] font-mono text-[var(--muted)] uppercase truncate">{photo.alt || "Untitled Photo"}</p>
                </div>
              </motion.div>
            ))
          )}

          {activeTab === "blogs" && (
            blogs.map((blog) => (
              <motion.div key={blog.id} layout className="glass-card flex flex-col bg-[#111118] p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-0.5 rounded bg-[var(--color-neon)]/10 text-[var(--color-neon)] text-[9px] font-mono font-bold uppercase border border-[var(--color-neon)]/20">
                    {blog.category}
                  </span>
                  <button onClick={() => handleDelete("blogs", blog.id)} className="text-[var(--muted)] hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="font-bold text-sm mb-2 line-clamp-2 leading-tight">{blog.title}</h3>
                <p className="text-[var(--muted)] text-xs line-clamp-2 mb-4 font-mono">{blog.excerpt}</p>
                <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center text-[10px] font-mono text-[var(--muted)]">
                  <span>{blog.date}</span>
                  <a href={blog.link} target="_blank" className="text-[var(--color-neon)] hover:underline flex items-center gap-1">
                    Link <LinkIcon size={10} />
                  </a>
                </div>
              </motion.div>
            ))
          )}

          {activeTab === "clients" && (
            clients.map((client) => (
              <motion.div key={client.id} layout className="glass-card flex items-center gap-4 bg-[#111118] p-4">
                <div className="w-12 h-12 rounded bg-black flex items-center justify-center p-2 border border-[var(--border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{client.name}</h3>
                  <a href={client.website} target="_blank" className="text-[var(--muted)] text-[10px] font-mono truncate block hover:text-[var(--color-neon)]">
                    {client.website}
                  </a>
                </div>
                <button onClick={() => handleDelete("clients", client.id)} className="text-[var(--muted)] hover:text-red-400 transition-colors ml-2">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}

          {activeTab === "wallets" && (
            wallets.map((wallet) => (
              <motion.div key={wallet.id} layout className="glass-card flex items-center gap-4 bg-[#111118] p-4">
                <div className="w-12 h-12 rounded bg-[rgba(0,255,136,0.06)] flex items-center justify-center border border-[rgba(0,255,136,0.1)] text-[var(--color-neon)] font-mono font-bold text-xs">
                  {wallet.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{wallet.name}</h3>
                  <span className="text-[var(--muted)] text-[10px] font-mono block">{wallet.network}</span>
                  <code className="text-[10px] font-mono text-[var(--muted)] truncate block mt-1">{wallet.address}</code>
                </div>
                <button onClick={() => handleDelete("wallets" as Tab, wallet.id)} className="text-[var(--muted)] hover:text-red-400 transition-colors ml-2">
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Empty states */}
        {((activeTab === "photos" && photos.length === 0) || 
          (activeTab === "blogs" && blogs.length === 0) || 
          (activeTab === "clients" && clients.length === 0) ||
          (activeTab === "wallets" && wallets.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <X size={60} />
            <p className="font-mono mt-4 text-sm">NO SYSTEM ENTRIES FOUND</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          outline: none;
          font-family: var(--font-mono);
          font-size: 13px;
          color: white;
          transition: all 0.2s;
        }
        .admin-input:focus {
          border-color: var(--color-neon);
          box-shadow: 0 0 10px rgba(0,255,136,0.1);
        }
        .admin-btn {
          width: 100%;
          background: var(--color-neon);
          color: black;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 14px;
          border-radius: 12px;
          font-size: 12px;
          font-family: var(--font-mono);
          transition: all 0.3s;
          margin-top: 10px;
        }
        .admin-btn:hover {
          box-shadow: 0 0 20px var(--color-neon-glow);
        }
        .admin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
