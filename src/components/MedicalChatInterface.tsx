import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, RefreshCw, AlertTriangle, ShieldCheck, 
  Clock, Activity, Sparkles, Copy, Check, Heart, Thermometer,
  FileText, Trash2, User, Bot, AlertCircle, Info, Download,
  Mic, MicOff, ChevronDown, CheckCircle2, UserCheck, Stethoscope,
  BookOpen, FileCheck2, Printer
} from "lucide-react";

import { useMedicalConsultation } from "@/hooks/useMedicalConsultation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Agent, agents } from "@/lib/agents";
import { useAuth } from "@/contexts/AuthContext";
import { requestSessionSummary, saveTriageSession, StoredTriageSession } from "@/lib/triageService";
import { SessionSummaryModal } from "@/components/SessionSummaryModal";
import { toast } from "sonner";
import { useClinicalStore } from "@/clinical/store";
import { SessionTrendsChart } from "@/components/clinical/SessionTrendsChart";
import { ThresholdConfiguration } from "@/components/clinical/ThresholdConfiguration";

const QUICK_SYMPTOMS = [
  "Chest tightness with shortness of breath and diaphoresis",
  "High fever (39.2°C) with productive cough and chills",
  "Severe throbbing migraine with visual aura & photophobia",
  "Acute lower right abdominal pain with nausea",
  "Sudden itchy hives and facial swelling after food",
  "Twisted ankle with rapid swelling and difficulty bearing weight",
  "Frequent urination, excessive thirst, and unexplained fatigue",
];

// Component to track and render reading progress for longer AI triage reports
const AIReportReadingCard: React.FC<{
  text: string;
  msgId: string;
  specialty: string;
  onCopy: (id: string, text: string) => void;
  isCopied: boolean;
}> = ({ text, msgId, specialty, onCopy, isCopied }) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estimate reading time in minutes
  const readingTimeMin = useMemo(() => {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 180));
  }, [text]);

  const isLongReport = (text || "").length > 350;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const progress = Math.min(100, Math.round((target.scrollTop / totalHeight) * 100));
      setScrollProgress(progress);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Subtle reading progress indicator bar for long reports */}
      {isLongReport && (
        <div className="mb-2 px-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-3 h-3" />
              <span>Clinical Triage Report • ~{readingTimeMin} min read</span>
            </span>
            <span className="font-mono font-semibold">{scrollProgress}% read</span>
          </div>
          <Progress
            value={Math.max(5, scrollProgress)}
            className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full"
          />
        </div>
      )}

      {/* Report Markdown Content with internal scroll detection */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-3 ${
          isLongReport ? "max-h-96 overflow-y-auto pr-1.5 scrollbar-thin" : ""
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:mb-1.5 prose-headings:mt-3 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-slate-900 dark:prose-strong:text-white prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/50 dark:prose-blockquote:bg-emerald-950/30 prose-blockquote:py-1.5 prose-blockquote:px-3 prose-blockquote:rounded-r-md">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>

      {/* Response Footer Actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-3 text-xs text-slate-400 dark:text-slate-500">
        <span className="text-[10px]">
          Consultation with {specialty} Specialist
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopy(msgId, text)}
          className="h-6 px-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Copy advice transcript"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mr-1" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

interface MedicalChatInterfaceProps {
  initialSymptom?: string;
}

export const MedicalChatInterface: React.FC<MedicalChatInterfaceProps> = ({
  initialSymptom = "",
}) => {
  const { user } = useAuth();
  const {
    agents: allAgents,
    selectedAgent,
    selectAgent,
    messages,
    symptomsHistory,
    patientContext,
    setPatientContext,
    isLoading,
    sendMessage,
    resetConsultation,
    exportConsultation,
  } = useMedicalConsultation();

  const [inputVal, setInputVal] = useState(initialSymptom);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVitalsDialogOpen, setIsVitalsDialogOpen] = useState(false);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  // Session Summary Document State
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [currentSummaryData, setCurrentSummaryData] = useState<{
    summaryDocument: string;
    triageLevel: "EMERGENCY" | "URGENT" | "SEMI-URGENT" | "NON-URGENT" | "ROUTINE";
    agentName: string;
    agentSpecialty: string;
    sessionId?: string;
    createdAt?: string;
  } | null>(null);

  // Vitals form
  const [vitalsForm, setVitalsForm] = useState({
    age: patientContext.age ? String(patientContext.age) : "35",
    gender: patientContext.gender || "male",
    temperature: patientContext.vitals?.temperature_c ? String(patientContext.vitals.temperature_c) : "37.0",
    heartRate: patientContext.vitals?.heart_rate_bpm ? String(patientContext.vitals.heart_rate_bpm) : "72",
    systolic: patientContext.vitals?.bp_systolic ? String(patientContext.vitals.bp_systolic) : "120",
    diastolic: patientContext.vitals?.bp_diastolic ? String(patientContext.vitals.bp_diastolic) : "80",
    oxygenSat: patientContext.vitals?.oxygen_saturation ? String(patientContext.vitals.oxygen_saturation) : "98",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Speech recognition integration
  const {
    isListening,
    hasSupport,
    interimTranscript,
    toggleListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: (finalTranscript) => {
      setInputVal((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
      setVoiceToast("Voice dictated successfully");
      setTimeout(() => setVoiceToast(null), 3000);
    },
    onError: (err) => {
      setVoiceToast(`Voice dictation error: ${err}`);
      setTimeout(() => setVoiceToast(null), 4000);
    },
  });

  const setAgentState = useClinicalStore(state => state.setAgentState);
  const activateAgent = useClinicalStore(state => state.activateAgent);
  const addEvent = useClinicalStore(state => state.addEvent);
  const thresholdAlerts = useClinicalStore(state => state.thresholdAlerts);

  useEffect(() => {
    activateAgent(selectedAgent.id);
  }, [selectedAgent.id, activateAgent]);

  useEffect(() => {
    if (isLoading) {
      setAgentState(selectedAgent.id, "reasoning");
    } else {
      setAgentState(selectedAgent.id, "idle");
    }
  }, [isLoading, selectedAgent.id, setAgentState]);

  // Auto-scroll to newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialSymptom) {
      setInputVal(initialSymptom);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialSymptom]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isListening) {
      stopListening();
    }
    if (!inputVal.trim() || isLoading) return;
    const toSend = inputVal;
    setInputVal("");
    sendMessage(toSend);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    
    const temp = vitalsForm.temperature ? parseFloat(vitalsForm.temperature) : undefined;
    const hr = vitalsForm.heartRate ? parseInt(vitalsForm.heartRate, 10) : undefined;
    const sys = vitalsForm.systolic ? parseInt(vitalsForm.systolic, 10) : undefined;
    const dia = vitalsForm.diastolic ? parseInt(vitalsForm.diastolic, 10) : undefined;
    const spo2 = vitalsForm.oxygenSat ? parseFloat(vitalsForm.oxygenSat) : undefined;

    setPatientContext((prev) => ({
      ...prev,
      age: vitalsForm.age ? parseInt(vitalsForm.age, 10) : undefined,
      gender: vitalsForm.gender,
      vitals: {
        temperature_c: temp,
        heart_rate_bpm: hr,
        bp_systolic: sys,
        bp_diastolic: dia,
        oxygen_saturation: spo2,
      },
    }));
    setIsVitalsDialogOpen(false);
    toast.success("Patient vitals updated");

    // Threshold Alert Validation
    const warnings: string[] = [];
    if (hr !== undefined && (hr < thresholdAlerts.heartRate.min || hr > thresholdAlerts.heartRate.max)) {
      warnings.push(`Heart Rate (${hr} bpm) is outside safe range [${thresholdAlerts.heartRate.min}-${thresholdAlerts.heartRate.max}]`);
    }
    if (sys !== undefined && (sys < thresholdAlerts.systolicBP.min || sys > thresholdAlerts.systolicBP.max)) {
      warnings.push(`Systolic BP (${sys} mmHg) is outside safe range [${thresholdAlerts.systolicBP.min}-${thresholdAlerts.systolicBP.max}]`);
    }
    if (dia !== undefined && (dia < thresholdAlerts.diastolicBP.min || dia > thresholdAlerts.diastolicBP.max)) {
      warnings.push(`Diastolic BP (${dia} mmHg) is outside safe range [${thresholdAlerts.diastolicBP.min}-${thresholdAlerts.diastolicBP.max}]`);
    }
    if (spo2 !== undefined && (spo2 < thresholdAlerts.oxygenSaturation.min || spo2 > thresholdAlerts.oxygenSaturation.max)) {
      warnings.push(`SpO2 (${spo2}%) is outside safe range [${thresholdAlerts.oxygenSaturation.min}-${thresholdAlerts.oxygenSaturation.max}]`);
    }
    if (temp !== undefined && (temp < thresholdAlerts.temperature.min || temp > thresholdAlerts.temperature.max)) {
      warnings.push(`Temperature (${temp}°C) is outside safe range [${thresholdAlerts.temperature.min}-${thresholdAlerts.temperature.max}]`);
    }

    if (warnings.length > 0) {
      toast.error(`Critical Thresholds Exceeded: ${warnings.length} alert(s) triggered`, {
        duration: 8000,
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />
      });
      warnings.forEach((warning, idx) => {
        setTimeout(() => {
          addEvent({
            id: `ev-warn-${Date.now()}-${idx}`,
            timestamp: new Date().toISOString(),
            type: "clinical.warning",
            text: warning,
            severity: "high",
          });
        }, idx * 250);
      });
    }
  };

  const handleSelectAgentAndClose = (agent: Agent) => {
    selectAgent(agent);
    setIsAgentDrawerOpen(false);
  };

  // Generate formatted clinical summary document at end of session
  const handleGenerateSummary = async () => {
    if (messages.length <= 1) {
      toast.error("Please submit at least one clinical symptom before generating a summary.");
      return;
    }

    setIsGeneratingSummary(true);
    const toastId = toast.loading("Synthesizing clinical encounter record & recommended next steps...");

    try {
      const summaryResult = await requestSessionSummary({
        history: messages.map((m) => ({ role: m.role, text: m.text })),
        patientContext,
        agentName: selectedAgent.name,
        agentSpecialty: selectedAgent.specialty,
      });

      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const primarySymptom = symptomsHistory[0]?.text || messages.find((m) => m.role === "user")?.text || "General Consultation";

      const sessionRecord: StoredTriageSession = {
        sessionId: newSessionId,
        userId: user ? user.uid : "guest",
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        agentSpecialty: selectedAgent.specialty,
        symptoms: primarySymptom,
        status: "completed",
        summaryDocument: summaryResult.summaryDocument,
        triageLevel: summaryResult.triageLevel,
        messagesCount: messages.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveTriageSession(sessionRecord);

      setCurrentSummaryData({
        summaryDocument: summaryResult.summaryDocument,
        triageLevel: summaryResult.triageLevel,
        agentName: selectedAgent.name,
        agentSpecialty: selectedAgent.specialty,
        sessionId: newSessionId,
        createdAt: new Date().toISOString(),
      });

      setSummaryModalOpen(true);
      toast.dismiss(toastId);
      toast.success("Clinical summary document generated and saved!");
    } catch (err: unknown) {
      console.error("Summary generation failed:", err);
      toast.dismiss(toastId);
      const errorMsg = err instanceof Error ? err.message : "Failed to generate session summary.";
      toast.error(errorMsg);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 shadow-xs">
            <AlertTriangle className="w-3 h-3" /> Critical Emergency
          </Badge>
        );
      case "urgent":
        return (
          <Badge className="bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-1 shadow-xs">
            <Clock className="w-3 h-3" /> Urgent Care Needed
          </Badge>
        );
      case "moderate":
        return (
          <Badge className="bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1 shadow-xs">
            <Activity className="w-3 h-3" /> Moderate / Semi-Urgent
          </Badge>
        );
      case "routine":
      default:
        return (
          <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Routine / Informational
          </Badge>
        );
    }
  };

  const userMessagesCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto">
      {/* Main Chat Stream (8 columns on large screens) */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Chat Consultation Header Card */}
        <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-4 sm:p-5 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Active Agent Info & Switcher Trigger */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedAgent.avatar_url}
                    alt={selectedAgent.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {selectedAgent.name}
                    </h2>
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 text-xs font-semibold py-0.5">
                      {selectedAgent.specialty}
                    </Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 max-w-md mt-0.5">
                    {selectedAgent.description}
                  </p>
                </div>
              </div>

              {/* Action Toolbar: End & Summary, Switch Specialist, Vitals, Export, Clear Conversation */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Generate Summary Action Button */}
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary || userMessagesCount === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  title="Generate formatted summary document with key findings and next steps"
                >
                  {isGeneratingSummary ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-100" />
                      <span>End & Generate Summary</span>
                    </>
                  )}
                </Button>

                {/* Threshold Configuration */}
                <ThresholdConfiguration />

                {/* Switch Specialist Dialog */}
                <Dialog open={isAgentDrawerOpen} onOpenChange={setIsAgentDrawerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 h-9 rounded-xl"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="hidden sm:inline">Switch Doctor ({allAgents.length})</span>
                      <span className="sm:hidden">Switch</span>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DialogHeader className="p-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Select Medical Specialist
                      </DialogTitle>
                      <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Choose from our 17 specialized AI medical agents to tailor your clinical triage.
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allAgents.map((agent) => {
                          const isCurrent = agent.id === selectedAgent.id;
                          return (
                            <button
                              key={agent.id}
                              onClick={() => handleSelectAgentAndClose(agent)}
                              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 relative ${
                                isCurrent
                                  ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-sm"
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <img
                                src={agent.avatar_url}
                                alt={agent.name}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                    {agent.name}
                                  </span>
                                  {isCurrent && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                                  {agent.specialty}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                  {agent.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                {/* Patient Vitals Dialog */}
                <Dialog open={isVitalsDialogOpen} onOpenChange={setIsVitalsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 h-9 rounded-xl"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{patientContext.age ? `${patientContext.age}y` : "Vitals"}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <Heart className="w-5 h-5 text-red-500" />
                        Patient Clinical Baseline & Vitals
                      </DialogTitle>
                      <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Refine clinical triage predictions by recording current patient vitals.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveVitals} className="space-y-4 py-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="patient-age">Age (Years)</Label>
                          <Input
                            id="patient-age"
                            type="number"
                            min="0"
                            max="125"
                            value={vitalsForm.age}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, age: e.target.value })}
                            placeholder="35"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="patient-gender">Biological Sex</Label>
                          <Select
                            value={vitalsForm.gender}
                            onValueChange={(val) => setVitalsForm({ ...vitalsForm, gender: val })}
                          >
                            <SelectTrigger id="patient-gender" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator className="dark:bg-slate-800" />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="vitals-temp">Temp (°C)</Label>
                          <Input
                            id="vitals-temp"
                            type="number"
                            step="0.1"
                            value={vitalsForm.temperature}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                            placeholder="37.0"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="vitals-hr">Heart Rate (BPM)</Label>
                          <Input
                            id="vitals-hr"
                            type="number"
                            value={vitalsForm.heartRate}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                            placeholder="72"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="vitals-sys">BP Systolic</Label>
                          <Input
                            id="vitals-sys"
                            type="number"
                            value={vitalsForm.systolic}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, systolic: e.target.value })}
                            placeholder="120"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="vitals-dia">BP Diastolic</Label>
                          <Input
                            id="vitals-dia"
                            type="number"
                            value={vitalsForm.diastolic}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, diastolic: e.target.value })}
                            placeholder="80"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="vitals-spo2">SpO2 (%)</Label>
                          <Input
                            id="vitals-spo2"
                            type="number"
                            value={vitalsForm.oxygenSat}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, oxygenSat: e.target.value })}
                            placeholder="98"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsVitalsDialogOpen(false)}
                          className="h-9 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
                        >
                          Save Baseline
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* More options menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DropdownMenuLabel className="text-xs font-bold">Export Transcript</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => exportConsultation("txt")} className="text-xs cursor-pointer">
                      <FileText className="w-3.5 h-3.5 mr-2" /> Text Document (.txt)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportConsultation("json")} className="text-xs cursor-pointer">
                      <Download className="w-3.5 h-3.5 mr-2" /> Medical JSON (.json)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setIsClearConfirmOpen(true)}
                      className="text-xs text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Reset Consultation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Prompt Banner if user has ongoing conversation */}
          {userMessagesCount >= 1 && (
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-slate-50 dark:from-slate-800/80 dark:via-emerald-950/40 dark:to-slate-800/80 border-t border-b border-emerald-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  Consultation in progress with <strong>{selectedAgent.name}</strong>. Ready to summarize findings?
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="h-7 text-[11px] font-bold border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-lg whitespace-nowrap"
              >
                <FileCheck2 className="w-3 h-3 mr-1" />
                Generate Summary Document
              </Button>
            </div>
          )}

          {/* Chat Messages Stream */}
          <CardContent className="p-4 sm:p-6 space-y-4 max-h-[580px] min-h-[420px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const isCopied = copiedId === msg.id;

              return (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-1">
                      {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                      ) : (
                        <img
                          src={selectedAgent.avatar_url}
                          alt={selectedAgent.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-500 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    {/* Message Bubble Card */}
                    <div
                      className={`p-4 rounded-2xl shadow-xs transition-colors ${
                        isUser
                          ? "bg-emerald-600 text-white rounded-tr-xs"
                          : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs"
                      }`}
                    >
                      {/* Sender Meta */}
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className={`text-[11px] font-bold ${isUser ? "text-emerald-100" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {isUser ? "You (Patient)" : selectedAgent.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          {!isUser && msg.urgency && getUrgencyBadge(msg.urgency)}
                        </div>
                      </div>

                      {/* Content */}
                      {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <AIReportReadingCard
                          text={msg.text}
                          msgId={msg.id}
                          specialty={selectedAgent.specialty}
                          onCopy={handleCopy}
                          isCopied={isCopied}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 max-w-[80%]"
              >
                <img
                  src={selectedAgent.avatar_url}
                  alt={selectedAgent.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>{selectedAgent.name} is evaluating clinical differential & triage parameters...</span>
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-64 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-3.5 w-48 bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Symptoms Prompt Pills */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Quick Inquiries:
            </span>
            {QUICK_SYMPTOMS.map((symp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputVal(symp);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap transition-colors text-slate-700 dark:text-slate-300 font-medium"
              >
                {symp}
              </button>
            ))}
          </div>

          {/* Input Chat Box & Controls */}
          <CardFooter className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 transition-all">
            <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-2">
              {/* Voice feedback banner if active */}
              {isListening ? (
                <div className="flex flex-col p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl relative overflow-hidden transition-all duration-300">
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-8 bg-red-400 dark:bg-red-500 rounded-[100%] blur-xl animate-pulse" style={{ transform: 'translateY(-50%)' }}></div>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="font-bold text-red-700 dark:text-red-300">Recording Patient Note...</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={toggleListening}
                      className="h-7 text-xs px-3 rounded-full font-bold shadow-sm"
                    >
                      <MicOff className="w-3 h-3 mr-1" /> Done
                    </Button>
                  </div>
                  
                  <div className="relative z-10 min-h-[60px] p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-red-100 dark:border-red-900/40 overflow-y-auto">
                    <span className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {inputVal} <span className="opacity-60">{interimTranscript || "Listening..."}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <div className="relative flex-1 group">
                    <Textarea
                      ref={textareaRef}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Describe your symptoms to ${selectedAgent.name} (e.g. onset, severity, location, timeline)...`}
                      className="min-h-[54px] max-h-32 pr-10 text-xs sm:text-sm resize-none rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-emerald-500 transition-colors"
                      disabled={isLoading}
                    />

                    {/* Speech Dictation Button */}
                    {hasSupport && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={toggleListening}
                              className="absolute right-2 bottom-2 h-7 w-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors group-focus-within:opacity-100"
                              title="Dictate clinical note"
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-white text-[10px] font-semibold border-none">
                            Capture Voice Note
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !inputVal.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-[54px] px-5 rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Consult</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Sidebar: Attending Specialist, Symptom Log, Summary Trigger, Red Flag Matrix (4 columns) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Session Summary Card */}
        <Card className="border-emerald-100 dark:border-slate-800 shadow-sm bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30">
          <CardHeader className="pb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Session Summary Document
                </CardTitle>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                Automated
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Compile clinical differential, NEWS2 risk, and recommended action steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              At the conclusion of your clinical consultation, generate an official, formatted <strong>Triage Summary Record</strong> to share with your personal physician or archive.
            </p>
            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || userMessagesCount === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
              >
                {isGeneratingSummary ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Summary...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Summary Document</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attending Specialist Card */}
        <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Attending Specialist
                </CardTitle>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                {selectedAgent.category || "Clinical"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-3">
              <img
                src={selectedAgent.avatar_url}
                alt={selectedAgent.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{selectedAgent.name}</div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{selectedAgent.specialty}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">AI Clinical Intelligence</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              {selectedAgent.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAgentDrawerOpen(true)}
              className="w-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800 h-8 rounded-xl"
            >
              Change Doctor ({allAgents.length} Available)
            </Button>
          </CardContent>
        </Card>

        {/* Tracked Symptoms History Card */}
        <Card className="border-slate-200/90 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="pb-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Symptom Log History
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                {symptomsHistory.length} Recorded
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Chronological log of reported symptoms in this session
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            {symptomsHistory.length === 0 ? (
              <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs">
                <Info className="w-4 h-4 mx-auto mb-1.5 text-slate-400" />
                No symptoms submitted yet. Dictate or type symptoms to begin tracking.
              </div>
            ) : (
              <ScrollArea className="h-36 pr-2">
                <ul className="space-y-2">
                  {symptomsHistory.map((symptom, idx) => (
                    <li
                      key={symptom.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Log #{idx + 1}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{symptom.timestamp}</span>
                      </div>
                      <p className="line-clamp-2 text-slate-600 dark:text-slate-300">{symptom.text}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Emergency Triage Rule Banner */}
        <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-red-900 dark:text-red-300">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              Critical Emergency Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-red-950/80 dark:text-red-200/80 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-red-900 dark:text-red-300">Immediate 911 Call Triggers:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-0.5">
              <li>Crushing central chest pain / radiating pressure</li>
              <li>Acute shortness of breath or blue lips</li>
              <li>Sudden facial drooping, arm weakness, or slurred speech</li>
              <li>Severe acute abdominal rigidity or hemorrhage</li>
            </ul>
          </CardContent>
        </Card>

        {/* Real-time Session Analytics Chart */}
        <SessionTrendsChart messages={messages} />
      </div>

      {/* Session Summary Document Dialog Modal */}
      {currentSummaryData && (
        <SessionSummaryModal
          isOpen={summaryModalOpen}
          onClose={() => setSummaryModalOpen(false)}
          summaryDocument={currentSummaryData.summaryDocument}
          triageLevel={currentSummaryData.triageLevel}
          agentName={currentSummaryData.agentName}
          agentSpecialty={currentSummaryData.agentSpecialty}
          sessionId={currentSummaryData.sessionId}
          createdAt={currentSummaryData.createdAt}
        />
      )}

      {/* Reset confirmation dialog */}
      <Dialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              End & Reset Consultation Session?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Would you like to generate a clinical summary document before clearing the conversation history?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetConsultation();
                setIsClearConfirmOpen(false);
                toast.success("Consultation reset");
              }}
              className="text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Clear Without Summary
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                setIsClearConfirmOpen(false);
                await handleGenerateSummary();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
            >
              Generate Summary & Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
