import type { Metadata } from "next";
import { OwnerCampaignDetailView } from "@/components/roles/owner-campaign-detail-view";

export const metadata: Metadata = {
  title: "Campaign",
  description: "Campaign leads, assigned agents and campaign settings.",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OwnerCampaignDetailView campaignId={id} />;
}
