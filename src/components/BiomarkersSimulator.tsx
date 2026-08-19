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
        advice: "Score ≥ 7 indicates severe physiological instability. Immediate emergency medical response required.",
      };
    }
    if (news2Score >= 5) {
      return {
        label: "Medium Clinical Risk (Urgent Care)",
        color: "bg-amber-500 text-white border-amber-600",
        badge: "Urgent Medical Review",
        icon: AlertTriangle,
        advice: "Score 5–6 reflects medium acute risk. Urgent physician review within 1 hour recommended.",
      };
    }
    return {
      label: "Low Clinical Risk (Stable)",
      color: "bg-emerald-600 text-white border-emerald-700",
      badge: "Normal / Baseline",
      icon: CheckCircle2,
      advice: "Score 0–4 indicates normal or mild physiological variation. Routine ward or home monitoring.",
    };
  }, [news2Score]);

  const handleApply = () => {
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

  const handlePreset = (preset: "normal" | "fever" | "hypertensive" | "sepsis") => {
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
        setHeartRate(112);
        setSystolic(128);
        setDiastolic(82);
        setOxygenSat(96);
        setRespiratoryRate(22);
        setGlucose(110);
        break;
      case "hypertensive":
        setTemperature(36.8);
        setHeartRate(94);
        setSystolic(185);
        setDiastolic(115);
        setOxygenSat(97);
        setRespiratoryRate(18);
        setGlucose(135);
        break;
      case "sepsis":
        setTemperature(39.8);
        setHeartRate(132);
        setSystolic(85);
        setDiastolic(50);
        setOxygenSat(89);
        setRespiratoryRate(28);
        setGlucose(165);
        break;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Clinical Vitals & Biomarker Diagnostic Simulator
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Adjust interactive physiological sliders to compute the National Early Warning Score (NEWS2) and evaluate clinical risk.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
          <button
            onClick={() => handlePreset("normal")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-semibold text-slate-700 transition-colors"
          >
            Baseline Normal
          </button>
          <button
            onClick={() => handlePreset("fever")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 rounded-lg font-semibold text-slate-700 transition-colors"
          >
            Acute Fever
          </button>
          <button
            onClick={() => handlePreset("hypertensive")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-lg font-semibold text-slate-700 transition-colors"
          >
            Hypertensive Crisis
          </button>
          <button
            onClick={() => handlePreset("sepsis")}
            className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 rounded-lg font-semibold text-slate-700 transition-colors"
          >
            Sepsis Red Flag
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Control Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-sm bg-white p-6 rounded-2xl space-y-6">
            {/* Body Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Body Temperature
                </span>
                <span className="font-mono font-bold text-blue-600 text-base">{temperature.toFixed(1)} °C</span>
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
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Hypothermia (&lt;35.0)</span>
                <span>Normal (36.5 - 37.5)</span>
                <span>Hyperpyrexia (&gt;39.5)</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Heart Rate (Pulse)
                </span>
                <span className="font-mono font-bold text-blue-600 text-base">{heartRate} bpm</span>
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
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Bradycardia (&lt;50)</span>
                <span>Resting (60 - 90)</span>
                <span>Tachycardia (&gt;110)</span>
              </div>
            </div>

            {/* Blood Pressure Systolic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  Blood Pressure (Systolic / Diastolic)
                </span>
                <span className="font-mono font-bold text-blue-600 text-base">
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
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Hypotension (&lt;90)</span>
                <span>Optimal (120/80)</span>
                <span>Crisis (&gt;180/120)</span>
              </div>
            </div>

            {/* Oxygen SpO2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-500" />
                  Oxygen Saturation (SpO2)
                </span>
                <span className="font-mono font-bold text-blue-600 text-base">{oxygenSat} %</span>
              </div>
              <Slider
                value={[oxygenSat]}
                min={70}
                max={100}
                step={1}
                onValueChange={(val) => setOxygenSat(val[0])}
                aria-label="Oxygen Saturation Percentage"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Critical Hypoxia (&lt;90%)</span>
                <span>Borderline (92-95%)</span>
                <span>Normal (96-100%)</span>
              </div>
            </div>

            {/* Respiratory Rate & Glucose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Respiration Rate</span>
                  <span className="font-mono font-bold text-blue-600">{respiratoryRate} /min</span>
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
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-amber-500" /> Blood Glucose
                  </span>
                  <span className="font-mono font-bold text-blue-600">{glucose} mg/dL</span>
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
          <Card className="border-slate-200 shadow-sm bg-white p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">NEWS2 Risk Assessment</h3>
                <p className="text-xs text-slate-500">National Early Warning Score</p>
              </div>
              <Badge className={riskLevel.color}>{riskLevel.badge}</Badge>
            </div>

            {/* Score Display Circle */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-2">
              <div className="text-5xl font-black text-slate-900 tracking-tight">
                {news2Score}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Score Index (0–20 Scale)
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-2">
                {riskLevel.label}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                {riskLevel.advice}
              </p>
            </div>

            {/* Vital Signs Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Simulated Patient Parameters:
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Temperature</span>
                  <span className="font-bold text-slate-900">{temperature.toFixed(1)}°C</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <span className="font-bold text-slate-900">{heartRate} bpm</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                  <span className="font-bold text-slate-900">{systolic}/{diastolic} mmHg</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Oxygen SpO2</span>
                  <span className="font-bold text-slate-900">{oxygenSat}%</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={handleApply}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Transfer Biomarkers to AI Triage Consultation</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
