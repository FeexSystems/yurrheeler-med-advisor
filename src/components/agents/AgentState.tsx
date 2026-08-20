import React from "react";
import { AgentState as AgentStateType } from "@/clinical/types";

interface AgentStateBadgeProps {
  state: AgentStateType;
  className?: string;
}

export const AgentStateBadge: React.FC<AgentStateBadgeProps> = ({ state, className = "" }) => {
  const config = {
    idle: { label: "Idle", bg: "bg-slate-800 text-slate-400 border-slate-700" },
    observing: { label: "Observing", bg: "bg-cyan-950/60 text-cyan-300 border-cyan-500/40" },
    reasoning: { label: "Reasoning", bg: "bg-amber-950/60 text-amber-300 border-amber-500/40" },
    consulting: { label: "Consulting", bg: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40" },
    speaking: { label: "Responding", bg: "bg-teal-950/60 text-teal-300 border-teal-500/40" },
    complete: { label: "Synthesized", bg: "bg-blue-950/60 text-blue-300 border-blue-500/40" },
  }[state] || { label: state, bg: "bg-slate-800 text-slate-400 border-slate-700" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase tracking-wider ${config.bg} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{config.label}</span>
    </span>
  );
};
