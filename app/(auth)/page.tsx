import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Callflow CRM workspace for your customer-support team.",
};

export default function CreateAccountPage() {
  return (
    <AuthFrame>
      <SignupForm />
    </AuthFrame>
  );
}
