import type { Metadata } from "next";
import { OwnerLeadImportView } from "@/components/roles/owner-lead-import-view";

export const metadata: Metadata = {
  title: "Import leads",
  description: "Upload a CSV of leads, preview every row and import the valid ones.",
};

type PageProps = {
  searchParams: Promise<{ campaign?: string | string[] }>;
};

export default async function ImportLeadsPage({ searchParams }: PageProps) {
  const { campaign } = await searchParams;
  const campaignId = typeof campaign === "string" ? campaign : undefined;
  return <OwnerLeadImportView campaignId={campaignId} />;
}
