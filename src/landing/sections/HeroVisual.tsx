import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClinicalScene } from "@/components/spatial/ClinicalScene";
import { AnatomyModel, AnatomyRegionId } from "@/components/spatial/AnatomyModel";
import { AgentNode } from "@/components/spatial/AgentNode";
import { EvidenceNode3D } from "@/components/spatial/EvidenceNode";
import { ConnectionLines } from "@/components/spatial/ConnectionLines";
import { agents } from "@/lib/agents";
import {
  Compass,
  Activity,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Layers,
  Box,
  Radio,
  Eye,
  HeartPulse,
  Brain,
  Wind,
} from "lucide-react";

type ClassicThemeMode = "classic-vitruvian" | "classic-clinical" | "classic-engraving";

interface OrganDetail {
  id: AnatomyRegionId;
  latin: string;
  name: string;
  specialist: string;
  vital: string;
  notes: string;
  position2D: { top: string; left: string };
}

const CLASSIC_ORGANS: OrganDetail[] = [
  {
    id: "brain",
    latin: "Cerebrum & Axis Neurologicus",
    name: "Brain & Cranial Nerves",
    specialist: "Neura (Neurology)",
    vital: "14 Hz • Alpha/Beta Synchrony",
    notes: "Central somatic computation, neural telemetry integration, and autonomic regulatory balance.",
    position2D: { top: "16%", left: "50%" },
  },
  {
    id: "heart",
    latin: "Cor Humanum",
    name: "Heart & Vasculature",
    specialist: "Cardia (Cardiology)",
    vital: "72 BPM • Sinus Regularis",
    notes: "Central hemodynamic oscillator generating systemic arterial perfusion and systolic pressure gradients.",
    position2D: { top: "34%", left: "50%" },
  },
  {
    id: "lungs",
    latin: "Pulmones (Sinister et Dexter)",
    name: "Lungs & Respiratory Tree",
    specialist: "Pulmono (Pulmonology)",
    vital: "99% SpO2 • 14 rpm",
    notes: "Pulmonary gas diffusion matrix maintaining arterial oxygenation and acid-base equilibrium.",
    position2D: { top: "32%", left: "42%" },
  },
  {
    id: "liver",
    latin: "Hepar",
    name: "Liver & Hepatic System",
    specialist: "Gastro (Gastroenterology)",
    vital: "AST/ALT In Range",
    notes: "Principal biochemical laboratory responsible for metabolic detoxification, glycogen, and clotting factors.",
    position2D: { top: "45%", left: "45%" },
  },
  {
    id: "kidney-left",
    latin: "Renes",
    name: "Renal Filtration Matrix",
    specialist: "Nephro (Nephrology)",
    vital: "eGFR > 95 mL/min/1.73m²",
    notes: "Glomerular filtration barrier regulating hydrostatic volume, electrolyte balance, and renin secretion.",
    position2D: { top: "54%", left: "55%" },
  },
];

export const HeroVisual: React.FC = () => {
  const [themeMode, setThemeMode] = useState<ClassicThemeMode>("classic-vitruvian");
  const [renderMode, setRenderMode] = useState<"3d" | "2d">("3d");
  const [selectedRegion, setSelectedRegion] = useState<string>("heart");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hero agents from canonical registry
  const heroAgents = useMemo(() => {
    const selectedIds = ["yurrheeler", "cardia", "nephro", "orthop"];
    return agents.filter((a) => selectedIds.includes(a.id));
  }, []);

  const agentPositions: Array<[number, number, number]> = [
    [-1.6, 1.4, 0.4],  // Cardia
    [1.6, 1.5, 0.3],   // Nephro
    [-1.4, 0.5, 0.8],  // Yurrheeler
    [1.5, 0.4, 0.6],   // Orthop
  ];

  const connections = useMemo(() => {
    const goldColor =
      themeMode === "classic-vitruvian"
        ? "#d4af37"
        : themeMode === "classic-engraving"
        ? "#b45309"
        : "#10b981";
    return [
      { from: [-1.6, 1.4, 0.4] as [number, number, number], to: [0.07, 1.12, 0.12] as [number, number, number], color: "#dc2626" },
      { from: [1.6, 1.5, 0.3] as [number, number, number], to: [0.18, 0.46, -0.1] as [number, number, number], color: "#0d9488" },
      { from: [-1.4, 0.5, 0.8] as [number, number, number], to: [0, 1.85, 0] as [number, number, number], color: goldColor },
      { from: [1.5, 0.4, 0.6] as [number, number, number], to: [0, 0.85, -0.18] as [number, number, number], color: "#c5a059" },
    ];
  }, [themeMode]);

  // Classic Auscultation Heartbeat Sound Synthesizer (lub-dub)
  useEffect(() => {
    if (!audioEnabled) {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;

      const playLubDub = () => {
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        const now = ctx.currentTime;

        // Lub (First Heart Sound, S1)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(68, now);
        osc1.frequency.exponentialRampToValueAtTime(32, now + 0.12);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // Dub (Second Heart Sound, S2) ~240ms later
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(95, now + 0.24);
        osc2.frequency.exponentialRampToValueAtTime(45, now + 0.35);
        gain2.gain.setValueAtTime(0.16, now + 0.24);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.24);
        osc2.stop(now + 0.35);
      };

      playLubDub();
      heartbeatTimerRef.current = setInterval(playLubDub, 833); // ~72 BPM
    } catch {
      // Audio blocked or unsupported
    }

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    };
  }, [audioEnabled]);

  const activeOrgan = useMemo(() => {
    return (
      CLASSIC_ORGANS.find((o) => o.id === selectedRegion) ||
      CLASSIC_ORGANS[0]
    );
  }, [selectedRegion]);

  const particleColor =
    themeMode === "classic-vitruvian"
      ? "#d4af37"
      : themeMode === "classic-engraving"
      ? "#b45309"
      : "#10b981";

  // Progressive Enhancement 2D Holographic Schematic View
  const fallback2D = (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-6 bg-[#07090e] overflow-hidden">
      {/* Background Vitruvian Rings & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full border border-[#d4af37]/20 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-dashed border-[#d4af37]/25" />
        </div>
      </div>

      {/* 2D Schematic Anatomical Silhouette */}
      <div className="relative w-[320px] h-[400px] flex items-center justify-center">
        {/* Silhouette Vector SVG */}
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full stroke-[#d4af37]/40 fill-[#d4af37]/5 drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        >
          {/* Head & Neck */}
          <circle cx="100" cy="50" r="28" strokeWidth="1.5" />
          <path d="M92 78 L92 95 M108 78 L108 95" strokeWidth="1.5" />
          {/* Torso & Shoulders */}
          <path
            d="M50 115 C70 95 130 95 150 115 L142 220 C130 250 70 250 58 220 Z"
            strokeWidth="1.5"
          />
          {/* Arms */}
          <path d="M50 115 L32 210 L25 280" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M150 115 L168 210 L175 280" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Legs */}
          <path d="M75 240 L70 340 L65 390" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M125 240 L130 340 L135 390" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {/* Interactive 2D Organ Markers */}
        {CLASSIC_ORGANS.map((organ) => {
          const isSelected = selectedRegion === organ.id;
          return (
            <button
              key={organ.id}
              type="button"
              onClick={() => setSelectedRegion(organ.id)}
              style={{ top: organ.position2D.top, left: organ.position2D.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#d4af37] text-slate-950 scale-125 shadow-[0_0_20px_#d4af37]"
                    : "bg-black/80 border border-[#d4af37]/60 text-[#d4af37] hover:scale-110"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              </div>
              <span className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/80 border border-white/10 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                {organ.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-gradient-to-b from-[#0e0f14] via-[#090b0e] to-[#06070a] shadow-2xl">
      {/* 1. CLASSIC BRASS / OBSIDIAN TOP HEADER BAR */}
      <div className="px-4 py-3 bg-[#111319]/90 border-b border-[#d4af37]/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Classic Latin Title & Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-xs tracking-wider text-[#fef08a] uppercase">
                TABULA ANATOMICA & MEDICA
              </span>
              <span className="text-[9px] font-mono bg-[#d4af37]/20 text-[#d4af37] px-1.5 py-0.2 rounded border border-[#d4af37]/30">
                CLASSIC
              </span>
            </div>
            <span className="text-[10px] text-slate-400 italic font-serif">
              "Primum non nocere • Mens sana in corpore sano"
            </span>
          </div>
        </div>

        {/* Center: Classic Theme Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setThemeMode("classic-vitruvian")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-serif transition-all ${
              themeMode === "classic-vitruvian"
                ? "bg-[#d4af37]/25 text-[#fef08a] border border-[#d4af37]/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-3 h-3 text-[#d4af37]" />
            <span>Vitruvian Plate</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("classic-engraving")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-serif transition-all ${
              themeMode === "classic-engraving"
                ? "bg-amber-900/30 text-amber-200 border border-amber-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>Monograph Lithograph</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("classic-clinical")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-serif transition-all ${
              themeMode === "classic-clinical"
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Clinical Lead-II</span>
          </button>
        </div>

        {/* Right: 3D/2D Progressive Toggle & Auscultation Audio */}
        <div className="flex items-center gap-2">
          {/* Progressive Enhancement Toggle */}
          <div className="flex items-center bg-black/60 p-0.5 rounded-md border border-white/10">
            <button
              type="button"
              onClick={() => setRenderMode("3d")}
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 ${
                renderMode === "3d"
                  ? "bg-[#d4af37]/20 text-[#fef08a] font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="3D Spatial Perspective"
            >
              <Box className="w-3 h-3" />
              <span>3D</span>
            </button>
            <button
              type="button"
              onClick={() => setRenderMode("2d")}
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 ${
                renderMode === "2d"
                  ? "bg-[#d4af37]/20 text-[#fef08a] font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="2D Schematic Progressive Fallback"
            >
              <Layers className="w-3 h-3" />
              <span>2D</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all ${
              audioEnabled
                ? "bg-rose-950/30 border-rose-500/50 text-rose-300 animate-pulse"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Toggle classical stethoscope auscultation audio"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">AUSCULTATION (72 BPM)</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">STETHOSCOPE</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion("heart")}
            className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            title="Reset focus"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN SPATIAL CANVAS / PROGRESSIVE 2D LAYER */}
      <div className="relative w-full h-[460px] md:h-[580px] lg:h-[620px] bg-[#07080b]">
        {/* Background Classical Grid & Astrolabe Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full border border-[#d4af37]/20 flex items-center justify-center">
              <div className="w-[380px] h-[380px] rounded-full border border-dashed border-[#d4af37]/25 flex items-center justify-center">
                <div className="w-[260px] h-[260px] rounded-full border border-[#d4af37]/15" />
              </div>
            </div>
          </div>
        </div>

        {/* 3D Human Anatomy Hologram & Schematic View */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* High-Resolution 3D Human Anatomy Holographic Render Image */}
          <div className="relative w-full max-w-[480px] h-[92%] flex items-center justify-center">
            <img
              src="/hero-anatomy-uploaded.svg"
              alt="3D Human Anatomy Holographic Render"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-2xl transition-all duration-700 select-none filter drop-shadow-[0_0_35px_rgba(56,189,248,0.3)]"
            />

            {/* Subtle Vitruvian Classical Circle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[340px] h-[340px] rounded-full border border-[#d4af37]/20 flex items-center justify-center animate-[spin_60s_linear_infinite]">
                <div className="w-[280px] h-[280px] rounded-full border border-dashed border-[#d4af37]/25" />
              </div>
            </div>

            {/* Interactive 3D Anatomy Organ Hotspots */}
            {CLASSIC_ORGANS.map((organ) => {
              const isSelected = selectedRegion === organ.id;
              const isHovered = hoveredRegion === organ.id;
              return (
                <button
                  key={organ.id}
                  type="button"
                  onClick={() => setSelectedRegion(organ.id)}
                  onMouseEnter={() => setHoveredRegion(organ.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  style={{ top: organ.position2D.top, left: organ.position2D.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none"
                >
                  <div
                    className={`relative flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 shadow-[0_0_25px_#d4af37] scale-110"
                        : isHovered
                        ? "w-7 h-7 rounded-full bg-[#d4af37]/30 border-2 border-[#d4af37] text-[#d4af37] scale-105"
                        : "w-6 h-6 rounded-full bg-black/80 border border-[#d4af37]/70 text-[#d4af37]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-slate-950" : "bg-[#d4af37] animate-pulse"
                      }`}
                    />
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-60 pointer-events-none" />
                    )}
                  </div>

                  {/* Hotspot Floating Tag */}
                  <div
                    className={`absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono px-2.5 py-1 rounded backdrop-blur-md border transition-all pointer-events-none ${
                      isSelected
                        ? "bg-[#181308]/95 border-[#d4af37] text-[#fef08a] shadow-lg opacity-100 translate-x-0"
                        : isHovered
                        ? "bg-black/90 border-[#d4af37]/60 text-white opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 hidden md:block group-hover:opacity-100 group-hover:translate-x-0 bg-black/80 border-white/10 text-slate-300"
                    }`}
                  >
                    <span className="font-serif font-semibold block">{organ.latin}</span>
                    <span className="text-[9px] text-[#d4af37] block">{organ.vital}</span>
                  </div>
                </button>
              );
            })}

            {/* Orbiting Specialist Intelligence Node Badges */}
            <div className="absolute top-[12%] -left-8 md:left-2 flex items-center gap-2 p-2 rounded-xl bg-black/80 border border-emerald-500/40 backdrop-blur-md shadow-xl text-left pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 block">CARDIA ACTIVE</span>
                <span className="text-[9px] text-slate-300">Hemodynamic Pulse</span>
              </div>
            </div>

            <div className="absolute bottom-[20%] -right-6 md:right-2 flex items-center gap-2 p-2 rounded-xl bg-black/80 border border-[#d4af37]/40 backdrop-blur-md shadow-xl text-left pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <div>
                <span className="text-[10px] font-mono font-bold text-[#fef08a] block">NEPHRO ACTIVE</span>
                <span className="text-[9px] text-slate-300">Filtration Telemetry</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CLASSICAL CALIPERS & DEGREE MARKINGS HUD */}
        <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono text-[#d4af37]/80 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            <span className="tracking-widest font-serif font-bold">AXIS ANATOMICA 0°—360°</span>
          </div>
          <span className="text-slate-400 text-[9px]">LAT: 51.5074° N • LONG: 0.1278° W</span>
        </div>

        {/* 4. CLASSIC INTERACTIVE ORGAN SELECTOR BUTTONS */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 max-w-[210px]">
          <div className="text-[10px] font-serif uppercase tracking-widest text-[#d4af37] font-semibold text-right mb-0.5">
            Organa Principalia
          </div>
          {CLASSIC_ORGANS.map((organ) => {
            const isSelected = selectedRegion === organ.id;
            return (
              <button
                key={organ.id}
                type="button"
                onClick={() => setSelectedRegion(organ.id)}
                className={`px-2.5 py-1.5 rounded text-left transition-all backdrop-blur-md border text-xs flex items-center justify-between ${
                  isSelected
                    ? "bg-[#181308]/90 border-[#d4af37] text-[#fef08a] shadow-lg shadow-black/50"
                    : "bg-black/60 border-white/10 text-slate-300 hover:border-[#d4af37]/40 hover:text-white"
                }`}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-serif font-medium text-[11px] truncate">
                    {organ.latin}
                  </span>
                  <span className="text-[9px] text-slate-400 font-sans truncate">
                    {organ.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* 5. CLASSICAL MONOGRAPH INSCRIPTION CARD (Active Organ Details) */}
        {activeOrgan && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-[#0f1118]/95 border border-[#d4af37]/40 rounded-xl p-3.5 backdrop-blur-xl shadow-2xl text-xs font-serif">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                <h4 className="font-semibold text-[#fef08a] tracking-wide text-xs">
                  {activeOrgan.latin} ({activeOrgan.name})
                </h4>
              </div>
              <span className="font-mono text-[10px] text-[#d4af37] bg-[#d4af37]/15 px-1.5 py-0.5 rounded border border-[#d4af37]/30">
                {activeOrgan.vital}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed font-sans mb-2.5">
              {activeOrgan.notes}
            </p>

            <div className="flex items-center justify-between text-[10px] font-sans text-slate-400 pt-1.5 border-t border-white/5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                Assigned Specialist: <strong className="text-white">{activeOrgan.specialist}</strong>
              </span>
              <span className="font-mono text-emerald-400">STATUS: VITAL</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. CLASSIC DIAL TELEMETRY STRIP */}
      <div className="px-4 py-3 bg-[#0d0f15] border-t border-[#d4af37]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-serif">
        <div className="p-2 rounded bg-black/40 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Rhythmus Cordis
          </span>
          <span className="text-sm font-semibold font-mono text-[#d4af37] mt-0.5">
            72 BPM (Sinus)
          </span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Saturatio O₂
          </span>
          <span className="text-sm font-semibold font-mono text-cyan-400 mt-0.5">
            99% Arterial
          </span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Filtratio Renalis
          </span>
          <span className="text-sm font-semibold font-mono text-teal-400 mt-0.5">
            98 mL/min (Normalis)
          </span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Fides Clinica
          </span>
          <span className="text-sm font-semibold font-mono text-emerald-400 mt-0.5">
            96.4% Guideline Grounded
          </span>
        </div>
      </div>
    </div>
  );
};
