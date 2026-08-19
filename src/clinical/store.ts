import { create } from 'zustand';
import { AgentState, EvidenceNode, ClinicalEvent } from './types';

export interface ThresholdAlerts {
  heartRate: { min: number; max: number };
  systolicBP: { min: number; max: number };
  diastolicBP: { min: number; max: number };
  oxygenSaturation: { min: number; max: number };
  temperature: { min: number; max: number };
}

interface ClinicalVisualizationState {
  selectedRegion?: string;
  activeAgents: string[];
  agentStates: Record<string, AgentState>;
  evidence: EvidenceNode[];
  clinicalEvents: ClinicalEvent[];
  activeSignals: string[];
  confidence?: {
    value?: number;
    label: "high" | "medium" | "low" | "uncertain";
  };
  visualizationMode: "overview" | "anatomy" | "agent" | "evidence" | "timeline";
  thresholdAlerts: ThresholdAlerts;
  setSelectedRegion: (regionId?: string) => void;
  activateAgent: (agentId: string) => void;
  deactivateAgent: (agentId: string) => void;
  setAgentState: (agentId: string, state: AgentState) => void;
  addEvidence: (evidence: EvidenceNode) => void;
  addEvent: (event: ClinicalEvent) => void;
  setVisualizationMode: (mode: "overview" | "anatomy" | "agent" | "evidence" | "timeline") => void;
  updateThresholds: (thresholds: Partial<ThresholdAlerts>) => void;
}

export const useClinicalStore = create<ClinicalVisualizationState>((set) => ({
  selectedRegion: undefined,
  activeAgents: [],
  agentStates: {},
  evidence: [],
  clinicalEvents: [
    {
      id: "ev-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: "patient.input",
      text: "Experiencing sharp chest pain on the left side that started 30 minutes ago."
    },
    {
      id: "ev-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      type: "agent.activated",
      agentId: "yurrheeler",
      reason: "Triage ingestion initiated."
    },
    {
      id: "ev-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
      type: "anatomy.selected",
      regionId: "heart"
    },
    {
      id: "ev-4",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      type: "agent.activated",
      agentId: "cardia",
      reason: "Cardiovascular specialist invoked based on symptoms."
    },
    {
      id: "ev-5",
      timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
      type: "vital.recorded",
      source: "Apple Watch (Patient Sync)",
      details: {
        heart_rate: 112,
        systolic: 145,
        diastolic: 92
      }
    },
    {
      id: "ev-6",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      type: "agent.reasoning",
      agentId: "cardia",
      text: "Elevated heart rate and blood pressure observed alongside localized chest pain."
    },
    {
      id: "ev-7",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: "clinical.warning",
      text: "Potential for acute coronary syndrome. Recommending immediate ECG.",
      severity: "high"
    }
  ],
  activeSignals: [],
  visualizationMode: "overview",
  thresholdAlerts: {
    heartRate: { min: 50, max: 110 },
    systolicBP: { min: 90, max: 140 },
    diastolicBP: { min: 60, max: 90 },
    oxygenSaturation: { min: 94, max: 100 },
    temperature: { min: 36.1, max: 37.8 },
  },
  setSelectedRegion: (regionId) => set({ selectedRegion: regionId }),
  activateAgent: (agentId) => set((state) => ({ 
    activeAgents: state.activeAgents.includes(agentId) ? state.activeAgents : [...state.activeAgents, agentId],
    agentStates: { ...state.agentStates, [agentId]: "observing" }
  })),
  deactivateAgent: (agentId) => set((state) => ({
    activeAgents: state.activeAgents.filter(id => id !== agentId),
    agentStates: { ...state.agentStates, [agentId]: "idle" }
  })),
  setAgentState: (agentId, agentState) => set((state) => ({
    agentStates: { ...state.agentStates, [agentId]: agentState }
  })),
  addEvidence: (evidence) => set((state) => ({
    evidence: [...state.evidence, evidence]
  })),
  addEvent: (event) => set((state) => ({
    clinicalEvents: [...state.clinicalEvents, event]
  })),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  updateThresholds: (thresholds) => set((state) => ({
    thresholdAlerts: { ...state.thresholdAlerts, ...thresholds }
  }))
}));
