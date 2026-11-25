import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register workspace",
  description: "Register your Callflow workspace details.",
};

export default function RegisterPage() {
  return (
    <AuthFrame tall>
      <RegisterForm />
    </AuthFrame>
  );
}
