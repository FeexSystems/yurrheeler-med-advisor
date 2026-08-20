import React, { useState } from "react";
import {
  Pill,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  FileCheck,
  Send,
  HelpCircle,
  Stethoscope,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface DrugInteractionSafetyMatrixProps {
  onConsultSpecialist?: (specialty: string, notes?: string) => void;
}

interface MedicationItem {
  id: string;
  name: string;
  dose: string;
  frequency: string;
}

interface SafetyPreset {
  id: string;
  title: string;
  badge: "Major Alert" | "Moderate" | "Contraindicated";
  medications: MedicationItem[];
  conditions: string[];
  allergies: string[];
  supplements: string[];
}

const SAFETY_PRESETS: SafetyPreset[] = [
  {
    id: "preset-cardio-renal",
    title: "Cardiorenal Triple Whammy (ACEi + K-Sparing + NSAID)",
    badge: "Major Alert",
    medications: [
      { id: "m1", name: "Lisinopril", dose: "20mg", frequency: "Daily" },
      { id: "m2", name: "Spironolactone", dose: "25mg", frequency: "Daily" },
      { id: "m3", name: "Ibuprofen (Advil)", dose: "400mg", frequency: "TID PRN" }
    ],
    conditions: ["Hypertension", "Chronic Kidney Disease Stage 2", "Osteoarthritis"],
    allergies: ["Sulfa drugs"],
    supplements: ["Potassium Citrate", "CoQ10"]
  },
  {
    id: "preset-serotonin",
    title: "Serotonergic Clash (SSRI + Opioid + St. John's Wort)",
    badge: "Contraindicated",
    medications: [
      { id: "m4", name: "Sertraline (Zoloft)", dose: "100mg", frequency: "Daily" },
      { id: "m5", name: "Tramadol", dose: "50mg", frequency: "Q6H PRN pain" }
    ],
    conditions: ["Major Depressive Disorder", "Chronic Low Back Pain"],
    allergies: ["Codeine (nausea)"],
    supplements: ["St. John's Wort (Herbal)", "5-HTP"]
  },
  {
    id: "preset-anticoagulant",
    title: "Anticoagulant Bleeding Risk (Warfarin + Aspirin + Ginkgo)",
    badge: "Major Alert",
    medications: [
      { id: "m6", name: "Warfarin (Coumadin)", dose: "5mg", frequency: "Daily per INR" },
      { id: "m7", name: "Aspirin (Enteric)", dose: "81mg", frequency: "Daily" }
    ],
    conditions: ["Atrial Fibrillation", "Coronary Artery Disease"],
    allergies: ["Penicillin"],
    supplements: ["Ginkgo Biloba", "High-Dose Vitamin E", "Fish Oil"]
  },
  {
    id: "preset-statin-cyp",
    title: "Statin Myopathy & CYP3A4 Inhibition",
    badge: "Moderate",
    medications: [
      { id: "m8", name: "Atorvastatin (Lipitor)", dose: "40mg", frequency: "Nightly" },
      { id: "m9", name: "Amlodipine", dose: "10mg", frequency: "Daily" }
    ],
    conditions: ["Hyperlipidemia", "Essential Hypertension"],
    allergies: [],
    supplements: ["Grapefruit Extract", "Red Yeast Rice"]
  }
];

export const DrugInteractionSafetyMatrix: React.FC<DrugInteractionSafetyMatrixProps> = ({
  onConsultSpecialist
}) => {
  const [medications, setMedications] = useState<MedicationItem[]>(SAFETY_PRESETS[0].medications);
  const [conditions, setConditions] = useState<string[]>(SAFETY_PRESETS[0].conditions);
  const [allergies, setAllergies] = useState<string[]>(SAFETY_PRESETS[0].allergies);
  const [supplements, setSupplements] = useState<string[]>(SAFETY_PRESETS[0].supplements);

  // New item inputs
  const [newMedName, setNewMedName] = useState<string>("");
  const [newMedDose, setNewMedDose] = useState<string>("");
  const [newCondition, setNewCondition] = useState<string>("");
  const [newAllergy, setNewAllergy] = useState<string>("");
  const [newSupplement, setNewSupplement] = useState<string>("");

  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [safetyReport, setSafetyReport] = useState<string | null>(null);

  const handleLoadPreset = (p: SafetyPreset) => {
    setMedications(p.medications);
    setConditions(p.conditions);
    setAllergies(p.allergies);
    setSupplements(p.supplements);
    setSafetyReport(null);
    toast.info(`Loaded regimen preset: ${p.title}`);
  };

  const addMedication = () => {
    if (!newMedName.trim()) return;
    setMedications((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: newMedName.trim(),
        dose: newMedDose.trim() || "Standard dose",
        frequency: "Daily"
      }
    ]);
    setNewMedName("");
    setNewMedDose("");
  };

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const addCondition = () => {
    if (!newCondition.trim()) return;
    setConditions((prev) => [...prev, newCondition.trim()]);
    setNewCondition("");
  };

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    setAllergies((prev) => [...prev, newAllergy.trim()]);
    setNewAllergy("");
  };

  const addSupplement = () => {
    if (!newSupplement.trim()) return;
    setSupplements((prev) => [...prev, newSupplement.trim()]);
    setNewSupplement("");
  };

  const handleRunSafetyScreen = async () => {
    if (medications.length === 0 && supplements.length === 0) {
      toast.error("Please add at least one medication or supplement");
      return;
    }

    setIsScreening(true);
    setSafetyReport(null);

    try {
      const res = await fetch("/api/drug-safety-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medications,
          conditions,
          allergies,
          supplements
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Safety screen failed");
      }

      setSafetyReport(data.safetyReport);
      toast.success("Pharmacotherapy safety screening compiled!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error running drug safety screen";
      toast.error(msg);
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-purple-950 border border-rose-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-rose-500 text-white font-bold px-2.5 py-0.5 text-xs uppercase tracking-wider">
                Feature 4 • Pharmacy AI
              </Badge>
              <span className="text-xs text-rose-300 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> High-Precision Drug-Drug & Contraindication Matrix
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Drug Interaction & Contraindication Safety Matrix
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Exhaustive clinical pharmacotherapy screening comparing prescriptions, OTC medicines, herbal supplements, organ filtration status, and allergic cross-reactivity.
            </p>
          </div>

          <Button
            onClick={handleRunSafetyScreen}
            disabled={isScreening || (medications.length === 0 && supplements.length === 0)}
            className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs h-10 px-5 rounded-xl shadow-md flex items-center gap-2 shrink-0"
          >
            {isScreening ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Screening Interactions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Safety Screen</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preset Regimens Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
          High-Risk Regimen Scenarios:
        </span>
        {SAFETY_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleLoadPreset(p)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700 shrink-0 transition-all flex items-center gap-1.5"
          >
            <span className="truncate">{p.title.split("(")[0]}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                p.badge === "Contraindicated"
                  ? "bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300"
                  : "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
              }`}
            >
              {p.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Medication List & Inputs (Left 5) vs Safety Report (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Regimen Composition */}
        <div className="lg:col-span-5 space-y-4">
          {/* Medications Card */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-rose-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Medications ({medications.length})
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Meds List */}
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {medications.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.dose} • {m.frequency}</div>
                    </div>
                    <button
                      onClick={() => removeMedication(m.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Med Form */}
              <div className="flex items-center gap-2 pt-1">
                <Input
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="Drug name (e.g. Lisinopril)"
                  className="text-xs h-8 rounded-lg flex-1"
                />
                <Input
                  value={newMedDose}
                  onChange={(e) => setNewMedDose(e.target.value)}
                  placeholder="Dose (10mg)"
                  className="text-xs h-8 rounded-lg w-24"
                />
                <Button
                  size="sm"
                  onClick={addMedication}
                  className="h-8 px-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Supplements, Allergies & Diseases */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-500" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Comorbidities, Allergies & Supplements
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Supplements Chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Herbal Supplements / Vitamins
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {supplements.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1"
                    >
                      {s}
                      <button
                        onClick={() => setSupplements((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-purple-400 hover:text-rose-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={newSupplement}
                    onChange={(e) => setNewSupplement(e.target.value)}
                    placeholder="e.g. St. John's Wort, Ginkgo"
                    className="text-xs h-7 rounded-lg flex-1"
                    onKeyDown={(e) => e.key === "Enter" && addSupplement()}
                  />
                  <Button size="sm" onClick={addSupplement} className="h-7 px-2 text-xs">
                    Add
                  </Button>
                </div>
              </div>

              {/* Conditions Chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Active Medical Conditions
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {conditions.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                    >
                      {c}
                      <button
                        onClick={() => setConditions((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-blue-400 hover:text-rose-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="e.g. CKD, Atrial Fibrillation"
                    className="text-xs h-7 rounded-lg flex-1"
                    onKeyDown={(e) => e.key === "Enter" && addCondition()}
                  />
                  <Button size="sm" onClick={addCondition} className="h-7 px-2 text-xs">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interaction Report Output */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[500px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-rose-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Pharmacotherapy Interaction Matrix & Pearls
                  </CardTitle>
                </div>
                {safetyReport && (
                  <Badge className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px]">
                    Screen Complete
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col">
              {isScreening ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500 animate-pulse flex items-center justify-center text-rose-600">
                      <Pill className="w-7 h-7 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Evaluating CYP450 Pathways & Pharmacodynamics
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md">
                      Cross-referencing FDA safety warnings, QT prolongation, nephrotoxicity, and serotonergic cascade risks...
                    </p>
                  </div>
                </div>
              ) : safetyReport ? (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto max-h-[480px] pr-2">
                    <ReactMarkdown>{safetyReport}</ReactMarkdown>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Ready for clinical pharmacist or physician review.</span>
                    </div>

                    {onConsultSpecialist && (
                      <Button
                        size="sm"
                        onClick={() => onConsultSpecialist("Internal Medicine", `Drug matrix screen: ${medications.map(m => m.name).join(", ")}`)}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs h-8 px-4 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Discuss with Clinical Specialist</span>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <Pill className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      No Pharmacotherapy Screen Executed
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Select one of the high-risk presets above or add your active prescription drugs and supplements, then click &quot;Execute Safety Screen&quot;.
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
