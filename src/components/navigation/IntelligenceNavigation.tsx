import React from "react";
import {
  Sparkles,
  MessageSquare,
  Users,
  Layers,
  Activity,
  BookOpen,
  FileText,
  UserCircle,
  Settings,
  ShieldCheck,
  Search,
  Eye,
  Mic,
  Pill,
  MapPin,
  HeartPulse
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  badge?: string;
}

export const navItems: NavItem[] = [
  { id: "overview", label: "Intelligence Overview", shortLabel: "Overview", icon: Sparkles, badge: "Live" },
  { id: "chat", label: "Clinical Conversation", shortLabel: "Conversation", icon: MessageSquare },
  { id: "multimodal", label: "Multimodal Vision Triage", shortLabel: "Vision", icon: Eye, badge: "Vision" },
  { id: "consensus", label: "Specialist Consensus Panel", shortLabel: "Tumor Board", icon: Users, badge: "17 AI" },
  { id: "voice", label: "Voice & Acoustic Triage", shortLabel: "Voice/Cough", icon: Mic, badge: "Acoustics" },
  { id: "drugs", label: "Drug Safety Matrix", shortLabel: "Drug Matrix", icon: Pill, badge: "Rx Safety" },
  { id: "emergency", label: "ER & Urgent Locator", shortLabel: "ER Locator", icon: MapPin, badge: "GPS" },
  { id: "aichat", label: "Stream Synthesis", shortLabel: "Stream", icon: Sparkles },
  { id: "agents", label: "Specialist Constellation", shortLabel: "Specialists", icon: Users, badge: "17" },
  { id: "anatomy", label: "Spatial Anatomy", shortLabel: "Anatomy", icon: Layers },
  { id: "health", label: "Health Intelligence", shortLabel: "Health", icon: Activity },
  { id: "evidence", label: "Evidence Layer", shortLabel: "Evidence", icon: BookOpen, badge: "NICE" },
  { id: "records", label: "Triage Records", shortLabel: "Records", icon: FileText },
  { id: "protocols", label: "Protocols", shortLabel: "Protocols", icon: ShieldCheck },
  { id: "profile", label: "Patient Health Context", shortLabel: "Profile", icon: UserCircle },
  { id: "settings", label: "System Settings", shortLabel: "Settings", icon: Settings },
];

interface IntelligenceNavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenSearch?: () => void;
}

export const IntelligenceNavigation: React.FC<IntelligenceNavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
}) => {
  return (
    <div className="w-full bg-white/90 dark:bg-[#090d14]/90 border-b border-slate-200 dark:border-white/10 sticky top-0 z-30 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-2">
          {/* Scrollable Navigation Strip */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-1.5 py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer select-none shrink-0 ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-slate-200 hover:bg-emerald-50/60 dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>

          {/* Quick Search Shortcut Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-black/60 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-mono shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Search</span>
              <kbd className="text-[10px] bg-white dark:bg-white/10 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                ⌘K
              </kbd>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
