import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageForPath } from "@/config/navigation";
import { screenConfigFor } from "@/config/screen";
import { ScreenView } from "@/components/screens/screen-view";
import "./screens.css";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = pageForPath(`/app/${slug.join("/")}`);
  return { title: page ? page.title : "Not found" };
}

export default async function WorkspaceScreenPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = pageForPath(`/app/${slug.join("/")}`);
  if (!page) notFound();

  return <ScreenView key={page.route} page={page} config={screenConfigFor(page)} />;
}
