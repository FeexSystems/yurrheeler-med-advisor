import React, { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import { 
  Activity, Heart, Thermometer, Wind, Droplets, 
  TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, 
  Calendar, RefreshCw, Sparkles, Filter, FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Synthetic Clinical Telemetry Datasets
const TIMELINE_24H = [
  { time: "00:00", systolic: 118, diastolic: 78, hr: 68, spo2: 99, temp: 36.8, resp: 14, glucose: 92, news2: 0 },
  { time: "04:00", systolic: 115, diastolic: 76, hr: 64, spo2: 98, temp: 36.6, resp: 14, glucose: 88, news2: 0 },
  { time: "08:00", systolic: 124, diastolic: 82, hr: 78, spo2: 98, temp: 37.1, resp: 16, glucose: 110, news2: 1 },
  { time: "12:00", systolic: 138, diastolic: 88, hr: 88, spo2: 97, temp: 38.4, resp: 19, glucose: 125, news2: 3 },
  { time: "16:00", systolic: 142, diastolic: 92, hr: 96, spo2: 96, temp: 38.9, resp: 22, glucose: 140, news2: 5 },
  { time: "20:00", systolic: 130, diastolic: 84, hr: 82, spo2: 98, temp: 37.8, resp: 18, glucose: 115, news2: 2 },
  { time: "Now", systolic: 122, diastolic: 80, hr: 74, spo2: 99, temp: 37.2, resp: 16, glucose: 98, news2: 1 },
];

const TIMELINE_7D = [
  { time: "Mon", systolic: 120, diastolic: 80, hr: 72, spo2: 99, temp: 36.8, news2: 0, inflammatoryIndex: 12 },
  { time: "Tue", systolic: 122, diastolic: 82, hr: 74, spo2: 98, temp: 37.0, news2: 1, inflammatoryIndex: 15 },
  { time: "Wed", systolic: 135, diastolic: 86, hr: 86, spo2: 97, temp: 38.2, news2: 3, inflammatoryIndex: 45 },
  { time: "Thu", systolic: 144, diastolic: 94, hr: 102, spo2: 95, temp: 39.1, news2: 6, inflammatoryIndex: 78 },
  { time: "Fri", systolic: 132, diastolic: 88, hr: 88, spo2: 97, temp: 38.0, news2: 3, inflammatoryIndex: 50 },
  { time: "Sat", systolic: 124, diastolic: 82, hr: 76, spo2: 98, temp: 37.3, news2: 1, inflammatoryIndex: 28 },
  { time: "Sun", systolic: 121, diastolic: 80, hr: 72, spo2: 99, temp: 36.9, news2: 0, inflammatoryIndex: 14 },
];

const ORGAN_RISK_RADAR = [
  { system: "Cardiovascular", riskScore: 35, fullMark: 100 },
  { system: "Respiratory", riskScore: 28, fullMark: 100 },
  { system: "Neurological", riskScore: 15, fullMark: 100 },
  { system: "Renal & Vitals", riskScore: 42, fullMark: 100 },
  { system: "Gastrointestinal", riskScore: 20, fullMark: 100 },
  { system: "Metabolic / Glycemia", riskScore: 30, fullMark: 100 },
];

const BIOMARKER_BENCHMARKS = [
  { name: "NEWS2 Score", value: 2, normalMax: 4, unit: "pts", status: "Normal / Low Risk" },
  { name: "C-Reactive Protein (CRP)", value: 6.4, normalMax: 5.0, unit: "mg/L", status: "Mild Elevation" },
  { name: "White Blood Cells (WBC)", value: 7.8, normalMax: 11.0, unit: "x10^9/L", status: "Optimal" },
  { name: "Estimated GFR (eGFR)", value: 92, normalMax: 90, unit: "mL/min", status: "Optimal Renal" },
  { name: "HbA1c Glycemia", value: 5.4, normalMax: 5.7, unit: "%", status: "Normal" },
  { name: "Troponin I", value: 0.01, normalMax: 0.04, unit: "ng/mL", status: "Normal Myocardial" },
];

export const HealthMetricsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"24h" | "7d">("24h");
  const [patientProfile, setPatientProfile] = useState<string>("adult");

  const chartData = timeframe === "24h" ? TIMELINE_24H : TIMELINE_7D;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical Telemetry & Biomarker Trends
            </h2>
            <Badge className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-semibold py-0.5">
              Recharts Analytics
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Real-time multi-variable physiologic telemetry, vital sign stability trajectories, and organ risk radar.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTimeframe("24h")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeframe === "24h"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              24-Hour Telemetry
            </button>
            <button
              onClick={() => setTimeframe("7d")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeframe === "7d"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              7-Day Trend
            </button>
          </div>

          <Select value={patientProfile} onValueChange={setPatientProfile}>
            <SelectTrigger className="w-44 h-9 text-xs rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Patient Cohort" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs">
              <SelectItem value="adult">Standard Adult (35y)</SelectItem>
              <SelectItem value="cardiac">Cardiovascular Cohort</SelectItem>
              <SelectItem value="febrile">Acute Febrile Infection</SelectItem>
              <SelectItem value="postop">Post-Op Recovery Track</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm p-4.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Blood Pressure
            </span>
            <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px]">
              Optimal
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">122 / 80</span>
            <span className="text-xs text-slate-500">mmHg</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-8 mmHg from afternoon peak</span>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm p-4.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" />
              Heart Rate (Pulse)
            </span>
            <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px]">
              Resting
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">74</span>
            <span className="text-xs text-slate-500">bpm</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <span>Baseline range: 60 - 90 bpm</span>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm p-4.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-500" />
              Body Temperature
            </span>
            <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px]">
              Normothermic
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">37.2</span>
            <span className="text-xs text-slate-500">°C</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Resolved from 38.9°C fever spike</span>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm p-4.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-500" />
              Oxygen (SpO2)
            </span>
            <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px]">
              Saturated
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">99</span>
            <span className="text-xs text-slate-500">%</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <span>Airway oxygenation optimal</span>
          </div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Blood Pressure & Heart Rate Multi-Variable Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Blood Pressure & Heart Rate Continuous Telemetry
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Systolic (top), Diastolic (bottom), and Pulse progression over {timeframe === "24h" ? "24 hours" : "7 days"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Systolic
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span> Diastolic
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Heart Rate
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sysGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="time" className="text-xs font-mono text-slate-500" stroke="#94a3b8" />
                  <YAxis className="text-xs font-mono text-slate-500" stroke="#94a3b8" domain={[50, 160]} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="systolic"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#sysGradient)"
                    name="Systolic BP (mmHg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fill="none"
                    name="Diastolic BP (mmHg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="hr"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ fill: "#f43f5e", r: 3 }}
                    name="Heart Rate (bpm)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Temperature & Oxygen SpO2 Chart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Thermal Curve (°C)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Fever Index</span>
              </CardTitle>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" className="text-[10px] font-mono" />
                    <YAxis stroke="#94a3b8" domain={[36.0, 40.0]} className="text-[10px] font-mono" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ fill: "#f59e0b", r: 3 }}
                      name="Temperature (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-500" />
                  Oxygen Saturation SpO2 (%)
                </span>
                <span className="text-[11px] font-mono text-slate-400">Target &gt;95%</span>
              </CardTitle>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" className="text-[10px] font-mono" />
                    <YAxis stroke="#94a3b8" domain={[90, 100]} className="text-[10px] font-mono" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="spo2"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      fill="url(#spo2Grad)"
                      name="SpO2 (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* Organ Risk Radar & Biomarkers Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Organ Risk Radar Chart */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-5">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Organ System Vulnerability Radar
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Composite risk calculation across physiological body systems
            </CardDescription>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ORGAN_RISK_RADAR}>
                  <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="system" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="System Risk"
                    dataKey="riskScore"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Biomarkers Table & Status */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Laboratory Biomarker Status
              </span>
              <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px]">
                Valid Baseline
              </Badge>
            </div>

            <div className="space-y-2.5">
              {BIOMARKER_BENCHMARKS.map((bio, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100/70 dark:border-slate-800/60 last:border-0">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{bio.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Normal &lt; {bio.normalMax} {bio.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-slate-900 dark:text-white">
                      {bio.value} <span className="text-[10px] font-normal text-slate-400">{bio.unit}</span>
                    </div>
                    <span className={`text-[10px] font-medium ${
                      bio.status === "Mild Elevation"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {bio.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
