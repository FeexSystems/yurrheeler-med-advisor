export type AgentState = "idle" | "observing" | "reasoning" | "consulting" | "speaking" | "complete";

export interface EvidenceNode {
  id: string;
  title: string;
  source: string;
  type: "guideline" | "study" | "record" | "lab" | "observation";
  confidence: "high" | "medium" | "low" | "conflicting";
  relatedRegions: string[];
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export type ClinicalEvent =
  | { id: string; timestamp: string; type: "patient.input"; text: string }
  | { id: string; timestamp: string; type: "vital.recorded"; source: string; details: Record<string, unknown> }
  | { id: string; timestamp: string; type: "agent.activated"; agentId: string; reason?: string }
  | { id: string; timestamp: string; type: "agent.reasoning"; agentId: string; text?: string }
  | { id: string; timestamp: string; type: "anatomy.selected"; regionId: string }
  | { id: string; timestamp: string; type: "evidence.retrieved"; evidenceId: string; title?: string }
  | { id: string; timestamp: string; type: "evidence.connected"; evidenceId: string; regionId: string }
  | { id: string; timestamp: string; type: "clinical.observation"; text: string; confidence?: string }
  | { id: string; timestamp: string; type: "clinical.warning"; text: string; severity?: string }
  | { id: string; timestamp: string; type: "clinical.recommendation"; text: string; agentId?: string }
  | { id: string; timestamp: string; type: "consultation.completed"; agentId: string };

export interface AnatomicalRegion {
  id: string;
  label: string;
  system: string;
  position: [number, number, number];
  relatedAgents: string[];
}

