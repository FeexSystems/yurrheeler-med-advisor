import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "Is this a replacement for a human doctor?",
      answer: "No. YurrheelerMed is an AI-powered clinical advisory and triage guidance tool designed for educational, informational, and triage prioritization purposes. It does not formulate a definitive medical diagnosis or replace formal consultation by a licensed healthcare professional."
    },
    {
      question: "How does the multi-agent system work?",
      answer: "The platform routes your clinical data through a primary triage orchestrator, which then consults up to 17 specialized AI agents (e.g., Cardiology, Neurology) simultaneously. They debate and synthesize a unified triage recommendation in real-time."
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes. All data is processed securely and is not used to train public foundation models. We adhere to strict data privacy standards and HIPAA guidelines for ephemeral processing."
    },
    {
      question: "Can I use voice dictation for symptoms?",
      answer: "Absolutely. The interface supports hands-free voice dictation powered by advanced Speech-to-Text models that are fine-tuned for medical terminology."
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Everything you need to know about the platform.
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-slate-200 dark:border-slate-800">
            <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
