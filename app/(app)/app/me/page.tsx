import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import "./profile.css";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Your personal details, profile strength and workspace identity.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
