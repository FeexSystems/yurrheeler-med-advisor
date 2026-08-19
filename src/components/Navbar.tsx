import React, { useState } from "react";
import { 
  Stethoscope, PhoneCall, ShieldAlert, 
  Menu, X, Sparkles, MessageSquare, 
  Users, Activity, BookOpen, Layers, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Agent } from "@/lib/agents";

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeAgent: Agent;
  onOpenAgentDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  activeAgent,
  onOpenAgentDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const navItems = [
    { id: "chat", label: "Triage Chat", icon: MessageSquare, badge: null },
    { id: "agents", label: "Specialists", icon: Users, badge: "17 Doctors" },
    { id: "metrics", label: "Health Metrics", icon: BarChart3, badge: "Recharts" },
    { id: "anatomy", label: "Anatomy Mapper", icon: Layers, badge: "Interactive" },
    { id: "biomarkers", label: "Vitals & Lab", icon: Activity, badge: "NEWS2" },
    { id: "protocols", label: "Protocols", icon: BookOpen, badge: null },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick("chat")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Yurrheeler<span className="text-blue-600 dark:text-blue-400">Med</span>
                </span>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold py-0 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800">
                  AI Clinical
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Multi-Specialty Clinical Triage & Health Advisory
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Toolbar: Theme Toggle, Active Agent Pill & Emergency Action */}
          <div className="flex items-center space-x-2">
            {/* Active Specialist Pill */}
            <button
              type="button"
              onClick={onOpenAgentDrawer}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all text-left"
              title="Click to switch specialist agent"
            >
              <img
                src={activeAgent.avatar_url}
                alt={activeAgent.name}
                className="w-7 h-7 rounded-full object-cover border border-blue-300 dark:border-blue-500"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>{activeAgent.name}</span>
                  <Sparkles className="w-3 h-3 text-blue-500" />
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate max-w-[100px]">
                  {activeAgent.specialty}
                </div>
              </div>
            </button>

            {/* Dark/Light Theme Toggle Component */}
            <ThemeToggle />

            {/* Emergency Hotline Trigger */}
            <Dialog open={emergencyModalOpen} onOpenChange={setEmergencyModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                  aria-label="Emergency Hotlines and Red Flags"
                >
                  <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden xs:inline">Emergency</span>
                  <span className="xs:hidden">911</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-lg">
                    <ShieldAlert className="w-5 h-5" />
                    Emergency Medical Response Protocols
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 dark:text-slate-400">
                    Immediate emergency numbers and life-threatening red flag symptoms.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl space-y-2">
                    <div className="font-bold text-red-900 dark:text-red-200 flex items-center justify-between">
                      <span>United States & Canada</span>
                      <a
                        href="tel:911"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-lg shadow-sm"
                      >
                        Call 911
                      </a>
                    </div>
                    <div className="font-bold text-red-900 dark:text-red-200 flex items-center justify-between pt-1 border-t border-red-200 dark:border-red-900/60">
                      <span>United Kingdom</span>
                      <a
                        href="tel:999"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-lg shadow-sm"
                      >
                        Call 999
                      </a>
                    </div>
                    <div className="font-bold text-red-900 dark:text-red-200 flex items-center justify-between pt-1 border-t border-red-200 dark:border-red-900/60">
                      <span>European Union</span>
                      <a
                        href="tel:112"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-lg shadow-sm"
                      >
                        Call 112
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Critical Red Flag Indicators:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Crushing or radiating chest pain / pressure</li>
                      <li>Acute shortness of breath or blue lips</li>
                      <li>Facial drooping, arm weakness, slurred speech (Stroke FAST)</li>
                      <li>Severe uncontrolled hemorrhage or deep lacerations</li>
                      <li>Acute confusion, delirium, or loss of consciousness</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
