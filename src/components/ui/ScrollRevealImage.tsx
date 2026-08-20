import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export interface ScrollRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide" | "cinema";
  caption?: string;
  credit?: string;
  priority?: boolean;
  revealType?: "width" | "scale" | "fade" | "radius";
  parallaxAmount?: number;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

export const ScrollRevealImage: React.FC<ScrollRevealImageProps> = ({
  src,
  alt,
  className = "",
  aspectRatio = "wide",
  caption,
  credit,
  priority = false,
  revealType = "width",
  parallaxAmount = 24,
  rounded = "2xl",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax translation
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-parallaxAmount, parallaxAmount]
  );

  // Progressive reveal animations
  const widthTransform = useTransform(
    scrollYProgress,
    [0, 0.45],
    prefersReducedMotion ? ["100%", "100%"] : ["88%", "100%"]
  );

  const scaleTransform = useTransform(
    scrollYProgress,
    [0, 0.45],
    prefersReducedMotion ? [1, 1] : [0.94, 1]
  );

  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.4, 1]
  );

  const radiusTransform = useTransform(
    scrollYProgress,
    [0, 0.45],
    prefersReducedMotion ? ["1.5rem", "1.5rem"] : ["2.5rem", "1.5rem"]
  );

  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    wide: "aspect-[16/9]",
    cinema: "aspect-[21/9]",
  }[aspectRatio];

  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div ref={containerRef} className={`w-full overflow-hidden my-4 ${className}`}>
      <motion.div
        style={{
          width: revealType === "width" ? widthTransform : "100%",
          scale: revealType === "scale" ? scaleTransform : 1,
          opacity: opacityTransform,
          borderRadius: revealType === "radius" ? radiusTransform : undefined,
        }}
        className={`mx-auto relative overflow-hidden bg-[#0d1117] border border-white/10 ${aspectClass} ${roundedClass} shadow-2xl`}
      >
        {/* Subtle dark scientific gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-black/20 z-10 pointer-events-none" />

        {/* Native Image with Motion Parallax */}
        <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] relative">
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
        </motion.div>

        {/* Optional caption overlay */}
        {(caption || credit) && (
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white bg-gradient-to-t from-[#07090e]/90 via-[#07090e]/50 to-transparent">
            {caption && (
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug max-w-xl">
                {caption}
              </p>
            )}
            {credit && (
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {credit}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
