import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClinicalScene } from "@/components/spatial/ClinicalScene";
import { AnatomyModel, AnatomyRegionId } from "@/components/spatial/AnatomyModel";
import {
  Activity,
  HeartPulse,
  Brain,
  Wind,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Box,
  Layers,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface RegionDetail {
  id: AnatomyRegionId;
  name: string;
  system: string;
  specialist: string;
  specialistId: string;
  metrics: Array<{ label: string; value: string; status: "optimal" | "monitoring" | "alert" }>;
  summary: string;
  pos2D: { top: string; left: string };
}

const REGION_DATA: Record<string, RegionDetail> = {
  heart: {
    id: "heart",
    name: "Myocardium & Coronary Arteries",
    system: "Cardiovascular System",
    specialist: "Cardia (Cardiology)",
    specialistId: "cardia",
    metrics: [
      { label: "Resting Heart Rate", value: "68 bpm", status: "optimal" },
      { label: "Blood Pressure", value: "118/76 mmHg", status: "optimal" },
      { label: "Heart Rate Variability", value: "54 ms", status: "monitoring" },
    ],
    summary:
      "Hemodynamic stability verified. Real-time differential monitoring for arrhythmia, ischemic markers, and arterial compliance.",
    pos2D: { top: "35%", left: "52%" },
  },
  brain: {
    id: "brain",
    name: "Cerebral Cortex & Cranial Axis",
    system: "Neurological System",
    specialist: "Neura (Neurology)",
    specialistId: "neura",
    metrics: [
      { label: "Cognitive Load", value: "Balanced", status: "optimal" },
      { label: "Cranial Nerve Status", value: "Intact I-XII", status: "optimal" },
      { label: "Sleep Architecture", value: "7.4 hrs (22% REM)", status: "optimal" },
    ],
    summary:
      "Neural pathway integrity analysis with automated screening for tension headaches, migraine auras, and sleep-deprivation indicators.",
    pos2D: { top: "15%", left: "50%" },
  },
  lungs: {
    id: "lungs",
    name: "Pulmonary Parenchyma & Airway",
    system: "Respiratory System",
    specialist: "Pulmono (Pulmonology)",
    specialistId: "yurrheeler",
    metrics: [
      { label: "Oxygen Saturation (SpO2)", value: "98%", status: "optimal" },
      { label: "Respiratory Rate", value: "14 /min", status: "optimal" },
      { label: "Peak Expiratory Flow", value: "490 L/min", status: "monitoring" },
    ],
    summary:
      "Continuous gas exchange modeling evaluating ventilation-perfusion ratios and bronchial airway resistance.",
    pos2D: { top: "32%", left: "42%" },
  },
  liver: {
    id: "liver",
    name: "Hepatic Lobules & Biliary Duct",
    system: "Gastrointestinal & Hepatic",
    specialist: "Gastro (Gastroenterology)",
    specialistId: "yurrheeler",
    metrics: [
      { label: "ALT / AST Ratio", value: "1.1 (Normal)", status: "optimal" },
      { label: "Bilirubin Clearance", value: "0.8 mg/dL", status: "optimal" },
      { label: "Metabolic Status", value: "Euglycemic", status: "optimal" },
    ],
    summary:
      "Metabolic and enzymatic clearance profile cross-referenced against pharmacological interactions and dietary inputs.",
    pos2D: { top: "46%", left: "44%" },
  },
  "kidney-left": {
    id: "kidney-left",
    name: "Renal Cortex & Glomerular Filter",
    system: "Renal & Electrolyte Matrix",
    specialist: "Nephro (Nephrology)",
    specialistId: "nephro",
    metrics: [
      { label: "Estimated GFR", value: ">90 mL/min", status: "optimal" },
      { label: "Serum Creatinine", value: "0.9 mg/dL", status: "optimal" },
      { label: "Electrolyte Balance", value: "Na+ 140 / K+ 4.2", status: "optimal" },
    ],
    summary:
      "Precision filtration profiling monitoring tubular reabsorption, electrolyte balance, and systemic hydration state.",
    pos2D: { top: "54%", left: "56%" },
  },
  "kidney-right": {
    id: "kidney-right",
    name: "Renal Cortex & Glomerular Filter",
    system: "Renal & Electrolyte Matrix",
    specialist: "Nephro (Nephrology)",
    specialistId: "nephro",
    metrics: [
      { label: "Estimated GFR", value: ">90 mL/min", status: "optimal" },
      { label: "Serum Creatinine", value: "0.9 mg/dL", status: "optimal" },
      { label: "Electrolyte Balance", value: "Na+ 140 / K+ 4.2", status: "optimal" },
    ],
    summary:
      "Precision filtration profiling monitoring tubular reabsorption, electrolyte balance, and systemic hydration state.",
    pos2D: { top: "54%", left: "44%" },
  },
};

export const InteractiveAnatomySection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("heart");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [stageMode, setStageMode] = useState<"3d" | "2d">("3d");

  const currentDetail = REGION_DATA[selectedRegion] || REGION_DATA["heart"];

  const fallback2D = (
    <div className="w-full h-full flex items-center justify-center relative p-6 bg-[#07090e] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* 2D Holographic Anatomy Schematic Silhouette */}
      <div className="relative w-[280px] h-[380px] flex items-center justify-center">
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full stroke-cyan-500/40 fill-cyan-500/5 drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
          <circle cx="100" cy="50" r="28" strokeWidth="1.5" />
          <path d="M92 78 L92 95 M108 78 L108 95" strokeWidth="1.5" />
          <path
            d="M50 115 C70 95 130 95 150 115 L142 220 C130 250 70 250 58 220 Z"
            strokeWidth="1.5"
          />
          <path d="M50 115 L32 210 L25 280" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M150 115 L168 210 L175 280" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M75 240 L70 340 L65 390" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M125 240 L130 340 L135 390" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {/* 2D Interactive Target Pins */}
        {Object.entries(REGION_DATA)
          .filter(([key]) => key !== "kidney-right")
          .map(([key, organ]) => {
            const isSelected = selectedRegion === key || (key === "kidney-left" && selectedRegion === "kidney-right");
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRegion(key)}
                style={{ top: organ.pos2D.top, left: organ.pos2D.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-cyan-400 text-slate-950 scale-125 shadow-[0_0_20px_#06b6d4]"
                      : "bg-black/80 border border-cyan-500/60 text-cyan-400 hover:scale-110"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );

  return (
    <section
      id="anatomy"
      className="py-24 md:py-36 relative overflow-hidden bg-[#0a0d12] border-t border-b border-white/5"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Interactive Physiological Explorer
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
            Intelligence that moves with context.
          </h2>
          <p className="text-slate-400 mt-4 text-base md:text-lg leading-relaxed font-light">
            Click anatomical organ systems to observe dynamic physiological telemetry and witness how specialized AI agents route specific diagnostics.
          </p>
        </div>

        {/* Interactive Layout: 3D Canvas Left, Intelligence Card Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Anatomical Stage with Progressive Enhancement Switch */}
          <div className="lg:col-span-7 h-[460px] md:h-[540px] bg-[#090c10] rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl flex flex-col">
            {/* Top Stage Header with Organ Selectors & 3D/2D Toggle */}
            <div className="p-3.5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between z-20">
              {/* Organ Selection Pills */}
              <div className="flex flex-wrap gap-1.5">
                {["heart", "brain", "lungs", "kidney-left", "liver"].map((regKey) => {
                  const isSelected =
                    selectedRegion === regKey ||
                    (regKey === "kidney-left" && selectedRegion === "kidney-right");
                  const label =
                    regKey === "kidney-left"
                      ? "Kidneys"
                      : regKey.charAt(0).toUpperCase() + regKey.slice(1);
                  return (
                    <button
                      key={regKey}
                      onClick={() => setSelectedRegion(regKey)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20"
                          : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* 3D / 2D Progressive Toggle */}
              <div className="flex items-center bg-black/60 p-0.5 rounded-md border border-white/10">
                <button
                  type="button"
                  onClick={() => setStageMode("3d")}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                    stageMode === "3d"
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="3D Spatial Perspective"
                >
                  <Box className="w-3 h-3" />
                  <span>3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageMode("2d")}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                    stageMode === "2d"
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="2D Schematic Progressive Fallback"
                >
                  <Layers className="w-3 h-3" />
                  <span>2D</span>
                </button>
              </div>
            </div>

            {/* Stage Canvas Body */}
            <div className="w-full flex-1 relative">
              {stageMode === "3d" ? (
                <ClinicalScene
                  cameraPosition={[0, 1.0, 3.8]}
                  fov={45}
                  enableOrbit={true}
                  particleColor="#06b6d4"
                  className="w-full h-full"
                  fallback2D={fallback2D}
                >
                  <AnatomyModel
                    selectedRegion={selectedRegion}
                    onSelectRegion={(id) => id && setSelectedRegion(id)}
                    hoveredRegion={hoveredRegion}
                    onHoverRegion={(id) => setHoveredRegion(id)}
                  />
                </ClinicalScene>
              ) : (
                fallback2D
              )}
            </div>

            {/* Helper tooltip indicator at bottom */}
            <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                Rotate / Click any anatomical node to inspect
              </span>
            </div>
          </div>

          {/* Right Detail Card: Telemetry & Specialist Link */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDetail.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0e131b] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      {currentDetail.system}
                    </span>
                    <h3 className="text-xl font-semibold text-white mt-0.5">
                      {currentDetail.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    {currentDetail.id === "heart" ? (
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                    ) : currentDetail.id === "brain" ? (
                      <Brain className="w-5 h-5" />
                    ) : (
                      <Activity className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                  {currentDetail.summary}
                </p>

                {/* Metrics Breakdown */}
                <div className="space-y-3 mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Real-time Biosignals
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentDetail.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-300">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-white">
                            {m.value}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              m.status === "optimal"
                                ? "bg-emerald-400"
                                : m.status === "monitoring"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Specialist Agent */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                        Assigned Specialist
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {currentDetail.specialist}
                      </span>
                    </div>
                  </div>

                  <Link to="/app">
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg px-3.5 h-8"
                    >
                      Consult
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
