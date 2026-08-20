import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export interface ScrollRevealImageProps {
  src: string;
  alt: string;
  height?: string;
  fromWidth?: string;
  toWidth?: string;
  fromRadius?: string;
  toRadius?: string;
  radiusStart?: number;
  innerWidth?: string;
  fromScale?: number;
  toScale?: number;
  stiffness?: number;
  damping?: number;
  scrollOffset?: NonNullable<Parameters<typeof useScroll>[0]>["offset"];
  container?: React.RefObject<HTMLElement | null>;
  className?: string;
  imageClassName?: string;
  overlay?: boolean;
  overlayClassName?: string;
  caption?: string;
  eyebrow?: string;
  objectPosition?: string;
  enableParallax?: boolean;
  respectReducedMotion?: boolean;
  fallbackSrc?: string;
}

export default function ScrollRevealImage({
  src,
  alt,
  height = "75vh",
  fromWidth = "50vw",
  toWidth = "95vw",
  fromRadius = "12px",
  toRadius = "28px",
  radiusStart = 0.4,
  innerWidth = "95vw",
  fromScale = 1.4,
  toScale = 1,
  stiffness = 100,
  damping = 60,
  scrollOffset = ["start end", "start start"],
  container,
  className = "",
  imageClassName = "",
  overlay = true,
  overlayClassName = "bg-gradient-to-t from-[#090a0b]/90 via-[#090a0b]/30 to-transparent",
  caption,
  eyebrow,
  objectPosition = "center",
  enableParallax = true,
  respectReducedMotion = true,
  fallbackSrc = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
}: ScrollRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const shouldReduceMotion = respectReducedMotion && prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container,
    // @ts-expect-error framer-motion typing issue
    offset: scrollOffset,
  });

  const width = useTransform(scrollYProgress, [0, 1], [fromWidth, toWidth]);
  const scale = useTransform(scrollYProgress, [0, 1], [enableParallax ? fromScale : 1, toScale]);
  const radius = useTransform(scrollYProgress, [radiusStart, 1], [fromRadius, toRadius]);

  const smoothWidth = useSpring(width, { stiffness, damping });
  const smoothScale = useSpring(scale, { stiffness, damping });
  const smoothRadius = useSpring(radius, { stiffness, damping });

  const activeSrc = hasError ? fallbackSrc : src;

  return (
    <motion.div
      ref={containerRef}
      id="scroll-reveal-container"
      className={`relative overflow-hidden mx-auto shadow-2xl border border-white/10 ${className}`}
      style={{
        width: shouldReduceMotion ? toWidth : smoothWidth,
        height,
        borderRadius: shouldReduceMotion ? toRadius : smoothRadius,
      }}
    >
      {/* Background Skeleton while image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900/60 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        </div>
      )}

      <motion.div
        className="relative w-full h-full"
        style={{
          position: "absolute",
          left: "50%",
          x: "-50%",
          width: innerWidth,
          height: "100%",
          scale: shouldReduceMotion ? 1 : smoothScale,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        <img
          src={activeSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          style={{ objectPosition }}
          className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${imageClassName}`}
        />

        {/* Overlay */}
        {overlay && (
          <div className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
        )}

        {/* Caption & Eyebrow */}
        {(eyebrow || caption) && (
          <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 z-20 flex flex-col justify-end text-left pointer-events-none">
            {eyebrow && (
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-2">
                {eyebrow}
              </span>
            )}
            {caption && (
              <p className="text-lg md:text-2xl font-light text-slate-100 max-w-2xl leading-relaxed drop-shadow-md">
                {caption}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
