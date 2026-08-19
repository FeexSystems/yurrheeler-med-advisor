export interface PatientVitals {
  temperature_c?: number;
  heart_rate_bpm?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  oxygen_saturation?: number;
}

export interface PatientContext {
  age?: number;
  gender?: string;
  symptoms: string[];
  vitals?: PatientVitals;
}

export type TriageUrgency = "critical" | "urgent" | "moderate" | "routine" | "unknown";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  urgency?: TriageUrgency;
  isError?: boolean;
}

export interface SymptomRecord {
  id: string;
  text: string;
  timestamp: string;
  sessionIndex: number;
}
