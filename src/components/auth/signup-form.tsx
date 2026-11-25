"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { accountServiceOnline, postJson, saveDraft } from "@/lib/onboarding";
import { AuthBrand } from "./auth-brand";
import { PasswordInput } from "./password-input";
import { SocialButtons } from "./social-buttons";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (fullName.trim().length < 2) {
      setMessage({ tone: "error", text: "Enter your full name." });
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setMessage({ tone: "error", text: "Enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setMessage({ tone: "error", text: "Use at least 8 characters for your password." });
      return;
    }

    const draft = { fullName: fullName.trim(), email: email.trim() };

    if (!accountServiceOnline) {
      saveDraft(draft);
      router.push("/register");
      return;
    }

    setPending(true);
    try {
      await postJson("/auth/signup", { ...draft, password });
      saveDraft(draft);
      router.push("/register");
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not create the account.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-content">
      <AuthBrand />

      <div className="auth-heading">
        <p className="auth-eyebrow">Your customer conversations, connected</p>
        <h1 className="auth-title">
          <span>Create</span> account
        </h1>
        <p className="auth-sub">Calls, contacts, and follow-ups in one clear place.</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field-label" htmlFor="fullName">
            Full name
          </label>
          <div className="auth-input-wrap">
            <Icon name="user" size={17} className="auth-input-icon" />
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-field-label" htmlFor="email">
            Email address
          </label>
          <div className="auth-input-wrap">
            <Icon name="mail" size={17} className="auth-input-icon" />
            <input
              id="email"
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
          <label className="auth-field-label" htmlFor="password">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a secure password"
            autoComplete="new-password"
          />
          <p className="auth-hint">At least 8 characters.</p>
        </div>

        <button className="auth-submit" type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
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

      <div className="auth-divider">
        <span />
        <p>or sign up with</p>
        <span />
      </div>
      <SocialButtons
        onSelect={(provider) =>
          setMessage({ tone: "info", text: `${provider} sign-up isn't connected yet.` })
        }
      />

      <p className="auth-terms">
        By creating an account, you agree to Callflow&apos;s{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <p className="auth-alt">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
