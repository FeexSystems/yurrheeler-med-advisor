import ScrollRevealImage from "@/components/ui/scroll-reveal-image";
import { useRef } from "react";
import { motion } from "motion/react";

const SHOWCASE_ITEMS = [
  {
    title: "AI-Powered Clinical Triage",
    description: "Our proprietary Gemini-backed matrix evaluates symptom severity in milliseconds, referencing thousands of peer-reviewed clinical guidelines to provide accurate urgency stratification.",
    src: "https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=2070&auto=format&fit=crop",
    alt: "Clinical Triage Dashboard",
    height: "80vh",
  },
  {
    title: "Continuous Patient Monitoring",
    description: "Integrate directly with clinical biometrics. Track vital signs in real-time with automated NEWS2 scoring and early warning algorithms designed for rapid clinical intervention.",
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
    alt: "Medical Professional Reviewing Analytics",
    height: "80vh",
  },
  {
    title: "Specialized Agent Handoffs",
    description: "Seamlessly route complex cases to domain-specific AI agents. From cardiology to dermatology, our specialized hubs deliver focused differential diagnoses without context loss.",
    src: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop",
    alt: "Specialized Agent Interface",
    height: "80vh",
  },
];

export function SaaSProductShowcase({
  fromWidth = "60%",
  toWidth = "95%",
  fromScale = 1.3,
  toScale = 1,
  fromRadius = "12px",
  toRadius = "24px",
  stiffness = 100,
  damping = 40,
}: {
  fromWidth?: string;
  toWidth?: string;
  fromScale?: number;
  toScale?: number;
  fromRadius?: string;
  toRadius?: string;
  stiffness?: number;
  damping?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" ref={scrollRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-semibold text-blue-800 dark:text-blue-300 mb-6">
          <span>Enterprise Grade Architecture</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white sm:text-6xl tracking-tight mb-6">
          Unprecedented <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Clarity.</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium">
          Experience a revolutionary unified health advisory platform. Gemini-powered clinical insights, seamless biometric tracking, and predictive urgency stratification in one elegant interface.
        </p>
      </div>

      <div className="w-full relative flex flex-col gap-32 pb-32">
        {SHOWCASE_ITEMS.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Context Text */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{item.description}</p>
            </div>
            
            {/* Scroll Reveal Image */}
            <ScrollRevealImage
              src={item.src}
              alt={item.alt}
              height={item.height}
              fromWidth={fromWidth}
              toWidth={toWidth}
              innerWidth="100%"
              fromScale={fromScale}
              toScale={toScale}
              fromRadius={fromRadius}
              toRadius={toRadius}
              stiffness={stiffness}
              damping={damping}
            />
          </div>
        ))}
      </div>
      
      {/* Decorative Gradients */}
      <div className="absolute top-1/3 -left-64 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 -right-64 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}

export default SaaSProductShowcase;
