"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { accountServiceOnline, postJson } from "@/lib/onboarding";
import {
  createAgent,
  findAgentByEmail,
  readSession,
  setSession,
  signInAgent,
} from "@/lib/workspace";
import { AuthBrand } from "./auth-brand";
import { PasswordInput } from "./password-input";
import { SocialButtons } from "./social-buttons";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Role = "owner" | "agent";

const roles: { id: Role; label: string; hint: string; icon: string }[] = [
  { id: "owner", label: "Organisation owner", hint: "Full workspace", icon: "building" },
  { id: "agent", label: "Agent", hint: "Agent desk only", icon: "headset" },
];

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);
  const [missingSeat, setMissingSeat] = useState<string | null>(null);
  const canSeedPreviewSeat = process.env.NODE_ENV !== "production" && !accountServiceOnline;

  useEffect(() => {
    if (readSession()?.role === "agent") setRole("agent");
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    // Preview mode: the account service is not connected yet. Owner access opens with any
    // credentials; agent access needs an email that was actually invited from the owner
    // workspace. Real authentication resumes when the API is configured.
    if (!accountServiceOnline) {
      if (role === "agent") {
        if (!emailPattern.test(email.trim())) {
          setMessage({ tone: "error", text: "Enter the work email your owner invited." });
          return;
        }
        const result = signInAgent(email.trim());
        if (!result.ok) {
          setMessage({ tone: "error", text: result.error });
          setMissingSeat(email.trim().toLowerCase());
          return;
        }
        setMissingSeat(null);
        setPending(true);
        router.push("/app/agent");
        return;
      }
      if (readSession()?.role === "agent") {
        setMessage({
          tone: "error",
          text: "Sign out of the agent desk before opening the owner workspace.",
        });
        return;
      }
      if (findAgentByEmail(email.trim())) {
        setMessage({
          tone: "error",
          text: "That email belongs to an agent seat. Use the Agent tab to open that desk.",
        });
        setMissingSeat(null);
        return;
      }
      setSession({ role: "owner" });
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
      await postJson("/auth/login", { email: email.trim(), password, role });
      if (role === "agent") {
        const result = signInAgent(email.trim());
        if (!result.ok) {
          setMessage({ tone: "error", text: result.error });
          return;
        }
        router.push("/app/agent");
        return;
      }
      setSession({ role: "owner" });
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

  function createPreviewSeat() {
    if (!missingSeat) return;
    const email = missingSeat;
    if (!findAgentByEmail(email)) {
      const handle = email.split("@")[0].replace(/[._-]+/g, " ").trim();
      const name = handle.length >= 2
        ? handle.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
        : "Preview agent";
      const created = createAgent({ name, email, team: "Sales", extension: "" });
      if (!created.ok) {
        setMessage({ tone: "error", text: created.error });
        return;
      }
    }
    const result = signInAgent(email);
    if (!result.ok) {
      setMessage({ tone: "error", text: result.error });
      return;
    }
    setMissingSeat(null);
    setPending(true);
    router.push("/app/agent");
  }

  const isAgent = role === "agent";

  return (
    <div className="auth-content">
      <AuthBrand />

      <div className="auth-heading">
        <p className="auth-eyebrow">{isAgent ? "Agent desk" : "Good to see you again"}</p>
        <h1 className="auth-title">{isAgent ? "Agent sign-in" : "Welcome back"}</h1>
        <p className="auth-sub">
          {isAgent
            ? "Use the work email your organisation owner invited. Your desk only opens the leads and calls assigned to you."
            : "Sign in to your workspace and pick up where you left off."}
        </p>
      </div>

      <div className="auth-role" role="group" aria-label="Choose account type">
        {roles.map((item) => (
          <button
            key={item.id}
            type="button"
            className={role === item.id ? "is-active" : undefined}
            aria-pressed={role === item.id}
            onClick={() => {
              setRole(item.id);
              setMessage(null);
              setMissingSeat(null);
            }}
          >
            <Icon name={item.icon} size={16} />
            <span>
              <strong>{item.label}</strong>
              <em>{item.hint}</em>
            </span>
          </button>
        ))}
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field-label" htmlFor="login-email">
            {isAgent ? "Work email" : "Email address"}
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
              onChange={(event) => {
                setEmail(event.target.value);
                setMissingSeat(null);
              }}
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
          {pending ? "Signing in…" : isAgent ? "Open agent desk" : "Sign in"}
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
        {canSeedPreviewSeat && missingSeat && (
          <div className="auth-seat-fallback">
            <p>
              No agent seat for <strong>{missingSeat}</strong> exists in this browser. Seats are
              created by the owner and stay in the browser that made them.
            </p>
            <button type="button" onClick={createPreviewSeat}>
              Add a preview seat and sign in
            </button>
            <span>Development only — skipped when the account API is connected.</span>
          </div>
        )}
        {!accountServiceOnline && (
          <p className="auth-preview">
            {isAgent
              ? "Preview access — use the exact email your owner invited. No password is checked yet."
              : "Preview access — any email and password opens the owner workspace."}
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
        {isAgent ? (
          <>
            Need a seat? Ask your organisation owner to invite you from the owner workspace.
          </>
        ) : (
          <>
            New to Callflow? <Link href="/">Create an account</Link>
          </>
        )}
      </p>
    </div>
  );
}
