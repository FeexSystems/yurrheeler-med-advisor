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
    id: "lungs",
    name: "Lungs & Respiratory",
    agentId: "pulmono",
    icon: Wind,
    color: "from-sky-500 to-blue-600",
    commonSymptoms: [
      "Persistent dry or productive cough",
      "Wheezing or audible stridor",
      "Chest tightness during deep inspiration",
      "Sleep apnea or daytime excessive sleepiness",
    ],
    redFlags: [
      "Hemoptysis (coughing up bright red blood)",
      "Severe resting dyspnea with cyanosis (blue lips)",
      "Oxygen saturation SpO2 dropping below 92%",
    ],
    description: "Specialized in pulmonary function, asthma, COPD, pneumonia, sleep disorders, and gas exchange.",
  },
  {
    id: "abdomen",
    name: "Abdomen & Digestive System",
    agentId: "gastro",
    icon: Activity,
    color: "from-amber-500 to-orange-600",
    commonSymptoms: [
      "Epigastric burning or acid reflux (GERD)",
      "Cramping abdominal pain or bloating",
      "Altered bowel habits (diarrhea or constipation)",
      "Nausea, vomiting, or appetite changes",
    ],
    redFlags: [
      "Severe acute right lower quadrant pain (appendicitis)",
      "Melena (black tarry stools) or hematemesis (vomiting blood)",
      "Involuntary abdominal rigidity or rebound tenderness",
    ],
    description: "Analyzes gastrointestinal motility, liver enzymes, inflammatory bowel disease, and digestive disorders.",
  },
  {
    id: "joints",
    name: "Bones, Spine & Joints",
    agentId: "orthop",
    icon: Layers,
    color: "from-emerald-500 to-teal-600",
    commonSymptoms: [
      "Joint stiffness, swelling, or reduced range of motion",
      "Lower back pain radiating into buttocks or leg",
      "Localized pain following acute trauma or twist",
      "Crackling sensations (crepitus) in knees or shoulders",
    ],
    redFlags: [
      "Visible bone deformity or open fracture",
      "Loss of bowel or bladder control (cauda equina syndrome)",
      "Rapidly hot, erythematous, swollen joint with fever (septic arthritis)",
    ],
    description: "Covers musculoskeletal trauma, arthritis, spinal discs, ligaments, fractures, and rehabilitation.",
  },
  {
    id: "skin",
    name: "Skin & Integumentary",
    agentId: "derma",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    commonSymptoms: [
      "Pruritic (itchy) rash or hives (urticaria)",
      "Dry, flaking, or eczematous plaques",
      "Unusual or evolving skin moles",
      "Acne breakouts, cysts, or localized redness",
    ],
    redFlags: [
      "ABCDE mole changes (Asymmetry, Border, Color, Diameter, Evolution)",
      "Rapidly spreading cellulitis with systemic fever",
      "Widespread painful blistering or mucosal ulcerations",
    ],
    description: "Focuses on dermatologic pathology, melanoma screening, psoriasis, allergic eczema, and wound healing.",
  },
];

interface AnatomyMapperProps {
  onConsultAgent: (agent: Agent, promptSymptom?: string) => void;
}

export const AnatomyMapper: React.FC<AnatomyMapperProps> = ({ onConsultAgent }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("chest");

  const currentRegion = BODY_REGIONS.find((r) => r.id === selectedRegionId) || BODY_REGIONS[0];
  const assignedAgent = getAgentById(currentRegion.agentId) || agents[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Interactive Anatomical Symptom Mapper
          </h2>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Select an anatomical body zone to explore clinical symptom patterns, warning indicators, and launch an AI consultation with the designated specialist doctor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Body Region Selector Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Anatomical Zone:
            </div>

            {BODY_REGIONS.map((region) => {
              const Icon = region.icon;
              const isSelected = region.id === selectedRegionId;
              const regionAgent = getAgentById(region.agentId);

              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${region.color} text-white flex items-center justify-center shadow-xs flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{region.name}</div>
                      <div className="text-xs text-blue-600 font-medium">
                        Specialist: {regionAgent?.name} ({regionAgent?.specialty})
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-blue-600 translate-x-1" : "text-slate-400"
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
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
                <CardHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentRegion.color} text-white flex items-center justify-center shadow-md`}
                      >
                        <currentRegion.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900">
                          {currentRegion.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-600 mt-0.5">
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
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      Characteristic Symptoms for this Zone:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentRegion.commonSymptoms.map((sym, idx) => (
                        <button
                          key={idx}
                          onClick={() => onConsultAgent(assignedAgent, sym)}
                          className="p-2.5 bg-slate-50 hover:bg-blue-50/80 text-left rounded-xl border border-slate-200/90 text-xs text-slate-700 hover:text-blue-700 transition-all font-medium flex items-center justify-between group"
                        >
                          <span>{sym}</span>
                          <Sparkles className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Red Flag Warning Box */}
                  <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-900">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Critical Red Flag Symptoms (Seek Immediate Emergency Care):</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                      {currentRegion.redFlags.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed font-medium">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Attending Specialist Banner */}
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={assignedAgent.avatar_url}
                        alt={assignedAgent.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-blue-400"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{assignedAgent.name}</div>
                        <div className="text-xs text-blue-600 font-semibold">{assignedAgent.specialty} Specialist</div>
                        <div className="text-[11px] text-slate-500">Ready for instant AI triage session</div>
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
