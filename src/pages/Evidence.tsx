import React from "react";
import { EvidencePanel } from "@/components/clinical/EvidencePanel";
import { ClinicalProtocols } from "@/components/ClinicalProtocols";
import { ScrollRevealImage } from "@/components/ui/ScrollRevealImage";
import { BookOpen, ShieldCheck } from "lucide-react";

export const EvidencePage: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header */}
      <div className="bg-[#0d1117] border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Evidence Layer & Guideline Architecture
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Grounding clinical intelligence in verified medical literature.
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-1.5 max-w-2xl font-light leading-relaxed">
          Every diagnosis, triage recommendation, and specialist reasoning vector is substantiated with NICE, AHA, ESC, and Cochrane systematic reviews.
        </p>
      </div>

      {/* Main Evidence Grid */}
      <EvidencePanel />

      {/* Clinical Protocols & Decision Trees */}
      <div className="bg-[#0f131a] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white">
              Standardized Clinical Decision Protocols
            </h2>
            <p className="text-xs text-slate-400">
              Interactive clinical pathways for chest pain, dyspnea, stroke screening, and sepsis alert thresholds.
            </p>
          </div>
        </div>
        <ClinicalProtocols />
      </div>

      {/* Research Scroll Reveal */}
      <ScrollRevealImage
        src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop"
        alt="Biomedical Research Literature"
        caption="Continuous integration of validated clinical trials and systematic diagnostic meta-analyses."
        credit="National Library of Medicine / Cochrane Collaboration"
      />
    </div>
  );
};
