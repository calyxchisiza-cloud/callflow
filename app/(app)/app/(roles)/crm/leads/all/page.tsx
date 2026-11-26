import type { Metadata } from "next";
import { OwnerLeadsView } from "@/components/roles/owner-leads-view";

export const metadata: Metadata = {
  title: "Lead inbox",
  description: "Every lead in the organisation, with stages and agent owners.",
};

export default function LeadInboxPage() {
  return <OwnerLeadsView />;
}
