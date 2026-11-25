import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link for Callflow.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthFrame>
      <ForgotPasswordForm />
    </AuthFrame>
  );
}
