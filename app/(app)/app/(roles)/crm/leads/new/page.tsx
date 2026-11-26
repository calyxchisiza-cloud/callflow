import type { Metadata } from "next";
import { OwnerLeadFormView } from "@/components/roles/owner-lead-form-view";

export const metadata: Metadata = {
  title: "Add lead",
  description: "Capture a single lead, route it to a campaign and an agent.",
};

type PageProps = {
  searchParams: Promise<{ campaign?: string | string[] }>;
};

export default async function NewLeadPage({ searchParams }: PageProps) {
  const { campaign } = await searchParams;
  const campaignId = typeof campaign === "string" ? campaign : undefined;
  return <OwnerLeadFormView campaignId={campaignId} />;
}
