import type { Metadata } from "next";
import { OwnerCampaignsView } from "@/components/roles/owner-campaigns-view";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Create calling campaigns, assign agents and route leads into them.",
};

export default function CampaignsPage() {
  return <OwnerCampaignsView />;
}
