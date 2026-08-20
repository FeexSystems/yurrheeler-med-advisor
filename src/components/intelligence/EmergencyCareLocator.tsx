import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  PhoneCall,
  ShieldAlert,
  Clock,
  Building2,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Pill,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface EmergencyCareLocatorProps {
  initialUrgency?: "critical" | "urgent" | "moderate" | "routine";
}

interface FacilityCard {
  id: string;
  name: string;
  category: "Trauma Center" | "Emergency Room" | "Urgent Care" | "24/7 Pharmacy";
  distance: string;
  driveTime: string;
  address: string;
  phone: string;
  capabilities: string[];
  openStatus: string;
  level: "emergency" | "urgent" | "routine";
}

const SAMPLE_FACILITIES: FacilityCard[] = [
  {
    id: "fac-1",
    name: "Metropolitan Academic Medical Center & Level 1 Trauma",
    category: "Trauma Center",
    distance: "2.8 miles",
    driveTime: "7-10 min",
    address: "100 University Health Blvd, Metro City",
    phone: "(555) 911-0100",
    capabilities: ["Level 1 Trauma", "Comprehensive Stroke Center", "STEMI Cath Lab", "Pediatric ER"],
    openStatus: "Open 24/7 • Real-time ER Wait: ~14 mins",
    level: "emergency"
  },
  {
    id: "fac-2",
    name: "St. Jude Memorial Community Emergency Center",
    category: "Emergency Room",
    distance: "4.1 miles",
    driveTime: "12 min",
    address: "450 St. Jude Parkway, Metro City",
    phone: "(555) 321-4400",
    capabilities: ["24/7 Acute Resuscitation", "CT & MRI on-site", "Cardiovascular Observation", "Ultrasound"],
    openStatus: "Open 24/7 • Real-time ER Wait: ~22 mins",
    level: "emergency"
  },
  {
    id: "fac-3",
    name: "ExpressCare Walk-In Urgent Care & Occupational Clinic",
    category: "Urgent Care",
    distance: "1.4 miles",
    driveTime: "4 min",
    address: "780 North Market Street, Suite 100",
    phone: "(555) 880-9210",
    capabilities: ["Digital X-Ray", "Laceration Suturing", "Point-of-Care Bloods", "IV Fluids", "Nebulizers"],
    openStatus: "Open Today: 7:00 AM – 10:00 PM • Wait: ~8 mins",
    level: "urgent"
  },
  {
    id: "fac-4",
    name: "MetroHealth 24-Hour Drive-Thru Community Pharmacy",
    category: "24/7 Pharmacy",
    distance: "0.9 miles",
    driveTime: "3 min",
    address: "320 West End Avenue, Metro City",
    phone: "(555) 777-1024",
    capabilities: ["Emergency Prescription Fills", "Asthma Inhalers", "EpiPens", "Medical Equipment"],
    openStatus: "Open 24/7",
    level: "routine"
  }
];

export const EmergencyCareLocator: React.FC<EmergencyCareLocatorProps> = ({
  initialUrgency = "urgent"
}) => {
  const [zipCode, setZipCode] = useState<string>("90210");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [urgencyTier, setUrgencyTier] = useState<string>(initialUrgency);
  const [facilityFilter, setFacilityFilter] = useState<string>("all");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locatorReport, setLocatorReport] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
        toast.success(`Acquired GPS coordinates: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
      },
      (err) => {
        setIsLocating(false);
        toast.error("Unable to retrieve location. Please use ZIP code search.");
      },
      { timeout: 8000 }
    );
  };

  const handleSearchFacilities = async () => {
    setIsLocating(true);
    setLocatorReport(null);

    try {
      const res = await fetch("/api/emergency-locator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: userCoords?.lat,
          longitude: userCoords?.lng,
          zipCode,
          urgencyLevel: urgencyTier,
          facilityType: facilityFilter
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setLocatorReport(data.locatorGuide);
      toast.success("Emergency facilities and triage route guide compiled!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error searching facilities";
      toast.error(msg);
    } finally {
      setIsLocating(false);
    }
  };

  const filteredFacilities = SAMPLE_FACILITIES.filter((f) => {
    if (facilityFilter === "er") return f.category === "Emergency Room" || f.category === "Trauma Center";
    if (facilityFilter === "urgent") return f.category === "Urgent Care";
    if (facilityFilter === "pharmacy") return f.category === "24/7 Pharmacy";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-red-500/40 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-600 text-white font-bold px-2.5 py-0.5 text-xs uppercase tracking-wider animate-pulse">
                Feature 5 • Geospatial Dispatch
              </Badge>
              <span className="text-xs text-rose-300 font-mono flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> Emergency Care & Urgent Locator Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Geospatial Emergency Room & Urgent Care Finder
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Match triage urgency severity with nearest open trauma centers, 24/7 emergency rooms, walk-in urgent care clinics, and pharmacies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:911"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Direct Emergency 911</span>
            </a>
          </div>
        </div>
      </div>

      {/* Triage Urgency Tier Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "critical", label: "🚨 Critical Emergency", desc: "Level 1 Trauma / ED STAT", border: "border-red-500", bg: "bg-red-50 dark:bg-red-950/50" },
          { id: "urgent", label: "⚠️ Urgent (Within 2-4h)", desc: "Urgent Care / Community ED", border: "border-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50" },
          { id: "moderate", label: "🟡 Semi-Urgent (24h)", desc: "Walk-In Clinic / Same-day", border: "border-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/50" },
          { id: "routine", label: "🟢 Non-Urgent / Rx", desc: "Outpatient / Pharmacy", border: "border-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setUrgencyTier(t.id)}
            className={`p-3 rounded-2xl text-left border transition-all ${
              urgencyTier === t.id
                ? `${t.bg} ${t.border} font-bold shadow-md ring-2 ring-red-500/20`
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</div>
            <div className="text-[11px] text-slate-500">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Location Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <Input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP Code or City (e.g. 90210, Manhattan NY)"
            className="text-xs h-9 rounded-xl max-w-xs"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleGetLocation}
            className="text-xs h-9 rounded-xl flex items-center gap-1.5 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            <span>Use My GPS</span>
          </Button>
        </div>

        {/* Facility Category Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Facilities" },
            { id: "er", label: "Emergency Rooms" },
            { id: "urgent", label: "Urgent Care" },
            { id: "pharmacy", label: "24/7 Pharmacies" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFacilityFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border shrink-0 transition-colors ${
                facilityFilter === f.id
                  ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 font-bold"
                  : "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}

          <Button
            size="sm"
            onClick={handleSearchFacilities}
            disabled={isLocating}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
          >
            {isLocating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Search Facilities</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Facilities List (Left 6) vs Grounded Guide (Right 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Nearby Facilities Cards */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-red-500" />
            Accredited Regional Medical Facilities ({filteredFacilities.length})
          </h3>

          <div className="space-y-3">
            {filteredFacilities.map((fac) => (
              <Card
                key={fac.id}
                className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-red-400 dark:hover:border-red-700 transition-all overflow-hidden"
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[9px] uppercase font-bold ${
                            fac.category === "Trauma Center"
                              ? "bg-red-600 text-white"
                              : fac.category === "Emergency Room"
                              ? "bg-rose-600 text-white"
                              : fac.category === "Urgent Care"
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {fac.category}
                        </Badge>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {fac.openStatus}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {fac.name}
                      </h4>
                      <p className="text-xs text-slate-500">{fac.address}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{fac.distance}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{fac.driveTime}</div>
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="flex flex-wrap gap-1">
                    {fac.capabilities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={`tel:${fac.phone}`}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{fac.phone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.name + " " + fac.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-500"
                    >
                      <span>Navigate Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: AI Triage Guide & Pre-Departure Checklist */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[480px] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-500" />
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Clinical Routing & Emergency Preparation Protocol
                  </CardTitle>
                </div>
                {locatorReport && (
                  <Badge className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[10px]">
                    Grounded Guide
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col">
              {isLocating ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/20 border-2 border-red-500 animate-pulse flex items-center justify-center text-red-600">
                      <Navigation className="w-7 h-7 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Grounding Nearest Emergency Facilities
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Matching triage urgency with trauma center capabilities, real-time hours, and pre-departure protocol...
                    </p>
                  </div>
                </div>
              ) : locatorReport ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto max-h-[460px] pr-2">
                    <ReactMarkdown>{locatorReport}</ReactMarkdown>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>If experiencing severe chest pain or syncope, call 911 immediately.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Default Emergency Guidance Box */}
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-950 dark:text-red-200 space-y-2">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Critical Triage Decision Matrix:</span>
                    </div>
                    <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                      <li><strong>Emergency Room (ED)</strong>: Crushing chest pain, severe breathlessness, stroke signs (FAST), severe burns, compound fractures, uncontrolled bleeding.</li>
                      <li><strong>Urgent Care Center</strong>: Moderate sprains, mild lacerations needing stitches, simple infections, low-grade fevers, ear pain, UTIs.</li>
                      <li><strong>24/7 Pharmacy</strong>: Prescription refills, nebulizers, emergency OTC allergy medications.</li>
                    </ul>
                  </div>

                  {/* Pre-Departure Checklist Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      🧳 What to Bring to the Emergency Room / Urgent Care:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Photo ID / Driver&apos;s License</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Health Insurance Card</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Active Medication List</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Emergency Contact Phone</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSearchFacilities}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-9 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Grounded Care Routing Guide</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
