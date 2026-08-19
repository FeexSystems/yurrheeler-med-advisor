import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Brain, Wind, Activity, Layers, 
  ShieldAlert, ArrowRight, UserCheck, Sparkles, type LucideIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agent, getAgentById, agents } from "@/lib/agents";

interface BodyRegion {
  id: string;
  name: string;
  agentId: string;
  icon: LucideIcon;
  color: string;
  commonSymptoms: string[];
  redFlags: string[];
  description: string;
}

const BODY_REGIONS: BodyRegion[] = [
  {
    id: "chest",
    name: "Chest & Heart",
    agentId: "cardia",
    icon: Heart,
    color: "from-red-500 to-rose-600",
    commonSymptoms: [
      "Retrosternal chest tightness / pressure",
      "Palpitations or irregular heart rhythm",
      "Shortness of breath on mild exertion",
      "Dizziness or lightheadedness upon standing",
    ],
    redFlags: [
      "Crushing pain radiating to jaw, neck, or left arm",
      "Sudden diaphoresis (cold sweats) with nausea",
      "Syncope (fainting) during physical activity",
    ],
    description: "Evaluates myocardial perfusion, coronary artery syndromes, arrhythmias, and hypertension.",
  },
  {
    id: "head",
    name: "Head & Nervous System",
    agentId: "neura",
    icon: Brain,
    color: "from-indigo-500 to-purple-600",
    commonSymptoms: [
      "Pulsating unilateral or tension headache",
      "Visual aura, floaters, or light sensitivity",
      "Tingling, paresthesia, or localized numbness",
      "Tremors, muscle twitching, or balance difficulty",
    ],
    redFlags: [
      "Sudden explosive 'thunderclap' headache",
      "Facial drooping or unilateral arm weakness (FAST)",
      "Sudden slurred speech or confusion",
    ],
    description: "Assesses cerebrovascular health, migraines, cranial nerves, seizures, and neuropathic disorders.",
  },
  {
    id: "respiratory",
    name: "Lungs & Respiratory Tract",
    agentId: "pulmo",
    icon: Wind,
    color: "from-sky-500 to-blue-600",
    commonSymptoms: [
      "Persistent productive or dry cough",
      "Wheezing or inspiratory stridor",
      "Chest tightness during deep inhalation",
      "Post-viral airway reactivity",
    ],
    redFlags: [
      "Severe dyspnea at rest / inability to speak full sentences",
      "Hemoptysis (coughing up bright red blood)",
      "Cyanosis (bluish tint around lips or fingernails)",
    ],
    description: "Assesses asthma exacerbations, bronchitis, COPD, pneumonia, and oxygen saturation deficits.",
  },
  {
    id: "abdomen",
    name: "Abdomen & Digestive System",
    agentId: "gastro",
    icon: Activity,
    color: "from-amber-500 to-orange-600",
    commonSymptoms: [
      "Epigastric burning / acid reflux",
      "Right lower quadrant tenderness",
      "Bloating, cramping, and irregular bowel habits",
      "Postprandial nausea or dyspepsia",
    ],
    redFlags: [
      "Rigid board-like abdomen with severe rebound tenderness",
      "Hematemesis (coffee-ground vomit) or melena (black tarry stool)",
      "Jaundice (yellowing of skin or eyes) with fever",
    ],
    description: "Evaluates appendicitis, gallstones, gastroesophageal reflux, peptic ulcers, and bowel inflammation.",
  },
  {
    id: "joints",
    name: "Musculoskeletal & Joints",
    agentId: "ortho",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    commonSymptoms: [
      "Joint swelling, stiffness, or reduced range of motion",
      "Acute ligament strain after physical trauma",
      "Localized bone tenderness or deformity",
      "Morning joint stiffness >30 minutes",
    ],
    redFlags: [
      "Inability to bear weight on injured limb with rapid hematoma",
      "Open compound fracture or gross anatomical deformity",
      "Hot, acutely swollen joint with high systemic fever (septic arthritis)",
    ],
    description: "Assesses fractures, ligament sprains, osteoarthritis, bursitis, and spinal biomechanics.",
  },
  {
    id: "skin",
    name: "Skin, Hair & Integumentary",
    agentId: "derma",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    commonSymptoms: [
      "Erythematous itchy rash or urticaria",
      "New or evolving asymmetrical pigmented mole",
      "Flaking, scaling eczema plaques",
      "Localized acneiform lesions or pustules",
    ],
    redFlags: [
      "Rapidly spreading erythema with skin necrosis or bullae",
      "Facial edema / tongue swelling with rash (anaphylaxis)",
      "ABCDE melanoma red flags (Asymmetry, Border irregularity, Color variegation, Diameter >6mm, Evolution)",
    ],
    description: "Screens for malignant melanoma, atopic dermatitis, cellulitis, shingles, and allergic reactions.",
  },
];

interface AnatomyMapperProps {
  onConsultAgent: (agent: Agent, symptom?: string) => void;
}

export const AnatomyMapper: React.FC<AnatomyMapperProps> = ({ onConsultAgent }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("chest");

  const currentRegion =
    BODY_REGIONS.find((r) => r.id === selectedRegionId) || BODY_REGIONS[0];

  const assignedAgent = getAgentById(currentRegion.agentId) || agents[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Interactive Anatomical Triage & Symptom Mapper
          </h2>
          <Badge className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-xs">
            Zone Diagnostics
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Select an anatomical body region to explore common clinical symptom presentations, identify emergency red flag signs, and connect immediately to the corresponding medical specialist.
        </p>
      </div>

      {/* Main Grid: Body Zones List vs Detailed Zone Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Body Regions Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Anatomical Body Zones:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {BODY_REGIONS.map((region) => {
              const isSelected = region.id === selectedRegionId;
              const Icon = region.icon;
              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${region.color} text-white flex items-center justify-center shadow-xs flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {region.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {getAgentById(region.agentId)?.specialty} Specialist
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-blue-600 dark:text-blue-400 translate-x-1" : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Clinical Zone Diagnostic Card (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRegion.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
                <CardHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentRegion.color} text-white flex items-center justify-center shadow-md`}
                      >
                        <currentRegion.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                          {currentRegion.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {currentRegion.description}
                        </CardDescription>
                      </div>
                    </div>

                    <Badge className="bg-blue-600 text-white font-semibold text-xs py-1">
                      {assignedAgent.specialty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {/* Common Clinical Symptoms */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Characteristic Symptoms for this Zone:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentRegion.commonSymptoms.map((sym, idx) => (
                        <button
                          key={idx}
                          onClick={() => onConsultAgent(assignedAgent, sym)}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/80 dark:hover:bg-slate-700 text-left rounded-xl border border-slate-200/90 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all font-medium flex items-center justify-between group"
                        >
                          <span>{sym}</span>
                          <Sparkles className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Red Flag Warning Box */}
                  <div className="p-4 bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-300">
                      <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Critical Red Flag Symptoms (Seek Immediate Emergency Care):</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-1">
                      {currentRegion.redFlags.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed font-medium">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Attending Specialist Banner */}
                  <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={assignedAgent.avatar_url}
                        alt={assignedAgent.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-blue-400"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{assignedAgent.name}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{assignedAgent.specialty} Specialist</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Ready for instant AI triage session</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => onConsultAgent(assignedAgent)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-10 rounded-xl shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Start Triage</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
