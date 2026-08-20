import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, ShieldCheck, 
  ArrowRight, Users, HeartPulse, Layers, Mic,
  MousePointer2, MousePointerClick
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
  const [isInteractive, setIsInteractive] = useState(false);

  const hotSymptoms = [
    "Chest pressure & shortness of breath",
    "High fever (>39°C) with productive cough",
    "Sudden throbbing migraine & visual aura",
    "Severe right lower abdominal pain",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-background pt-14 pb-16 transition-colors group border-b border-slate-200/80 dark:border-slate-800">
      {/* Spline 3D DNA Background */}
      <div className={`absolute inset-0 z-0 ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none'} opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700`}>
        <iframe 
          src="https://app.spline.design/file/4c0253e6-2528-4e34-b983-358c4f0b267a?view=preview" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          title="DNA Particles Spline 3D"
        />
      </div>

      {/* Interactivity Toggle Control */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsInteractive(!isInteractive)}
          className="shadow-md bg-white/60 hover:bg-white/90 dark:bg-slate-800/60 dark:hover:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-xs transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          {isInteractive ? (
            <>
              <MousePointer2 className="w-3.5 h-3.5 mr-1.5" />
              Disable 3D Interaction
            </>
          ) : (
            <>
              <MousePointerClick className="w-3.5 h-3.5 mr-1.5" />
              Enable 3D Interaction
            </>
          )}
        </Button>
      </div>

      {/* Top Gradient (Open SaaS Style) */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#60a5fa] to-[#818cf8] dark:from-[#3b82f6] dark:to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="relative z-10 md:p-10 lg:p-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Hero Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center pointer-events-auto"
          >
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-full text-xs font-medium text-blue-800 dark:text-blue-300 backdrop-blur-sm shadow-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Next-Gen Multi-Agent Medical Advisory</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Evidence-Based AI Triage &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 italic block sm:inline mt-2 sm:mt-0">
                17 Clinical Specialists
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Describe your symptoms with voice dictation or structured questionnaires. Our clinical intelligence agent provides instant urgency stratification, red-flag screening, and specialty referrals.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={onStartConsultation}
                className="w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 h-12"
              >
                <span>Start AI Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onExploreAgents}
                className="w-full sm:w-auto rounded-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-6 h-12 flex items-center justify-center gap-2 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
              >
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Browse Specialists</span>
              </Button>
            </div>

            {/* Quick Symptom Triggers (Centered) */}
            <div className="mt-8 flex flex-col items-center justify-center">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Common symptom inquiries</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {hotSymptoms.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQuickSymptom(s)}
                    className="text-xs px-4 py-2 bg-white/60 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 rounded-full font-medium transition-all shadow-sm backdrop-blur-sm"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom App Screenshot / Telemetry Board (Open SaaS Style) */}
          <div className="mt-16 flow-root sm:mt-20 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center rounded-2xl lg:-m-4 lg:p-4 bg-slate-900/5 dark:bg-white/5 ring-1 ring-inset ring-slate-900/10 dark:ring-white/10"
            >
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl overflow-hidden p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl ring-1 ring-blue-100 dark:ring-blue-800">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Clinical Triage Engine</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Gemini 3.5 Diagnostic Matrix</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse inline-block" />
                    Real-time Active
                  </Badge>
                </div>
                
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">17</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Specialist Agents</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cardiology, Neuro, Derm</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">&lt; 1.2s</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Stratification</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rapid Emergency Flagging</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">NEWS2</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Vital Scoring</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Continuous Monitoring</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-1">Speech</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Voice AI</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hands-Free Input</div>
                  </div>
                </div>
                
                {/* Trust & Compliance Pill */}
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-blue-900 dark:text-blue-200 font-medium mt-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>
                    Built in compliance with international emergency triage & clinical referral protocols.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient (Open SaaS Style) */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#60a5fa] to-[#818cf8] dark:from-[#3b82f6] dark:to-[#4f46e5] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

