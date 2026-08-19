export const motionPresets = {
  pageEnter: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
  },
  panelEnter: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
    transition: { duration: 0.25, ease: "easeOut" }
  },
  agentActivate: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
  },
  evidenceAppear: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, type: "spring", bounce: 0.2 }
  },
  clinicalPulse: {
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(var(--clinical-primary), 0)",
        "0 0 0 4px rgba(var(--clinical-primary), 0.2)",
        "0 0 0 0 rgba(var(--clinical-primary), 0)"
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  }
};
