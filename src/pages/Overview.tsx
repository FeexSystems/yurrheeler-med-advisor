import React from "react";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { useClinicalStore } from "@/clinical/store";
import { IntelligenceStatus } from "@/components/intelligence/IntelligenceStatus";
import { IntelligenceActivity } from "@/components/intelligence/IntelligenceActivity";
import { PatientContextPanel } from "@/components/clinical/PatientContextPanel";
import { ScrollRevealImage } from "@/components/ui/ScrollRevealImage";
import { agents, Agent } from "@/lib/agents";
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  Activity,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface OverviewProps {
  onNavigateTab?: (tab: string) => void;
  onConsultAgent?: (agent: Agent, symptom?: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onNavigateTab,
  onConsultAgent,
}) => {
  const { user } = useAuth();
  const userName = user?.displayName || "Alex";
  const selectedRegion = useClinicalStore((state) => state.selectedRegion);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const topSpecialists = agents.slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 1. WELCOME & INTELLIGENCE READY BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gradient-to-r dark:from-[#0d131c] dark:via-[#0b1017] dark:to-[#07090e] border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md dark:shadow-2xl transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Clinical Context Ready
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {userName}.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1.5 max-w-xl font-normal dark:font-light leading-relaxed">
            Your physiological baseline, active telemetry, and 17 specialized AI clinical perspectives are synchronized.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Button
            onClick={() => onNavigateTab && onNavigateTab("chat")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 px-5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult Yurrheeler</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Link to="/clinical-space">
            <Button
              variant="outline"
              className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white font-medium text-xs h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-cyan-400" />
              <span>3D Clinical Space</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. CLINICAL INTELLIGENCE STATUS */}
      <IntelligenceStatus />

      {/* 2B. NEW CLINICAL AI INTELLIGENCE SUITE (5 EXPANDED MODULES) */}
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md dark:shadow-xl transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Next-Gen Clinical AI Diagnostic Suite
              </h3>
              <p className="text-xs text-slate-500">
                5 specialized multi-agent and multimodal clinical workflows
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            ALL 5 ENGINES ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {/* Card 1: Multimodal Vision */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("multimodal")}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Feature 1</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Multimodal Vision & Lab OCR
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Scan dermatological lesions, radiographs, 12-lead ECGs, and blood panels with instant clinical triage.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Open Scanner</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Tumor Board Consensus */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("consensus")}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Feature 2</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Multi-Specialist Tumor Board
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Convene 17 specialist agents to resolve diagnostic controversy, calculate concordance, and synthesize action plans.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>Convene Panel</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Voice & Acoustic Triage */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("voice")}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Feature 3</span>
                <span className="w-2 h-2 rounded-full bg-teal-500" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Voice & Acoustic Cough Triage
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Hands-free speech consultation with acoustic sound evaluation for dry, productive, wheezing, or stridor coughs.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-teal-600 dark:text-teal-400 flex items-center justify-between">
              <span>Start Voice Triage</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Drug Safety Matrix */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("drugs")}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Feature 4</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Drug Safety & Contraindications
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Pharmacotherapy matrix screening prescriptions, herbal supplements, allergies, and organ clearance limits.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between">
              <span>Run Drug Screen</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 5: Emergency Care Locator */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("emergency")}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-red-500 hover:bg-red-50/40 dark:hover:bg-red-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Feature 5</span>
                <span className="w-2 h-2 rounded-full bg-red-500" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                Geospatial ER & Urgent Care
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Locate open trauma centers, emergency rooms, urgent care clinics, and pharmacies matched to your triage severity.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center justify-between">
              <span>Find Nearby Care</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE DUAL WORKSPACE: PATIENT CONTEXT + LIVE ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Coherent Patient Context Object */}
        <div className="lg:col-span-7">
          <PatientContextPanel />
        </div>

        {/* Right: Telemetry Activity & 3D Spatial Shortcut */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <IntelligenceActivity />

          {/* Spatial World Preview Card */}
          <div className="bg-white dark:bg-[#0f131a] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md dark:shadow-xl relative overflow-hidden flex flex-col justify-between transition-colors">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/10 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
                  Spatial Anatomy
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Dynamic 3D Physiological World
                </h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-cyan-500/10 border border-emerald-200 dark:border-cyan-500/20 flex items-center justify-center text-emerald-600 dark:text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-normal dark:font-light leading-relaxed mb-4">
              Inspect anatomical structures, active agent vectors, and real-time evidence links projected in three-dimensional clinical space.
            </p>

            <Link to="/clinical-space">
              <Button
                variant="outline"
                className="w-full bg-emerald-50 dark:bg-cyan-950/20 border-emerald-200 dark:border-cyan-500/30 hover:bg-emerald-100 dark:hover:bg-cyan-950/40 text-emerald-800 dark:text-cyan-300 font-semibold text-xs h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch 3D Spatial Environment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE SPECIALISTS PREVIEW STRIP */}
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md dark:shadow-xl transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Specialist Intelligence Constellation
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("agents")}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>View all 17 specialists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {topSpecialists.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onConsultAgent && onConsultAgent(agent)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-[#121822] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {agent.avatar_url ? (
                      <img
                        src={agent.avatar_url}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>🩺</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                      {agent.name}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      {agent.specialty}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>OBSERVING</span>
                <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline">Consult →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CINEMATIC CLINICAL STORY STRIP */}
      <ScrollRevealImage
        src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop"
        alt="Clinical Intelligence Synchronized"
        aspectRatio="wide"
        revealType="width"
        caption="Continuous neural clinical synthesis grounded in peer-reviewed medical practice guidelines."
        credit="Yurrheeler Clinical Intelligence Platform"
      />
    </div>
  );
};
