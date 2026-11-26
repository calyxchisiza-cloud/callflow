import type { Metadata } from "next";
import { OwnerCampaignFormView } from "@/components/roles/owner-campaign-form-view";

export const metadata: Metadata = {
  title: "Edit campaign",
  description: "Update a campaign's details, status and agent team.",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCampaignPage({ params }: PageProps) {
  const { id } = await params;
  return <OwnerCampaignFormView campaignId={id} />;
}
