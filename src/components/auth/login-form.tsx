"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { accountServiceOnline, postJson } from "@/lib/onboarding";
import { AuthBrand } from "./auth-brand";
import { PasswordInput } from "./password-input";
import { SocialButtons } from "./social-buttons";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    // Preview mode: the account service is not connected, so any credentials open the
    // dashboard. Real authentication resumes automatically once the API is configured.
    if (!accountServiceOnline) {
      setPending(true);
      router.push("/app/dashboard");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setMessage({ tone: "error", text: "Enter a valid email address." });
      return;
    }
    if (password.length === 0) {
      setMessage({ tone: "error", text: "Enter your password." });
      return;
    }

    setPending(true);
    try {
      await postJson("/auth/login", { email: email.trim(), password });
      router.push("/app/dashboard");
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not sign in.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-content">
      <AuthBrand />

      <div className="auth-heading">
        <p className="auth-eyebrow">Good to see you again</p>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your workspace and pick up where you left off.</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field-label" htmlFor="login-email">
            Email address
          </label>
          <div className="auth-input-wrap">
            <Icon name="mail" size={17} className="auth-input-icon" />
            <input
              id="login-email"
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

        <div className="auth-field">
          <div className="auth-row">
            <label className="auth-field-label" htmlFor="login-password">
              Password
            </label>
            <Link className="auth-inline-link" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="login-password" value={password} onChange={setPassword} />
        </div>

        <button className="auth-submit" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
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
        {!accountServiceOnline && (
          <p className="auth-preview">
            Preview access — any email and password opens the dashboard.
          </p>
        )}
      </form>

      <div className="auth-divider">
        <span />
        <p>or continue with</p>
        <span />
      </div>
      <SocialButtons
        onSelect={(provider) =>
          setMessage({ tone: "info", text: `${provider} sign-in isn't connected yet.` })
        }
      />

      <p className="auth-alt">
        New to Callflow? <Link href="/">Create an account</Link>
      </p>
    </div>
  );
}
