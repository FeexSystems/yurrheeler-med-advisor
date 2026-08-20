import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HealthImage, heroImages } from "@/data/health-images";
import { HealthCarousel } from "./HealthCarousel";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { Sparkles, Layers, Image as ImageIcon } from "lucide-react";

export const HealthGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = [
    { id: "all", label: "All Modalities" },
    { id: "anatomy", label: "Spatial Anatomy" },
    { id: "clinical", label: "Clinical Triage" },
    { id: "research", label: "Biomedical Literature" },
    { id: "technology", label: "AI Specialist Mesh" },
    { id: "human", label: "Human Context" },
  ];

  const filteredImages = heroImages.filter((img) => {
    if (activeCategory === "all") return true;
    return img.category === activeCategory;
  });

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1117] border border-white/10 p-5 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Clinical & Physiological Imagery Archive
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              High-Precision
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing anatomical layers, clinical triage environments, and biomedical research.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Embla Carousel View */}
      <div className="w-full">
        <HealthCarousel
          images={filteredImages}
          onSelectImage={handleOpenLightbox}
        />
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        images={filteredImages}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setActiveImageIndex(idx)}
      />
    </div>
  );
};
