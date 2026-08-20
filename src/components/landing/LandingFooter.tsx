import React from "react";
import { Stethoscope, HeartPulse } from "lucide-react";

export function LandingFooter() {
  const footerNavigation = {
    app: [
      { name: "AI Triage", href: "#" },
      { name: "Specialist Agents", href: "#" },
      { name: "Health Metrics", href: "#" },
      { name: "Anatomy Mapper", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Clinical Disclaimer", href: "#" },
    ],
  };

  return (
    <div className="mx-auto mt-6 max-w-7xl px-6 lg:px-8">
      <footer
        aria-labelledby="footer-heading"
        className="relative border-t border-slate-200 dark:border-slate-800 py-16 sm:py-24 sm:mt-16"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-16">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Yurrheeler<span className="text-blue-600 dark:text-blue-400">Med</span>
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Yurrheeler Med Advisor is an AI-powered clinical advisory and triage guidance tool designed for educational, informational, and triage prioritization purposes.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                Platform
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.app.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm leading-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                Legal
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm leading-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-xs text-slate-500 dark:text-slate-400">
          <div>&copy; {new Date().getFullYear()} Yurrheeler Med Advisor. All clinical triage rights reserved.</div>
          <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            <span>Gemini Clinical Engine Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
