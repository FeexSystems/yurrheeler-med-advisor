import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Brain, HeartPulse, ShieldCheck, Database, Stethoscope, Microscope, Search, GitBranch, Activity, User, Plus, CheckCircle2, AlertTriangle, Fingerprint, Lock, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import ScrollRevealImage from "@/components/ui/scroll-reveal-image";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#090a0b] text-slate-200 font-sans selection:bg-emerald-900/50 selection:text-emerald-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#090a0b]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-lg tracking-wide text-white">YURRHEELER</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Clinical Intelligence</a>
            <a href="#specialists" className="hover:text-white transition-colors">Specialists</a>
            <a href="#safety" className="hover:text-white transition-colors">Safety</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/app" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/app">
              <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-5 h-9 text-xs font-semibold shadow-none border-none">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />
      <TrustStrip />
      <ProblemSection />
      <ProductIntroduction />
      <SpecialistAgentsSection />
      <ClinicalSpaceSection />
      <EvidenceSection />
      <AnatomySection />
      <PersonalizationSection />
      <ConversationalAISection />
      <SafetySection />
      <PrivacySection />
      <TechnologySection />
      <UseCasesSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}

// 6. HERO
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Background Visual */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[80px]" />
        
        {/* Subtle abstract grid/circles */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-slate-300 uppercase">Clinical Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[90px] font-medium tracking-tight text-white leading-[1.1] mb-8"
        >
          A new way to understand<br />
          <span className="text-slate-400">your health.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Yurrheeler brings specialized medical AI, clinical context, evidence, and intelligent guidance into one intelligent environment.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/app">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 text-sm font-medium border-none shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all hover:shadow-[0_0_30px_rgba(5,150,105,0.5)]">
              Explore Yurrheeler
            </Button>
          </Link>
          <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-12 text-sm font-medium">
            See how it works
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-xs text-slate-500 font-medium uppercase tracking-widest space-y-2"
        >
          <div>Trusted by intelligent minds.</div>
          <div>Designed around the human.</div>
        </motion.div>
      </div>
    </section>
  );
}

// 9. HERO TRUST STRIP
function TrustStrip() {
  return (
    <div className="border-y border-white/5 bg-white/[0.01] py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-light text-emerald-400/90 mb-2">16+</div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-medium leading-relaxed">Specialized AI<br/>Medical Domains</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-light text-emerald-400/90 mb-2"><CheckCircle2 className="w-8 h-8 opacity-80" /></div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-medium leading-relaxed">Evidence-aware<br/>Clinical Context</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-light text-emerald-400/90 mb-2"><User className="w-8 h-8 opacity-80" /></div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-medium leading-relaxed">Designed for<br/>Human Understanding</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-light text-emerald-400/90 mb-2"><ShieldCheck className="w-8 h-8 opacity-80" /></div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-medium leading-relaxed">Privacy-first<br/>Architecture</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. PROBLEM SECTION
function ProblemSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Healthcare is full of information.<br />
          <span className="text-slate-500">Understanding it is another problem.</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
          Medical information is fragmented across symptoms, records, measurements, specialists, and sources. Yurrheeler brings these perspectives together into one coherent clinical environment.
        </p>
      </div>
      
      {/* Abstract visual of fragmented nodes coming together */}
      <div className="mt-20 relative h-[400px] w-full max-w-5xl mx-auto overflow-hidden">
        {/* Placeholder for fragmented nodes animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <motion.div 
              animate={{ 
                x: ["-20%", "0%"], 
                y: ["-20%", "0%"],
                opacity: [0, 1]
              }} 
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              className="absolute top-1/4 left-1/4 w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-md"
            >
              <FileText className="w-6 h-6 text-blue-400" />
            </motion.div>
            <motion.div 
              animate={{ 
                x: ["20%", "0%"], 
                y: ["20%", "0%"],
                opacity: [0, 1]
              }} 
              transition={{ duration: 2, ease: "easeOut", delay: 0.7 }}
              className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-md"
            >
              <Activity className="w-6 h-6 text-emerald-400" />
            </motion.div>
            <motion.div 
              animate={{ 
                x: ["20%", "0%"], 
                y: ["-20%", "0%"],
                opacity: [0, 1]
              }} 
              transition={{ duration: 2, ease: "easeOut", delay: 0.9 }}
              className="absolute top-1/3 right-1/3 w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-md"
            >
              <Brain className="w-6 h-6 text-purple-400" />
            </motion.div>

            {/* Central Hub */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#0a0a0b] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(5,150,105,0.15)] z-10"
            >
              <HeartPulse className="w-10 h-10 text-emerald-500" />
            </motion.div>
            
            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
               <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4 4" className="text-blue-500" />
               <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4 4" className="text-emerald-500" />
               <line x1="66%" y1="33%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4 4" className="text-purple-500" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// 11. PRODUCT INTRODUCTION
function ProductIntroduction() {
  return (
    <section className="py-32 bg-[#0d0e10] border-y border-white/5" id="product">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          One intelligence layer.<br />
          <span className="text-slate-500">Many medical perspectives.</span>
        </h2>
        
        <div className="mt-24 relative h-[600px] w-full flex items-center justify-center">
          {/* Orbital rings */}
          <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5" />
          <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white/5" />
          
          <div className="absolute z-20 w-24 h-24 rounded-full bg-[#090a0b] border border-white/10 flex items-center justify-center shadow-2xl">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>

          {/* Agents */}
          <div className="absolute z-10 w-full h-full animate-[spin_60s_linear_infinite]">
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121418] border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 font-medium">Cardia</div>
            <div className="absolute bottom-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121418] border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-medium">Neura</div>
            <div className="absolute top-[30%] right-[15%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121418] border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400 font-medium">Pulmono</div>
            <div className="absolute bottom-[10%] right-[30%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121418] border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 font-medium">Gastro</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 12. SPECIALIST AGENTS SECTION
function SpecialistAgentsSection() {
  return (
    <section className="py-32 relative" id="specialists">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
              Specialized intelligence,<br />
              <span className="text-slate-500">working together.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-8">
              Yurrheeler connects specialized medical perspectives so complex health questions can be explored from multiple clinical domains.
            </p>
            
            <div className="space-y-4 mt-12">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">CARDIA</h4>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Cardiovascular Intelligence</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400 uppercase tracking-wider font-medium">Observing</div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  Focused on cardiovascular context, observations, and related evidence.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm opacity-60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">NEURA</h4>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Neurological Intelligence</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded border border-white/10 text-[10px] text-slate-500 uppercase tracking-wider font-medium">Standby</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-[600px] flex items-center justify-center">
            {/* Visual constellation of agents */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.1),transparent_70%)]" />
             {/* Render some abstract UI lines and nodes */}
             <div className="w-full max-w-md aspect-square relative">
                <svg className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 0 10px rgba(5,150,105,0.2))" }}>
                   <path d="M50 200 Q 200 50 350 200" fill="none" stroke="rgba(5,150,105,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                   <path d="M100 300 Q 200 200 350 200" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
                </svg>
                <div className="absolute top-[30%] left-[10%] w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                <div className="absolute top-[50%] right-[10%] w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
                <div className="absolute bottom-[20%] left-[30%] w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_15px_#a855f7]" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 13. CLINICAL SPACE SECTION
function ClinicalSpaceSection() {
  return (
    <section className="py-32 bg-[#0d0e10] border-y border-white/5 relative overflow-hidden" id="intelligence">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          See the clinical picture.
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
          Move beyond isolated answers. Explore patient context, anatomy, observations, specialist activity, and evidence in one environment.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <ScrollRevealImage 
          src="https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=2070&auto=format&fit=crop"
          alt="Clinical Space Environment"
          height="70vh"
          fromWidth="60%"
          toWidth="100%"
          fromRadius="12px"
          toRadius="24px"
          imageClassName="opacity-80 mix-blend-screen"
        />
      </div>
    </section>
  );
}

// 16. EVIDENCE SECTION
function EvidenceSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center">
             <div className="w-full h-full border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm p-8 relative flex flex-col items-center justify-center">
                <div className="w-32 h-10 border border-emerald-500/30 bg-emerald-500/10 rounded-full flex items-center justify-center text-xs text-emerald-400 mb-8 absolute top-20">Clinical Question</div>
                <div className="w-24 h-8 border border-white/10 bg-white/5 rounded-full flex items-center justify-center text-[10px] text-slate-400 absolute top-1/2 left-10">Observations</div>
                <div className="w-24 h-8 border border-white/10 bg-white/5 rounded-full flex items-center justify-center text-[10px] text-slate-400 absolute top-1/2 right-10">Evidence</div>
                <div className="w-24 h-8 border border-white/10 bg-white/5 rounded-full flex items-center justify-center text-[10px] text-slate-400 absolute bottom-20 left-1/4">Context</div>
                <div className="w-24 h-8 border border-amber-500/30 bg-amber-500/10 rounded-full flex items-center justify-center text-[10px] text-amber-400 absolute bottom-20 right-1/4">Uncertainty</div>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                   <line x1="50%" y1="120" x2="20%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                   <line x1="50%" y1="120" x2="80%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                   <line x1="20%" y1="50%" x2="35%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                   <line x1="80%" y1="50%" x2="65%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </svg>
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
              Answers should have <span className="text-emerald-400">context.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-8">
              Yurrheeler is designed to distinguish observation from interpretation, highlighting evidence and openly acknowledging uncertainty.
            </p>
            <ul className="space-y-4">
              {['Observation', 'Interpretation', 'Evidence', 'Uncertainty', 'Next steps'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// 17. ANATOMY SECTION
function AnatomySection() {
  return (
    <section className="py-32 bg-[#0d0e10] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Health is not a list of symptoms.<br/>
          <span className="text-slate-500">It's a system.</span>
        </h2>
      </div>
      
      <div className="relative w-full max-w-5xl mx-auto h-[500px] flex items-center justify-center border border-white/5 rounded-2xl bg-[#090a0b]/50 overflow-hidden">
        {/* Placeholder for interactive anatomical visualization */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e10] via-transparent to-[#0d0e10]" />
        
        <div className="relative z-10 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl w-64 translate-x-32 -translate-y-16">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Region</div>
          <div className="text-lg font-medium text-white mb-4">Cardiovascular System</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Related Intelligence</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-400">Cardia</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 20. CONVERSATIONAL AI SECTION
function ConversationalAISection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Ask naturally.
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
          Not every health question fits a form.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-8 backdrop-blur-sm space-y-8">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-white/10 text-white rounded-2xl rounded-tr-sm px-6 py-4 text-sm max-w-[80%] font-light">
              "What could explain these symptoms?"
            </div>
          </div>
          
          {/* AI Message */}
          <div className="flex justify-start">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-50 rounded-2xl rounded-tl-sm px-6 py-4 text-sm max-w-[90%] font-light leading-relaxed">
              Based on the information you've shared, there are several possibilities worth considering. The cluster of observations points primarily towards cardiovascular or respiratory pathways. 
              <br/><br/>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-widest mt-2 mb-1">
                <Search className="w-3 h-3" /> Exploring
              </div>
              <div className="space-y-2 mt-3">
                <div className="p-3 bg-black/20 rounded border border-white/5">
                  <div className="font-medium text-white">Possible explanations</div>
                  <div className="text-xs text-slate-400 mt-1">Reviewing 3 clinical pathways</div>
                </div>
                <div className="p-3 bg-black/20 rounded border border-white/5">
                  <div className="font-medium text-white">Relevant evidence</div>
                  <div className="text-xs text-slate-400 mt-1">Sourced from peer-reviewed guidelines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 19. PERSONALIZATION SECTION
function PersonalizationSection() {
  return (
    <section className="py-24 bg-[#0d0e10] border-y border-white/5">
       <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium tracking-tight text-white mb-6">
            Built around your context.
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-12 opacity-70">
            {['Symptoms', 'Vitals', 'History', 'Observations', 'Conversations', 'Clinical context'].map((item, i) => (
              <div key={i} className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-slate-300">
                {item}
              </div>
            ))}
          </div>
       </div>
    </section>
  )
}

// 21. SAFETY SECTION
function SafetySection() {
  return (
    <section className="py-32 relative" id="safety">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Intelligence with <span className="text-amber-400">boundaries.</span>
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            Yurrheeler is designed to help people understand health information and prepare for informed conversations with qualified healthcare professionals. It does not replace professional medical diagnosis, treatment, or emergency care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-white/10 bg-white/[0.02] rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-4" />
            <h4 className="text-white font-medium mb-2">Evidence</h4>
            <p className="text-sm text-slate-500 font-light">Grounded in established clinical literature.</p>
          </div>
          <div className="p-6 border border-white/10 bg-white/[0.02] rounded-xl">
            <Search className="w-6 h-6 text-blue-500 mb-4" />
            <h4 className="text-white font-medium mb-2">Uncertainty</h4>
            <p className="text-sm text-slate-500 font-light">Clear distinction between facts and probabilistic models.</p>
          </div>
          <div className="p-6 border border-white/10 bg-white/[0.02] rounded-xl">
            <User className="w-6 h-6 text-purple-500 mb-4" />
            <h4 className="text-white font-medium mb-2">Human oversight</h4>
            <p className="text-sm text-slate-500 font-light">Designed to augment, not replace, clinical judgment.</p>
          </div>
          <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-500 mb-4" />
            <h4 className="text-white font-medium mb-2">Emergency guidance</h4>
            <p className="text-sm text-amber-500/80 font-light">Built-in safeguards and immediate escalation protocols.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 22. PRIVACY SECTION
function PrivacySection() {
  return (
    <section className="py-24 bg-[#0d0e10] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Your health information deserves<br />
          <span className="text-slate-500">serious engineering.</span>
        </h2>
        <div className="mt-16 flex flex-wrap justify-center gap-8">
           <div className="flex items-center gap-2 text-slate-300"><Lock className="w-4 h-4 text-emerald-500"/> Privacy-aware architecture</div>
           <div className="flex items-center gap-2 text-slate-300"><Fingerprint className="w-4 h-4 text-emerald-500"/> Secure authentication</div>
           <div className="flex items-center gap-2 text-slate-300"><ShieldCheck className="w-4 h-4 text-emerald-500"/> Data minimization</div>
        </div>
      </div>
    </section>
  );
}

// 23. TECHNOLOGY SECTION
function TechnologySection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl font-medium tracking-tight text-white mb-16">
          Built like intelligence infrastructure.
        </h2>
        
        <div className="flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
          <div className="w-full p-4 border border-white/10 bg-white/5 rounded-lg text-sm text-slate-300">Patient Context</div>
          <div className="h-6 w-px bg-emerald-500/50" />
          <div className="w-full p-4 border border-white/10 bg-white/5 rounded-lg text-sm text-slate-300">Clinical State</div>
          <div className="h-6 w-px bg-emerald-500/50" />
          <div className="w-full p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-sm font-medium text-emerald-400">Specialist Agents</div>
          <div className="h-6 w-px bg-emerald-500/50" />
          <div className="w-full p-4 border border-white/10 bg-white/5 rounded-lg text-sm text-slate-300">Evidence & Reasoning</div>
          <div className="h-6 w-px bg-emerald-500/50" />
          <div className="w-full p-4 border border-white/10 bg-white/10 rounded-lg text-sm font-medium text-white">Clinical Experience</div>
        </div>
      </div>
    </section>
  );
}

// 25. USE CASES
function UseCasesSection() {
  return (
    <section className="py-24 bg-[#0d0e10] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 border border-white/5 bg-black/20 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-3">UNDERSTAND</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Make complex health information easier to understand.</p>
          </div>
          <div className="p-8 border border-white/5 bg-black/20 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-3">PREPARE</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Prepare for conversations with healthcare professionals.</p>
          </div>
          <div className="p-8 border border-white/5 bg-black/20 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-3">EXPLORE</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Explore symptoms, observations, and health context.</p>
          </div>
          <div className="p-8 border border-white/5 bg-black/20 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-3">ORGANIZE</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Bring health information into one intelligent environment.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 26. FINAL CTA
function FinalCTASection() {
  return (
    <section className="py-40 relative flex items-center justify-center overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 bg-emerald-900/10 mix-blend-screen" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8 leading-tight">
          Your health is complex.<br />
          <span className="text-slate-500">Your understanding doesn't have to be.</span>
        </h2>
        <p className="text-xl text-slate-400 font-light mb-12">
          Explore a more intelligent way to navigate health information.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/app">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 text-sm font-medium border-none w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-12 text-sm font-medium w-full sm:w-auto">
              Explore Clinical Intelligence
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 27. FOOTER
function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#090a0b] py-16 text-slate-500 text-sm font-light">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold tracking-wide text-white">YURRHEELER</span>
          </div>
          <p className="text-xs">Clinical Intelligence Platform</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-white font-medium mb-4">Product</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Clinical Intelligence</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Specialists</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Safety</a></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-white font-medium mb-4">Security</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Resources</a></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-white font-medium mb-4">Legal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Medical Disclaimer</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs">&copy; {new Date().getFullYear()} Yurrheeler. All rights reserved.</p>
        <p className="text-xs max-w-md text-center md:text-right">Yurrheeler does not provide professional medical diagnosis, treatment, or emergency care.</p>
      </div>
    </footer>
  );
}
