import React from "react";
import { motion } from "motion/react";
import {
  User,
  Heart,
  Activity,
  Pill,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClinicalStore } from "@/clinical/store";

export const PatientContextPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { user } = useAuth();
  const selectedRegion = useClinicalStore((state) => state.selectedRegion);

  const patientData = {
    name: user?.displayName || "Alex Morgan",
    age: 42,
    gender: "Male",
    primarySymptoms: ["Exertional tightness", "Mild fatigue"],
    vitals: {
      hr: "72 bpm",
      bp: "120/78 mmHg",
      spo2: "99%",
      temp: "36.8°C",
    },
    activeMedications: ["Atorvastatin 20mg", "Omega-3 1000mg"],
    allergies: ["Penicillin (Rash)"],
    recentEvents: ["Cardio workout logged 2h ago", "Sleep tracker: 7.6 hrs (22% REM)"],
  };

  if (compact) {
    return (
      <div className="p-3.5 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between text-xs transition-colors shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            {patientData.name.charAt(0)}
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold text-xs">{patientData.name}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {patientData.age}y • {patientData.gender} • HR {patientData.vitals.hr}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
          Sync Ready
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f131a] border border-slate-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-md dark:shadow-xl flex flex-col gap-5 transition-colors">
      {/* Patient Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-base shadow-inner">
            {patientData.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {patientData.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{patientData.age} Years</span>
              <span>•</span>
              <span>{patientData.gender}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Longitudinal Context</span>
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          ACTIVE PROFILE
        </span>
      </div>

      {/* Active Symptoms & Targeted Focus */}
      <div>
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          Current Clinical Context
        </h4>
        <div className="flex flex-wrap gap-2">
          {patientData.primarySymptoms.map((symptom, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 font-medium"
            >
              <AlertCircle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              {symptom}
            </span>
          ))}
          {selectedRegion && (
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs flex items-center gap-1.5 font-mono">
              <Activity className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              Target: {selectedRegion}
            </span>
          )}
        </div>
      </div>

      {/* Recent Telemetry Vitals Grid */}
      <div>
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          Synchronized Vitals
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400 block">HR</span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{patientData.vitals.hr}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400 block">BP</span>
            <span className="text-xs font-bold font-mono text-teal-600 dark:text-cyan-400">{patientData.vitals.bp}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400 block">SpO2</span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-teal-400">{patientData.vitals.spo2}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
            <span className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400 block">Temp</span>
            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">{patientData.vitals.temp}</span>
          </div>
        </div>
      </div>

      {/* Medications & Observations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5 font-semibold">
            <Pill className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Medications
          </span>
          <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            {patientData.activeMedications.map((m, idx) => (
              <div key={idx} className="truncate">• {m}</div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5 font-semibold">
            <Clock className="w-3 h-3 text-teal-600 dark:text-cyan-400" />
            Observations
          </span>
          <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            {patientData.recentEvents.map((e, idx) => (
              <div key={idx} className="truncate">• {e}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
