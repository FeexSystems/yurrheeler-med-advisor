import React from 'react';
import { useClinicalStore } from '@/clinical/store';
import { getAgentById } from '@/lib/agents';

export const ClinicalEnvironment: React.FC = () => {
  const selectedRegion = useClinicalStore((state) => state.selectedRegion);
  const setSelectedRegion = useClinicalStore((state) => state.setSelectedRegion);
  const activeAgents = useClinicalStore((state) => state.activeAgents);
  const evidence = useClinicalStore((state) => state.evidence);

  const organRegions = [
    { id: "head", label: "Cranial & Neurological", top: "16%", left: "50%", agent: "neura" },
    { id: "chest", label: "Cardiovascular & Pulmonary", top: "35%", left: "50%", agent: "cardia" },
    { id: "abdomen", label: "Hepatic & Digestive", top: "50%", left: "50%", agent: "gastro" },
    { id: "spine", label: "Musculoskeletal & Axis", top: "42%", left: "40%", agent: "orthop" },
    { id: "pelvis", label: "Renal & Pelvic Matrix", top: "62%", left: "50%", agent: "nephro" },
  ];

  return (
    <div className="w-full h-full relative bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* 3D Human Anatomy Holographic Render Image */}
      <div className="relative w-full max-w-lg h-full flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop"
          alt="3D Human Anatomy Clinical Space"
          referrerPolicy="no-referrer"
          className="w-full h-full max-h-[500px] object-contain filter brightness-105 contrast-120 drop-shadow-[0_0_35px_rgba(16,185,129,0.3)] transition-all duration-700"
        />

        {/* Anatomical Organ Target Pins */}
        {organRegions.map((region) => {
          const isSelected = selectedRegion === region.id;
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => setSelectedRegion(region.id)}
              style={{ top: region.top, left: region.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none"
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSelected
                    ? "w-8 h-8 bg-emerald-500 text-slate-950 shadow-[0_0_25px_#10b981] scale-125"
                    : "w-6 h-6 bg-black/80 border border-emerald-500/60 text-emerald-400 hover:scale-110"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-slate-950" : "bg-emerald-400 animate-pulse"}`} />
              </div>

              {/* Tooltip Tag */}
              <div
                className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-md border transition-all ${
                  isSelected
                    ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 font-bold opacity-100"
                    : "bg-black/80 border-white/10 text-slate-300 opacity-0 group-hover:opacity-100"
                }`}
              >
                {region.label}
              </div>
            </button>
          );
        })}

        {/* Active Agents Badge Orbit */}
        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
          {activeAgents.map((agentId) => {
            const agent = getAgentById(agentId);
            if (!agent) return null;
            return (
              <div
                key={agentId}
                className="px-3 py-1 rounded-full bg-black/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{agent.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClinicalEnvironment;
