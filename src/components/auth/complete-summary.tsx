"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { planById, trialDays } from "@/config/plans";
import { accountServiceOnline, readDraft, type OnboardingDraft } from "@/lib/onboarding";
import { AuthBrand } from "./auth-brand";

export function CompleteSummary() {
  const [draft, setDraft] = useState<OnboardingDraft | null>(null);

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  if (draft === null) {
    return (
      <div className="auth-content">
        <AuthBrand />
        <p className="auth-empty" style={{ marginTop: 40 }}>
          Loading your setup…
        </p>
      </div>
    );
  }

  const plan = planById(draft.planId);
  const hasSetup = Boolean(plan || draft.company || draft.handle);

  if (!hasSetup) {
    return (
      <div className="auth-content">
        <AuthBrand />
        <div className="auth-heading">
          <h1 className="auth-title">Nothing to show yet</h1>
          <p className="auth-sub">Start with an account and we&apos;ll walk you through the rest.</p>
        </div>
        <div className="auth-actions">
          <Link className="auth-submit" href="/">
            Create an account
            <span className="auth-submit-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-content">
      <AuthBrand />

      <div className="auth-heading">
        <span className="auth-complete-icon" aria-hidden="true">
          <Icon name="check" size={26} />
        </span>
        <h1 className="auth-title">{accountServiceOnline ? "Your workspace is ready" : "Almost there"}</h1>
        <p className="auth-sub">
          {accountServiceOnline
            ? `Your ${trialDays}-day trial has started. Sign in to open the workspace.`
            : "Your account, workspace and plan are saved in this browser session. They activate as soon as the account service is connected."}
        </p>
      </div>

      {!accountServiceOnline && (
        <p className="auth-draft">
          <span>
            <strong>Draft only.</strong> No account, workspace or trial has been created yet.
          </span>
        </p>
      )}

      <div className="auth-summary">
        <div className="auth-summary-row">
          <span>Workspace</span>
          <strong>{draft.company ?? "Not named yet"}</strong>
        </div>
        <div className="auth-summary-row">
          <span>Plan</span>
          <strong>{plan ? `${plan.name} · ${draft.billingCycle === "annual" ? "annual" : "monthly"}` : "Not chosen"}</strong>
        </div>
        <div className="auth-summary-row">
          <span>Contact</span>
          <strong>{draft.email ?? "—"}</strong>
        </div>
        <div className="auth-summary-total">
          <span>Due today</span>
          <span>$0.00</span>
        </div>
      </div>

      <div className="auth-actions">
        <Link className="auth-submit" href={accountServiceOnline ? "/login" : "/landing"}>
          {accountServiceOnline ? "Go to sign in" : "Return to Callflow"}
          <span className="auth-submit-arrow" aria-hidden="true">
            →
          </span>
        </Link>
        <Link className="auth-secondary" href="/">
          Start over
        </Link>
      </div>
    </div>
  );
}
