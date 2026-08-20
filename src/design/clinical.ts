/**
 * Clinical System Design Configuration
 */

export interface SystemStatusSignal {
  id: string;
  label: string;
  status: "active" | "standby" | "processing" | "alert";
  details: string;
}

export const defaultClinicalSignals: SystemStatusSignal[] = [
  {
    id: "context",
    label: "Context Engine",
    status: "active",
    details: "Patient longitudinal history & vital records synchronized",
  },
  {
    id: "specialists",
    label: "Specialist Mesh",
    status: "active",
    details: "17 autonomous clinical agent nodes ready for differential triage",
  },
  {
    id: "evidence",
    label: "Evidence Layer",
    status: "active",
    details: "NICE, AHA, ESC & Cochrane clinical guidelines active",
  },
  {
    id: "spatial",
    label: "Spatial Model",
    status: "active",
    details: "3D organ system projection calibrated",
  },
];
