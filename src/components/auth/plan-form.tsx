"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { plans, priceFor, trialDays, type BillingCycle } from "@/config/plans";
import {
  accountServiceOnline,
  postJson,
  readDraft,
  saveDraft,
  type OnboardingDraft,
} from "@/lib/onboarding";
import { AuthBrand } from "./auth-brand";
import { DraftBanner } from "./draft-banner";
import { StepIndicator } from "./step-indicator";

export function PlanForm() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [planId, setPlanId] = useState("growth");
  const [draft, setDraft] = useState<OnboardingDraft>({});
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  useEffect(() => {
    const stored = readDraft();
    setDraft(stored);
    if (stored.planId) setPlanId(stored.planId);
    if (stored.billingCycle) setBilling(stored.billingCycle);
  }, []);

  const selected = plans.find((plan) => plan.id === planId) ?? plans[0];
  const price = priceFor(selected, billing);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const patch = { planId: selected.id, billingCycle: billing };

    if (!accountServiceOnline) {
      saveDraft(patch);
      router.push("/subscribe/complete");
      return;
    }

    setPending(true);
    try {
      await postJson("/billing/trial", { ...patch, workspace: draft.handle ?? "" });
      saveDraft(patch);
      router.push("/subscribe/complete");
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not start the trial.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-content is-wide">
      <AuthBrand />
      <StepIndicator active={3} />

      <div className="auth-heading">
        <p className="auth-eyebrow">Step 3 of 3</p>
        <h1 className="auth-title">Choose your plan</h1>
        <p className="auth-sub">
          Every plan starts with a {trialDays}-day free trial. No card required today.
        </p>
      </div>

      <DraftBanner />

      <div className="auth-billing" role="group" aria-label="Billing period">
        <button
          type="button"
          className={billing === "monthly" ? "is-active" : undefined}
          aria-pressed={billing === "monthly"}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          className={billing === "annual" ? "is-active" : undefined}
          aria-pressed={billing === "annual"}
          onClick={() => setBilling("annual")}
        >
          Annual <em>2 months free</em>
        </button>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="auth-plans" role="radiogroup" aria-label="Plan">
          {plans.map((plan) => {
            const active = plan.id === selected.id;
            return (
              <button
                key={plan.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`auth-plan${active ? " is-selected" : ""}`}
                onClick={() => setPlanId(plan.id)}
              >
                <span className="auth-plan-name">
                  {plan.name}
                  {plan.highlighted && <span className="auth-plan-badge">Most popular</span>}
                </span>
                <span className="auth-plan-price">
                  <strong>${priceFor(plan, billing)}</strong>
                  <span>{billing === "annual" ? "/mo, billed yearly" : "/month"}</span>
                </span>
                <span className="auth-plan-copy">{plan.tagline}</span>
                <ul className="auth-plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="auth-summary">
          <div className="auth-summary-row">
            <span>Workspace</span>
            <strong>{draft.company ?? "Not named yet"}</strong>
          </div>
          <div className="auth-summary-row">
            <span>Plan</span>
            <strong>{selected.name}</strong>
          </div>
          <div className="auth-summary-row">
            <span>Billing</span>
            <strong>{billing === "annual" ? "Annual" : "Monthly"}</strong>
          </div>
          <div className="auth-summary-total">
            <span>Due today</span>
            <span>$0.00</span>
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={pending}>
          {pending ? "Saving plan…" : `Start ${trialDays}-day free trial`}
          <span className="auth-submit-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <p className="auth-note">
          Then ${price}/month{billing === "annual" ? ", billed yearly" : ""}. Cancel anytime during
          the trial.
        </p>
        <p
          className={`auth-message${message?.tone === "error" ? " is-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {message?.text}
        </p>
      </form>

      <Link className="auth-back" href="/register">
        <Icon name="chevron" size={13} />
        Back to workspace details
      </Link>
    </div>
  );
}
