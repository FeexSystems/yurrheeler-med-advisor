import React, { useState } from "react";
import { 
  BookOpen, ShieldAlert, Heart, Brain, Wind, 
  Search, CheckCircle2, ChevronRight, AlertCircle, PhoneCall 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProtocolItem {
  id: string;
  category: string;
  title: string;
  urgency: "CRITICAL 911" | "URGENT CARE" | "ROUTINE CLINICAL";
  summary: string;
  immediateActions: string[];
  diagnosticCriteria: string[];
}

const CLINICAL_PROTOCOLS: ProtocolItem[] = [
  {
    id: "chest-pain-ami",
    category: "Cardiovascular",
    title: "Acute Coronary Syndrome & Myocardial Infarction Triage",
    urgency: "CRITICAL 911",
    summary: "Immediate assessment protocol for suspected cardiac ischemia or acute myocardial infarction.",
    immediateActions: [
      "Dial 911 immediately; do not drive oneself to the hospital.",
      "Rest in a semi-recumbent position to minimize myocardial oxygen demand.",
      "Administer 325 mg non-enteric chewable aspirin if no allergy or active bleeding.",
      "Keep AED (Automated External Defibrillator) accessible if available on site.",
    ],
    diagnosticCriteria: [
      "Retrosternal pressure/crushing sensation lasting > 15 minutes",
      "Radiation to left shoulder, arm, neck, or lower jaw",
      "Associated diaphoresis (cold sweats), nausea, and dyspnea",
    ],
  },
  {
    id: "stroke-fast",
    category: "Neurology",
    title: "Acute Ischemic Stroke (FAST Protocol)",
    urgency: "CRITICAL 911",
    summary: "Time-critical rapid screening framework for acute cerebrovascular infarction within the thrombolysis window (<4.5 hrs).",
    immediateActions: [
      "Call emergency services immediately and announce 'Suspected Stroke Code'.",
      "Note the EXACT time the patient was last seen normal/well.",
      "Do NOT administer food, water, or medication (aspiration risk).",
      "Position patient with head slightly elevated (30 degrees).",
    ],
    diagnosticCriteria: [
      "F - Face Drooping: One side of face is numb or droops when smiling",
      "A - Arm Weakness: One arm drifts downward when both are raised",
      "S - Speech Difficulty: Slurred words or unable to repeat simple sentences",
      "T - Time to Call 911: Immediate emergency neurovascular response",
    ],
  },
  {
    id: "anaphylaxis-protocol",
    category: "Immunology / Allergy",
    title: "Severe Anaphylactic Shock & Airway Compromise",
    urgency: "CRITICAL 911",
    summary: "Acute multi-system allergic reaction with impending respiratory failure or vascular collapse.",
    immediateActions: [
      "Administer Intramuscular Epinephrine auto-injector (EpiPen 0.3mg) into anterolateral mid-thigh immediately.",
      "Call 911 immediately and state 'Anaphylactic Emergency'.",
      "Lay patient flat with legs elevated unless vomiting or experiencing severe respiratory distress.",
      "Repeat epinephrine injection after 5–15 minutes if symptoms fail to improve.",
    ],
    diagnosticCriteria: [
      "Rapid onset hives/pruritus with lip/tongue edema (angioedema)",
      "Inspiratory stridor, wheezing, or tightness in throat",
      "Hypotension, lightheadedness, or sudden syncope",
    ],
  },
  {
    id: "sepsis-qsofa",
    category: "Infectious Disease",
    title: "Sepsis Quick SOFA (qSOFA) Severity Screening",
    urgency: "CRITICAL 911",
    summary: "Bedside score to rapidly identify patients with suspected infection at high risk of in-hospital deterioration.",
    immediateActions: [
      "Seek emergency hospital evaluation immediately for broad-spectrum IV antibiotics and fluid resuscitation.",
      "Measure core temperature, blood pressure, and pulse oximetry.",
      "Obtain blood cultures prior to antibiotic administration when possible in emergency care.",
    ],
    diagnosticCriteria: [
      "Respiratory Rate ≥ 22 breaths per minute",
      "Altered mental status (Glasgow Coma Scale < 15 or acute confusion)",
      "Systolic Blood Pressure ≤ 100 mmHg",
    ],
  },
  {
    id: "dka-hyperglycemia",
    category: "Endocrinology",
    title: "Diabetic Ketoacidosis (DKA) & Hyperglycemic Crisis",
    urgency: "URGENT CARE",
    summary: "Metabolic emergency characterized by uncontrolled hyperglycemia, metabolic acidosis, and ketonemia.",
    immediateActions: [
      "Check blood glucose immediately (typically >250 mg/dL).",
      "Check urine ketones using dipstick if available.",
      "Seek immediate urgent care or emergency department assessment for IV hydration and insulin protocol.",
    ],
    diagnosticCriteria: [
      "Deep, rapid breathing (Kussmaul respiration) with fruity acetone breath odor",
      "Polydipsia (extreme thirst), polyuria, and severe dehydration",
      "Nausea, persistent vomiting, and diffuse abdominal pain",
    ],
  },
  {
    id: "acute-asthma",
    category: "Pulmonology",
    title: "Acute Severe Bronchospasm & Asthma Exacerbation",
    urgency: "URGENT CARE",
    summary: "Escalation protocol for patients experiencing acute airflow obstruction unresponsive to initial rescue inhalers.",
    immediateActions: [
      "Administer 4 to 8 puffs of Albuterol / Salbutamol via spacer every 20 minutes for 1 hour.",
      "Maintain upright sitting position.",
      "If peak flow < 50% or patient unable to complete sentences in one breath, call 911.",
    ],
    diagnosticCriteria: [
      "Audible expiratory wheezing with intercostal retractions",
      "Inability to speak in full sentences without pausing for breath",
      "SpO2 dropping below 92% on room air",
    ],
  },
];

export const ClinicalProtocols: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CLINICAL_PROTOCOLS.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Triage Protocols & Emergency Decision Trees
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Evidence-based medical guidelines, red-flag checklists, and standardized emergency protocols.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search protocol (e.g. stroke, sepsis)..."
            className="pl-9 text-xs h-10 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Protocols Accordion List */}
      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="chest-pain-ami" className="space-y-3">
          {filtered.map((protocol) => (
            <AccordionItem
              key={protocol.id}
              value={protocol.id}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 px-5 shadow-xs overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full pr-4 text-left">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {protocol.title}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800">
                        {protocol.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{protocol.summary}</p>
                  </div>

                  <Badge
                    className={`text-[10px] uppercase font-bold py-0.5 whitespace-nowrap ${
                      protocol.urgency.includes("CRITICAL")
                        ? "bg-red-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {protocol.urgency}
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-4">
                {/* Immediate Actions */}
                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 space-y-2">
                  <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Immediate Clinical & First Aid Actions:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1">
                    {protocol.immediateActions.map((act, i) => (
                      <li key={i} className="leading-relaxed font-medium">
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Diagnostic Criteria */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>Clinical Diagnostic Presentation:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
                    {protocol.diagnosticCriteria.map((crit, i) => (
                      <li key={i} className="leading-relaxed">
                        {crit}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
