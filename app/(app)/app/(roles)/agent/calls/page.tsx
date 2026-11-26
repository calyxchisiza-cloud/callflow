import type { Metadata } from "next";
import { AgentCallsView } from "@/components/roles/agent-calls-view";

export const metadata: Metadata = {
  title: "My calls",
  description: "Your call activity and the leads waiting for a call.",
};

export default function AgentCallsPage() {
  return <AgentCallsView />;
}
