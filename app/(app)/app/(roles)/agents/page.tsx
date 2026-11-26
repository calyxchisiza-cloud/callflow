import type { Metadata } from "next";
import { OwnerAgentsView } from "@/components/roles/owner-agents-view";

export const metadata: Metadata = {
  title: "Agents",
  description: "Invite agents, manage seats and see who is online.",
};

export default function AgentsPage() {
  return <OwnerAgentsView />;
}
