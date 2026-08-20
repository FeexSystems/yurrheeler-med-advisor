import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2, Tag, Info } from "lucide-react";
import { HealthImage } from "@/data/health-images";

export interface ImageLightboxProps {
  images: HealthImage[];
  currentIndex: number | null;
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
  const currentImage = currentIndex !== null && images[currentIndex] ? images[currentIndex] : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || currentIndex === null) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        onNavigate(prevIndex);
      } else if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % images.length;
        onNavigate(nextIndex);
      }
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <div
        id="image-lightbox-portal"
        role="dialog"
        aria-modal="true"
        aria-label={currentImage.title || currentImage.alt}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
      >
        {/* Top Controls */}
        <div className="absolute top-4 inset-x-4 md:inset-x-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-white/10 text-emerald-400 rounded-full border border-white/10 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              {currentImage.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentIndex !== null ? currentIndex + 1 : 1} / {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="lightbox-close-btn"
              onClick={onClose}
              aria-label="Close image viewer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation - Prev */}
        <button
          id="lightbox-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (currentIndex !== null) {
              onNavigate((currentIndex - 1 + images.length) % images.length);
            }
          }}
          aria-label="Previous image"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-emerald-600/80 text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Navigation - Next */}
        <button
          id="lightbox-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (currentIndex !== null) {
              onNavigate((currentIndex + 1) % images.length);
            }
          }}
          aria-label="Next image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-emerald-600/80 text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400 group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Central Display */}
        <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10 select-none"
            />
          </motion.div>

          {/* Bottom Information Card */}
          <div className="w-full max-w-3xl mt-4 px-4 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
            <div>
              {currentImage.title && (
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  {currentImage.title}
                </h4>
              )}
              {currentImage.description && (
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                  {currentImage.description}
                </p>
              )}
            </div>

            {currentImage.credit && (
              <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Credit: {currentImage.credit}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
