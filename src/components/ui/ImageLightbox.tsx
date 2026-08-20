import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";
import { HealthImage } from "@/data/health-images";

interface ImageLightboxProps {
  images: HealthImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-8"
        >
          {/* Header Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {currentImage.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Stage with Nav Buttons */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 overflow-hidden">
            {images.length > 1 && (
              <button
                onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white transition-all backdrop-blur-sm cursor-pointer"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <motion.div
              key={currentImage.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[75vh] max-w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
            >
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-h-[75vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {images.length > 1 && (
              <button
                onClick={() => onNavigate((currentIndex + 1) % images.length)}
                className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white transition-all backdrop-blur-sm cursor-pointer"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Caption & Metadata Footer */}
          <div className="w-full max-w-4xl text-center z-10 bg-black/40 border border-white/10 rounded-xl p-4 backdrop-blur-md">
            {currentImage.title && (
              <h3 className="text-sm font-semibold text-white mb-1">
                {currentImage.title}
              </h3>
            )}
            {currentImage.description && (
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mx-auto">
                {currentImage.description}
              </p>
            )}
            {currentImage.credit && (
              <span className="text-[10px] text-slate-500 font-mono block mt-2">
                Source: {currentImage.credit}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
