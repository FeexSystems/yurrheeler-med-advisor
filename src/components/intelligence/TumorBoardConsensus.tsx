import React, { useState } from "react";
import {
  Users,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  FileCheck2,
  Share2,
  Send,
  RefreshCw,
  Award,
  Layers,
  HeartPulse,
  Brain,
  Wind,
  Search,
  CheckCircle2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { agents, Agent } from "@/lib/agents";

interface TumorBoardConsensusProps {
  onConsultAgent?: (agent: Agent, notes?: string) => void;
}

interface CasePreset {
  id: string;
  title: string;
  chiefComplaint: string;
  symptoms: string;
  specialistIds: string[];
  patientHistory: string;
}

const COMPLEX_CASE_PRESETS: CasePreset[] = [
  {
    id: "case-cardio-pulm",
    title: "Acute Dyspnea & Pleuritic Chest Discomfort",
    chiefComplaint: "Sudden onset exertional breathlessness, unilateral calf tightness, and sharp right-sided inspiration pain.",
    symptoms: "Dyspnea on minimal exertion, HR 104 bpm, O2 Sat 93% on room air, mild non-productive cough, unilateral right lower leg swelling following recent 6-hour flight.",
    specialistIds: ["cardiology", "pulmonology", "emergency", "internal-medicine"],
    patientHistory: "54-year-old male, mild hypertension on Lisinopril, non-smoker, BMI 28."
  },
  {
    id: "case-onco-heme",
    title: "Unexplained B-Symptoms & Lymphadenopathy",
    chiefComplaint: "Progressive fatigue, drenching night sweats for 3 weeks, and non-tender cervical mass.",
    symptoms: "Unintentional 12-lb weight loss in 6 weeks, low-grade evening fevers (38.1°C), firm palpable 2.5cm left anterior cervical lymph node, persistent lethargy.",
    specialistIds: ["oncology", "infectious-disease", "immunology", "endocrinology"],
    patientHistory: "42-year-old female, no prior chronic conditions, recent travel to Southeast Asia 4 months prior."
  },
  {
    id: "case-neuro-vascular",
    title: "Paroxysmal Neurological Deficit & Headache",
    chiefComplaint: "Transient left hand clumsiness, visual aura, followed by unilateral throbbing headache.",
    symptoms: "15-minute episode of dropped coffee mug due to hand weakness (now resolved), scintillating scotoma in left visual field, pulse 76 regular, BP 148/92 mmHg.",
    specialistIds: ["neurology", "cardiology", "emergency", "geriatrics"],
    patientHistory: "62-year-old female, hyperlipidemia, family history of early stroke in father."
  },
  {
    id: "case-gi-metabolic",
    title: "Epigastric Radiation & Postprandial Emesis",
    chiefComplaint: "Severe upper abdominal aching radiating directly through to mid-back after meals.",
    symptoms: "Boring epigastric pain worsening when lying supine, relieved slightly by leaning forward, nausea, mild scleral icterus noted by spouse, bilirubin 2.1 mg/dL.",
    specialistIds: ["gastroenterology", "general-surgery", "endocrinology", "radiology"],
    patientHistory: "49-year-old male, history of cholelithiasis (gallstones), moderate social alcohol use."
  }
];

export const TumorBoardConsensus: React.FC<TumorBoardConsensusProps> = ({
  onConsultAgent
}) => {
  const [selectedCase, setSelectedCase] = useState<CasePreset>(COMPLEX_CASE_PRESETS[0]);
  const [chiefComplaint, setChiefComplaint] = useState<string>(COMPLEX_CASE_PRESETS[0].chiefComplaint);
  const [symptoms, setSymptoms] = useState<string>(COMPLEX_CASE_PRESETS[0].symptoms);
  const [patientHistory, setPatientHistory] = useState<string>(COMPLEX_CASE_PRESETS[0].patientHistory);
  const [selectedSpecialistIds, setSelectedSpecialistIds] = useState<string[]>(COMPLEX_CASE_PRESETS[0].specialistIds);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [consensusReport, setConsensusReport] = useState<string | null>(null);

  const handleSelectPreset = (preset: CasePreset) => {
    setSelectedCase(preset);
    setChiefComplaint(preset.chiefComplaint);
    setSymptoms(preset.symptoms);
    setPatientHistory(preset.patientHistory);
    setSelectedSpecialistIds(preset.specialistIds);
    setConsensusReport(null);
    toast.info(`Loaded complex case: ${preset.title}`);
  };

  const toggleSpecialist = (id: string) => {
    setSelectedSpecialistIds((prev) =>
      prev.includes(id) ? (prev.length > 2 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const handleRunConsensus = async () => {
    setIsSynthesizing(true);
    setConsensusReport(null);

    const specialistNames = selectedSpecialistIds.map((id) => {
      const match = agents.find((a) => a.id === id);
      return match ? `${match.name} (${match.specialty})` : id;
    });

    try {
      const res = await fetch("/api/tumor-board-consensus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chiefComplaint,
          symptoms,
          selectedSpecialists: specialistNames,
          patientContext: {
            history: patientHistory,
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Consensus generation failed");
      }

      setConsensusReport(data.consensusReport);
      toast.success("Multidisciplinary consensus compiled!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error compiling consensus";
      toast.error(msg);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border border-indigo-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500 text-white font-bold px-2.5 py-0.5 text-xs uppercase tracking-wider">
                Feature 2 • Multi-Agent Consensus
              </Badge>
              <span className="text-xs text-indigo-300 font-mono flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> 17-Specialist Multidisciplinary Tumor Board
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Multi-Specialist Clinical Consensus Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Convene concurrent specialist doctor agents to cross-examine complex diagnostic differentials, resolve clinical controversies, and synthesize prioritized diagnostic action plans.
            </p>
          </div>

          <Button
            onClick={handleRunConsensus}
            disabled={isSynthesizing}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-10 px-5 rounded-xl shadow-md flex items-center gap-2 shrink-0"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Convening Specialist Panel...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Convene Clinical Panel</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Case Presets Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
          Clinical Dilemma Cases:
        </span>
        {COMPLEX_CASE_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border shrink-0 transition-all ${
              selectedCase.id === p.id
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-semibold shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Grid: Inputs & Panel Selection (Left 5) vs Consensus Output (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Case Parameters & Specialist Selection */}
        <div className="lg:col-span-5 space-y-4">
          {/* Participating Specialists Selection */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Participating Specialists ({selectedSpecialistIds.length}/17)
                  </CardTitle>
                </div>
                <span className="text-[11px] text-slate-400">Min 2 required</span>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {agents.map((ag) => {
                  const isSelected = selectedSpecialistIds.includes(ag.id);
                  return (
                    <button
                      key={ag.id}
                      onClick={() => toggleSpecialist(ag.id)}
                      className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 text-indigo-950 dark:text-indigo-200 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {ag.name.split(" ")[1]?.slice(0, 2) || ag.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate leading-tight">{ag.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ag.specialty}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Clinical Case Details */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Case Presentation & Biomarkers
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Chief Complaint
                </label>
                <Input
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="text-xs h-8 rounded-lg"
                  placeholder="Primary acute complaint..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Detailed Symptoms & Vitals
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                  className="text-xs rounded-xl resize-none"
                  placeholder="Clinical presentation details..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Patient Health History & Risk Factors
                </label>
                <Input
                  value={patientHistory}
                  onChange={(e) => setPatientHistory(e.target.value)}
                  className="text-xs h-8 rounded-lg"
                  placeholder="Comorbidities, medications, age..."
                />
              </div>

              <Button
                onClick={handleRunConsensus}
                disabled={isSynthesizing || selectedSpecialistIds.length < 2}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                {isSynthesizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cross-examining Differentials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Multi-Specialist Consensus</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Consensus Report Document */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[500px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Consensus Deliberation & Action Matrix
                  </CardTitle>
                </div>
                {consensusReport && (
                  <Badge className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px]">
                    Board Synthesized
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col">
              {isSynthesizing ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500 animate-pulse flex items-center justify-center text-indigo-600">
                      <Users className="w-7 h-7 animate-bounce" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Conducting Specialist Panel Roundtable
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md">
                      Gathering opinions from {selectedSpecialistIds.length} specialist doctor agents, cross-referencing NICE/AHA guidelines, and calculating diagnostic concordance...
                    </p>
                  </div>
                </div>
              ) : consensusReport ? (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto max-h-[500px] pr-2">
                    <ReactMarkdown>{consensusReport}</ReactMarkdown>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <FileCheck2 className="w-4 h-4 text-emerald-500" />
                      <span>Validated across multi-agent clinical knowledge graph.</span>
                    </div>

                    {onConsultAgent && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const primaryAgent = agents.find((a) => a.id === selectedSpecialistIds[0]) || agents[0];
                          onConsultAgent(primaryAgent, `Consensus findings: ${chiefComplaint}`);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-8 px-4 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Open Lead Specialist Chat</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No Tumor Board Convened Yet
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Select a complex clinical case from above or customize the patient symptoms and specialist panel, then click &quot;Convene Clinical Panel&quot;.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
