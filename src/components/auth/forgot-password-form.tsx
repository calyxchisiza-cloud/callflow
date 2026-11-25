"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { accountServiceOnline, postJson } from "@/lib/onboarding";
import { AuthBrand } from "./auth-brand";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!emailPattern.test(email.trim())) {
      setMessage({ tone: "error", text: "Enter a valid email address." });
      return;
    }

    if (!accountServiceOnline) {
      setMessage({
        tone: "info",
        text: "Password reset switches on when the account service is connected. Nothing was sent.",
      });
      return;
    }

    setPending(true);
    try {
      await postJson("/auth/password-reset", { email: email.trim() });
      setMessage({
        tone: "info",
        text: "If that email has an account, a reset link is on its way.",
      });
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not request a reset link.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-content">
      <AuthBrand />

      <div className="auth-heading">
        <p className="auth-eyebrow">Account help</p>
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-sub">Enter your work email and we&apos;ll send a reset link.</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field-label" htmlFor="reset-email">
            Email address
          </label>
          <div className="auth-input-wrap">
            <Icon name="mail" size={17} className="auth-input-icon" />
            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
          <span className="auth-submit-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <p
          className={`auth-message${message?.tone === "error" ? " is-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {message?.text}
        </p>
      </form>

      <Link className="auth-back" href="/login">
        <Icon name="chevron" size={13} />
        Back to sign in
      </Link>
    </div>
  );
}
