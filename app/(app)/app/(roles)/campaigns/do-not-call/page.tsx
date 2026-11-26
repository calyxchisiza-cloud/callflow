import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageForPath } from "@/config/navigation";
import { screenConfigFor } from "@/config/screen";
import { ScreenView } from "@/components/screens/screen-view";

export const metadata: Metadata = {
  title: "Do not call",
  description: "Numbers excluded from every campaign, with the reason they were added.",
};

export default function CampaignDoNotCallPage() {
  const page = pageForPath("/app/campaigns/do-not-call");
  if (!page) notFound();
  return <ScreenView page={page} config={screenConfigFor(page)} />;
}
