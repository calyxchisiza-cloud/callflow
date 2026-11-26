import type { Metadata } from "next";
import { AgentLeadsView } from "@/components/roles/agent-leads-view";

export const metadata: Metadata = {
  title: "My leads",
  description: "The leads assigned to you and their stages.",
};

export default function AgentLeadsPage() {
  return <AgentLeadsView />;
}
