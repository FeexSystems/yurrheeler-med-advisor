import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Users, Layers, Activity, 
  BookOpen, ClipboardList, ShieldAlert, Sparkles, HeartPulse, 
  PhoneCall, Stethoscope
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MedicalChatInterface } from "@/components/MedicalChatInterface";
import { AgentsDirectory } from "@/components/AgentsDirectory";
import { AnatomyMapper } from "@/components/AnatomyMapper";
import { BiomarkersSimulator } from "@/components/BiomarkersSimulator";
import { ClinicalProtocols } from "@/components/ClinicalProtocols";
import { ConsultationInterface } from "@/components/ConsultationInterface";
import { Agent, agents } from "@/lib/agents";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [activeAgent, setActiveAgent] = useState<Agent>(agents[0]);
  const [promptSymptom, setPromptSymptom] = useState<string>("");
  const [showHero, setShowHero] = useState<boolean>(true);

  const handleStartConsultationWithSymptom = (symptom: string) => {
    setPromptSymptom(symptom);
    setActiveTab("chat");
  };

  const handleConsultAgent = (agent: Agent, symptom?: string) => {
    setActiveAgent(agent);
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
    setPromptSymptom(summary);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeAgent={activeAgent}
        onOpenAgentDrawer={() => setActiveTab("agents")}
      />

      {/* Emergency Advisory Bar */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 text-xs font-semibold shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Emergency Triage Alert:</strong> If experiencing life-threatening symptoms (crushing chest pain, severe dyspnea, acute stroke signs), dial <strong>911</strong> immediately.
            </span>
          </div>
          <a
            href="tel:911"
            className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Dial 911</span>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      {showHero && (
        <HeroSection
          onStartConsultation={() => setActiveTab("chat")}
          onExploreAgents={() => setActiveTab("agents")}
          onExploreAnatomy={() => setActiveTab("anatomy")}
          onQuickSymptom={handleStartConsultationWithSymptom}
        />
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Sub-Header / Tab Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Clinical Triage & Specialist Intelligence Hub
                </h2>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold py-0.5">
                  Live
                </Badge>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Multi-agent medical consultation, evidence-based triage stratification, and biomarker risk analytics.
              </p>
            </div>

            {/* Navigation Tabs Pill Bar */}
            <TabsList className="bg-slate-200/80 p-1 rounded-xl border border-slate-300/80 flex flex-wrap h-auto gap-1">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Triage Chat</span>
              </TabsTrigger>

              <TabsTrigger
                value="agents"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              >
                <Users className="w-3.5 h-3.5" />
                <span>17 Specialists</span>
              </TabsTrigger>

              <TabsTrigger
                value="anatomy"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Anatomy Mapper</span>
              </TabsTrigger>

              <TabsTrigger
                value="biomarkers"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Vitals & NEWS2</span>
              </TabsTrigger>

              <TabsTrigger
                value="protocols"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Protocols</span>
              </TabsTrigger>

              <TabsTrigger
                value="intake"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Intake Form</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: AI Chat Triage Interface */}
          <TabsContent value="chat" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MedicalChatInterface initialSymptom={promptSymptom} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 2: 17 Doctors Directory */}
          <TabsContent value="agents" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="agents-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AgentsDirectory
                  onConsultAgent={(agent) => handleConsultAgent(agent)}
                  activeAgentId={activeAgent.id}
                />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 3: Anatomy Mapper */}
          <TabsContent value="anatomy" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="anatomy-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AnatomyMapper onConsultAgent={handleConsultAgent} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 4: Biomarkers & Vitals Simulator (NEWS2) */}
          <TabsContent value="biomarkers" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="biomarkers-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BiomarkersSimulator onApplyVitals={handleApplyVitals} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 5: Clinical Protocols & Decision Trees */}
          <TabsContent value="protocols" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="protocols-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ClinicalProtocols />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 6: Structured Intake Form */}
          <TabsContent value="intake" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="intake-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ConsultationInterface onBack={() => setActiveTab("chat")} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>

      {/* Comprehensive Medical Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900">
                Yurrheeler<span className="text-blue-600">Med</span> Clinical AI
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <button onClick={() => setActiveTab("chat")} className="hover:text-blue-600">
                AI Triage
              </button>
              <button onClick={() => setActiveTab("agents")} className="hover:text-blue-600">
                17 Specialist Doctors
              </button>
              <button onClick={() => setActiveTab("anatomy")} className="hover:text-blue-600">
                Anatomy Mapper
              </button>
              <button onClick={() => setActiveTab("biomarkers")} className="hover:text-blue-600">
                Vitals & NEWS2
              </button>
              <button onClick={() => setActiveTab("protocols")} className="hover:text-blue-600">
                Clinical Protocols
              </button>
            </div>
          </div>

          <div className="space-y-2 text-slate-500 leading-relaxed text-[11px]">
            <p className="font-bold text-slate-700">
              IMPORTANT CLINICAL DISCLAIMER & SAFETY NOTICE:
            </p>
            <p>
              Yurrheeler Med Advisor is an artificial intelligence-powered clinical advisory and triage guidance tool designed for educational, informational, and triage prioritization purposes. It does not formulate a definitive medical diagnosis, prescribe pharmaceutical drugs, or replace formal consultation, physical examination, and treatment by a board-certified licensed healthcare professional.
            </p>
            <p>
              If you suspect you or someone else is experiencing an acute life-threatening emergency (such as severe chest pain, sudden numbness/paralysis, acute respiratory failure, anaphylaxis, or uncontrolled bleeding), call 911 (US/Canada), 999 (UK), 112 (Europe), or proceed immediately to the nearest hospital Emergency Department.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            <div>&copy; {new Date().getFullYear()} Yurrheeler Med Advisor. All clinical triage rights reserved.</div>
            <div className="flex items-center gap-1.5 font-medium text-emerald-600">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Gemini Clinical Triage Engine Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
