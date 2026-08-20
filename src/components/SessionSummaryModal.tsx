import React, { useState } from "react";
import Markdown from "react-markdown";
import { 
  FileText, Printer, Copy, Check, ShieldAlert, 
  Download, Sparkles, User, Calendar, Stethoscope, Share2, AlertCircle, CheckCircle2 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryDocument: string;
  triageLevel?: "EMERGENCY" | "URGENT" | "SEMI-URGENT" | "NON-URGENT" | "ROUTINE";
  agentName: string;
  agentSpecialty: string;
  sessionId?: string;
  createdAt?: string;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  summaryDocument,
  triageLevel = "SEMI-URGENT",
  agentName,
  agentSpecialty,
  sessionId,
  createdAt,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryDocument);
      setCopied(true);
      toast.success("Triage summary copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([summaryDocument], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Clinical_Triage_Summary_${agentName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Summary document downloaded (.md)");
  };

  const getTriageBadge = (level: string) => {
    switch (level) {
      case "EMERGENCY":
        return (
          <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>EMERGENCY 911</span>
          </Badge>
        );
      case "URGENT":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>URGENT CARE (1-4h)</span>
          </Badge>
        );
      case "SEMI-URGENT":
        return (
          <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-sm">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>SEMI-URGENT (24-48h)</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ROUTINE / HOME CARE</span>
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl">
        {/* Document Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <DialogTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Clinical Triage Encounter Record
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-600 dark:text-slate-400">
                Automated clinical synthesis, key findings, and recommended next steps.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              {getTriageBadge(triageLevel)}
            </div>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Specialist: <strong>{agentName}</strong> ({agentSpecialty})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {sessionId && (
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                ID: {sessionId.slice(0, 8)}...
              </div>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Verified Medical Summary</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        {/* Formatted Markdown Body */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="markdown-body text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-4">
            <Markdown>{summaryDocument}</Markdown>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Encrypted & stored in your secure patient records.
          </span>
          <Button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-5 rounded-xl shadow-xs"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
