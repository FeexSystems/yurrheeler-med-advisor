import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Users, Layers, Activity, 
  BookOpen, ClipboardList, ShieldAlert, Sparkles, HeartPulse, 
  PhoneCall, Stethoscope, BarChart3, FileText, Database, UserCircle, Settings
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
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
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HighlightedFeature } from "@/components/landing/HighlightedFeature";
import SaaSProductShowcase from "@/components/landing/SaaSProductShowcase";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Agent, agents } from "@/lib/agents";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useClinicalStore } from "@/clinical/store";


const AppDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [activeAgent, setActiveAgent] = useState<Agent>(agents[0]);
  const [promptSymptom, setPromptSymptom] = useState<string>("");
  
  const handleStartConsultationWithSymptom = (symptom: string) => {
    setPromptSymptom(symptom);
    setShowHero(false);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Top Navbar with Theme Toggle & Google Sign-in */}
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
      {/* Main Workspace Layout */}
      <main className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Clinical Triage & Specialist Hub
                    </h2>
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-xs font-bold py-0.5 px-2">
                      Live
                    </Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Multi-agent medical consultation, automated clinical summaries, and biomarker risk analytics.
                  </p>
                </div>
                
                <a 
                  href="/clinical-space" 
                  className="shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Clinical Space (3D)</span>
                </a>
              </div>
              
              <div className="w-full relative">
                <ScrollArea className="w-full whitespace-nowrap -mb-px">
                  <TabsList className="w-full justify-start bg-transparent border-none p-0 h-auto flex rounded-none gap-4">
                <TabsTrigger
                  value="chat"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Triage Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="aichat"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>Stream Chat</span>
                </TabsTrigger>


                <TabsTrigger
                  value="records"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Triage Records</span>
                </TabsTrigger>

                <TabsTrigger
                  value="agents"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>17 Specialists</span>
                </TabsTrigger>

                <TabsTrigger
                  value="metrics"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Health Metrics</span>
                </TabsTrigger>

                <TabsTrigger
                  value="anatomy"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Anatomy Mapper</span>
                </TabsTrigger>

                <TabsTrigger
                  value="biomarkers"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Vitals & NEWS2</span>
                </TabsTrigger>

                <TabsTrigger
                  value="protocols"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Protocols</span>
                </TabsTrigger>

                <TabsTrigger
                  value="intake"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Intake Form</span>
                </TabsTrigger>

                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <UserCircle className="w-3.5 h-3.5" />
                  <span>Patient Profile</span>
                </TabsTrigger>

                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">

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

          {/* TAB 1B: Stream Chat Interface */}
          <TabsContent value="aichat" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="aichat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AiChatInterface />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 2: Triage Records & Saved Clinical Summaries */}
          <TabsContent value="records" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="records-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <TriageRecordsView onNewConsultation={() => setActiveTab("chat")} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 3: 17 Doctors Directory */}
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

          {/* TAB 4: Health Metrics Dashboard (Recharts Visualizations) */}
          <TabsContent value="metrics" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="metrics-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <HealthMetricsDashboard />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 5: Anatomy Mapper */}
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

          {/* TAB 6: Biomarkers & Vitals Simulator (NEWS2) */}
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

          {/* TAB 7: Clinical Protocols & Decision Trees */}
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

          {/* TAB 8: Structured Intake Form */}
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

          {/* TAB 9: Patient Profile */}
          <TabsContent value="profile" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <UserProfileDashboard />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 10: Settings */}
          <TabsContent value="settings" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SettingsDashboard />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          </div>
        </Tabs>
      </main>
      {/* Comprehensive Medical Footer */}
      
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-16 text-slate-600 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                Yurrheeler<span className="text-blue-600 dark:text-blue-400">Med</span> Clinical AI
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button onClick={() => setActiveTab("chat")} className="hover:text-blue-600 dark:hover:text-blue-400">
                AI Triage
              </button>
              <button onClick={() => setActiveTab("records")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Triage Records
              </button>
              <button onClick={() => setActiveTab("agents")} className="hover:text-blue-600 dark:hover:text-blue-400">
                17 Specialist Doctors
              </button>
              <button onClick={() => setActiveTab("metrics")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Health Metrics
              </button>
              <button onClick={() => setActiveTab("anatomy")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Anatomy Mapper
              </button>
              <button onClick={() => setActiveTab("biomarkers")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Vitals & NEWS2
              </button>
              <button onClick={() => setActiveTab("protocols")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Clinical Protocols
              </button>
              <button onClick={() => setActiveTab("profile")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Patient Profile
              </button>
              <button onClick={() => setActiveTab("settings")} className="hover:text-blue-600 dark:hover:text-blue-400">
                Settings
              </button>
            </div>
          </div>

          <div className="space-y-2 text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            <p className="font-bold text-slate-700 dark:text-slate-300">
              IMPORTANT CLINICAL DISCLAIMER & SAFETY NOTICE:
            </p>
            <p>
              Yurrheeler Med Advisor is an artificial intelligence-powered clinical advisory and triage guidance tool designed for educational, informational, and triage prioritization purposes. It does not formulate a definitive medical diagnosis, prescribe pharmaceutical drugs, or replace formal consultation, physical examination, and treatment by a board-certified licensed healthcare professional.
            </p>
            <p>
              If you suspect you or someone else is experiencing an acute life-threatening emergency (such as severe chest pain, sudden numbness/paralysis, acute respiratory failure, anaphylaxis, or uncontrolled bleeding), call 911 (US/Canada), 999 (UK), 112 (Europe), or proceed immediately to the nearest hospital Emergency Department.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            <div>&copy; {new Date().getFullYear()} Yurrheeler Med Advisor. All clinical triage rights reserved.</div>
            <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Gemini Clinical Triage Engine Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppDashboard;

