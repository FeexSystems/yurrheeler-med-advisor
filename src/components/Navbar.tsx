import React, { useState } from "react";
import { 
  Stethoscope, PhoneCall, ShieldAlert, 
  Menu, X, Sparkles, MessageSquare, 
  Users, Activity, BookOpen, Layers
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
    { id: "anatomy", label: "Anatomy Mapper", icon: Layers, badge: "Interactive" },
    { id: "biomarkers", label: "Vitals & Lab", icon: Activity, badge: "NEWS2" },
    { id: "protocols", label: "Protocols", icon: BookOpen, badge: null },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
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
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Yurrheeler<span className="text-blue-600">Med</span>
                </span>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold py-0 text-blue-700 bg-blue-50 border-blue-200">
                  AI Clinical
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
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
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Toolbar: Active Agent Pill & Emergency Action */}
          <div className="flex items-center space-x-2.5">
            {/* Active Specialist Pill */}
            <button
              type="button"
              onClick={onOpenAgentDrawer}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 rounded-xl transition-all text-left"
              title="Click to switch specialist agent"
            >
              <img
                src={activeAgent.avatar_url}
                alt={activeAgent.name}
                className="w-7 h-7 rounded-full object-cover border border-blue-300"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <span>{activeAgent.name}</span>
                  <Sparkles className="w-3 h-3 text-blue-500" />
                </div>
                <div className="text-slate-500 text-[10px] truncate max-w-[100px]">
                  {activeAgent.specialty}
                </div>
              </div>
            </button>

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
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600 font-bold text-lg">
                    <ShieldAlert className="w-5 h-5" />
                    Emergency Medical Response Protocols
                  </DialogTitle>
                  <DialogDescription>
                    Immediate emergency numbers and life-threatening red flag symptoms.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 text-sm text-slate-700">
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2">
                    <div className="font-bold text-red-900 flex items-center justify-between">
                      <span>United States & Canada</span>
                      <a
                        href="tel:911"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-lg shadow-sm"
                      >
                        Call 911
                      </a>
                    </div>
                    <div className="font-bold text-red-900 flex items-center justify-between pt-1 border-t border-red-200">
                      <span>United Kingdom</span>
                      <a
                        href="tel:999"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-lg shadow-sm"
                      >
                        Call 999
                      </a>
                    </div>
                    <div className="font-bold text-red-900 flex items-center justify-between pt-1 border-t border-red-200">
                      <span>European Union</span>
                      <a
                        href="tel:112"
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-lg shadow-sm"
                      >
                        Call 112
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Critical Red Flag Indicators:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
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
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200/80 space-y-1">
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
                      : "text-slate-700 hover:bg-slate-100"
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
                          : "bg-blue-50 text-blue-700"
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
