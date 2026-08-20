import React from "react";
import { motion } from "motion/react";
import { Activity, ShieldCheck, Sparkles, Brain, Cpu, Database } from "lucide-react";
import { useClinicalStore } from "@/clinical/store";
import { agents } from "@/lib/agents";

export const IntelligenceStatus: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const activeAgents = useClinicalStore((state) => state.activeAgents);
  const evidence = useClinicalStore((state) => state.evidence);
  const selectedRegion = useClinicalStore((state) => state.selectedRegion);

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Context Sync
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>{agents.length} Specialists</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d1117] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Clinical Intelligence Status
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Continuous neural synthesis & multidisciplinary consensus pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            System Latency: <span className="text-emerald-400 font-semibold">42ms</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Context Status */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Patient Context
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-white">Synchronized</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            Live EHR & Wearable Bus
          </span>
        </div>

        {/* Specialists Status */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              AI Specialists
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-white">
            {activeAgents.length > 0 ? `${activeAgents.length} Active` : `${agents.length} Standby`}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            17 Subspecialties Ready
          </span>
        </div>

        {/* Evidence Layer */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Evidence Layer
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <span className="text-sm font-semibold text-white">
            {evidence.length > 0 ? `${evidence.length} Grounded Nodes` : "NICE / AHA Active"}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            Peer-Reviewed Guidelines
          </span>
        </div>

        {/* Spatial Target */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Spatial Target
            </span>
            <span className="w-2 h-2 rounded-full bg-teal-400" />
          </div>
          <span className="text-sm font-semibold text-white capitalize">
            {selectedRegion ? selectedRegion.replace("-", " ") : "Whole Physiology"}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            3D Calibrated Mesh
          </span>
        </div>
      </div>
    </div>
  );
};
