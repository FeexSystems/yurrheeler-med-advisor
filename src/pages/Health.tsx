import React from "react";
import { HealthGallery } from "@/components/health/HealthGallery";
import { HealthMetricsDashboard } from "@/components/HealthMetricsDashboard";
import { BiomarkersSimulator } from "@/components/BiomarkersSimulator";
import { ScrollRevealImage } from "@/components/ui/ScrollRevealImage";
import { Activity, HeartPulse, Sparkles, Layers } from "lucide-react";
import { useClinicalStore } from "@/clinical/store";

interface HealthProps {
  onApplyVitals?: (vitals: {
    temperature: number;
    heartRate: number;
    systolic: number;
    diastolic: number;
    oxygenSat: number;
    respiratoryRate: number;
    glucose: number;
  }) => void;
}

export const Health: React.FC<HealthProps> = ({ onApplyVitals }) => {
  const handleVitals = (v: {
    temperature: number;
    heartRate: number;
    systolic: number;
    diastolic: number;
    oxygenSat: number;
    respiratoryRate: number;
    glucose: number;
  }) => {
    if (onApplyVitals) {
      onApplyVitals(v);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header */}
      <div className="bg-[#0d1117] border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Health Intelligence & Physiological Baselines
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Your health is more than isolated measurements.
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-1.5 max-w-2xl font-light leading-relaxed">
          Explore longitudinal trends, synchronized wearable signals, dynamic biomarker simulations, and visual anatomical archives.
        </p>
      </div>

      {/* Biomarker & Vitals Simulator (NEWS2) */}
      <div className="bg-[#0f131a] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white">
              Vitals Intelligence & NEWS2 Clinical Score Calculator
            </h2>
            <p className="text-xs text-slate-400">
              Simulate or sync arterial pressure, heart rate, oxygen saturation, and body temperature.
            </p>
          </div>
        </div>
        <BiomarkersSimulator onApplyVitals={handleVitals} />
      </div>

      {/* Longitudinal Health Metrics Visualizer */}
      <div className="bg-[#0f131a] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white">
              Longitudinal Biomarker Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Interactive multi-week trend lines across hemodynamic, glucose, and autonomic signals.
            </p>
          </div>
        </div>
        <HealthMetricsDashboard />
      </div>

      {/* Health Image Gallery & Archive */}
      <HealthGallery />

      {/* Scroll Reveal Image */}
      <ScrollRevealImage
        src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop"
        alt="Multidimensional Anatomy Systems"
        caption="Integrated multisystem physiological mapping connected directly to specialized clinical reasoning agents."
        credit="Yurrheeler Health Intelligence"
      />
    </div>
  );
};
