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
    category: "Emergency Medicine",
    title: "Severe Anaphylaxis & Airway Compromise",
    urgency: "CRITICAL 911",
    summary: "Immediate management of multi-system acute allergic reaction compromising airway or hemodynamics.",
    immediateActions: [
      "Inject Epinephrine (EpiPen) into anterolateral mid-thigh immediately.",
      "Call 911 and state anaphylaxis shock.",
      "Lay patient flat with legs elevated unless breathing is labored.",
      "Repeat second dose of Epinephrine in 5–15 minutes if symptoms persist.",
    ],
    diagnosticCriteria: [
      "Sudden airway stridor, throat tightness, or wheezing",
      "Rapidly spreading urticaria (hives) and facial/lip angioedema",
      "Hypotension with dizziness or collapse following allergen exposure",
    ],
  },
  {
    id: "sepsis-qsofa",
    category: "Internal Medicine",
    title: "Sepsis Quick SOFA (qSOFA) Clinical Risk Assessment",
    urgency: "URGENT CARE",
    summary: "Bedside screening tool to identify patients with suspected infection at high risk of in-hospital deterioration.",
    immediateActions: [
      "Transfer immediately to emergency facility for blood cultures and IV broad-spectrum antibiotics.",
      "Administer IV crystalloid fluid resuscitation if hypotensive.",
      "Monitor continuous lactate biomarkers and urine output.",
    ],
    diagnosticCriteria: [
      "Respiratory rate ≥ 22 breaths per minute",
      "Altered mentation (Glasgow Coma Scale < 15)",
      "Systolic blood pressure ≤ 100 mmHg",
    ],
  },
  {
    id: "pediatric-fever",
    category: "Pediatrics",
    title: "Pediatric Fever & Dehydration Triage (<3 Months to 5 Years)",
    urgency: "URGENT CARE",
    summary: "Stratification of pediatric febrile illnesses, fontanelle assessment, and hydration status.",
    immediateActions: [
      "Any infant under 3 months with rectal temperature ≥ 38.0°C (100.4°F) requires same-day emergency evaluation.",
      "Provide oral rehydration solution (ORS) in small, frequent sips.",
      "Administer weight-based acetaminophen or ibuprofen (if >6 months). Avoid aspirin.",
    ],
    diagnosticCriteria: [
      "Sunken fontanelle, dry mucous membranes, no wet diapers for >8 hours",
      "Lethargy, inconsolable crying, or petechial non-blanching rash",
      "Tachypnea or intercostal retractions during breathing",
    ],
  },
];

export const ClinicalProtocols: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CLINICAL_PROTOCOLS.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Clinical Triage Protocols & Emergency Decision Trees
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
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
            className="pl-9 text-xs h-10 rounded-xl"
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
              className="border border-slate-200 rounded-2xl bg-white px-5 shadow-xs overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full pr-4 text-left">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {protocol.title}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-semibold text-blue-700 bg-blue-50">
                        {protocol.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{protocol.summary}</p>
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

              <AccordionContent className="pt-2 pb-5 border-t border-slate-100 text-xs text-slate-700 space-y-4">
                {/* Immediate Actions */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Immediate Clinical & First Aid Actions:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                    {protocol.immediateActions.map((act, i) => (
                      <li key={i} className="leading-relaxed font-medium">
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Diagnostic Criteria */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-slate-600" />
                    <span>Clinical Diagnostic Presentation:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
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
