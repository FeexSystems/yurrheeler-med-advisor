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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d131c] via-[#0b1017] to-[#07090e] border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Clinical Context Ready
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {getGreeting()}, {userName}.
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1.5 max-w-xl font-light leading-relaxed">
            Your physiological baseline, active telemetry, and 17 specialized AI clinical perspectives are synchronized.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Button
            onClick={() => onNavigateTab && onNavigateTab("chat")}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-11 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consult Yurrheeler</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Link to="/clinical-space">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium text-xs h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>3D Clinical Space</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. CLINICAL INTELLIGENCE STATUS */}
      <IntelligenceStatus />

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
          <div className="bg-[#0f131a] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  Spatial Anatomy
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Dynamic 3D Physiological World
                </h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
              Inspect anatomical structures, active agent vectors, and real-time evidence links projected in three-dimensional clinical space.
            </p>

            <Link to="/clinical-space">
              <Button
                variant="outline"
                className="w-full bg-cyan-950/20 border-cyan-500/30 hover:bg-cyan-950/40 text-cyan-300 font-semibold text-xs h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch 3D Spatial Environment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE SPECIALISTS PREVIEW STRIP */}
      <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Specialist Intelligence Constellation
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab("agents")}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
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
              className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/40 hover:bg-[#121822] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
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
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {agent.name}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {agent.specialty}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>OBSERVING</span>
                <span className="text-emerald-400 group-hover:underline">Consult →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CINEMATIC CLINICAL STORY STRIP */}
      <ScrollRevealImage
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
        alt="Clinical Intelligence Synchronized"
        aspectRatio="wide"
        revealType="width"
        caption="Continuous neural clinical synthesis grounded in peer-reviewed medical practice guidelines."
        credit="Yurrheeler Clinical Intelligence Platform"
      />
    </div>
  );
};
