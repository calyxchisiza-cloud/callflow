import type { Metadata } from "next";
import { OwnerCampaignFormView } from "@/components/roles/owner-campaign-form-view";

export const metadata: Metadata = {
  title: "New campaign",
  description: "Name a calling campaign and choose the agents who will work it.",
};

export default function NewCampaignPage() {
  return <OwnerCampaignFormView />;
}
