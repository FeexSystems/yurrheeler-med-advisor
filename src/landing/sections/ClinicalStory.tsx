import React from "react";
import { motion } from "motion/react";
import ScrollRevealImage from "@/components/ui/scroll-reveal-image";
import { MessageSquare, Database, Sparkles, Activity, FileText, CheckCircle2 } from "lucide-react";

interface StoryScene {
  step: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badge: string;
}

const SCENES: StoryScene[] = [
  {
    step: "01",
    icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
    badge: "Patient Dialogue",
    title: "Tell Yurrheeler what's happening.",
    subtitle: "Natural language input without clinical friction.",
    description:
      "Share your symptoms, timeline, and observations exactly as you experience them. Yurrheeler captures conversational context, nuance, and history with empathetic clinical precision.",
    imageSrc:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Patient having a natural health consultation with intelligent digital interface",
  },
  {
    step: "02",
    icon: <Database className="w-4 h-4 text-cyan-400" />,
    badge: "Data Synthesis",
    title: "Context begins to form.",
    subtitle: "Unifying scattered vitals, history, and medications.",
    description:
      "Isolated data points transform into a coherent longitudinal record. Blood work, wearable telemetry, and prior diagnoses are harmonized into a structured clinical picture.",
    imageSrc:
      "https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Longitudinal health matrix assembling diagnostic data points",
  },
  {
    step: "03",
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    badge: "Multi-Agent Mesh",
    title: "Specialized intelligence activates.",
    subtitle: "Dedicated agents deliberate across domains.",
    description:
      "Cardia evaluates cardiovascular risk, Neura investigates neurological markers, and Nephro assesses renal filtration—collaborating in real time to form differential hypotheses.",
    imageSrc:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Multi-agent neural network orchestrating simultaneous specialist evaluations",
  },
  {
    step: "04",
    icon: <Activity className="w-4 h-4 text-rose-400" />,
    badge: "Spatial Anatomy",
    title: "The clinical picture becomes visible.",
    subtitle: "Mapping pathophysiology directly to organ systems.",
    description:
      "Witness your health in three dimensions. Interactive anatomical layers reveal interconnected symptoms, hemodynamic changes, and primary physiological drivers.",
    imageSrc:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Three-dimensional anatomical projection illustrating physiological feedback loops",
  },
  {
    step: "05",
    icon: <FileText className="w-4 h-4 text-amber-400" />,
    badge: "Grounded Evidence",
    title: "Evidence connects the picture.",
    subtitle: "Direct citations from peer-reviewed literature.",
    description:
      "Every recommendation is rigorously anchored in accredited clinical guidelines (NICE, AHA/ACC, KDIGO) with transparent confidence scores and clinical citations.",
    imageSrc:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Clinical research laboratory cross-referencing diagnostic evidence",
  },
  {
    step: "06",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    badge: "Actionable Clarity",
    title: "Understanding emerges.",
    subtitle: "A prepared summary for you and your physician.",
    description:
      "Receive an organized triage summary, prioritized questions for your upcoming doctor visit, and clear red-flag alerts so you navigate healthcare with confidence.",
    imageSrc:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
    imageAlt: "Physician and patient sharing clear clinical summary during consultation",
  },
];

export const ClinicalStory: React.FC = () => {
  return (
    <section id="clinical-story" className="py-24 md:py-36 bg-[#080b0e] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              The Clinical Journey
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight">
            See the bigger picture.
          </h2>
          <p className="text-slate-400 mt-4 text-base md:text-lg leading-relaxed font-light">
            Health is not a collection of isolated data points. Follow how Yurrheeler transforms disjointed symptoms into coherent, evidence-backed clinical understanding.
          </p>
        </div>

        {/* Story Scenes Stack */}
        <div className="space-y-32 md:space-y-44">
          {SCENES.map((scene, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={scene.step} className="flex flex-col gap-8">
                {/* Text and Step Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto w-full">
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-2xl font-bold text-emerald-500/40">
                        {scene.step}
                      </span>
                      <span className="h-px w-8 bg-white/10" />
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                        {scene.icon}
                        <span>{scene.badge}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-medium text-white tracking-tight leading-tight">
                      {scene.title}
                    </h3>
                    <p className="text-emerald-400/90 text-sm md:text-base font-normal mt-1 mb-3">
                      {scene.subtitle}
                    </p>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
                      {scene.description}
                    </p>
                  </div>

                  <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                        <span>INTELLIGENCE PIPELINE</span>
                        <span className="text-emerald-400">ACTIVE</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${((index + 1) / SCENES.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cinematic Scroll Reveal Image for Scene */}
                <div className="w-full pt-4">
                  <ScrollRevealImage
                    src={scene.imageSrc}
                    alt={scene.imageAlt}
                    height="65vh"
                    fromWidth="48vw"
                    toWidth="94vw"
                    fromRadius="16px"
                    toRadius="32px"
                    fromScale={1.35}
                    toScale={1}
                    caption={scene.subtitle}
                    eyebrow={`SCENE ${scene.step} • ${scene.badge}`}
                    className="shadow-2xl border border-white/10"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
