import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Testimonials() {
  const testimonials = [
    {
      content: "YurrheelerMed has transformed our ED triage workflow. The multi-agent system identifies critical cases minutes before human triage completes.",
      author: "Dr. Sarah Chen",
      role: "Chief of Emergency Medicine",
      initials: "SC"
    },
    {
      content: "The ability to instantly consult with 17 different AI specialists provides an unparalleled safety net for our rural clinic.",
      author: "James Wilson, NP",
      role: "Lead Nurse Practitioner",
      initials: "JW"
    },
    {
      content: "As a diagnostic tool, the Gemini-powered matrix catches rare cross-specialty indicators that are easily missed during busy shifts.",
      author: "Dr. Elena Rodriguez",
      role: "Diagnostic Specialist",
      initials: "ER"
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 py-16 sm:py-24 border-y border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Trusted by Clinical Leaders
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            See how healthcare professionals are augmenting their practice with AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.author}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                  "{t.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
