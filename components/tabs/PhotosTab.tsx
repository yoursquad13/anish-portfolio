"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn, Loader2 } from "lucide-react";

interface PhotoItem {
  id: string;
  src: string;
  alt: string;
}

export function PhotosTab() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/photos")
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl lg:text-4xl font-black">
          <span className="text-[var(--foreground)]">Photo </span>
          <span className="neon-text">Gallery</span>
        </h2>
        <p className="text-[var(--muted)] font-mono text-sm mt-2">
          <span className="text-[var(--color-neon)] opacity-60">&gt;</span> click to preview • managed via admin
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[var(--color-neon)]" size={40} />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 1.02 }}
              className="aspect-square relative overflow-hidden rounded-xl cursor-pointer group border border-[var(--border)] hover:border-[rgba(0,255,136,0.3)] transition-all duration-300 shadow-xl"
              onClick={() => setSelectedPhoto(photo.src)}
            >
              <Image
                src={photo.src.startsWith('http') ? photo.src : photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                <span className="text-white text-[10px] font-mono uppercase tracking-widest truncate max-w-[80%]">{photo.alt}</span>
                <div className="w-8 h-8 rounded-full bg-[var(--color-neon)] flex items-center justify-center shadow-[0_0_15px_var(--color-neon-glow)]">
                  <ZoomIn size={14} className="text-black" />
                </div>
              </div>
              {/* Neon corner accents */}
              <div className="absolute top-0 left-0 w-6 h-[1px] bg-[var(--color-neon)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 left-0 w-[1px] h-6 bg-[var(--color-neon)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-[var(--color-neon)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-[var(--color-neon)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[rgba(0,255,136,0.3)] bg-black/50 text-[var(--color-neon)] flex items-center justify-center hover:bg-[rgba(0,255,136,0.1)] transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-full max-h-[85vh] rounded-xl overflow-hidden border border-[var(--border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto}
                alt="Full screen preview"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
