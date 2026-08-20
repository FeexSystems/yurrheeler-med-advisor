import React, { useState } from "react";
import { 
  Stethoscope, PhoneCall, ShieldAlert, 
  Menu, X, Sparkles, MessageSquare, 
  Users, Activity, BookOpen, Layers, BarChart3,
  FileText, LogIn, LogOut, User as UserIcon, CheckCircle2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Agent } from "@/lib/agents";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const { user, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const navItems = [
    { id: "chat", label: "Triage Chat", icon: MessageSquare, badge: null },
    { id: "records", label: "Triage Records", icon: FileText, badge: "Summaries" },
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

  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      await login();
      toast.success("Signed in successfully with Google");
    } catch (err: unknown) {
      const isPopupClosed = err && typeof err === "object" && "code" in err && (err as { code: string }).code === "auth/popup-closed-by-user";
      if (!isPopupClosed) {
        const errorMsg = err instanceof Error ? err.message : "Failed to sign in";
        toast.error("Sign-in error: " + errorMsg);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
    } catch {
      toast.error("Sign out failed");
    }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Yurrheeler<span className="text-emerald-600 dark:text-emerald-400">Med</span>
                </span>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold py-0 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-emerald-800 text-emerald-100"
                          : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Toolbar: Google Auth, Theme Toggle, Active Agent Pill & Emergency Action */}
          <div className="flex items-center space-x-2">
            {/* Active Specialist Pill */}
            <button
              type="button"
              onClick={onOpenAgentDrawer}
              className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all text-left"
              title="Click to switch specialist agent"
            >
              <img
                src={activeAgent.avatar_url}
                alt={activeAgent.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400 dark:border-emerald-500"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>{activeAgent.name}</span>
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate max-w-[80px]">
                  {activeAgent.specialty}
                </div>
              </div>
            </button>

            {/* Google Authentication Control */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 rounded-full flex items-center gap-2 px-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-6 h-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span className="text-xs font-semibold max-w-[90px] truncate text-slate-800 dark:text-slate-200 hidden sm:inline">
                      {user.displayName?.split(" ")[0] || "Patient"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                        {user.displayName || "Patient User"}
                      </p>
                      <p className="text-[11px] leading-none text-slate-500 truncate">
                        {user.email}
                      </p>
                      <div className="pt-1">
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] py-0">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Firestore Synced
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavClick("records")} className="text-xs cursor-pointer">
                    <FileText className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                    <span>My Triage Records</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick("chat")} className="text-xs cursor-pointer">
                    <MessageSquare className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                    <span>Active Consultation</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                disabled={authLoading}
                className="text-xs font-semibold h-9 rounded-xl border-emerald-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}

            {/* Dark/Light Theme Toggle Component */}
            <ThemeToggle />

            {/* Emergency Hotline Trigger */}
            <Dialog open={emergencyModalOpen} onOpenChange={setEmergencyModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm h-9 rounded-xl"
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
