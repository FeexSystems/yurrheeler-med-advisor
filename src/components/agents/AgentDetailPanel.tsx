import React from "react";
import { motion } from "motion/react";
import { Agent } from "@/lib/agents";
import { useClinicalStore } from "@/clinical/store";
import { AgentStateBadge } from "./AgentState";
import {
  Brain,
  MessageSquare,
  ShieldCheck,
  BookOpen,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentDetailPanelProps {
  agent: Agent;
  onConsult: () => void;
}

export const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({
  agent,
  onConsult,
}) => {
  const agentStates = useClinicalStore((state) => state.agentStates);
  const state = agentStates[agent.id] || "observing";
  const evidence = useClinicalStore((state) => state.evidence);

  const relatedEvidence = evidence.filter(
    (ev) =>
      ev.source.toLowerCase().includes(agent.specialty.toLowerCase()) ||
      ev.title.toLowerCase().includes(agent.specialty.toLowerCase())
  );

  return (
    <motion.div
      key={agent.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-[#0f131a] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Top Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header Profile */}
      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/20 overflow-hidden shadow-lg flex items-center justify-center text-2xl">
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
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {agent.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold block">
              {agent.specialty}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {agent.category || "Clinical Medicine"}
            </span>
          </div>
        </div>

        <AgentStateBadge state={state} />
      </div>

      {/* Description / Clinical Mission */}
      <div className="mb-6 relative z-10">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
          Clinical Specialty Scope
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-black/40 border border-white/5 rounded-xl p-3.5">
          {agent.description}
        </p>
      </div>

      {/* Capabilities & Evidence Focus */}
      <div className="space-y-3 mb-6 relative z-10">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          Reasoning Protocols
        </h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">NICE & AHA Differential Validation</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Multisystem Biosignal Cross-Correlation</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Automated Red-Flag & Escalation Check</span>
          </div>
        </div>
      </div>

      {/* Consult CTA Button */}
      <div className="pt-2 relative z-10">
        <Button
          onClick={onConsult}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-11 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Consult {agent.name}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};
