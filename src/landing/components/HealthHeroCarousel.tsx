import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { heroImages, HealthImage } from "@/data/health-images";

export const HealthHeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, []);

  // Autoplay management
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, prefersReducedMotion, nextSlide]);

  // Tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
  };

  const current: HealthImage = heroImages[currentIndex];

  return (
    <div
      id="hero-carousel-container"
      role="region"
      aria-roledescription="carousel"
      aria-label="Clinical Health Imagery Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0f14] aspect-[16/9] md:aspect-[21/9] focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
    >
      {/* Slide Image with Crossfade + Subtle Scale */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={current.src}
            alt={current.alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {/* Subtle cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0b] via-[#090a0b]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090a0b]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content Caption */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {current.category}
          </div>
          <h3 className="text-xl md:text-3xl font-medium text-white tracking-tight drop-shadow-md">
            {current.title}
          </h3>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed drop-shadow">
            {current.description}
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-emerald-600/80 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-emerald-600/80 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all group"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 pointer-events-auto">
        {heroImages.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}: ${img.title}`}
            aria-current={currentIndex === idx ? "true" : "false"}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-6 bg-emerald-400"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
