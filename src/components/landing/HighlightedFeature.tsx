import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HighlightedFeature() {
  const benefits = [
    "Red-flag symptom detection",
    "Automated clinical summaries",
    "Seamless specialist handoffs",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="order-2 lg:order-1">
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-xl aspect-square sm:aspect-video lg:aspect-square flex items-center justify-center">
            {/* Abstract visual representation of AI processing */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
            <div className="relative w-3/4 h-3/4 rounded-xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl p-6 flex flex-col gap-4">
              <div className="w-full h-8 bg-slate-200/50 dark:bg-slate-700/50 rounded-md animate-pulse" />
              <div className="w-2/3 h-8 bg-blue-200/50 dark:bg-blue-900/30 rounded-md animate-pulse delay-75" />
              <div className="w-5/6 h-8 bg-slate-200/50 dark:bg-slate-700/50 rounded-md animate-pulse delay-150" />
              <div className="w-1/2 h-8 bg-emerald-200/50 dark:bg-emerald-900/30 rounded-md animate-pulse delay-300" />
              
              <div className="mt-auto grid grid-cols-2 gap-4">
                <div className="h-16 bg-white/60 dark:bg-slate-800/60 rounded-lg" />
                <div className="h-16 bg-white/60 dark:bg-slate-800/60 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-1 lg:order-2 flex flex-col justify-center space-y-6 lg:pl-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-semibold text-indigo-800 dark:text-indigo-300 w-max">
            <span>Powered by Gemini 3.5</span>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Triage precision that scales with your clinical needs.
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Our multi-agent system doesn't just parse text; it understands medical context. It evaluates differential diagnoses in real-time, drastically reducing time-to-treatment for critical patients.
          </p>
          
          <ul className="space-y-3 mt-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <div className="pt-4">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-full px-6 h-12 shadow-md">
              View Technical Specs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
