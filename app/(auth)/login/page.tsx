import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your Callflow CRM workspace.",
};

export default function LoginPage() {
  return (
    <AuthFrame>
      <LoginForm />
    </AuthFrame>
  );
}
