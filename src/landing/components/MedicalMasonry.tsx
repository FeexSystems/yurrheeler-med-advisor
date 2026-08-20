import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Tag, ArrowUpRight } from "lucide-react";
import { HealthImage } from "@/data/health-images";

interface MedicalMasonryProps {
  images: HealthImage[];
  onSelectImage: (index: number) => void;
}

export const MedicalMasonry: React.FC<MedicalMasonryProps> = ({
  images,
  onSelectImage,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[220px] md:auto-rows-[260px]">
      {images.map((img, idx) => {
        // High visual rhythm: feature first, varied spans
        const isFeatured = idx === 0 || idx === 5;
        const isWide = idx === 2 || idx === 6;
        const isTall = idx === 3;

        let colSpan = "md:col-span-4";
        let rowSpan = "row-span-1";

        if (isFeatured) {
          colSpan = "md:col-span-8";
          rowSpan = "md:row-span-2";
        } else if (isWide) {
          colSpan = "md:col-span-6";
        } else if (isTall) {
          colSpan = "md:col-span-4";
          rowSpan = "md:row-span-2";
        }

        return (
          <motion.div
            key={img.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] cursor-pointer shadow-lg ${colSpan} ${rowSpan}`}
            onClick={() => onSelectImage(idx)}
            role="button"
            tabIndex={0}
            aria-label={`View full image: ${img.title || img.alt}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectImage(idx);
              }
            }}
          >
            {/* Image with progressive loading and subtle hover scale */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
            />

            {/* Gradient Overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0b]/90 via-[#090a0b]/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            {/* Top Category Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                <Tag className="w-2.5 h-2.5" />
                {img.category}
              </span>
            </div>

            {/* Hover Expand Icon */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bottom Caption Info */}
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 z-10 flex flex-col justify-end text-left transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              {img.title && (
                <h4 className="text-sm md:text-base font-semibold text-white tracking-tight flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                  {img.title}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </h4>
              )}
              {img.description && (
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100">
                  {img.description}
                </p>
              )}
              {img.credit && (
                <span className="text-[10px] font-mono text-slate-400 mt-2">
                  Credit: {img.credit}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
