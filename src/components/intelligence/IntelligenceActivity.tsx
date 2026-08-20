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
    <div className="w-full bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-md dark:shadow-lg flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-900 dark:text-white font-semibold">
            Intelligence Activity Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
          Live Telemetry
        </span>
      </div>

      <div className="space-y-2.5">
        {recentEvents.map((ev) => {
          return (
            <div
              key={ev.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex items-start gap-2.5 text-xs"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                    {ev.type.replace(".", " ")}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-xs mt-0.5 truncate">
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
