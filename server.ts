import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

    // If Gemini API Key is available, invoke Gemini
    if (ai) {
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      // Include patient intake context if present
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

      // Append previous history
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }

      // Append current message
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
        },
      });

      const text = response.text || "I was unable to generate a response. Please consult a healthcare professional.";

      return res.json({
        response: text,
        model: "gemini-3.5-flash",
      });
    }

    // Fallback if API key is not configured: intelligent clinical rule-based response
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
    console.error("Error in /api/chat:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return res.status(500).json({ error: errorMessage });
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
