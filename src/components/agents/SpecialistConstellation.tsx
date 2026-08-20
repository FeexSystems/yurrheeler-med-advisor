import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Agent, agents } from "@/lib/agents";
import { useClinicalStore } from "@/clinical/store";
import { AgentStateBadge } from "./AgentState";
import { AgentDetailPanel } from "./AgentDetailPanel";
import { Sparkles, Brain, Search, CheckCircle2, ArrowRight } from "lucide-react";

interface SpecialistConstellationProps {
  onSelectAgent?: (agent: Agent) => void;
  onConsultAgent?: (agent: Agent, prompt?: string) => void;
}

export const SpecialistConstellation: React.FC<SpecialistConstellationProps> = ({
  onSelectAgent,
  onConsultAgent,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("yurrheeler");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const activeAgents = useClinicalStore((state) => state.activeAgents);
  const agentStates = useClinicalStore((state) => state.agentStates);
  const activateAgent = useClinicalStore((state) => state.activateAgent);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.clinicalRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgentId(agent.id);
    activateAgent(agent.id);
    if (onSelectAgent) {
      onSelectAgent(agent);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1117] border border-white/10 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Specialist Intelligence Constellation
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              17 Active Agents
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous multi-agent consensus network grounded in peer-reviewed clinical knowledge.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specialty, organ, or doctor..."
            className="w-full pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Grid: Constellation Grid on Left, Agent Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Constellation Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredAgents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            const isYurrheeler = agent.id === "yurrheeler";
            const state = agentStates[agent.id] || (isYurrheeler ? "consulting" : "observing");

            return (
              <motion.div
                key={agent.id}
                whileHover={{ y: -2 }}
                onClick={() => handleAgentClick(agent)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#131924] border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50"
                    : isYurrheeler
                    ? "bg-[#0f141f] border-teal-500/40 hover:border-teal-500/70"
                    : "bg-[#0d1117] border-white/10 hover:border-white/20 hover:bg-[#10151f]"
                }`}
              >
                {/* Background ambient glow for selected */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-lg shadow-inner">
                      {agent.avatarIcon || "🩺"}
                    </div>
                    <AgentStateBadge state={state} />
                  </div>

                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {agent.name}
                    {isYurrheeler && (
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400 block mb-2">
                    {agent.specialty}
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {agent.clinicalRole}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{agent.decisionThreshold}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Agent Detail Panel */}
        <div className="lg:col-span-5 sticky top-20">
          <AgentDetailPanel
            agent={selectedAgent}
            onConsult={() => onConsultAgent && onConsultAgent(selectedAgent)}
          />
        </div>
      </div>
    </div>
  );
};
