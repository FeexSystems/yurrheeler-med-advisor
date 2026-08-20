import React from "react";
import { motion } from "motion/react";

interface IntelligenceSignalProps {
  status?: "active" | "idle" | "reasoning" | "alert";
  label?: string;
  className?: string;
}

export const IntelligenceSignal: React.FC<IntelligenceSignalProps> = ({
  status = "active",
  label,
  className = "",
}) => {
  const color = {
    active: "bg-emerald-400 text-emerald-400 border-emerald-500/30",
    idle: "bg-slate-400 text-slate-400 border-slate-500/30",
    reasoning: "bg-cyan-400 text-cyan-400 border-cyan-500/30",
    alert: "bg-rose-400 text-rose-400 border-rose-500/30",
  }[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 border ${color} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${color.split(" ")[0]} animate-pulse`} />
      {label && <span className="text-[10px] font-mono font-medium uppercase tracking-wider">{label}</span>}
    </div>
  );
};
