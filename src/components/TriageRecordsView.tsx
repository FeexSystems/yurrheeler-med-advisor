import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { 
  FileText, Calendar, Trash2, Eye, 
  Search, Stethoscope, Sparkles, LogIn, Database, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getUserTriageSessions, 
  deleteTriageSession, 
  StoredTriageSession 
} from "@/lib/triageService";
import { SessionSummaryModal } from "@/components/SessionSummaryModal";
import { toast } from "sonner";

interface TriageRecordsViewProps {
  onNewConsultation: () => void;
}

export const TriageRecordsView: React.FC<TriageRecordsViewProps> = ({ onNewConsultation }) => {
  const { user, login } = useAuth();
  const [sessions, setSessions] = useState<StoredTriageSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<StoredTriageSession | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const records = await getUserTriageSessions(user ? user.uid : null);
      setSessions(records);
    } catch (err) {
      console.error("Error fetching triage records:", err);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTriageSession(user ? user.uid : null, sessionId);
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      toast.success("Triage summary record deleted");
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error("Could not delete record");
    }
  };

  const filtered = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.agentName.toLowerCase().includes(q) ||
      s.agentSpecialty.toLowerCase().includes(q) ||
      (s.symptoms && s.symptoms.toLowerCase().includes(q)) ||
      (s.summaryDocument && s.summaryDocument.toLowerCase().includes(q))
    );
  });

  const getTriageBadge = (level?: string) => {
    switch (level) {
      case "EMERGENCY":
        return (
          <Badge className="bg-red-600 text-white font-bold text-[10px] py-0.5 px-2">
            Emergency
          </Badge>
        );
      case "URGENT":
        return (
          <Badge className="bg-amber-500 text-white font-bold text-[10px] py-0.5 px-2">
            Urgent
          </Badge>
        );
      case "SEMI-URGENT":
        return (
          <Badge className="bg-blue-600 text-white font-bold text-[10px] py-0.5 px-2">
            Semi-Urgent
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-600 text-white font-bold text-[10px] py-0.5 px-2">
            Routine
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Triage Records & Saved Clinical Summaries
            </h2>
            <Badge className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-xs">
              {sessions.length} Saved Records
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review formatted clinical triage reports, action plans, biomarker assessments, and key diagnostic findings generated across your specialist consultations.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records, symptoms, doctors..."
              className="pl-9 text-xs h-10 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchRecords}
            className="h-10 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          {!user && (
            <Button
              onClick={() => login()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </Button>
          )}
        </div>
      </div>

      {/* Sync Banner if Guest */}
      {!user && (
        <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              You are currently viewing local device records. <strong>Sign in with Google</strong> to securely back up and sync your consultation summaries to Firebase Firestore across all devices.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => login()}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-8 rounded-lg whitespace-nowrap self-start sm:self-auto"
          >
            Connect Cloud Sync
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-sm font-medium">Loading clinical records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No triage records found</h3>
          <p className="text-xs max-w-md mx-auto">
            {searchQuery
              ? "No session summaries matched your search query. Try another search keyword."
              : "When you end a consultation session with any of our 17 AI specialist doctors, an automated summary document highlighting key findings and action plans will appear here."}
          </p>
          <Button
            onClick={onNewConsultation}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 px-5 rounded-xl"
          >
            Start Medical Consultation
          </Button>
        </div>
      ) : (
        /* Records Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((record, index) => (
            <motion.div
              key={record.sessionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Card
                onClick={() => setSelectedSession(record)}
                className="h-full flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {record.agentName}
                        </CardTitle>
                        <CardDescription className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                          {record.agentSpecialty}
                        </CardDescription>
                      </div>
                    </div>

                    {getTriageBadge(record.triageLevel)}
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-1 flex-1 space-y-3">
                  {record.symptoms && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Symptoms: </span>
                      {record.symptoms}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {record.createdAt
                          ? new Date(record.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "Recent"}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400">
                      ID: {record.sessionId.slice(0, 6)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8 rounded-xl flex items-center justify-center gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSession(record);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Summary</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(record.sessionId, e)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full Document View Modal */}
      {selectedSession && (
        <SessionSummaryModal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          summaryDocument={selectedSession.summaryDocument || "No summary text available."}
          triageLevel={selectedSession.triageLevel}
          agentName={selectedSession.agentName}
          agentSpecialty={selectedSession.agentSpecialty}
          sessionId={selectedSession.sessionId}
          createdAt={selectedSession.createdAt}
        />
      )}
    </div>
  );
};
