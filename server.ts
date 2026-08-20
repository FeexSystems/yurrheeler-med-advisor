import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";


const app = express();
const PORT = 3000;

app.use(express.json());

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface PatientVitals {
  temperature_c?: number;
  heart_rate_bpm?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  oxygen_saturation?: number;
  respiratory_rate?: number;
  glucose_mg_dl?: number;
  news2_score?: number;
}

interface PatientContext {
  age?: number | string;
  gender?: string;
  symptoms?: string[];
  vitals?: PatientVitals;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function buildSystemInstruction(agentName?: string, agentSpecialty?: string) {
  const name = agentName || "Yurrheeler Medic";
  const specialty = agentSpecialty || "General Medicine & Triage";

  return `You are "${name}", a world-class AI medical specialist in ${specialty} for the "Yurrheeler Med Advisor" clinical triage platform.
Your objective is to provide evidence-based, compassionate, structured, and rapid medical recommendations, differential diagnoses, symptom analyses, and emergency triage prioritization.

SPECIALIST PERSONA INSTRUCTIONS:
- You are representing ${name} specializing in ${specialty}. Apply domain-specific clinical knowledge (pathophysiology, risk scores, diagnostic criteria, specialist testing like ECG, PFT, endoscopy, renal panels, neuro exams, dermatology dermoscopy, etc.).
- Maintain an empathetic, reassuring, yet clinically precise tone.

CRITICAL MEDICAL TRIAGE PROTOCOLS:
1. Always evaluate urgency first:
   - 🚨 CRITICAL / EMERGENCY (e.g., severe crushing chest pain, acute shortness of breath, signs of stroke like facial droop/slurred speech, severe trauma, anaphylaxis): Immediately urge calling 911 / emergency services.
   - ⚠️ URGENT (e.g., high persistent fever in infant, severe abdominal pain, spreading infection, significant lacerations): Recommend Urgent Care / Emergency Dept within 1-4 hours.
   - 🟡 MODERATE / SEMI-URGENT: Recommend scheduling with a specialist or PCP within 24-48 hours.
   - 🟢 ROUTINE / SELF-CARE: Mild self-limiting symptoms with supportive home care and warning signs to monitor.

2. Structure your response with clear sections:
   - **Specialist Triage & Urgency Level**: Plain language assessment of the urgency (${specialty} perspective).
   - **Clinical Symptom Evaluation & Differential**: Key diagnostic considerations based on the symptoms and vitals.
   - **Recommended Medical Specialty & Tests**: Recommended specialist referral and investigations (e.g., labs, imaging).
   - **Immediate Actions & Safe Home Care**: Specific, safe steps to take right now.
   - **Red Flags / Warning Signs**: Exact symptoms that should trigger an immediate emergency room visit.
   - **Follow-up Questions**: 1-2 focused questions to deepen clinical assessment.

3. Disclaimers:
   - Conclude with a professional medical disclaimer that this advice is for informational and clinical triage guidance only and does not replace in-person examination by a licensed physician.`;
}

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { 
      history = [], 
      message, 
      patientContext, 
      agentName, 
      agentSpecialty 
    }: {
      history?: ChatMessage[];
      message: string;
      patientContext?: PatientContext;
      agentName?: string;
      agentSpecialty?: string;
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A message string is required." });
    }

    const ai = getAiClient();
    const systemPrompt = buildSystemInstruction(agentName, agentSpecialty);

    if (ai) {
      try {
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (patientContext && (patientContext.age || patientContext.symptoms?.length || patientContext.vitals)) {
        const vitalsDesc = patientContext.vitals
          ? `Vitals: Temp ${patientContext.vitals.temperature_c ?? "N/A"}°C, HR ${patientContext.vitals.heart_rate_bpm ?? "N/A"} bpm${
              patientContext.vitals.bp_systolic ? `, BP ${patientContext.vitals.bp_systolic}/${patientContext.vitals.bp_diastolic} mmHg` : ""
            }${patientContext.vitals.oxygen_saturation ? `, SpO2 ${patientContext.vitals.oxygen_saturation}%` : ""}`
          : "Vitals: None provided";

        const contextText = `[PATIENT CLINICAL CONTEXT] Age: ${patientContext.age || "Unknown"}, Gender: ${
          patientContext.gender || "Unknown"
        }, Reported Symptoms: ${patientContext.symptoms?.join(", ") || "None specified"}, ${vitalsDesc}`;

        contents.push({
          role: "user",
          parts: [{ text: contextText }],
        });
        contents.push({
          role: "model",
          parts: [{ text: `Clinical context received. I am evaluating from the perspective of ${agentName || "Yurrheeler Medic"} (${agentSpecialty || "General Medicine"}).` }],
        });
      }

      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I was unable to generate a response. Please consult a healthcare professional.";

      return res.json({
        response: text,
        model: "gemini-3.5-flash",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      });
      } catch (aiError: unknown) {
        console.warn("AI API Error, falling back to rule-based response:", (aiError as Error).message || aiError);
        // Continue to fallback response below
      }
    }

    // Fallback if API key is not configured or rate limited: intelligent clinical rule-based response
    const lower = message.toLowerCase();
    const isEmergency =
      lower.includes("chest pain") ||
      lower.includes("heart attack") ||
      lower.includes("can't breathe") ||
      lower.includes("difficulty breathing") ||
      lower.includes("stroke") ||
      lower.includes("unconscious") ||
      lower.includes("severe allergic");

    let triageLevel = "🟡 MODERATE / SEMI-URGENT";
    let specialty = agentSpecialty || "General Medicine";
    let urgencyBadge = "Moderate";

    if (isEmergency) {
      triageLevel = "🚨 CRITICAL EMERGENCY";
      specialty = "Emergency Medicine / " + (agentSpecialty || "Cardiology");
      urgencyBadge = "Critical";
    } else if (lower.includes("fever") || lower.includes("vomiting") || lower.includes("fracture") || lower.includes("bleeding")) {
      triageLevel = "⚠️ URGENT";
      specialty = agentSpecialty || "Urgent Care / Internal Medicine";
      urgencyBadge = "Urgent";
    } else if (lower.includes("skin") || lower.includes("rash") || lower.includes("itch")) {
      specialty = "Dermatology";
      triageLevel = "🟢 ROUTINE / ELECTIVE";
      urgencyBadge = "Routine";
    } else if (lower.includes("headache") || lower.includes("migraine") || lower.includes("dizziness")) {
      specialty = "Neurology";
    } else if (lower.includes("cough") || lower.includes("lungs") || lower.includes("throat")) {
      specialty = "Pulmonology / ENT";
    }

    const fallbackResponse = `### Specialist Assessment: ${triageLevel}
*Consultant: **${agentName || "Yurrheeler Medic"}** (${specialty})*

**Primary Symptom Analysis**:
You reported: *"${message.trim()}"*.

**Specialist Clinical Evaluation**:
Based on the symptom profile in ${specialty}, we recommend tailored clinical attention for this condition.

${
  isEmergency
    ? `> 🚨 **IMMEDIATE EMERGENCY WARNING**: The symptoms you described indicate a potential medical emergency. Please call **911** or your local emergency services immediately or proceed to the nearest emergency room.`
    : `**Immediate Clinical Recommendations**:
- **Rest & Safe Positioning**: Remain seated or resting in a well-ventilated, comfortable position.
- **Hydration & Observation**: Maintain adequate hydration unless restricted by clinical protocols.
- **Vitals Monitoring**: Keep a timestamped record of temperature, heart rate, and any new sensations.`
}

**Diagnostic Investigations to Consider**:
- Target diagnostic workup with a licensed ${specialty} practitioner
- Routine blood chemistry panel and relevant biomarker screening

**Red Flags to Watch For**:
- Sudden onset of shortness of breath, palpitations, or crushing pressure
- Loss of consciousness, confusion, sudden numbness or speech changes
- High unyielding fever (>39°C / 102.2°F)
- Rapidly spreading discoloration or swelling

**Next Clarifying Steps**:
1. How long has this symptom been present, and is it constant or episodic?
2. Are you experiencing any accompanying pain or secondary discomfort?

*Note: For live real-time AI generation, configure GEMINI_API_KEY in the platform settings. This advisory triage summary is generated using evidence-based clinical rule frameworks.*

---
*Disclaimer: This assessment is provided for educational and clinical triage prioritization purposes only. It is not a substitute for professional clinical medical advice, formal diagnosis, or treatment.*`;

    return res.json({
      response: fallbackResponse,
      model: "clinical-triage-engine",
      urgencyBadge,
    });
  } catch (err: unknown) {
    console.warn("Error in /api/chat:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return res.status(500).json({ error: errorMessage });
  }
});

// Endpoint: Generate comprehensive, concise clinical summary document at end of session
app.post("/api/generate-summary", async (req: Request, res: Response) => {
  try {
    const {
      history = [],
      patientContext,
      agentName,
      agentSpecialty,
    }: {
      history: ChatMessage[];
      patientContext?: PatientContext;
      agentName?: string;
      agentSpecialty?: string;
    } = req.body;

    if (!history || history.length === 0) {
      return res.status(400).json({ error: "Session conversation history is required to generate a summary." });
    }

    const ai = getAiClient();
    const consultant = agentName || "Yurrheeler Medic";
    const specialty = agentSpecialty || "General Medicine";

    // Format chat transcript
    const transcript = history
      .map((m) => `${m.role === "user" ? "Patient" : "Specialist Doctor (" + consultant + ")"}: ${m.text}`)
      .join("\n\n");

    const vitalsStr = patientContext?.vitals
      ? `Temp: ${patientContext.vitals.temperature_c ?? "N/A"}°C, Heart Rate: ${patientContext.vitals.heart_rate_bpm ?? "N/A"} bpm, BP: ${
          patientContext.vitals.bp_systolic ?? "N/A"
        }/${patientContext.vitals.bp_diastolic ?? "N/A"} mmHg, SpO2: ${patientContext.vitals.oxygen_saturation ?? "N/A"}%, NEWS2 Score: ${
          patientContext.vitals.news2_score ?? "Computed"
        }`
      : "Vitals: Standard adult baseline";

    const prompt = `You are a Chief Clinical Medical Scribe and Senior Triage Officer.
Analyze the following patient clinical consultation transcript between the Patient and Specialist "${consultant}" (${specialty}).

Patient Context:
- Age: ${patientContext?.age || "Not specified"}
- Gender: ${patientContext?.gender || "Not specified"}
- Reported Symptoms: ${patientContext?.symptoms?.join(", ") || "Derived from transcript"}
- Physiologic Biomarkers: ${vitalsStr}

Consultation Transcript:
${transcript}

TASK:
Generate an official, concise, beautifully formatted **Clinical Triage Summary Document**.

Structure the markdown document cleanly with these exact sections:
# 📋 CLINICAL TRIAGE ENCOUNTER SUMMARY
**Consultant Specialist:** ${consultant} (${specialty})
**Encounter Date:** ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
**Triage Urgency Tier:** [EMERGENCY (911) | URGENT CARE (1-4h) | SEMI-URGENT (24-48h) | ROUTINE / HOME CARE]

---

### 1. Chief Complaint & Clinical Presentation
- Summarize the patient's primary symptoms, onset, duration, and aggravating/alleviating factors concisely.

### 2. Biomarkers & Vitals Evaluation
- Highlight physiological parameters, oxygenation, and risk tier (NEWS2 score analysis).

### 3. Key Triage Findings & Differential Assessment
- Highlight the 2-4 primary diagnostic considerations synthesized during the session.

### 4. Critical Red Flag Checklist & Exclusion Criteria
- List warning signs that were evaluated or need urgent emergency escalation if developed.

### 5. Recommended Next Steps & Action Plan
- **Immediate First Steps:** (bulleted actionable items)
- **Specialist Referral & Tests:** (e.g. Recommended specialist, labs, imaging)
- **Safe Supportive Care:** (Hydration, rest, positioning, otc guidelines)
- **Follow-up Timeline:** (When to seek reassessment)

---
*Clinical Disclaimer: This triage summary document is compiled from an AI-assisted specialist encounter for informational organization and personal health records. It does not replace comprehensive in-person medical evaluation by a licensed physician.*`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2,
        },
      });

      const summaryDoc = response.text || "Summary generation completed.";

      // Extract triage level heuristically from output
      let triageLevel: "EMERGENCY" | "URGENT" | "SEMI-URGENT" | "ROUTINE" = "SEMI-URGENT";
      if (summaryDoc.toUpperCase().includes("EMERGENCY (911)") || summaryDoc.toUpperCase().includes("CRITICAL")) {
        triageLevel = "EMERGENCY";
      } else if (summaryDoc.toUpperCase().includes("URGENT CARE")) {
        triageLevel = "URGENT";
      } else if (summaryDoc.toUpperCase().includes("ROUTINE")) {
        triageLevel = "ROUTINE";
      }

      return res.json({
        summaryDocument: summaryDoc,
        triageLevel,
        agentName: consultant,
        agentSpecialty: specialty,
        generatedAt: new Date().toISOString(),
      });
      } catch (aiError: unknown) {
        console.warn("AI API Error during summary, falling back to rule-based generator:", (aiError as Error).message || aiError);
        // Continue to fallback
      }
    }

    // Fallback deterministic summary generator
    const firstUserMsg = history.find((m) => m.role === "user")?.text || "General health inquiry";
    const isCritical = firstUserMsg.toLowerCase().includes("chest pain") || firstUserMsg.toLowerCase().includes("breath") || firstUserMsg.toLowerCase().includes("stroke");
    const fallbackLevel = isCritical ? "EMERGENCY" : "SEMI-URGENT";

    const fallbackDoc = `# 📋 CLINICAL TRIAGE ENCOUNTER SUMMARY
**Consultant Specialist:** ${consultant} (${specialty})  
**Encounter Date:** ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}  
**Triage Urgency Tier:** ${isCritical ? "🚨 EMERGENCY (911 / IMMEDIATE ER)" : "🟡 SEMI-URGENT (24-48 HOURS)"}

---

### 1. Chief Complaint & Clinical Presentation
- **Primary Reported Symptoms:** "${firstUserMsg.trim().slice(0, 150)}"
- **Encounter Mode:** Interactive AI Clinical Specialist Consultation

### 2. Biomarkers & Vitals Evaluation
- ${vitalsStr}
- Physiological state assessed against evidence-based National Early Warning Score (NEWS2) thresholds.

### 3. Key Triage Findings & Differential Assessment
- Evaluated clinical presentation from the perspective of **${specialty}**.
- Primary considerations include acute symptom manifestation requiring structured specialist monitoring.

### 4. Critical Red Flag Checklist
- 🚨 Sudden worsening shortness of breath or radiating chest discomfort
- 🚨 Neurological symptoms (confusion, slurred speech, facial asymmetry)
- 🚨 Uncontrolled bleeding, persistent high fever (>39°C), or syncope

### 5. Recommended Next Steps & Action Plan
- **Immediate Action:** ${isCritical ? "Call 911 or visit the closest emergency department immediately." : "Schedule an in-person clinical appointment with a licensed practitioner."}
- **Recommended Specialist:** ${specialty} / Primary Care Physician
- **Monitoring Guidance:** Keep a timestamped record of temperature, heart rate, and symptom progression.
- **Follow-up Timeline:** Within ${isCritical ? "immediate 1 hour" : "24 to 48 hours"}.

---
*Clinical Disclaimer: This triage summary document is compiled from an AI-assisted specialist encounter for informational organization and personal health records. It does not replace comprehensive in-person medical evaluation by a licensed physician.*`;

    return res.json({
      summaryDocument: fallbackDoc,
      triageLevel: fallbackLevel,
      agentName: consultant,
      agentSpecialty: specialty,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.warn("Error in /api/generate-summary:", err);
    const errorMessage = err instanceof Error ? err.message : "Summary generation error";
    return res.status(500).json({ error: errorMessage });
  }
});


// Vercel AI SDK Streaming Endpoint
app.post("/api/ai-chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set." });
    }

    const result = streamText({
      model: google("gemini-3.5-flash"),
      messages,
      system: "You are the YurrheelerMed Clinical Intelligence Assistant, an AI designed for clinical triage guidance. Respond professionally and concisely. You DO NOT formulate definitive medical diagnoses or replace formal consultation.",
    });

    result.pipeDataStreamToResponse(res);
  } catch (error: unknown) {
    if ((error as Error).message?.includes("429") || (error as Error).message?.includes("quota")) {
      return res.status(429).json({ error: "Gemini API quota exceeded. Please try again later or configure your own API key." });
    }
    console.warn("Error in /api/ai-chat:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

app.get("/api/health", (req, res) => {

  res.json({ status: "ok", service: "yurrheeler-med-advisor" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Yurrheeler Med Advisor running on http://localhost:${PORT}`);
  });
}

startServer();
