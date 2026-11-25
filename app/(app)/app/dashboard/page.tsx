import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Command center",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
