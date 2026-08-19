import { Agent } from "@/lib/agents";

export interface ClinicalAgent {
  id: string;
  name: string;
  specialty: string;
  description: string;

  avatar: {
    type: "portrait" | "3d" | "abstract" | "custom";
    source?: string;
    model?: string;
  };

  visualIdentity: {
    accentToken: string;
    symbol?: string;
    environment?: string;
  };
}

export function mapAgentToClinicalAgent(agent: Agent): ClinicalAgent {
  return {
    id: agent.id,
    name: agent.name,
    specialty: agent.specialty,
    description: agent.description,
    avatar: {
      type: "portrait",
      source: agent.avatar_url,
    },
    visualIdentity: {
      accentToken: agent.badgeColor || "blue",
    }
  };
}
