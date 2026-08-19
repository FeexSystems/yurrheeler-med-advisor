import React, { useState, useMemo } from "react";
import { 
  Activity, Thermometer, Heart, Wind, Droplets, 
  ShieldAlert, Send, Sparkles, CheckCircle2, AlertTriangle, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BiomarkersSimulatorProps {
  onApplyVitals: (vitals: {
    temperature: number;
    heartRate: number;
    systolic: number;
    diastolic: number;
    oxygenSat: number;
    respiratoryRate: number;
    glucose: number;
  }) => void;
}

export const BiomarkersSimulator: React.FC<BiomarkersSimulatorProps> = ({ onApplyVitals }) => {
  const [temperature, setTemperature] = useState<number>(37.0);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [oxygenSat, setOxygenSat] = useState<number>(98);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(16);
  const [glucose, setGlucose] = useState<number>(95);

  // NEWS2 calculation score algorithm
  const news2Score = useMemo(() => {
    let score = 0;

    // Respiration rate
    if (respiratoryRate <= 8 || respiratoryRate >= 25) score += 3;
    else if (respiratoryRate >= 21) score += 2;
    else if (respiratoryRate <= 11) score += 1;

    // Oxygen saturation SpO2
    if (oxygenSat <= 91) score += 3;
    else if (oxygenSat <= 93) score += 2;
    else if (oxygenSat <= 95) score += 1;

    // Systolic BP
    if (systolic <= 90 || systolic >= 220) score += 3;
    else if (systolic <= 100) score += 2;
    else if (systolic <= 110) score += 1;

    // Heart Rate
    if (heartRate <= 40 || heartRate >= 131) score += 3;
    else if (heartRate >= 111) score += 2;
    else if (heartRate <= 50 || heartRate >= 91) score += 1;

    // Temperature
    if (temperature <= 35.0) score += 3;
    else if (temperature >= 39.1) score += 2;
    else if (temperature <= 36.0 || temperature >= 38.1) score += 1;

    return score;
  }, [temperature, heartRate, systolic, oxygenSat, respiratoryRate]);

  const riskLevel = useMemo(() => {
    if (news2Score >= 7) {
      return {
        label: "High Clinical Risk (Critical Emergency)",
        color: "bg-red-600 text-white border-red-700",
        badge: "Emergency Triage",
        icon: AlertCircle,
        recommendation:
          "Immediate emergency clinical evaluation and senior medical review required. Call emergency medical response (911/999/112).",
      };
    } else if (news2Score >= 5) {
      return {
        label: "Medium Clinical Risk (Urgent Care)",
        color: "bg-amber-500 text-white border-amber-600",
        badge: "Urgent Review",
        icon: AlertTriangle,
        recommendation:
          "Urgent clinical assessment warranted by acute medical team or urgent care physician within 1 hour.",
      };
    } else if (news2Score >= 1) {
      return {
        label: "Low-Medium Clinical Risk (Ward Level Monitoring)",
        color: "bg-blue-600 text-white border-blue-700",
        badge: "Moderate Review",
        icon: Activity,
        recommendation:
          "Routine clinical monitoring. Observe vital progression every 4-6 hours.",
      };
    } else {
      return {
        label: "Low Clinical Risk (Normal Physiologic Parameters)",
        color: "bg-emerald-600 text-white border-emerald-700",
        badge: "Stable Vitals",
        icon: CheckCircle2,
        recommendation:
          "Patient vitals are currently within stable physiologic reference ranges.",
      };
    }
  }, [news2Score]);

  // Preset Clinical Archetypes
  const applyPreset = (preset: "normal" | "fever" | "hypertensive" | "hypoxia") => {
    switch (preset) {
      case "normal":
        setTemperature(37.0);
        setHeartRate(72);
        setSystolic(120);
        setDiastolic(80);
        setOxygenSat(98);
        setRespiratoryRate(16);
        setGlucose(95);
        break;
      case "fever":
        setTemperature(39.4);
        setHeartRate(118);
        setSystolic(110);
        setDiastolic(70);
        setOxygenSat(96);
        setRespiratoryRate(24);
        setGlucose(115);
        break;
      case "hypertensive":
        setTemperature(36.8);
        setHeartRate(95);
        setSystolic(195);
        setDiastolic(115);
        setOxygenSat(97);
        setRespiratoryRate(18);
        setGlucose(130);
        break;
      case "hypoxia":
        setTemperature(38.2);
        setHeartRate(124);
        setSystolic(95);
        setDiastolic(60);
        setOxygenSat(88);
        setRespiratoryRate(28);
        setGlucose(140);
        break;
    }
  };

  const handleSendToChat = () => {
    onApplyVitals({
      temperature,
      heartRate,
      systolic,
      diastolic,
      oxygenSat,
      respiratoryRate,
      glucose,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Biomarkers & Vital Signs Simulator (NEWS2)
            </h2>
            <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              Algorithmic Triage
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Simulate patient physiologic vital signs to compute real-time National Early Warning Score (NEWS2) clinical risk tiers and transfer vitals into the AI triage consultation.
          </p>
        </div>

        {/* Presets Button Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Presets:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset("normal")}
            className="text-xs h-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            Normal Adult
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset("fever")}
            className="text-xs h-8 rounded-lg border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30"
          >
            Severe Sepsis / Fever
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset("hypertensive")}
            className="text-xs h-8 rounded-lg border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
          >
            Hypertensive Crisis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset("hypoxia")}
            className="text-xs h-8 rounded-lg border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30"
          >
            Acute Hypoxia
          </Button>
        </div>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Configuration Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-6">
            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Body Temperature
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">{temperature.toFixed(1)} °C</span>
              </div>
              <Slider
                value={[temperature]}
                min={34.0}
                max={41.5}
                step={0.1}
                onValueChange={(val) => setTemperature(val[0])}
                className="py-1"
                aria-label="Body Temperature in Celsius"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Hypothermia (&lt;35.0)</span>
                <span>Normal (36.5 - 37.5)</span>
                <span>Hyperpyrexia (&gt;39.5)</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Heart Rate (Pulse)
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">{heartRate} bpm</span>
              </div>
              <Slider
                value={[heartRate]}
                min={35}
                max={190}
                step={1}
                onValueChange={(val) => setHeartRate(val[0])}
                className="py-1"
                aria-label="Heart Rate in beats per minute"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Bradycardia (&lt;50)</span>
                <span>Resting (60 - 90)</span>
                <span>Tachycardia (&gt;110)</span>
              </div>
            </div>

            {/* Blood Pressure Systolic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  Blood Pressure (Systolic / Diastolic)
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                  {systolic} / {diastolic} mmHg
                </span>
              </div>
              <div className="space-y-3 pt-1">
                <Slider
                  value={[systolic]}
                  min={65}
                  max={230}
                  step={1}
                  onValueChange={(val) => setSystolic(val[0])}
                  aria-label="Systolic Blood Pressure"
                />
                <Slider
                  value={[diastolic]}
                  min={40}
                  max={130}
                  step={1}
                  onValueChange={(val) => setDiastolic(val[0])}
                  aria-label="Diastolic Blood Pressure"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Hypotension (&lt;90)</span>
                <span>Optimal (120/80)</span>
                <span>Crisis (&gt;180/120)</span>
              </div>
            </div>

            {/* Oxygen SpO2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-500" />
                  Oxygen Saturation (SpO2)
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">{oxygenSat} %</span>
              </div>
              <Slider
                value={[oxygenSat]}
                min={70}
                max={100}
                step={1}
                onValueChange={(val) => setOxygenSat(val[0])}
                aria-label="Oxygen Saturation Percentage"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Critical Hypoxia (&lt;90%)</span>
                <span>Borderline (92-95%)</span>
                <span>Normal (96-100%)</span>
              </div>
            </div>

            {/* Respiratory Rate & Glucose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Respiration Rate</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{respiratoryRate} /min</span>
                </div>
                <Slider
                  value={[respiratoryRate]}
                  min={6}
                  max={45}
                  step={1}
                  onValueChange={(val) => setRespiratoryRate(val[0])}
                  aria-label="Respiratory Rate"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-amber-500" /> Blood Glucose
                  </span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{glucose} mg/dL</span>
                </div>
                <Slider
                  value={[glucose]}
                  min={40}
                  max={400}
                  step={1}
                  onValueChange={(val) => setGlucose(val[0])}
                  aria-label="Blood Glucose"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Real-time NEWS2 Clinical Risk Score Gauge & Apply Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">NEWS2 Risk Assessment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">National Early Warning Score</p>
              </div>
              <Badge className={riskLevel.color}>{riskLevel.badge}</Badge>
            </div>

            {/* Score Ring Display */}
            <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-white flex flex-col items-center justify-center shadow-md">
                <span className="text-3xl font-black font-mono leading-none">{news2Score}</span>
                <span className="text-[10px] uppercase font-bold text-blue-200 mt-1">Score</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-1">
                  {riskLevel.label}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {riskLevel.recommendation}
                </p>
              </div>
            </div>

            {/* Parameters Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Active Physiological Parameters:
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between">
                  <span>Temp:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{temperature.toFixed(1)} °C</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between">
                  <span>HR:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{heartRate} bpm</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between">
                  <span>BP:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{systolic}/{diastolic}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between">
                  <span>SpO2:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{oxygenSat} %</span>
                </div>
              </div>
            </div>

            {/* Action CTA: Apply to Triage Consultation */}
            <Button
              onClick={handleSendToChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Import Vitals into AI Triage Chat</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
