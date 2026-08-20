import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { agents, Agent } from "@/lib/agents";
import { ClinicalScene } from "@/components/spatial/ClinicalScene";
import { AgentNode, AgentNodeState } from "@/components/spatial/AgentNode";
import { Sparkles, Shield, ArrowRight, Activity, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AgentConstellationSection: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("cardia");

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const agentPositions: Array<[number, number, number]> = [
    [0, 1.2, 0],       // Yurrheeler (Center)
    [-1.8, 1.7, 0.4],  // Cardia
    [1.8, 1.6, 0.3],   // Orthop
    [-1.6, 0.3, 0.6],  // Pedia
    [1.6, 0.4, 0.5],   // Nephro
    [-0.9, -0.6, 0.8], // Derma
    [0.9, -0.7, 0.7],  // Opthalm
  ];

  return (
    <section id="specialists" className="py-24 md:py-36 relative overflow-hidden bg-[#090c0f]">
      {/* Radial glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Autonomous Clinical Intelligence
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
            A constellation of specialists, unified in purpose.
          </h2>
          <p className="text-slate-400 mt-4 text-base md:text-lg leading-relaxed font-light">
            Each agent possesses domain-specific clinical intelligence, cross-deliberating in real time to provide comprehensive differential guidance.
          </p>
        </div>

        {/* 3D Agent Mesh Canvas */}
        <div className="h-[440px] md:h-[500px] w-full bg-[#0b0e14] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden mb-12">
          {/* Spatial 3D Node Mesh */}
          <ClinicalScene
            cameraPosition={[0, 0.8, 4.2]}
            fov={45}
            enableOrbit={true}
            particleColor="#10b981"
            className="w-full h-full"
          >
            {agents.slice(0, 7).map((agent, idx) => {
              const pos = agentPositions[idx] || [0, 0, 0];
              const isSelected = agent.id === selectedAgentId;
              const state: AgentNodeState = isSelected
                ? "reasoning"
                : idx % 2 === 0
                ? "observing"
                : "processing";

              return (
                <AgentNode
                  key={agent.id}
                  id={agent.id}
                  name={agent.name}
                  specialty={agent.specialty}
                  state={state}
                  position={pos}
                  onClick={() => setSelectedAgentId(agent.id)}
                  color={
                    agent.badgeColor === "red"
                      ? "#ef4444"
                      : agent.badgeColor === "cyan"
                      ? "#06b6d4"
                      : agent.badgeColor === "amber"
                      ? "#f59e0b"
                      : agent.badgeColor === "rose"
                      ? "#f43f5e"
                      : "#10b981"
                  }
                />
              );
            })}
          </ClinicalScene>

          {/* Quick Select Bottom Bar */}
          <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-center gap-2 overflow-x-auto py-2">
            {agents.slice(0, 7).map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 font-semibold shadow-lg scale-105"
                      : "bg-black/60 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        agent.badgeColor === "red"
                          ? "#ef4444"
                          : agent.badgeColor === "cyan"
                          ? "#06b6d4"
                          : agent.badgeColor === "amber"
                          ? "#f59e0b"
                          : "#10b981",
                    }}
                  />
                  <span>{agent.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Deep Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAgent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 rounded-2xl bg-[#0e131b] border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={selectedAgent.avatar_url}
                  alt={selectedAgent.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0e131b] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {selectedAgent.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                    {selectedAgent.specialty}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl font-light leading-relaxed">
                  {selectedAgent.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Category: {selectedAgent.category || "Clinical Medicine"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Sub-second reasoning
                  </span>
                </div>
              </div>
            </div>

            <Link to="/app" className="shrink-0 w-full md:w-auto">
              <Button className="w-full md:w-auto bg-white text-black hover:bg-slate-200 rounded-full px-6 font-semibold text-xs h-10 shadow-none border-none">
                Start Consultation with {selectedAgent.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
