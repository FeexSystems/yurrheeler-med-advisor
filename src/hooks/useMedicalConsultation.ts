import { useState, useCallback, useEffect } from "react";
import { ChatMessage, PatientContext, SymptomRecord, TriageUrgency } from "@/types/consultation";
import { Agent, agents, getAgentById } from "@/lib/agents";

const getLocalizedTimestamp = () => {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
};

const createInitialGreeting = (agent: Agent): ChatMessage => ({
  id: `msg-welcome-${agent.id}`,
  role: "model",
  text: `Hello, I am **${agent.name}**, specializing in **${agent.specialty}**.\n\n${agent.description}\n\nPlease describe the symptoms you or your patient are experiencing (e.g., onset, severity, location, accompanying sensations). I will provide immediate specialist evaluation and clinical triage guidance.`,
  timestamp: getLocalizedTimestamp(),
  urgency: "routine",
});

export function useMedicalConsultation(initialAgentId = "yurrheeler") {
  const [selectedAgent, setSelectedAgentState] = useState<Agent>(() => {
    return getAgentById(initialAgentId) || agents[0];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem("yurrheeler_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    const currentAgent = getAgentById(initialAgentId) || agents[0];
    return [createInitialGreeting(currentAgent)];
  });

  const [symptomsHistory, setSymptomsHistory] = useState<SymptomRecord[]>(() => {
    try {
      const saved = sessionStorage.getItem("yurrheeler_symptoms_history");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [patientContext, setPatientContext] = useState<PatientContext>(() => {
    try {
      const saved = sessionStorage.getItem("yurrheeler_patient_context");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      symptoms: [],
      vitals: {
        temperature_c: 37.0,
        heart_rate_bpm: 72,
        bp_systolic: 120,
        bp_diastolic: 80,
        oxygen_saturation: 98,
      },
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem("yurrheeler_chat_messages", JSON.stringify(messages));
      sessionStorage.setItem("yurrheeler_symptoms_history", JSON.stringify(symptomsHistory));
      sessionStorage.setItem("yurrheeler_patient_context", JSON.stringify(patientContext));
      sessionStorage.setItem("yurrheeler_active_agent_id", selectedAgent.id);
    } catch {
      // ignore
    }
  }, [messages, symptomsHistory, patientContext, selectedAgent]);

  const selectAgent = useCallback((agent: Agent) => {
    setSelectedAgentState(agent);
    const greeting = createInitialGreeting(agent);
    // If conversation only had initial greeting, replace it; otherwise add introduction
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [greeting];
      }
      return [
        ...prev,
        {
          id: `msg-switch-${Date.now()}`,
          role: "model",
          text: `🔄 **Consultation transferred to ${agent.name}** (${agent.specialty}).\n\n${agent.description}`,
          timestamp: getLocalizedTimestamp(),
          urgency: "routine",
        },
      ];
    });
  }, []);

  const detectUrgency = (text: string): TriageUrgency => {
    const lower = text.toLowerCase();
    if (
      lower.includes("critical emergency") ||
      lower.includes("🚨") ||
      lower.includes("call 911") ||
      lower.includes("immediate medical emergency") ||
      lower.includes("emergency department immediately")
    ) {
      return "critical";
    }
    if (lower.includes("urgent care") || lower.includes("⚠️") || lower.includes("urgency level: urgent")) {
      return "urgent";
    }
    if (lower.includes("moderate") || lower.includes("semi-urgent") || lower.includes("🟡")) {
      return "moderate";
    }
    return "routine";
  };

  const sendMessage = useCallback(
    async (userInput: string) => {
      const trimmed = userInput.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMsgId = `user-${Date.now()}`;
      const now = getLocalizedTimestamp();

      const newUserMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        text: trimmed,
        timestamp: now,
      };

      const newSymptomRecord: SymptomRecord = {
        id: `symptom-${Date.now()}`,
        text: trimmed,
        timestamp: now,
        sessionIndex: symptomsHistory.length + 1,
      };

      setMessages((prev) => [...prev, newUserMsg]);
      setSymptomsHistory((prev) => [...prev, newSymptomRecord]);
      setPatientContext((prev) => ({
        ...prev,
        symptoms: Array.from(new Set([...prev.symptoms, trimmed])),
      }));

      setIsLoading(true);

      try {
        const historyForApi = messages
          .filter((m) => !m.id.startsWith("msg-welcome"))
          .map((m) => ({
            role: m.role,
            text: m.text,
          }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history: historyForApi,
            message: trimmed,
            patientContext,
            agentName: selectedAgent.name,
            agentSpecialty: selectedAgent.specialty,
            agentId: selectedAgent.id,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with ${response.status}`);
        }

        const data = await response.json();
        const aiText: string = data.response || "No response received from triage assistant.";
        const urgency = detectUrgency(aiText);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "model",
          text: aiText,
          timestamp: getLocalizedTimestamp(),
          urgency,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: unknown) {
        console.error("Consultation inquiry error:", err);
        const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errMsg);

        const fallbackAiMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: "model",
          text: `⚠️ **System Notice**: We encountered a temporary connection issue.

If this is an emergency (such as severe chest pain, acute shortness of breath, facial droop, or heavy bleeding), please **call 911 or proceed to the nearest emergency room immediately**.

*Error details: ${errMsg}*`,
          timestamp: getLocalizedTimestamp(),
          urgency: "critical",
          isError: true,
        };

        setMessages((prev) => [...prev, fallbackAiMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, symptomsHistory.length, patientContext, selectedAgent]
  );

  const resetConsultation = useCallback(() => {
    const greeting = createInitialGreeting(selectedAgent);
    setMessages([greeting]);
    setSymptomsHistory([]);
    setPatientContext({
      symptoms: [],
      vitals: {
        temperature_c: 37.0,
        heart_rate_bpm: 72,
        bp_systolic: 120,
        bp_diastolic: 80,
        oxygen_saturation: 98,
      },
    });
    setError(null);
    try {
      sessionStorage.removeItem("yurrheeler_chat_messages");
      sessionStorage.removeItem("yurrheeler_symptoms_history");
      sessionStorage.removeItem("yurrheeler_patient_context");
    } catch {
      // ignore
    }
  }, [selectedAgent]);

  const exportConsultation = useCallback((format: "json" | "txt" = "txt") => {
    const dateStr = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString();

    if (format === "json") {
      const exportData = {
        metadata: {
          platform: "Yurrheeler AI Medical Advisor",
          exportDate: dateStr,
          exportTime: timeStr,
          consultingAgent: {
            id: selectedAgent.id,
            name: selectedAgent.name,
            specialty: selectedAgent.specialty,
          },
        },
        patient: {
          age: patientContext.age ?? "Not provided",
          gender: patientContext.gender ?? "Not provided",
          vitals: patientContext.vitals ?? {},
          reportedSymptoms: symptomsHistory.map((s) => ({
            text: s.text,
            timestamp: s.timestamp,
          })),
        },
        transcript: messages.map((m) => ({
          speaker: m.role === "user" ? "Patient" : selectedAgent.name,
          timestamp: m.timestamp,
          urgencyClassification: m.urgency || "routine",
          message: m.text,
        })),
        disclaimer:
          "This consultation transcript is generated by Yurrheeler AI for informational and clinical triage prioritization. It is not an official medical record or definitive diagnostic prescription.",
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `yurrheeler-consultation-${selectedAgent.id}-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      let txtContent = `======================================================================\n`;
      txtContent += `      YURRHEELER AI CLINICAL MEDICAL CONSULTATION SUMMARY\n`;
      txtContent += `======================================================================\n`;
      txtContent += `Consultation Date: ${dateStr} at ${timeStr}\n`;
      txtContent += `Attending Specialist: ${selectedAgent.name} (${selectedAgent.specialty})\n`;
      txtContent += `Patient Profile: Age ${patientContext.age ?? "N/A"} | Sex ${patientContext.gender ?? "N/A"}\n`;
      if (patientContext.vitals) {
        txtContent += `Vitals: Temp ${patientContext.vitals.temperature_c ?? "37.0"}°C | HR ${
          patientContext.vitals.heart_rate_bpm ?? "72"
        } bpm | BP ${patientContext.vitals.bp_systolic ?? "120"}/${
          patientContext.vitals.bp_diastolic ?? "80"
        } mmHg | SpO2 ${patientContext.vitals.oxygen_saturation ?? "98"}%\n`;
      }
      txtContent += `----------------------------------------------------------------------\n\n`;

      txtContent += `[TRACKED SYMPTOMS LOG]\n`;
      if (symptomsHistory.length === 0) {
        txtContent += `None recorded in structured log.\n`;
      } else {
        symptomsHistory.forEach((s, idx) => {
          txtContent += `${idx + 1}. [${s.timestamp}] ${s.text}\n`;
        });
      }
      txtContent += `\n----------------------------------------------------------------------\n`;
      txtContent += `[CONSULTATION TRANSCRIPT]\n\n`;

      messages.forEach((m) => {
        const sender = m.role === "user" ? "PATIENT" : selectedAgent.name.toUpperCase();
        txtContent += `[${m.timestamp}] ${sender}:\n${m.text}\n\n`;
      });

      txtContent += `======================================================================\n`;
      txtContent += `CLINICAL DISCLAIMER:\n`;
      txtContent += `This AI clinical advisory transcript is intended for educational and triage\n`;
      txtContent += `prioritization purposes only. It is not a substitute for professional clinical\n`;
      txtContent += `evaluation, official diagnosis, or prescriptive treatment by a licensed physician.\n`;
      txtContent += `======================================================================\n`;

      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `yurrheeler-consultation-${selectedAgent.id}-${dateStr}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [selectedAgent, patientContext, symptomsHistory, messages]);

  return {
    agents,
    selectedAgent,
    selectAgent,
    messages,
    symptomsHistory,
    patientContext,
    setPatientContext,
    isLoading,
    error,
    sendMessage,
    resetConsultation,
    exportConsultation,
  };
}
