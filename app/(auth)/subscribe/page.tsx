import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { PlanForm } from "@/components/auth/plan-form";

export const metadata: Metadata = {
  title: "Choose a plan",
  description: "Pick a Callflow plan and start a free trial.",
};

export default function SubscribePage() {
  return (
    <AuthFrame wide tall>
      <PlanForm />
    </AuthFrame>
  );
}
