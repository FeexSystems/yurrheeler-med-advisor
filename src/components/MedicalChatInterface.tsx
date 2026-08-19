import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, RefreshCw, AlertTriangle, ShieldCheck, 
  Clock, Activity, Sparkles, Copy, Check, Heart, Thermometer,
  FileText, Trash2, User, Bot, AlertCircle, Info, Download,
  Mic, MicOff, ChevronDown, CheckCircle2, UserCheck, Stethoscope,
  BookOpen
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
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 180));
  }, [text]);

  const isLongReport = text.length > 350;

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
            <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
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
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:mb-1.5 prose-headings:mt-3 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-slate-900 dark:prose-strong:text-white prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-1.5 prose-blockquote:px-3 prose-blockquote:rounded-r-md">
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
    setPatientContext((prev) => ({
      ...prev,
      age: vitalsForm.age ? parseInt(vitalsForm.age, 10) : undefined,
      gender: vitalsForm.gender,
      vitals: {
        temperature_c: vitalsForm.temperature ? parseFloat(vitalsForm.temperature) : undefined,
        heart_rate_bpm: vitalsForm.heartRate ? parseInt(vitalsForm.heartRate, 10) : undefined,
        bp_systolic: vitalsForm.systolic ? parseInt(vitalsForm.systolic, 10) : undefined,
        bp_diastolic: vitalsForm.diastolic ? parseInt(vitalsForm.diastolic, 10) : undefined,
        oxygen_saturation: vitalsForm.oxygenSat ? parseFloat(vitalsForm.oxygenSat) : undefined,
      },
    }));
    setIsVitalsDialogOpen(false);
  };

  const handleSelectAgentAndClose = (agent: Agent) => {
    selectAgent(agent);
    setIsAgentDrawerOpen(false);
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
          <Badge className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 shadow-xs">
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
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
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
                    <Badge className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 text-xs font-semibold py-0.5">
                      {selectedAgent.specialty}
                    </Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 max-w-md mt-0.5">
                    {selectedAgent.description}
                  </p>
                </div>
              </div>

              {/* Action Toolbar: Switch Specialist, Vitals, Export, Clear Conversation */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Switch Specialist Dialog */}
                <Dialog open={isAgentDrawerOpen} onOpenChange={setIsAgentDrawerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 h-9"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Switch Specialist ({allAgents.length})</span>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DialogHeader className="p-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                                  ? "border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-sm"
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
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
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
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
                      className="text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 h-9"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{patientContext.age ? `Patient (${patientContext.age}y)` : "Vitals"}</span>
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
                          <Label htmlFor="patient-temp" className="flex items-center gap-1 text-xs">
                            <Thermometer className="w-3.5 h-3.5 text-red-500" />
                            Temperature (°C)
                          </Label>
                          <Input
                            id="patient-temp"
                            type="number"
                            step="0.1"
                            value={vitalsForm.temperature}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                            placeholder="37.0"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="patient-hr" className="flex items-center gap-1 text-xs">
                            <Heart className="w-3.5 h-3.5 text-red-500" />
                            Heart Rate (bpm)
                          </Label>
                          <Input
                            id="patient-hr"
                            type="number"
                            value={vitalsForm.heartRate}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
                            placeholder="72"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="patient-bp-sys" className="text-xs">Blood Pressure (Systolic/Diastolic)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="patient-bp-sys"
                              type="number"
                              value={vitalsForm.systolic}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, systolic: e.target.value })}
                              placeholder="120"
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                            <span>/</span>
                            <Input
                              id="patient-bp-dia"
                              type="number"
                              value={vitalsForm.diastolic}
                              onChange={(e) => setVitalsForm({ ...vitalsForm, diastolic: e.target.value })}
                              placeholder="80"
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="patient-spo2" className="text-xs">Oxygen SpO2 (%)</Label>
                          <Input
                            id="patient-spo2"
                            type="number"
                            min="50"
                            max="100"
                            value={vitalsForm.oxygenSat}
                            onChange={(e) => setVitalsForm({ ...vitalsForm, oxygenSat: e.target.value })}
                            placeholder="98"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsVitalsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Save Vitals
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Export Consultation Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 h-9 px-2.5"
                      aria-label="Export consultation transcript"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DropdownMenuLabel className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Export Consultation
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => exportConsultation("txt")} className="text-xs cursor-pointer">
                      <FileText className="w-3.5 h-3.5 mr-2 text-blue-600 dark:text-blue-400" />
                      Download Clinical Summary (.txt)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportConsultation("json")} className="text-xs cursor-pointer">
                      <Download className="w-3.5 h-3.5 mr-2 text-emerald-600 dark:text-emerald-400" />
                      Download Raw Data (.json)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Conversation Button (Header) */}
                <Dialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1 h-9 px-2.5"
                      aria-label="Clear conversation history and start fresh consultation"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        Clear Conversation History?
                      </DialogTitle>
                      <DialogDescription className="text-slate-500 dark:text-slate-400">
                        This will reset the active chat transcript, recorded symptoms, and start a fresh clinical consultation with {selectedAgent.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsClearConfirmOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          resetConsultation();
                          setIsClearConfirmOpen(false);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, Clear Conversation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Message Thread Scroll Area */}
        <Card className="flex-1 border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col min-h-[520px] max-h-[640px] bg-slate-50/50 dark:bg-slate-950/40">
          <ScrollArea className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                    ) : (
                      <img
                        src={selectedAgent.avatar_url}
                        alt={selectedAgent.name}
                        className="flex-shrink-0 w-9 h-9 rounded-xl object-cover border border-blue-300 dark:border-blue-600 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col max-w-[90%] sm:max-w-[84%] ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      {/* Sender label, urgency badge, and SUBTLE LOCALIZED TIMESTAMP */}
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {isUser ? "Patient" : selectedAgent.name}
                        </span>
                        {!isUser && getUrgencyBadge(msg.urgency)}
                        {/* Subtle localized timestamp */}
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tracking-tight">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Content Card with Reading Progress for AI Reports */}
                      <div
                        className={`rounded-2xl p-4 sm:p-5 shadow-sm text-sm leading-relaxed ${
                          isUser
                            ? "bg-blue-600 text-white rounded-tr-none font-medium"
                            : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 rounded-tl-none"
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <AIReportReadingCard
                            text={msg.text}
                            msgId={msg.id}
                            specialty={selectedAgent.specialty}
                            onCopy={handleCopy}
                            isCopied={copiedId === msg.id}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* SKELETON FEEDBACK COMPONENT: Displayed while AI agent is processing inquiry */}
              {isLoading && (
                <div className="flex items-start gap-3 animate-fade-in" aria-live="polite" aria-busy="true">
                  <img
                    src={selectedAgent.avatar_url}
                    alt={selectedAgent.name}
                    className="flex-shrink-0 w-9 h-9 rounded-xl object-cover border border-blue-300 dark:border-blue-600 shadow-sm animate-pulse"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col w-full max-w-[88%] sm:max-w-[82%] space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedAgent.name}</span>
                      <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 animate-pulse text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-spin text-blue-600 dark:text-blue-400" />
                        Clinical Triage & Differential Evaluation...
                      </Badge>
                    </div>

                    {/* Rich Skeleton Structure */}
                    <Card className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 shadow-sm space-y-3.5 rounded-tl-none">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-5 w-40 bg-blue-100/80 dark:bg-blue-900/40" />
                        <Skeleton className="h-5 w-28 bg-slate-200 dark:bg-slate-800" />
                      </div>

                      <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-[92%] bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-[78%] bg-slate-200 dark:bg-slate-800" />
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-4 w-48 bg-slate-300 dark:bg-slate-700" />
                        <div className="flex gap-2 items-center">
                          <Skeleton className="h-3.5 w-3.5 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                          <Skeleton className="h-3.5 w-[85%] bg-slate-200 dark:bg-slate-800" />
                        </div>
                        <div className="flex gap-2 items-center">
                          <Skeleton className="h-3.5 w-3.5 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                          <Skeleton className="h-3.5 w-[70%] bg-slate-200 dark:bg-slate-800" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <Skeleton className="h-3 w-36 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Symptom Chips */}
          <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
                Quick Prompts:
              </span>
              {QUICK_SYMPTOMS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputVal(chip);
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                    }
                  }}
                  className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200/90 dark:border-slate-700 rounded-full transition-all whitespace-nowrap text-xs shadow-2xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Live Voice Status Pill */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 dark:bg-red-950/40 border-t border-red-200 dark:border-red-900 px-4 py-2 flex items-center justify-between text-xs text-red-900 dark:text-red-200"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="font-semibold">Microphone Active: Dictate your symptoms clearly...</span>
                </div>
                {interimTranscript && (
                  <span className="italic text-slate-600 dark:text-slate-300 truncate max-w-xs sm:max-w-md">
                    "{interimTranscript}"
                  </span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={stopListening}
                  className="h-6 text-xs text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950"
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accessible Chat Input Form */}
          <CardFooter className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  id="symptom-input"
                  rows={2}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Describe your symptoms to ${selectedAgent.name} (e.g., onset, pain 1-10, location, vitals)...`}
                  className="resize-none min-h-[58px] max-h-32 text-sm pr-14 focus-visible:ring-2 focus-visible:ring-blue-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl"
                  aria-label="Describe your symptoms or ask a medical inquiry"
                  aria-describedby="chat-input-instruction"
                  disabled={isLoading}
                />
                <span id="chat-input-instruction" className="sr-only">
                  Press Enter to submit symptoms inquiry, or Shift+Enter for a new line. You can also use the microphone button to dictate symptoms.
                </span>

                {/* Voice Dictation Button inside Textarea */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleListening}
                        className={`absolute right-2.5 top-2.5 h-8 w-8 rounded-lg transition-all ${
                          isListening
                            ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                            : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                        }`}
                        aria-label={isListening ? "Stop voice dictation" : "Dictate symptoms with voice"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isListening ? "Stop recording voice" : "Dictate symptoms via microphone"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex sm:flex-col justify-between sm:justify-end gap-2">
                <Button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm transition-all flex items-center justify-center gap-2 h-12 rounded-xl"
                  aria-label="Submit symptoms for clinical AI triage"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Consult</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Sidebar: Session Symptom Timeline, Active Specialist Bio, Emergency Check (4 columns) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Attending Specialist Card */}
        <Card className="border-blue-100 dark:border-slate-800 shadow-sm bg-gradient-to-br from-white to-blue-50/40 dark:from-slate-900 dark:to-slate-900/80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Attending Specialist
                </CardTitle>
              </div>
              <Badge className="bg-blue-600 text-white text-[10px]">
                {selectedAgent.category || "Clinical"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-3">
              <img
                src={selectedAgent.avatar_url}
                alt={selectedAgent.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{selectedAgent.name}</div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedAgent.specialty}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">AI Clinical Intelligence</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              {selectedAgent.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAgentDrawerOpen(true)}
              className="w-full text-xs font-semibold text-blue-700 dark:text-blue-300 border-blue-200 dark:border-slate-700 hover:bg-blue-100/50 dark:hover:bg-slate-800 h-8"
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
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Symptom Log History
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
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
              <ScrollArea className="h-44 pr-2">
                <ul className="space-y-2">
                  {symptomsHistory.map((symptom, idx) => (
                    <li
                      key={symptom.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Log #{idx + 1}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{symptom.timestamp}</span>
                      </div>
                      <p className="line-clamp-2 text-slate-600 dark:text-slate-300">{symptom.text}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
          {symptomsHistory.length > 0 && (
            <CardFooter className="pt-0 pb-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportConsultation("txt")}
                className="flex-1 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 h-8 border-slate-200 dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsClearConfirmOpen(true)}
                className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 h-8"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          )}
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
      </div>
    </div>
  );
};
