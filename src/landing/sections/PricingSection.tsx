import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Lock,
  FileSpreadsheet,
  Stethoscope,
  Users,
  Building2,
  HelpCircle,
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyPerYearPrice: number;
  highlightColor: string;
  ctaText: string;
  ctaLink: string;
  features: Array<{
    text: string;
    tooltip?: string;
    highlight?: boolean;
  }>;
}

const TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Essential Patient",
    description:
      "Core clinical intake, basic symptom mapping, and guideline-grounded triage for individual health clarity.",
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyPerYearPrice: 0,
    highlightColor: "slate",
    ctaText: "Start Free Now",
    ctaLink: "/app",
    features: [
      { text: "Primary Yurrheeler General Triage Agent", tooltip: "General clinical consultation and triage reasoning" },
      { text: "Interactive 3D Anatomical Organ Viewer", tooltip: "Inspect organ systems and spatial symptoms" },
      { text: "Standard NICE & AHA Evidence Citations", tooltip: "Peer-reviewed guidelines backing explanations" },
      { text: "Local Health Timeline & Case History", tooltip: "Saved securely in your browser" },
      { text: "Doctor Visit Question Generator", tooltip: "Prepared questions for your next appointment" },
      { text: "Single Device Sync" },
    ],
  },
  {
    id: "pro",
    name: "Clinical Pro",
    popular: true,
    badge: "MOST POPULAR",
    description:
      "Full multi-specialist agent mesh, continuous biometric wearable ingestion, and advanced longitudinal summaries.",
    monthlyPrice: 24,
    annualPrice: 228,
    monthlyPerYearPrice: 19,
    highlightColor: "emerald",
    ctaText: "Begin 14-Day Pro Trial",
    ctaLink: "/app?tier=pro",
    features: [
      { text: "All 16+ Specialist Autonomous Agents", highlight: true, tooltip: "Cardia, Neura, Nephro, Pulmono, Ortho, Derm, etc." },
      { text: "Real-time Multi-Agent Consensus Deliberation", highlight: true, tooltip: "Cross-specialty peer review and differential analysis" },
      { text: "Wearable & Lab Report Ingestion (Apple, Garmin, Oura)", highlight: true, tooltip: "Continuous biometric telemetry synchronization" },
      { text: "Full 3D Organ Simulation with Dynamic Telemetry", highlight: true, tooltip: "Hemodynamic pressure, ECG Lead-II, and organ perfusion models" },
      { text: "Longitudinal EHR PDF & FHIR Export for Doctors", highlight: true, tooltip: "Print-ready clinical briefing packages" },
      { text: "Unlimited Consultations & Multi-Profile Support", tooltip: "Manage records for up to 4 family members" },
      { text: "Zero-Knowledge AES-256 Cloud Sync", tooltip: "End-to-end encrypted across all your devices" },
      { text: "Priority Agent Compute & Sub-second Deliberation" },
    ],
  },
  {
    id: "enterprise",
    name: "Health Systems & Clinics",
    badge: "INSTITUTIONAL",
    description:
      "Enterprise orchestration, FHIR/HL7 hospital interoperability, multi-clinician workspaces, and custom agent deployment.",
    monthlyPrice: 199,
    annualPrice: 1900,
    monthlyPerYearPrice: 158,
    highlightColor: "cyan",
    ctaText: "Contact Clinical Solutions",
    ctaLink: "#contact-enterprise",
    features: [
      { text: "All Clinical Pro Capabilities Included" },
      { text: "HL7 & FHIR EHR Bidirectional Bridge (Epic, Cerner)", highlight: true, tooltip: "Seamless hospital EHR data exchange" },
      { text: "Multi-Clinician Collaborative Diagnostic Board", highlight: true, tooltip: "Shared patient round boards and team handoffs" },
      { text: "Custom Hospital Clinical Guideline Injection", highlight: true, tooltip: "Integrate your institution's specific clinical protocols" },
      { text: "Dedicated Institutional HIPAA & BAA Agreement", highlight: true, tooltip: "Legal compliance and security governance" },
      { text: "Real-time Audit Logs & Explainability Ledger", tooltip: "Complete clinical traceability for every recommendation" },
      { text: "Dedicated Clinical Implementation Specialist" },
      { text: "Custom API & SDK Access with 99.99% SLA" },
    ],
  },
];

const FAQS = [
  {
    q: "Is Yurrheeler Med Advisor a replacement for my doctor?",
    a: "No. Yurrheeler is an intelligent clinical decision-support and health comprehension platform designed to help you synthesize symptoms, understand diagnostic evidence, and prepare structured summaries for consultations with your qualified physician.",
  },
  {
    q: "How does the 14-day Clinical Pro trial work?",
    a: "You get full, unrestricted access to all 16+ specialist agents, wearable integrations, and advanced 3D anatomical simulations for 14 days. No surprise charges, and you can cancel anytime with one click in your account settings.",
  },
  {
    q: "How is my personal medical data secured?",
    a: "We utilize zero-knowledge architecture. Your biometric records and consultation histories are encrypted with client-side AES-256-GCM encryption. Even our engineering team cannot view your decrypted medical data.",
  },
  {
    q: "Can I bring Yurrheeler reports to my appointment?",
    a: "Yes! Clinical Pro generates clean, standardized PDF briefings structured according to SOAP (Subjective, Objective, Assessment, Plan) and SBAR communication standards, complete with guideline citations that physicians appreciate.",
  },
  {
    q: "Can I switch between monthly and annual plans?",
    a: "Yes, you can upgrade, downgrade, or switch billing cadences anytime. Upgrades take effect immediately with prorated billing.",
  },
];

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);

  return (
    <TooltipProvider>
      <section
        id="pricing"
        className="py-28 md:py-36 bg-[#080b0e] relative overflow-hidden border-t border-white/10"
      >
        {/* Background Atmospheric Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header & Value Proposition */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Transparent Clinical Pricing
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight">
              Invest in precision clinical intelligence.
            </h2>
            <p className="text-slate-400 mt-4 text-base md:text-lg leading-relaxed font-light">
              Choose the tier that matches your health journey. From intuitive self-triage to institutional multi-specialist clinical orchestration.
            </p>

            {/* Monthly / Annual Billing Switcher */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-[#11161e] border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  !isAnnual
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  isAnnual
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Annual Billing</span>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                    isAnnual
                      ? "bg-slate-950/20 text-slate-950"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
            {TIERS.map((tier) => {
              const isPro = tier.popular;
              const isEnterprise = tier.id === "enterprise";

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                    isPro
                      ? "bg-gradient-to-b from-[#0f1722] via-[#0d131c] to-[#0a0f16] border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40 lg:-translate-y-2"
                      : isEnterprise
                      ? "bg-[#0b0e14] border border-cyan-500/30 hover:border-cyan-500/50"
                      : "bg-[#0b0e14] border border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Top Popular or Institutional Badge */}
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className={`px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${
                          isPro
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30"
                            : "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                        }`}
                      >
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white tracking-wide">
                        {tier.name}
                      </h3>
                      {isPro && (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <HeartPulse className="w-4 h-4" />
                        </div>
                      )}
                      {isEnterprise && (
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-light leading-relaxed mb-6 min-h-[48px]">
                      {tier.description}
                    </p>

                    {/* Price Display */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-medium font-mono text-white tracking-tight">
                          ${isAnnual ? tier.monthlyPerYearPrice : tier.monthlyPrice}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          / month
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        {tier.monthlyPrice === 0 ? (
                          "Free forever • No card required"
                        ) : isAnnual ? (
                          <span className="text-emerald-400 font-medium">
                            Billed annually (${tier.annualPrice}/yr) • Save 20%
                          </span>
                        ) : (
                          "Billed monthly • Cancel anytime"
                        )}
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-3.5 mb-8">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-2">
                        Included Features
                      </div>
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isPro
                                ? "bg-emerald-500/20 text-emerald-400"
                                : isEnterprise
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-white/10 text-slate-300"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </div>

                          <div className="flex items-center gap-1.5 flex-1">
                            <span
                              className={
                                feat.highlight
                                  ? "text-slate-100 font-medium"
                                  : "text-slate-300 font-light"
                              }
                            >
                              {feat.text}
                            </span>
                            {feat.tooltip && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-200 transition-colors"
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border border-white/10 text-xs text-slate-200 max-w-xs">
                                  {feat.tooltip}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action Button */}
                  <div>
                    {isEnterprise ? (
                      <Dialog open={enterpriseModalOpen} onOpenChange={setEnterpriseModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-11 rounded-xl text-xs font-semibold border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 hover:text-cyan-200 transition-all"
                          >
                            {tier.ctaText}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0e131b] border border-white/15 text-slate-200 sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-white text-lg font-semibold flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-cyan-400" />
                              Health System & Clinical Inquiries
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-xs mt-1">
                              Deploy specialized Yurrheeler agent clusters into your clinical department or hospital EHR framework.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-3 text-xs">
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Institution / Health System Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Mayo Clinic, NHS Trust, Memorial Health"
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Clinical Department or Role
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Chief Medical Information Officer, Cardiology"
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Work Email
                              </label>
                              <input
                                type="email"
                                placeholder="doctor@healthsystem.org"
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <Button
                              onClick={() => {
                                setEnterpriseModalOpen(false);
                              }}
                              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold h-10 rounded-lg text-xs mt-2"
                            >
                              Request Clinical Architecture Briefing
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Link to={tier.ctaLink} className="block w-full">
                        <Button
                          className={`w-full h-11 rounded-xl text-xs font-semibold transition-all ${
                            isPro
                              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          <span>{tier.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantee & Trust Badges Strip */}
          <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/10 max-w-4xl mx-auto mb-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">30-Day Money-Back Guarantee</span>
              <span className="text-slate-400 text-[11px] font-light">Full refund with no questions asked if unsatisfied.</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Zero-Knowledge Privacy</span>
              <span className="text-slate-400 text-[11px] font-light">AES-256 encrypted. We never sell or train on private data.</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">Accredited Evidence Base</span>
              <span className="text-slate-400 text-[11px] font-light">Cross-referenced against NICE, AHA, and KDIGO guidelines.</span>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-medium text-white tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Have questions regarding pricing, clinical evidence, or privacy?
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {FAQS.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-white/10 bg-[#0d1117] rounded-xl px-5 overflow-hidden"
                >
                  <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-white py-4 text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-400 font-light leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};
