import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, ShieldCheck, 
  ArrowRight, Users, HeartPulse, Layers, Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onStartConsultation: () => void;
  onExploreAgents: () => void;
  onExploreAnatomy: () => void;
  onQuickSymptom: (symptom: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartConsultation,
  onExploreAgents,
  onExploreAnatomy,
  onQuickSymptom,
}) => {
  const hotSymptoms = [
    "Chest pressure & shortness of breath",
    "High fever (>39°C) with productive cough",
    "Sudden throbbing migraine & visual aura",
    "Severe right lower abdominal pain",
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/80 pt-8 pb-10">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTAs (7 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 border border-blue-200 rounded-full text-xs font-semibold text-blue-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Next-Gen Multi-Agent Medical Advisory & Triage</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Evidence-Based AI Medical Triage &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600">
                17 Clinical Specialists
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Describe your symptoms with voice dictation or structured questionnaires. Our clinical intelligence agent provides instant urgency stratification, red-flag screening, and specialty referrals.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="lg"
                onClick={onStartConsultation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md hover:shadow-lg transition-all flex items-center gap-2 h-12"
              >
                <span>Start AI Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onExploreAgents}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-5 h-12 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Browse 17 Specialists</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={onExploreAnatomy}
                className="text-slate-600 hover:text-blue-600 font-semibold px-4 h-12 flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Anatomy Mapper</span>
              </Button>
            </div>

            {/* Quick Symptom Triggers */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-blue-500" />
                <span>Common symptom inquiries:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotSymptoms.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQuickSymptom(s)}
                    className="text-xs px-3 py-1.5 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 border border-slate-200/90 rounded-full font-medium transition-all shadow-2xs text-left"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Clinical Telemetry Badge Board (5 columns) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900">Clinical Triage Engine</h2>
                    <p className="text-[11px] text-slate-500">Gemini 3.5 Diagnostic Matrix</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                  ● Real-time Active
                </Badge>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-extrabold text-blue-600">17</div>
                  <div className="text-xs font-semibold text-slate-800">Specialist Agents</div>
                  <div className="text-[10px] text-slate-500">Cardiology, Neuro, Derm, etc.</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-extrabold text-emerald-600">&lt; 1.2s</div>
                  <div className="text-xs font-semibold text-slate-800">Triage Stratification</div>
                  <div className="text-[10px] text-slate-500">Rapid Emergency Flagging</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-extrabold text-indigo-600">NEWS2</div>
                  <div className="text-xs font-semibold text-slate-800">Vital Risk Scoring</div>
                  <div className="text-[10px] text-slate-500">Continuous Clinical Scoring</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-extrabold text-teal-600">Speech-AI</div>
                  <div className="text-xs font-semibold text-slate-800">Voice Dictation</div>
                  <div className="text-[10px] text-slate-500">Hands-Free Accessibility</div>
                </div>
              </div>

              {/* Trust & Compliance Pill */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-2.5 text-xs text-blue-900 font-medium">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>
                  Built in compliance with international emergency triage & clinical referral protocols.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
