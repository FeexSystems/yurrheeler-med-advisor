export interface HealthImage {
  id: string;
  src: string;
  alt: string;
  category: "anatomy" | "clinical" | "research" | "wellness" | "technology" | "human";
  title?: string;
  description?: string;
  credit?: string;
  source?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
}

export const heroImages: HealthImage[] = [
  {
    id: "hero-human-centered",
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    alt: "Medical professional reviewing biometric health analytics on high-precision clinical display",
    category: "human",
    title: "Human-Centered Intelligence",
    description: "Real-time biometric convergence designed around individual patient physiology and clinical context.",
    credit: "Unsplash / National Cancer Institute",
    aspectRatio: "wide",
  },
  {
    id: "hero-anatomy-spatial",
    src: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop",
    alt: "Digital anatomical visualization illustrating multisystem physiological mapping",
    category: "anatomy",
    title: "Spatial Anatomical Mapping",
    description: "Multidimensional body systems connected directly to specialized clinical reasoning agents.",
    credit: "Unsplash / Conny Schneider",
    aspectRatio: "wide",
  },
  {
    id: "hero-clinical-triage",
    src: "https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=2070&auto=format&fit=crop",
    alt: "Advanced clinical workspace interface organizing triage observations and evidence",
    category: "clinical",
    title: "Clinical Triage Matrix",
    description: "Stratifying urgency and synthesizing evidence from thousands of peer-reviewed clinical guidelines.",
    credit: "Unsplash / Luke Jones",
    aspectRatio: "wide",
  },
  {
    id: "hero-research-lab",
    src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop",
    alt: "Biomedical research laboratory environment exploring molecular and physiological markers",
    category: "research",
    title: "Evidence-Based Literature",
    description: "Grounded in continuous clinical trials, systematic reviews, and validated diagnostic protocols.",
    credit: "Unsplash / Louis Reed",
    aspectRatio: "wide",
  },
  {
    id: "hero-spatial-tech",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    alt: "Spatial computing technology interface for advanced medical intelligence",
    category: "technology",
    title: "Specialist Agent Mesh",
    description: "Autonomous specialized agents orchestrating unified differential assessments in real time.",
    credit: "Unsplash / Science in HD",
    aspectRatio: "wide",
  },
];

export const anatomyImages: HealthImage[] = [
  {
    id: "anatomy-cardio",
    src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1980&auto=format&fit=crop",
    alt: "High-resolution anatomical render of the cardiovascular system and arterial network",
    category: "anatomy",
    title: "Cardiovascular System",
    description: "Vascular hemodynamics, cardiac output rhythmicity, and continuous arterial pressure monitoring.",
    credit: "Unsplash",
    aspectRatio: "portrait",
  },
  {
    id: "anatomy-neuro",
    src: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop",
    alt: "Scientific neural pathway map illustrating central nervous system connectivity",
    category: "anatomy",
    title: "Neurological Pathways",
    description: "Synaptic connectivity, cranial nerve pathways, and neuro-cognitive clinical context.",
    credit: "Unsplash",
    aspectRatio: "landscape",
  },
  {
    id: "anatomy-respiratory",
    src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=2070&auto=format&fit=crop",
    alt: "Diagnostic imaging showing pulmonary alveoli and airway distribution",
    category: "anatomy",
    title: "Pulmonary Dynamics",
    description: "Gas exchange metrics, spirometry baseline correlation, and airway resistance models.",
    credit: "Unsplash",
    aspectRatio: "square",
  },
];

export const clinicalImages: HealthImage[] = [
  {
    id: "clinical-monitoring",
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
    alt: "Clinician analyzing multi-lead telemetry and NEWS2 risk scores",
    category: "clinical",
    title: "Telemetry & NEWS2 Stratification",
    description: "Early warning detection system parsing physiological trends before decompensation occurs.",
    credit: "Unsplash",
    aspectRatio: "landscape",
  },
  {
    id: "clinical-consultation",
    src: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
    alt: "Physician discussing personalized diagnostic findings in a modern consultation suite",
    category: "clinical",
    title: "Shared Clinical Decision Making",
    description: "Translating algorithmic complexity into actionable, compassionate patient understanding.",
    credit: "Unsplash",
    aspectRatio: "portrait",
  },
  {
    id: "clinical-diagnostics",
    src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
    alt: "Sterile clinical setting with digital diagnostic tools and precision telemetry",
    category: "clinical",
    title: "Biometric Integration",
    description: "Continuous synchronization of pulse oximetry, ambulatory blood pressure, and metabolic labs.",
    credit: "Unsplash",
    aspectRatio: "square",
  },
];

export const researchImages: HealthImage[] = [
  {
    id: "research-genomics",
    src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop",
    alt: "Molecular genetics workstation exploring biomarker expression in clinical datasets",
    category: "research",
    title: "Genomic & Molecular Biomarkers",
    description: "Correlating phenotypic symptom clusters with established genomic variants and clinical literature.",
    credit: "Unsplash",
    aspectRatio: "landscape",
  },
  {
    id: "research-microscopy",
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
    alt: "High-magnification cellular pathology visualization in medical research laboratory",
    category: "research",
    title: "Pathophysiological Analysis",
    description: "Cellular-level disease mechanisms informing multi-agent differential hypotheses.",
    credit: "Unsplash",
    aspectRatio: "square",
  },
];

export const humanImages: HealthImage[] = [
  {
    id: "human-care",
    src: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070&auto=format&fit=crop",
    alt: "Compassionate patient consultation emphasizing human understanding and guidance",
    category: "human",
    title: "Compassionate Healthcare Guidance",
    description: "Built to empower informed, calm discussions between patients and their qualified doctors.",
    credit: "Unsplash",
    aspectRatio: "landscape",
  },
  {
    id: "human-recovery",
    src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop",
    alt: "Patient engaging in proactive physical wellness and monitored recovery",
    category: "human",
    title: "Holistic Health Longevity",
    description: "Longitudinal health context tracking for proactive lifestyle and clinical optimization.",
    credit: "Unsplash",
    aspectRatio: "portrait",
  },
];

export const technologyImages: HealthImage[] = [
  {
    id: "tech-mesh",
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    alt: "Abstract visualization of neural intelligence graphs and encrypted data structures",
    category: "technology",
    title: "Zero-Knowledge Spatial Architecture",
    description: "Private, audited mathematical models keeping personal health information strictly secure.",
    credit: "Unsplash",
    aspectRatio: "landscape",
  },
  {
    id: "tech-robotics",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    alt: "Microprocessor circuitry and high-speed clinical reasoning computation node",
    category: "technology",
    title: "Sub-Second Clinical Inference",
    description: "High-throughput inference delivering instant clinical context without latency.",
    credit: "Unsplash",
    aspectRatio: "square",
  },
];

export const allHealthImages: HealthImage[] = [
  ...heroImages,
  ...anatomyImages,
  ...clinicalImages,
  ...researchImages,
  ...humanImages,
  ...technologyImages,
];

export function getImagesByCategory(category: string): HealthImage[] {
  if (category.toLowerCase() === "all") {
    return allHealthImages;
  }
  return allHealthImages.filter((img) => img.category.toLowerCase() === category.toLowerCase());
}
