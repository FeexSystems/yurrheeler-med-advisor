import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Brain,
  Layers,
  BookOpen,
  Activity,
  MessageSquare,
  Sparkles,
  X,
  ArrowRight,
  User,
  Settings,
} from "lucide-react";
import { agents, Agent } from "@/lib/agents";
import { useClinicalStore } from "@/clinical/store";

interface ClinicalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onConsultAgent: (agent: Agent) => void;
}

export const ClinicalCommandPalette: React.FC<ClinicalCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onConsultAgent,
}) => {
  const [query, setQuery] = useState("");
  const setSelectedRegion = useClinicalStore((state) => state.setSelectedRegion);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.specialty.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  );

  const anatomyOptions = [
    { id: "heart", name: "Heart & Coronary Arteries", system: "Cardiovascular" },
    { id: "brain", name: "Brain & Cranial Nerves", system: "Neurological" },
    { id: "lungs", name: "Lungs & Respiratory Tree", system: "Pulmonology" },
    { id: "kidney", name: "Renal Filtration Matrix", system: "Nephrology" },
    { id: "liver", name: "Hepatic & Digestive System", system: "Gastroenterology" },
  ].filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.system.toLowerCase().includes(query.toLowerCase()));

  const quickNav = [
    { id: "overview", label: "Overview & Intelligence Status", icon: Sparkles },
    { id: "chat", label: "Clinical Intelligence Conversation", icon: MessageSquare },
    { id: "multimodal", label: "Multimodal Vision Triage (Images & Lab OCR)", icon: Layers },
    { id: "consensus", label: "Multidisciplinary Tumor Board (17 Specialists)", icon: Brain },
    { id: "voice", label: "Voice Consultation & Acoustic Cough Triage", icon: Activity },
    { id: "drugs", label: "Drug Interaction & Contraindication Matrix", icon: BookOpen },
    { id: "emergency", label: "Geospatial ER & Urgent Care Locator", icon: Activity },
    { id: "agents", label: "Specialist Constellation (17 Doctors)", icon: Brain },
    { id: "anatomy", label: "3D Spatial Anatomy Explorer", icon: Layers },
    { id: "health", label: "Health Metrics & Biomarkers (NEWS2)", icon: Activity },
    { id: "evidence", label: "Evidence Layer & Guidelines", icon: BookOpen },
    { id: "records", label: "Triage Records & Longitudinal Summaries", icon: BookOpen },
    { id: "profile", label: "Patient Health Context & Vitals", icon: User },
    { id: "settings", label: "Intelligence System Settings", icon: Settings },
  ].filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-[#0f131a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-black/40">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, organ systems, evidence, navigation..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation Matches */}
          {quickNav.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2 block mb-1.5">
                Workspaces & Intelligence
              </span>
              <div className="space-y-1">
                {quickNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-white/10 text-left text-xs flex items-center justify-between text-slate-200 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium group-hover:text-white">{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specialist Doctors Matches */}
          {matchedAgents.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2 block mb-1.5">
                Specialist AI Doctors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedAgents.slice(0, 6).map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      onConsultAgent(agent);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/40 hover:bg-[#121722] text-left text-xs flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-sm">
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
                    <div className="overflow-hidden">
                      <span className="font-semibold text-white block truncate">{agent.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 block truncate">{agent.specialty}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Anatomical Regions Matches */}
          {anatomyOptions.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2 block mb-1.5">
                Spatial Anatomy Nodes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {anatomyOptions.map((anat) => (
                  <button
                    key={anat.id}
                    onClick={() => {
                      setSelectedRegion(anat.id);
                      onSelectTab("anatomy");
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/40 text-left text-xs flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-medium text-white block">{anat.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 block">{anat.system}</span>
                    </div>
                    <Layers className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="p-3 bg-black/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[10px]">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>ESC to close</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
