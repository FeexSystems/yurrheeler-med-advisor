import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { HealthImage } from "@/data/health-images";

interface HealthCarouselProps {
  images: HealthImage[];
  onSelectImage?: (index: number) => void;
  autoplay?: boolean;
}

export const HealthCarousel: React.FC<HealthCarouselProps> = ({
  images,
  onSelectImage,
  autoplay = false,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Embla Viewport */}
      <div className="overflow-hidden rounded-3xl border border-white/10" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="flex-[0_0_100%] md:flex-[0_0_75%] lg:flex-[0_0_60%] min-w-0 px-2.5 py-2"
            >
              <div
                onClick={() => onSelectImage && onSelectImage(idx)}
                className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#0a0d14] border border-white/10 group cursor-pointer shadow-2xl"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                        {img.category}
                      </span>
                      <h4 className="text-sm md:text-base font-bold text-white mt-1.5 line-clamp-1">
                        {img.title || img.alt}
                      </h4>
                      {img.description && (
                        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-light">
                          {img.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                      title="Enlarge"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows & Dot Indicators */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="flex items-center gap-1.5">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                index === selectedIndex
                  ? "w-6 bg-emerald-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
