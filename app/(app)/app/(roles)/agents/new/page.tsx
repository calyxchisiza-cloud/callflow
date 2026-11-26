import type { Metadata } from "next";
import { OwnerAgentInviteView } from "@/components/roles/owner-agent-invite-view";

export const metadata: Metadata = {
  title: "Invite agent",
  description: "Create an agent seat with its own sign-in and agent desk.",
};

export default function InviteAgentPage() {
  return <OwnerAgentInviteView />;
}
