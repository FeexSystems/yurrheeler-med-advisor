import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "motion/react";
import {
  HeartPulse,
  CheckCircle2,
  User,
  ShieldCheck,
  Search,
  Activity,
  Brain,
  FileText,
  AlertTriangle,
  Lock,
  Fingerprint,
  Layers,
  ArrowRight,
  Shield,
  Stethoscope,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import ScrollRevealImage from "@/components/ui/scroll-reveal-image";
import { HeroVisual } from "@/landing/sections/HeroVisual";
import { HealthHeroCarousel } from "@/landing/components/HealthHeroCarousel";
import { AgentConstellationSection } from "@/landing/sections/AgentConstellationSection";
import { HealthGallery } from "@/landing/sections/HealthGallery";
import { InteractiveAnatomySection } from "@/landing/sections/InteractiveAnatomySection";
import { ClinicalStory } from "@/landing/sections/ClinicalStory";
import { PricingSection } from "@/landing/sections/PricingSection";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 40);
    });
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#080b0e] text-slate-200 font-sans selection:bg-emerald-900/50 selection:text-emerald-100 overflow-x-hidden">
      {/* 1. TOP NAVIGATION */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#080b0e]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-wider text-white">
                YURRHEELER
              </span>
              <span className="text-[9px] font-mono text-emerald-400 -mt-1 tracking-widest uppercase">
                Med Advisor
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-medium text-slate-400">
            <a href="#hero-carousel" className="hover:text-white transition-colors">
              Showcase
            </a>
            <a href="#specialists" className="hover:text-white transition-colors">
              Specialist Mesh
            </a>
            <a href="#clinical-space" className="hover:text-white transition-colors">
              Clinical Space
            </a>
            <a href="#health-gallery" className="hover:text-white transition-colors">
              Visual Archive
            </a>
            <a href="#anatomy" className="hover:text-white transition-colors">
              3D Anatomy
            </a>
            <a href="#clinical-story" className="hover:text-white transition-colors">
              Clinical Story
            </a>
            <a href="#pricing" className="hover:text-emerald-400 text-slate-300 font-semibold transition-colors">
              Pricing
            </a>
            <a href="#safety" className="hover:text-white transition-colors">
              Safety
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="text-xs font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link to="/app">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full px-5 h-8 text-xs font-semibold shadow-lg shadow-emerald-500/20 border-none">
                Open Advisor
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH 3D SPATIAL INTELLIGENCE */}
      <HeroSection />

      {/* 3. HERO TRUST STRIP */}
      <TrustStrip />

      {/* 4. HEALTH HERO CAROUSEL */}
      <section id="hero-carousel" className="py-20 md:py-28 px-4 md:px-8 bg-[#090d12] relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Cinematic Health Visuals
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
            Where medicine meets spatial computing.
          </h2>
          <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl mx-auto font-light">
            Interactive clinical layers designed to clarify physiology, research literature, and autonomous reasoning.
          </p>
        </div>
        <HealthHeroCarousel />
      </section>

      {/* 5. THE PROBLEM: FRAGMENTATION TO SYNTHESIS */}
      <ProblemSection />

      {/* 6. CINEMATIC EXPANDING SCROLL REVEAL HERO IMAGE */}
      <section className="py-20 bg-[#080b0e] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            A Unified Clinical Matrix
          </span>
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mt-2">
            See the bigger picture.
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl mx-auto font-light">
            Yurrheeler connects context, specialized intelligence, and evidence into one coherent environment.
          </p>
        </div>
        <ScrollRevealImage
          src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2070&auto=format&fit=crop"
          alt="Clinician synthesizing comprehensive biometric telemetry and diagnostic evidence"
          height="72vh"
          fromWidth="52vw"
          toWidth="95vw"
          fromRadius="14px"
          toRadius="28px"
          fromScale={1.35}
          toScale={1}
          eyebrow="BIOMETRIC CONVERGENCE"
          caption="Context → Autonomous Specialists → Grounded Evidence"
          className="shadow-2xl border border-white/10"
        />
      </section>

      {/* 7. SPECIALIST AGENT CONSTELLATION (3D + DATA DRIVEN) */}
      <AgentConstellationSection />

      {/* 8. CLINICAL SPACE SECTION (PRODUCT UI + SPATIAL TELEMETRY) */}
      <ClinicalSpaceSection />

      {/* 9. HEALTH GALLERY WITH MASONRY & LIGHTBOX */}
      <HealthGallery />

      {/* 10. INTERACTIVE 3D ANATOMY SECTION */}
      <InteractiveAnatomySection />

      {/* 11. EVIDENCE SECTION */}
      <EvidenceSection />

      {/* 12. CLINICAL SCROLL STORY (6 SCENES) */}
      <ClinicalStory />

      {/* 13. CONVERSATIONAL AI PRODUCT DEMO */}
      <ConversationalAISection />

      {/* 14. PERSONALIZATION SECTION */}
      <PersonalizationSection />

      {/* 15. SAFETY & CLINICAL GOVERNANCE */}
      <SafetySection />

      {/* 16. ZERO-KNOWLEDGE PRIVACY & SECURITY */}
      <PrivacySection />

      {/* 17. TECHNOLOGY ARCHITECTURE */}
      <TechnologySection />

      {/* 18. USE CASES */}
      <UseCasesSection />

      {/* 19. TRANSPARENT CLINICAL PRICING */}
      <PricingSection />

      {/* 20. FINAL CINEMATIC CTA */}
      <FinalCTASection />

      {/* 20. FOOTER */}
      <LandingFooter />
    </div>
  );
}

// ----------------------------------------------------
// SECTION IMPLEMENTATIONS
// ----------------------------------------------------

function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]" />
        {/* Fine scientific grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_45%,#000_30%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-medium tracking-widest text-emerald-300 uppercase">
            Living Clinical Intelligence Mesh
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-medium tracking-tight text-white leading-[1.08] mb-6"
        >
          A new way to understand
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            your health.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Yurrheeler synthesizes specialized medical AI agents, 3D anatomical modeling, real-time biometrics, and peer-reviewed clinical evidence into one intuitive interface.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link to="/app">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full px-8 h-12 text-sm font-semibold shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_35px_rgba(16,185,129,0.5)]">
              Launch Clinical Advisor
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="#hero-carousel">
            <Button
              variant="outline"
              className="bg-white/5 border-white/15 text-white hover:bg-white/10 rounded-full px-7 h-12 text-sm font-medium backdrop-blur-sm"
            >
              Explore 3D Intelligence
            </Button>
          </a>
        </motion.div>

        {/* 3D LIVING CENTRAL ANATOMY & AGENT SCENE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full max-w-4xl mx-auto mt-4 rounded-3xl border border-white/10 bg-[#090c10]/80 backdrop-blur-xl shadow-2xl overflow-hidden relative"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <div className="border-y border-white/10 bg-white/[0.01] py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-center">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold font-mono text-emerald-400 mb-1">16+</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium leading-relaxed">
              Specialized Medical AI Domains
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-light text-emerald-400 mb-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium leading-relaxed">
              NICE & AHA/ACC Grounded
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-light text-emerald-400 mb-1">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium leading-relaxed">
              Human-Centered Design
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-light text-emerald-400 mb-1">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium leading-relaxed">
              Zero-Knowledge Privacy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="py-28 md:py-36 relative bg-[#090c0f]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 block">
          The Information Dilemma
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Healthcare is full of data.
          <br />
          <span className="text-slate-500">Understanding it is the true challenge.</span>
        </h2>
        <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
          Medical insights are fractured across symptoms, lab reports, wearable vitals, specialist notes, and conflicting online searches. Yurrheeler synthesizes these fragments into a unified, actionable clinical view.
        </p>
      </div>

      <div className="mt-16 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">
              Fragmented Observations
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Isolated symptoms are often misinterpreted without understanding systemic physiological interactions and baseline metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">
              Cognitive Overload
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Raw medical test results lack immediate context, creating unnecessary anxiety or overlooked critical warning signs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0d1117] border border-emerald-500/30 bg-emerald-950/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-emerald-300 mb-2">
              The Yurrheeler Solution
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Multi-agent reasoning structures your health narrative, highlights grounded clinical evidence, and prepares clear questions for your physician.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClinicalSpaceSection() {
  return (
    <section
      id="clinical-space"
      className="py-28 md:py-36 bg-[#090d12] border-y border-white/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Production UI Architecture
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
          The Clinical Space Experience
        </h2>
        <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
          Experience a fluid clinical workspace where conversational intake, 3D anatomical inspection, and multi-agent deliberation occur simultaneously.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="relative rounded-3xl border border-white/15 bg-[#0e131b] p-3 md:p-6 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 mb-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-slate-200 font-semibold">
                Yurrheeler Clinical Space v2.4
              </span>
            </div>
            <span className="text-emerald-400">LIVE TELEMETRY SYNCED</span>
          </div>

          <ScrollRevealImage
            src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2070&auto=format&fit=crop"
            alt="Yurrheeler Clinical Workspace with 3D anatomical viewer and agent chat"
            height="68vh"
            fromWidth="60vw"
            toWidth="100%"
            fromRadius="12px"
            toRadius="20px"
            eyebrow="PRODUCTION WORKSPACE"
            caption="Synchronized multi-agent diagnostic workspace with spatial telemetry"
            className="shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section className="py-28 md:py-36 relative bg-[#080b0e]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[440px] md:h-[500px]">
            <div className="w-full h-full border border-white/10 rounded-2xl bg-[#0d1117] p-6 md:p-8 relative flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  Evidence Citation Graph
                </span>
                <span className="text-xs font-mono text-slate-400">CONFIDENCE: 96.4%</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">NICE Guideline CG95</div>
                    <div className="text-[11px] text-slate-400">Chest pain of recent onset assessment</div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    GRADE A
                  </span>
                </div>

                <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">AHA/ACC 2023 Guidelines</div>
                    <div className="text-[11px] text-slate-400">Cardiovascular Risk Score Calculator</div>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                    GRADE A
                  </span>
                </div>

                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-300">KDIGO 2024 Clinical Update</div>
                    <div className="text-[11px] text-slate-500">Renal Function & Electrolyte Monitoring</div>
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 text-slate-400 px-2 py-0.5 rounded">
                    PEER REVIEW
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>OBSERVATION → HYPOTHESIS → CITATION</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Rigorous Medical Grounding
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
              Answers must have <span className="text-emerald-400">grounded context.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8">
              Yurrheeler distinguishes factual biometrics from probabilistic interpretations, highlighting verified peer-reviewed citations while explicitly declaring clinical uncertainties.
            </p>

            <div className="space-y-4">
              {[
                { title: "Direct Guideline Citations", desc: "Every assessment links directly to authoritative medical sources." },
                { title: "Explicit Uncertainty Metrics", desc: "Transparent confidence scoring highlights when in-person clinical workup is required." },
                { title: "Physician Prepared Summaries", desc: "Structured outputs formatted for quick review by your primary doctor." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConversationalAISection() {
  return (
    <section className="py-28 md:py-36 relative bg-[#090d12] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 block">
          Empathetic & Precise
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
          Ask naturally. No rigid forms.
        </h2>
        <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed">
          Describe your health context the way you speak. Yurrheeler captures nuance, timeline, and associated symptoms.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div className="border border-white/10 rounded-2xl bg-[#0d1117] p-6 md:p-8 shadow-2xl space-y-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm max-w-[85%] font-light">
              "I have been noticing mild tightness in my chest after brisk morning walks, along with occasional palpitations. What should I check?"
            </div>
          </div>

          {/* AI Specialist Response */}
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 text-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 text-sm max-w-[95%] leading-relaxed font-light">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                  Cardia (Cardiology) & Yurrheeler Medic
                </span>
              </div>
              <p className="text-sm text-slate-200">
                Exercise-induced chest tightness with palpitations warrants prompt clinical attention. While this can stem from benign causes like musculoskeletal strain or mild arrhythmia, we must rule out exertional ischemia:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-white">Recommended Doctor Questions</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Request 12-lead resting ECG, Holter monitor, and exertional stress testing.
                  </div>
                </div>
                <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/30">
                  <div className="text-xs font-semibold text-rose-300">Urgent Warning Signs</div>
                  <div className="text-[11px] text-rose-400/90 mt-1">
                    Seek emergency care immediately if tightness radiates to the left arm, jaw, or is accompanied by shortness of breath or dizziness.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalizationSection() {
  return (
    <section className="py-20 bg-[#080b0e] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-6">
          Tailored to your individual physiological profile
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {[
            "Resting Heart Rate",
            "Longitudinal Vitals",
            "Prescription Interactions",
            "Family History",
            "Wearable ECG Streams",
            "Metabolic Biomarkers",
            "Prior Surgical History",
            "Allergy Profiles",
          ].map((item, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:text-white transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="py-28 md:py-36 relative bg-[#090c0f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Clinical Governance
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            Intelligence with <span className="text-amber-400">strict safety boundaries.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed">
            Yurrheeler is engineered to augment human understanding and prepare for informed doctor visits. It maintains safety protocols to escalate potential emergencies immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="text-white font-semibold text-sm mb-2">Evidence-First</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Every inference is cross-referenced with accredited peer-reviewed guidelines.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <Search className="w-6 h-6 text-cyan-400 mb-3" />
            <h4 className="text-white font-semibold text-sm mb-2">Uncertainty Declaration</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Transparent confidence metrics declare when lab tests or diagnostic imaging are required.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <User className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="text-white font-semibold text-sm mb-2">Physician Collaboration</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Designed to optimize the critical dialogue between patients and licensed physicians.
            </p>
          </div>

          <div className="p-6 border border-rose-500/30 bg-rose-950/10 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-rose-400 mb-3" />
            <h4 className="text-rose-300 font-semibold text-sm mb-2">Emergency Safeguards</h4>
            <p className="text-xs text-rose-300/80 font-light leading-relaxed">
              Automatic red-flag detection prioritizing immediate 911/ER escalation advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacySection() {
  return (
    <section className="py-24 bg-[#080b0e] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4">
          Your health data deserves rigorous security.
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto font-light mb-10">
          Client-side encrypted architectures ensuring personal health queries remain private and protected.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Lock className="w-4 h-4 text-emerald-400" /> AES-256 Client-Side Encryption
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Fingerprint className="w-4 h-4 text-emerald-400" /> Zero-Knowledge Authentication
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Strict Data Minimization Policy
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  return (
    <section className="py-28 md:py-36 relative bg-[#090c0f]">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 block">
          System Architecture
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-16">
          Engineered like critical medical infrastructure.
        </h2>

        <div className="max-w-md mx-auto space-y-3">
          <div className="p-4 border border-white/10 bg-[#0d1117] rounded-xl text-xs font-medium text-slate-300 flex items-center justify-between">
            <span>01. Longitudinal Patient Context</span>
            <span className="text-emerald-400 font-mono">INGESTED</span>
          </div>
          <div className="w-px h-5 bg-emerald-500/40 mx-auto" />
          <div className="p-4 border border-white/10 bg-[#0d1117] rounded-xl text-xs font-medium text-slate-300 flex items-center justify-between">
            <span>02. Dynamic Clinical State Matrix</span>
            <span className="text-emerald-400 font-mono">NORMALIZED</span>
          </div>
          <div className="w-px h-5 bg-emerald-500/40 mx-auto" />
          <div className="p-4 border border-emerald-500/30 bg-emerald-950/20 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-between">
            <span>03. Multi-Specialist Agent Mesh</span>
            <span className="text-emerald-400 font-mono">DELIBERATING</span>
          </div>
          <div className="w-px h-5 bg-emerald-500/40 mx-auto" />
          <div className="p-4 border border-white/10 bg-[#0d1117] rounded-xl text-xs font-medium text-slate-300 flex items-center justify-between">
            <span>04. Guideline Evidence Verification</span>
            <span className="text-cyan-400 font-mono">GROUNDED</span>
          </div>
          <div className="w-px h-5 bg-emerald-500/40 mx-auto" />
          <div className="p-4 border border-white/15 bg-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-between">
            <span>05. Unified Patient Consultation Action Plan</span>
            <span className="text-emerald-400 font-mono">SYNTHESIZED</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="py-20 bg-[#080b0e] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2 font-mono">UNDERSTAND</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Demystify lab results, medical jargon, and complex diagnostic reports into clear language.
            </p>
          </div>
          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2 font-mono">PREPARE</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Arrive at your physician appointments armed with precise questions, timelines, and vitals.
            </p>
          </div>
          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <h3 className="text-sm font-semibold text-purple-400 mb-2 font-mono">EXPLORE</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Investigate interconnected symptoms across 3D anatomical systems and specialized medical domains.
            </p>
          </div>
          <div className="p-6 border border-white/10 bg-[#0d1117] rounded-2xl">
            <h3 className="text-sm font-semibold text-amber-400 mb-2 font-mono">ORGANIZE</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Centralize your longitudinal health history, medications, and wellness tracking in one secure hub.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-32 md:py-44 relative flex items-center justify-center overflow-hidden bg-[#090d12]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-tight">
          Your health is complex.
          <br />
          <span className="text-slate-400">Your understanding shouldn't be.</span>
        </h2>
        <p className="text-base md:text-xl text-slate-300 font-light mb-10 max-w-2xl mx-auto">
          Explore a more intelligent, evidence-grounded way to navigate personal health.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/app">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full px-8 h-12 text-sm font-semibold shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] w-full sm:w-auto">
              Get Started with Yurrheeler
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/app">
            <Button
              variant="outline"
              className="bg-white/5 border-white/15 text-white hover:bg-white/10 rounded-full px-8 h-12 text-sm font-medium w-full sm:w-auto"
            >
              Explore Clinical Intelligence
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07090c] py-16 text-slate-400 text-xs font-light">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold tracking-wider text-white text-sm">
              YURRHEELER MED ADVISOR
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Multi-Agent Clinical Intelligence, 3D Anatomical Spatial Mapping, and Evidence Grounding.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
            Clinical System
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#specialists" className="hover:text-emerald-400 transition-colors">
                Specialist Agent Constellation
              </a>
            </li>
            <li>
              <a href="#anatomy" className="hover:text-emerald-400 transition-colors">
                3D Anatomical Explorer
              </a>
            </li>
            <li>
              <a href="#clinical-space" className="hover:text-emerald-400 transition-colors">
                Clinical Workspace
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
            Trust & Security
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#safety" className="hover:text-emerald-400 transition-colors">
                Clinical Safety Protocols
              </a>
            </li>
            <li>
              <a href="#safety" className="hover:text-emerald-400 transition-colors">
                Zero-Knowledge Privacy
              </a>
            </li>
            <li>
              <a href="#hero-carousel" className="hover:text-emerald-400 transition-colors">
                Visual Intelligence Archive
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
            Medical Notice
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Yurrheeler Med Advisor does not provide professional medical diagnosis, prescription, or emergency care. In an emergency, dial 911 immediately.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>&copy; {new Date().getFullYear()} Yurrheeler Health Intelligence. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/app" className="hover:text-white transition-colors">
            App
          </Link>
          <a href="#safety" className="hover:text-white transition-colors">
            Terms of Use
          </a>
          <a href="#safety" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
