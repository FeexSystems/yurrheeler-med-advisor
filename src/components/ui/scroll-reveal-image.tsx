import { useRef } from "react";
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
}

export default function ScrollRevealImage({
  src,
  alt,
  height = "80vh",
  fromWidth = "40vw",
  toWidth = "95vw",
  fromRadius = "0px",
  toRadius = "22px",
  radiusStart = 0.5,
  innerWidth = "95vw",
  fromScale = 1.6,
  toScale = 1,
  stiffness = 120,
  damping = 80,
  scrollOffset = ["start end", "start start"],
  container,
  className,
  imageClassName,
}: ScrollRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container,
    // @ts-expect-error framer-motion typing issue
    offset: scrollOffset,
  });

  const width = useTransform(scrollYProgress, [0, 1], [fromWidth, toWidth]);
  const scale = useTransform(scrollYProgress, [0, 1], [fromScale, toScale]);
  const radius = useTransform(
    scrollYProgress,
    [radiusStart, 1],
    [fromRadius, toRadius]
  );

  const smoothWidth = useSpring(width, { stiffness, damping });
  const smoothScale = useSpring(scale, { stiffness, damping });
  const smoothRadius = useSpring(radius, { stiffness, damping });

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        width: smoothWidth,
        position: "relative",
        height,
        borderRadius: smoothRadius,
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          x: "-50%",
          width: innerWidth,
          height: "100%",
          scale: smoothScale,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        <img
          src={src}
          alt={alt}
          className={`object-cover w-full h-full absolute inset-0 ${imageClassName || ""}`}
        />
      </motion.div>
    </motion.div>
  );
}
