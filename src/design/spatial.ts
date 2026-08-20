/**
 * Spatial System Design Configuration
 */

export const spatialConfig = {
  camera: {
    defaultPosition: [0, 1.1, 3.8] as [number, number, number],
    closeUpPosition: [0, 1.2, 2.2] as [number, number, number],
    fov: 42,
  },
  particles: {
    high: 80,
    medium: 40,
    low: 15,
  },
  colors: {
    anatomyBase: "#64748b",
    anatomyHighlight: "#10b981",
    signalBeam: "#06b6d4",
    evidenceLink: "#d4af37",
  },
};
