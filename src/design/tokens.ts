/**
 * Yurrheeler Clinical Intelligence Design Tokens
 * Scientific, Dark Elevated, Botanical Green & Cyan Accents
 */

export const colors = {
  background: {
    base: "#07090e",
    subtle: "#0b0e14",
    surface: "#0f131a",
    elevated: "#141923",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.16)",
  },
  accent: {
    green: {
      base: "#10b981", // botanical green
      glow: "rgba(16, 185, 129, 0.25)",
      subtle: "rgba(16, 185, 129, 0.1)",
      text: "#34d399",
    },
    teal: {
      base: "#0d9488", // muted surgical teal
      glow: "rgba(13, 148, 136, 0.25)",
      subtle: "rgba(13, 148, 136, 0.1)",
      text: "#2dd4bf",
    },
    cyan: {
      base: "#06b6d4", // restrained scientific cyan
      glow: "rgba(6, 182, 212, 0.25)",
      subtle: "rgba(6, 182, 212, 0.1)",
      text: "#38bdf8",
    },
  },
  clinical: {
    optimal: "#10b981",
    monitoring: "#f59e0b",
    warning: "#f97316",
    critical: "#ef4444",
    info: "#06b6d4",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    muted: "#64748b",
    accent: "#34d399",
  },
} as const;

export const spatialDepth = {
  level0: "bg-[#07090e]",
  level1: "bg-[#0b0e14] border border-white/5 shadow-md",
  level2: "bg-[#0f131a] border border-white/10 shadow-lg shadow-black/40",
  level3: "bg-[#141923] border border-white/15 shadow-2xl shadow-black/60",
} as const;
