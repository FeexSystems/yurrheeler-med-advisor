import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mic, HeartPulse, ShieldCheck, Activity, BrainCircuit, Users } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      title: "Voice-First Triage",
      description: "Speak your symptoms naturally. Our AI extracts clinical context with high precision.",
      icon: <Mic className="w-6 h-6 text-blue-500" />,
      size: "large",
      className: "md:col-span-2 lg:col-span-3",
    },
    {
      title: "17 Specialist Agents",
      description: "Direct routing to AI models trained on specific clinical domains.",
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      size: "medium",
      className: "md:col-span-2 lg:col-span-3",
    },
    {
      title: "NEWS2 Vitals Scoring",
      description: "Continuous physiological monitoring and risk stratification.",
      icon: <Activity className="w-6 h-6 text-indigo-500" />,
      size: "medium",
      className: "md:col-span-2 lg:col-span-2",
    },
    {
      title: "Evidence-Based Protocols",
      description: "Adheres to international emergency triage and referral guidelines.",
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      size: "medium",
      className: "md:col-span-2 lg:col-span-2",
    },
    {
      title: "Diagnostic Matrix",
      description: "Powered by Gemini 3.5, synthesizing millions of data points instantly.",
      icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
      size: "small",
      className: "md:col-span-2 lg:col-span-2",
    },
  ];

  return (
    <div className="mx-auto my-16 flex max-w-7xl flex-col gap-4 md:my-24 lg:my-32 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Clinical Intelligence, <span className="text-blue-600 dark:text-blue-400">Streamlined</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Everything you need for rapid, accurate medical triage in a secure, compliant environment.
        </p>
      </div>
      
      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {features.map((feature, i) => (
          <Card key={i} className={cn("overflow-hidden border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow", feature.className)}>
            <CardHeader className="pb-2">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-3">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
