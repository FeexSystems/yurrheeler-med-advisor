import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Users, Layers, Activity, 
  BookOpen, ClipboardList, ShieldAlert, Sparkles, HeartPulse, 
  PhoneCall, Stethoscope, BarChart3, FileText, Database, UserCircle, Settings
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { IntelligenceNavigation } from "@/components/navigation/IntelligenceNavigation";
import { ClinicalCommandPalette } from "@/components/ui/ClinicalCommandPalette";
import { Overview } from "@/pages/Overview";
import { SpecialistConstellation } from "@/components/agents/SpecialistConstellation";
import { Health } from "@/pages/Health";
import { EvidencePage } from "@/pages/Evidence";
import { AiChatInterface } from "@/components/chat/AiChatInterface";
import { MedicalChatInterface } from "@/components/MedicalChatInterface";
import { TriageRecordsView } from "@/components/TriageRecordsView";
import { AgentsDirectory } from "@/components/AgentsDirectory";
import { AnatomyMapper } from "@/components/AnatomyMapper";
import { BiomarkersSimulator } from "@/components/BiomarkersSimulator";
import { HealthMetricsDashboard } from "@/components/HealthMetricsDashboard";
import { ClinicalProtocols } from "@/components/ClinicalProtocols";
import { ConsultationInterface } from "@/components/ConsultationInterface";
import { UserProfileDashboard } from "@/components/profile/UserProfileDashboard";
import { SettingsDashboard } from "@/components/settings/SettingsDashboard";
import { Agent, agents } from "@/lib/agents";
import { useClinicalStore } from "@/clinical/store";
import { Link } from "react-router-dom";

const AppDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeAgent, setActiveAgent] = useState<Agent>(agents[0]);
  const [promptSymptom, setPromptSymptom] = useState<string>("");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  const activateAgent = useClinicalStore((state) => state.activateAgent);

  const handleStartConsultationWithSymptom = (symptom: string) => {
    setPromptSymptom(symptom);
    setActiveTab("chat");
  };

  const handleConsultAgent = (agent: Agent, symptom?: string) => {
    setActiveAgent(agent);
    activateAgent(agent.id);
    if (symptom) {
      setPromptSymptom(symptom);
    }
    setActiveTab("chat");
  };

  const handleApplyVitals = (vitals: {
    temperature: number;
    heartRate: number;
    systolic: number;
    diastolic: number;
    oxygenSat: number;
    respiratoryRate: number;
    glucose: number;
  }) => {
    const summary = `Simulated Vitals: Temp ${vitals.temperature}°C, HR ${vitals.heartRate} bpm, BP ${vitals.systolic}/${vitals.diastolic} mmHg, SpO2 ${vitals.oxygenSat}%, Respiration ${vitals.respiratoryRate}/min, Glucose ${vitals.glucose} mg/dL. Please evaluate clinical triage status.`;
    
    // Add to 3D clinical space evidence
    useClinicalStore.getState().addEvidence({
      id: `vitals-${Date.now()}`,
      title: 'Vital Signs (NEWS2)',
      type: 'observation',
      source: 'Biomarkers Simulator',
      confidence: vitals.oxygenSat < 94 || vitals.temperature > 38 ? 'high' : 'medium',
      relatedRegions: ['chest', 'respiratory'],
      metadata: vitals
    });

    setPromptSymptom(summary);
    setActiveTab("chat");
  };

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeAgent={activeAgent}
        onOpenAgentDrawer={() => setActiveTab("agents")}
      />

      {/* Emergency Advisory Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-b border-red-800/40 text-rose-100 px-4 py-2 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400 animate-pulse" />
            <span>
              <strong>Emergency Triage Notice:</strong> If you are experiencing acute, life-threatening symptoms (crushing chest pain, severe dyspnea, focal numbness/paralysis), immediately dial <strong>911</strong> or proceed to the nearest Emergency Room.
            </span>
          </div>
          <a
            href="tel:911"
            className="hidden sm:inline-flex items-center gap-1 bg-red-600/60 hover:bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors border border-red-500/40"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Dial 911</span>
          </a>
        </div>
      </div>

      {/* Intelligence Navigation Bar */}
      <IntelligenceNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setCommandPaletteOpen(true)}
      />

      {/* Main Intelligence Application Shell */}
      <main className="flex-1 w-full flex flex-col min-h-[calc(100vh-140px)]">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
          <AnimatePresence mode="wait">
            {/* VIEW 0: OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div
                key="overview-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Overview
                  onNavigateTab={setActiveTab}
                  onConsultAgent={handleConsultAgent}
                />
              </motion.div>
            )}

            {/* VIEW 1: CLINICAL CONVERSATION (Triage Chat) */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MedicalChatInterface initialSymptom={promptSymptom} />
              </motion.div>
            )}

            {/* VIEW 1B: STREAM SYNTHESIS (AiChatInterface) */}
            {activeTab === "aichat" && (
              <motion.div
                key="aichat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AiChatInterface />
              </motion.div>
            )}

            {/* VIEW 2: SPECIALIST CONSTELLATION */}
            {activeTab === "agents" && (
              <motion.div
                key="agents-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SpecialistConstellation
                  onSelectAgent={(agent) => setActiveAgent(agent)}
                  onConsultAgent={(agent) => handleConsultAgent(agent)}
                />
              </motion.div>
            )}

            {/* VIEW 3: SPATIAL ANATOMY */}
            {activeTab === "anatomy" && (
              <motion.div
                key="anatomy-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AnatomyMapper onConsultAgent={handleConsultAgent} />
              </motion.div>
            )}

            {/* VIEW 4: HEALTH INTELLIGENCE & BIOMARKERS */}
            {activeTab === "health" && (
              <motion.div
                key="health-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Health onApplyVitals={handleApplyVitals} />
              </motion.div>
            )}

            {/* VIEW 5: EVIDENCE LAYER & GUIDELINES */}
            {activeTab === "evidence" && (
              <motion.div
                key="evidence-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <EvidencePage />
              </motion.div>
            )}

            {/* VIEW 6: TRIAGE RECORDS */}
            {activeTab === "records" && (
              <motion.div
                key="records-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <TriageRecordsView onNewConsultation={() => setActiveTab("chat")} />
              </motion.div>
            )}

            {/* VIEW 7: PROTOCOLS */}
            {activeTab === "protocols" && (
              <motion.div
                key="protocols-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ClinicalProtocols />
              </motion.div>
            )}

            {/* VIEW 8: PATIENT PROFILE (Patient Health Context) */}
            {activeTab === "profile" && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <UserProfileDashboard />
              </motion.div>
            )}

            {/* VIEW 9: SETTINGS */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SettingsDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global Command / Search Palette Modal */}
      <ClinicalCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onConsultAgent={handleConsultAgent}
      />

      {/* Refined Clinical Intelligence Footer */}
      <footer className="border-t border-white/10 bg-[#090d14] py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Yurrheeler<span className="text-emerald-400">Med</span> Clinical Intelligence
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
              <button onClick={() => setActiveTab("overview")} className="hover:text-emerald-400 cursor-pointer">
                Overview
              </button>
              <button onClick={() => setActiveTab("chat")} className="hover:text-emerald-400 cursor-pointer">
                Conversation
              </button>
              <button onClick={() => setActiveTab("agents")} className="hover:text-emerald-400 cursor-pointer">
                Specialists
              </button>
              <button onClick={() => setActiveTab("health")} className="hover:text-emerald-400 cursor-pointer">
                Health Intelligence
              </button>
              <button onClick={() => setActiveTab("evidence")} className="hover:text-emerald-400 cursor-pointer">
                Evidence Layer
              </button>
              <Link to="/clinical-space" className="hover:text-cyan-400">
                Spatial World (3D)
              </Link>
              <button onClick={() => setActiveTab("profile")} className="hover:text-emerald-400 cursor-pointer">
                Patient Context
              </button>
              <button onClick={() => setActiveTab("settings")} className="hover:text-emerald-400 cursor-pointer">
                Settings
              </button>
            </div>
          </div>

          <div className="space-y-2 text-slate-400 leading-relaxed text-[11px]">
            <p className="font-semibold text-slate-300">
              CLINICAL TRIAGE ADVISORY & SAFETY NOTICE:
            </p>
            <p>
              Yurrheeler Med Clinical Intelligence is an autonomous multi-agent clinical advisory platform for health exploration, differential symptom stratification, and evidence grounding. It does not establish a definitive medical diagnosis or replace personalized consultation with a licensed physician.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-white/5 text-[11px] text-slate-500">
            <div>&copy; {new Date().getFullYear()} Yurrheeler Med Advisor. Multi-agent consensus engine grounded in clinical evidence.</div>
            <div className="flex items-center gap-1.5 font-medium text-emerald-400">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Context & Specialist Consensus Engine Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppDashboard;
