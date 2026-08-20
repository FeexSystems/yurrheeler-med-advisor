import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MedicalMasonry } from "../components/MedicalMasonry";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { getImagesByCategory, HealthImage } from "@/data/health-images";
import { Sparkles, Layers } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Imagery" },
  { id: "anatomy", label: "Anatomy" },
  { id: "clinical", label: "Clinical" },
  { id: "research", label: "Research" },
  { id: "human", label: "Human Care" },
  { id: "technology", label: "AI & Spatial" },
];

export const HealthGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredImages = useMemo(() => {
    return getImagesByCategory(activeCategory);
  }, [activeCategory]);

  return (
    <section id="health-gallery" className="py-24 md:py-36 relative overflow-hidden bg-[#090a0b]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Visual Intelligence Archive
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              A different way to see health.
            </h2>
            <p className="text-slate-400 mt-4 text-base md:text-lg leading-relaxed font-light">
              Explore authentic physiological imagery, spatial anatomical layers, and clinical research frameworks integrated into the Yurrheeler ecosystem.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md self-start md:self-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  aria-pressed={isActive}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 font-semibold shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry Grid with Animated Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <MedicalMasonry
              images={filteredImages}
              onSelectImage={(idx) => setSelectedImageIndex(idx)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Lightbox Modal */}
        <ImageLightbox
          images={filteredImages}
          currentIndex={selectedImageIndex}
          isOpen={selectedImageIndex !== null}
          onClose={() => setSelectedImageIndex(null)}
          onNavigate={(index) => setSelectedImageIndex(index)}
        />
      </div>
    </section>
  );
};
