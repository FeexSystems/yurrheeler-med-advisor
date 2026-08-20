/**
 * Yurrheeler Motion Design Tokens & Curves
 */

export const transitions = {
  instant: { duration: 0.15, ease: "easeOut" },
  fast: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
  normal: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  cinematic: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  springSoft: { type: "spring", stiffness: 120, damping: 20 },
  springSnappy: { type: "spring", stiffness: 260, damping: 25 },
} as const;

export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  rise: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  spatialFloat: {
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};
