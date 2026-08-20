import React from "react";
import { motion } from "motion/react";
import { Activity, Sparkles, Brain, ArrowUpRight } from "lucide-react";
import { useClinicalStore } from "@/clinical/store";
import { getAgentById } from "@/lib/agents";

export const IntelligenceActivity: React.FC = () => {
  const clinicalEvents = useClinicalStore((state) => state.clinicalEvents);
  const activeAgents = useClinicalStore((state) => state.activeAgents);

  const recentEvents = clinicalEvents.slice(-5).reverse();

  return (
    <div className="w-full bg-[#0d1117] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
            Intelligence Activity Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Live Telemetry
        </span>
      </div>

      <div className="space-y-2.5">
        {recentEvents.map((ev) => {
          return (
            <div
              key={ev.id}
              className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2.5 text-xs"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {ev.type.replace(".", " ")}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-slate-200 text-xs mt-0.5 truncate">
                  {"text" in ev
                    ? ev.text
                    : "reason" in ev
                    ? ev.reason
                    : "regionId" in ev
                    ? `Anatomical region ${ev.regionId} selected`
                    : "source" in ev
                    ? `Vitals updated from ${ev.source}`
                    : "Specialist consultation active"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
