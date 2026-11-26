import type { Metadata } from "next";
import { AgentAvailabilityView } from "@/components/roles/agent-availability-view";

export const metadata: Metadata = {
  title: "Availability",
  description: "Set your presence and working hours.",
};

export default function AgentAvailabilityPage() {
  return <AgentAvailabilityView />;
}
