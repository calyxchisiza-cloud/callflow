import type { Metadata } from "next";
import { AgentTodayView } from "@/components/roles/agent-today-view";

export const metadata: Metadata = {
  title: "Today",
  description: "Your agent desk: assigned leads, presence and setup.",
};

export default function AgentTodayPage() {
  return <AgentTodayView />;
}
