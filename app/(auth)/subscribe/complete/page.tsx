import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { CompleteSummary } from "@/components/auth/complete-summary";

export const metadata: Metadata = {
  title: "Trial setup",
  description: "Your Callflow trial setup.",
};

export default function SubscribeCompletePage() {
  return (
    <AuthFrame tall>
      <CompleteSummary />
    </AuthFrame>
  );
}
