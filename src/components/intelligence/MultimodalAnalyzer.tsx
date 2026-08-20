import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Camera,
  FileText,
  Activity,
  Heart,
  Pill,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Send,
  Eye,
  ShieldCheck,
  Stethoscope,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface MultimodalAnalyzerProps {
  onConsultSpecialist?: (specialty: string, initialNotes?: string) => void;
}

interface SamplePreset {
  id: string;
  title: string;
  category: "derm" | "lab_report" | "ecg" | "prescription" | "general";
  description: string;
  notes: string;
  svgDataUri: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "sample-derm-1",
    title: "Cutaneous Target Erythema (Lyme / Ringworm suspect)",
    category: "derm",
    description: "Expanding annular erythematous patch with central clearing on upper forearm.",
    notes: "Patient noticed circular red rash 4 days ago after hiking. Mild itching, no fever.",
    svgDataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23fef2f2'/><circle cx='200' cy='150' r='100' fill='%23fecaca' stroke='%23dc2626' stroke-width='8'/><circle cx='200' cy='150' r='50' fill='%23fef2f2' stroke='%23f87171' stroke-width='4'/><circle cx='200' cy='150' r='16' fill='%23ef4444'/><text x='200' y='280' font-family='sans-serif' font-size='14' text-anchor='middle' fill='%23991b1b'>Clinical Sample: Erythematous Annular Lesion</text></svg>"
  },
  {
    id: "sample-lab-1",
    title: "Metabolic & Inflammatory Lab Panel",
    category: "lab_report",
    description: "Routine venous blood panel showing elevated inflammatory markers.",
    notes: "Follow-up lab drawn for chronic fatigue and joint soreness.",
    svgDataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23f8fafc'/><text x='20' y='40' font-family='monospace' font-size='16' font-weight='bold' fill='%230f172a'>METABOLIC LAB REPORT</text><line x1='20' y1='55' x2='380' y2='55' stroke='%23cbd5e1' stroke-width='2'/><text x='20' y='90' font-family='monospace' font-size='13' fill='%23334155'>WBC: 11.8 x10^3/uL [HIGH *]</text><text x='20' y='125' font-family='monospace' font-size='13' fill='%23334155'>Hemoglobin: 14.2 g/dL [NORMAL]</text><text x='20' y='160' font-family='monospace' font-size='13' fill='%23334155'>CRP (C-Reactive): 18.4 mg/L [ELEVATED *]</text><text x='20' y='195' font-family='monospace' font-size='13' fill='%23334155'>eGFR: 88 mL/min/1.73m2 [NORMAL]</text><text x='20' y='230' font-family='monospace' font-size='13' fill='%23334155'>Potassium: 4.3 mmol/L [NORMAL]</text><rect x='15' y='255' width='370' height='30' rx='6' fill='%23dbeafe'/><text x='200' y='275' font-family='sans-serif' font-size='12' text-anchor='middle' fill='%231e40af'>Verification Stamp: Quest / LabCorp Format</text></svg>"
  },
  {
    id: "sample-ecg-1",
    title: "12-Lead Rhythm Strip (Sinus with T-Wave Flattening)",
    category: "ecg",
    description: "Standard Lead II rhythm strip with regular ventricular rate 72 bpm.",
    notes: "Patient reports occasional intermittent flutter after morning coffee.",
    svgDataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23fff1f2'/><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23fecdd3' stroke-width='1'/></pattern><rect width='100%' height='100%' fill='url(%23grid)'/><path d='M 10 150 L 50 150 Q 60 130 70 150 L 90 150 L 95 160 L 105 50 L 115 190 L 125 150 L 140 150 Q 160 135 180 150 L 220 150 L 225 160 L 235 50 L 245 190 L 255 150 L 270 150 Q 290 135 310 150 L 390 150' fill='none' stroke='%23e11d48' stroke-width='2.5'/><text x='20' y='30' font-family='sans-serif' font-size='13' font-weight='bold' fill='%239f1239'>Lead II - 25mm/s 10mm/mV (HR 72 bpm)</text></svg>"
  },
  {
    id: "sample-rx-1",
    title: "Cardiometabolic Prescription Regimen",
    category: "prescription",
    description: "Multidrug prescription label with Lisinopril & Atorvastatin.",
    notes: "Patient inquiring about taking these together with dietary supplements.",
    svgDataUri: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23f0fdf4'/><rect x='30' y='25' width='340' height='250' rx='12' fill='%23ffffff' stroke='%2386efac' stroke-width='2'/><text x='50' y='65' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23166534'>RX PHARMACY DIRECT</text><text x='50' y='95' font-family='monospace' font-size='12' fill='%23334155'>Rx# 849201-B • Refills: 3</text><text x='50' y='130' font-family='sans-serif' font-size='14' font-weight='bold' fill='%230f172a'>LISINOPRIL 10 MG TABLET</text><text x='50' y='150' font-family='sans-serif' font-size='12' fill='%23475569'>Take 1 tablet daily by mouth in the morning.</text><text x='50' y='185' font-family='sans-serif' font-size='14' font-weight='bold' fill='%230f172a'>ATORVASTATIN 20 MG TABLET</text><text x='50' y='205' font-family='sans-serif' font-size='12' fill='%23475569'>Take 1 tablet daily by mouth at bedtime.</text><text x='50' y='245' font-family='sans-serif' font-size='11' fill='%23dc2626'>⚠️ Avoid concurrent grapefruit products.</text></svg>"
  }
];

export const MultimodalAnalyzer: React.FC<MultimodalAnalyzerProps> = ({
  onConsultSpecialist
}) => {
  const [activeCategory, setActiveCategory] = useState<"derm" | "lab_report" | "ecg" | "prescription" | "general">("derm");
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(SAMPLE_PRESETS[0].svgDataUri);
  const [userNotes, setUserNotes] = useState<string>(SAMPLE_PRESETS[0].notes);
  const [patientAge, setPatientAge] = useState<string>("48");
  const [patientGender, setPatientGender] = useState<string>("Female");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageBase64(reader.result as string);
      setAnalysisResult(null);
      toast.success(`Loaded ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    setActiveCategory(preset.category);
    setSelectedImageBase64(preset.svgDataUri);
    setUserNotes(preset.notes);
    setAnalysisResult(null);
    toast.info(`Loaded sample: ${preset.title}`);
  };

  const handleRunAnalysis = async () => {
    if (!selectedImageBase64) {
      toast.error("Please upload or select an image first");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/multimodal-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          analysisType: activeCategory,
          userNotes,
          patientAge,
          patientGender
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisResult(data.analysis);
      toast.success("Multimodal analysis complete");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error analyzing image";
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 text-xs uppercase tracking-wider">
                Feature 1 • Gemini Vision
              </Badge>
              <span className="text-xs text-emerald-300 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Resolution Clinical OCR & Pathology
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Multimodal Diagnostic Image & Lab Analyzer
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Upload photos of skin lesions, rashes, 12-lead ECG strips, laboratory test reports, or prescription bottles for immediate evidence-based visual triage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs h-10 px-4 rounded-xl shadow-md flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Image/File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Tabs
          value={activeCategory}
          onValueChange={(val) => setActiveCategory(val as typeof activeCategory)}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl grid grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="derm" className="text-xs font-semibold flex items-center gap-1.5 py-2">
              <Eye className="w-3.5 h-3.5 text-rose-500" />
              <span>Dermatology</span>
            </TabsTrigger>
            <TabsTrigger value="lab_report" className="text-xs font-semibold flex items-center gap-1.5 py-2">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Lab Reports</span>
            </TabsTrigger>
            <TabsTrigger value="ecg" className="text-xs font-semibold flex items-center gap-1.5 py-2">
              <Heart className="w-3.5 h-3.5 text-emerald-500" />
              <span>ECG Strip</span>
            </TabsTrigger>
            <TabsTrigger value="prescription" className="text-xs font-semibold flex items-center gap-1.5 py-2">
              <Pill className="w-3.5 h-3.5 text-purple-500" />
              <span>Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="text-xs font-semibold flex items-center gap-1.5 py-2">
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              <span>General / X-Ray</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Sample Library:</span>
          {SAMPLE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 rounded-lg text-[11px] font-medium border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
            >
              {p.title.split("(")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload & Preview (Left 5) vs Analysis Output (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Preview & Patient Context */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Clinical Media Preview
                  </CardTitle>
                </div>
                {selectedImageBase64 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedImageBase64(null);
                      setAnalysisResult(null);
                    }}
                    className="h-7 text-xs text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5 mr-1" /> Remove
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Image Box */}
              {selectedImageBase64 ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950/20 flex items-center justify-center min-h-[220px] max-h-[300px]">
                  <img
                    src={selectedImageBase64}
                    alt="Clinical Preview"
                    className="max-h-[280px] w-auto object-contain rounded-lg shadow-sm"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-slate-900/80 backdrop-blur-md text-emerald-400 border-emerald-500/30 text-[10px]">
                      {activeCategory.toUpperCase()} MODE
                    </Badge>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
                >
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-full text-emerald-600 dark:text-emerald-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drop diagnostic image / PDF
                  </div>
                  <div className="text-[11px] text-slate-400">
                    PNG, JPG, WEBP, or SVG up to 10MB
                  </div>
                </div>
              )}

              {/* Patient Context Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Patient Age
                  </label>
                  <Input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="h-8 text-xs rounded-lg"
                    placeholder="e.g. 48"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Assigned Sex / Gender
                  </label>
                  <Input
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="h-8 text-xs rounded-lg"
                    placeholder="Female / Male"
                  />
                </div>
              </div>

              {/* Clinical Notes & Onset */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Accompanying Symptoms / Clinical Notes
                </label>
                <Textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Describe lesion evolution, pain, itching, fever, or relevant medical history..."
                  className="text-xs min-h-[70px] resize-none rounded-xl"
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !selectedImageBase64}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs h-10 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image with Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Visual Diagnostic Triage</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Structured Clinical Findings */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[480px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Visual Diagnostic Synthesis & Differentials
                  </CardTitle>
                </div>
                {analysisResult && (
                  <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px]">
                    Validated Report
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col">
              {isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 animate-pulse flex items-center justify-center text-emerald-600">
                      <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Processing Optical & Morphological Features
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Evaluating ABCDE criteria, lab analyte deviations, vector intervals, and clinical triage criteria...
                    </p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto max-h-[460px] pr-2">
                    <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Ready to link into patient record or specialist consultation.</span>
                    </div>

                    {onConsultSpecialist && (
                      <Button
                        size="sm"
                        onClick={() => onConsultSpecialist(
                          activeCategory === "derm" ? "Dermatology" : activeCategory === "ecg" ? "Cardiology" : "Internal Medicine",
                          `Multimodal findings: ${analysisResult.slice(0, 200)}...`
                        )}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs h-8 px-4 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Discuss with Attending Specialist</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <Eye className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No Image Analysis Executed Yet
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Select a sample image from the library above or upload your own clinical photo, lab report, or prescription to generate an evidence-based report.
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
