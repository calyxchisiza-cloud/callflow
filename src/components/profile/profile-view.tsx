"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { planById } from "@/config/plans";
import {
  accountServiceOnline,
  initialsFrom,
  readDraft,
  saveDraft,
  type OnboardingDraft,
} from "@/lib/onboarding";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  fullName: string;
  email: string;
  jobTitle: string;
  phone: string;
};

const emptyForm: FormState = { fullName: "", email: "", jobTitle: "", phone: "" };

const fields: { key: keyof FormState; label: string; icon: string; placeholder: string; type: string }[] = [
  { key: "fullName", label: "Full name", icon: "user", placeholder: "Your full name", type: "text" },
  { key: "email", label: "Email address", icon: "mail", placeholder: "name@company.com", type: "email" },
  { key: "jobTitle", label: "Job title", icon: "badge", placeholder: "e.g. Team lead", type: "text" },
  { key: "phone", label: "Phone number", icon: "phone", placeholder: "e.g. +265 991 234 567", type: "tel" },
];

const security = [
  {
    icon: "key",
    title: "Password",
    body: "A password protects sign-in once the account service is connected.",
    state: "Not set",
    tone: "wait",
  },
  {
    icon: "shield",
    title: "Two-factor authentication",
    body: "Add a second factor for workspace owners and admins.",
    state: "Off",
    tone: "quiet",
  },
  {
    icon: "server",
    title: "Active sessions",
    body: "Signed-in devices are listed here once sign-in goes live.",
    state: "Not tracked",
    tone: "quiet",
  },
];

function formFromDraft(draft: OnboardingDraft): FormState {
  return {
    fullName: draft.fullName ?? "",
    email: draft.email ?? "",
    jobTitle: draft.jobTitle ?? "",
    phone: draft.phone ?? "",
  };
}

export function ProfileView() {
  const [draft, setDraft] = useState<OnboardingDraft>({});
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<{ tone: "saved" | "error"; text: string } | null>(null);

  useEffect(() => {
    const saved = readDraft();
    setDraft(saved);
    setForm(formFromDraft(saved));
  }, []);

  const plan = draft.planId ? planById(draft.planId) : undefined;
  const name = draft.fullName?.trim();
  const initials = initialsFrom(name);

  const filled = fields.filter((field) => (draft[field.key] ?? "").trim().length > 0);
  const percent = Math.round((filled.length / fields.length) * 100);
  const dirty = fields.some((field) => form[field.key].trim() !== (draft[field.key] ?? "").trim());

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    if (status) setStatus(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const patch: FormState = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle.trim(),
      phone: form.phone.trim(),
    };

    if (patch.email && !emailPattern.test(patch.email)) {
      setStatus({ tone: "error", text: "Enter a valid email address, or leave it blank." });
      return;
    }
    if (patch.phone && patch.phone.replace(/\D/g, "").length < 6) {
      setStatus({ tone: "error", text: "That phone number looks too short." });
      return;
    }

    saveDraft(patch);
    const next = { ...draft, ...patch };
    setDraft(next);
    setForm(formFromDraft(next));
    setStatus({
      tone: "saved",
      text: "Saved in this browser session. Profile sync arrives with the account service.",
    });
  }

  return (
    <div className="profile">
      <section className="profile-hero" aria-labelledby="profile-name">
        <div className="profile-hero-top">
          <div className="profile-identity">
            <span className="profile-avatar" aria-hidden="true">
              {initials || <Icon name="user" size={30} />}
            </span>
            <div className="profile-identity-copy">
              <p className="profile-eyebrow">Personal settings</p>
              <h1 id="profile-name">{name || "Your profile"}</h1>
              <p className="profile-email">{draft.email?.trim() || "No email added yet"}</p>
              <div className="profile-chips">
                {draft.company?.trim() && (
                  <span className="profile-chip">
                    <Icon name="building" size={12} />
                    {draft.company}
                  </span>
                )}
                {plan && (
                  <span className="profile-chip is-plan">
                    <Icon name="badge" size={12} />
                    {plan.name} plan · Trial
                  </span>
                )}
                <span className={`profile-chip ${accountServiceOnline ? "is-online" : "is-preview"}`}>
                  <i aria-hidden="true" />
                  {accountServiceOnline ? "Account service connected" : "Preview mode"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-ring-block">
            <div
              className="profile-ring"
              style={{ "--profile-fill": `${percent}%` } as CSSProperties}
              role="img"
              aria-label={`Profile ${percent}% complete`}
            >
              <span>
                <strong>{percent}%</strong>
                <em>
                  {filled.length}/{fields.length}
                </em>
              </span>
            </div>
            <p>Profile complete</p>
          </div>
        </div>

        <dl className="profile-hero-meta">
          <div>
            <dt>Workspace</dt>
            <dd>{draft.company?.trim() || "Not set"}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>{plan ? `${plan.name} · Trial` : "Not selected"}</dd>
          </div>
          <div>
            <dt>Team size</dt>
            <dd>{draft.teamSize?.trim() || "Not set"}</dd>
          </div>
        </dl>
      </section>

      <div className="profile-grid">
        <section className="profile-card span-7" aria-labelledby="details-title">
          <div className="profile-card-head">
            <div>
              <span className="profile-kicker">Details</span>
              <h2 id="details-title">Personal details</h2>
            </div>
            <span className="profile-chip is-plain">4 fields</span>
          </div>

          <form className="profile-form" onSubmit={onSubmit} noValidate>
            <div className="profile-fields">
              {fields.map((field) => (
                <div className="profile-field" key={field.key}>
                  <label htmlFor={`profile-${field.key}`}>{field.label}</label>
                  <div className="profile-input">
                    <Icon name={field.icon} size={15} />
                    <input
                      id={`profile-${field.key}`}
                      name={field.key}
                      type={field.type}
                      autoComplete={
                        field.key === "fullName"
                          ? "name"
                          : field.key === "email"
                            ? "email"
                            : field.key === "phone"
                              ? "tel"
                              : "organization-title"
                      }
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(event) => update(field.key, event.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="profile-form-foot">
              <button className="profile-save" type="submit" disabled={!dirty}>
                Save changes
                <Icon name="check" size={14} />
              </button>
              <button
                className="profile-discard"
                type="button"
                disabled={!dirty}
                onClick={() => {
                  setForm(formFromDraft(draft));
                  setStatus(null);
                }}
              >
                Discard
              </button>
              <p
                className={`profile-status${status?.tone === "error" ? " is-error" : ""}`}
                role="status"
                aria-live="polite"
              >
                {status?.tone === "saved" && (
                  <span className="profile-status-dot" aria-hidden="true" />
                )}
                {status?.text}
              </p>
            </div>
          </form>
        </section>

        <div className="profile-stack span-5">
          <section className="profile-card" aria-labelledby="strength-title">
            <div className="profile-card-head">
              <div>
                <span className="profile-kicker">Onboarding</span>
                <h2 id="strength-title">Profile strength</h2>
              </div>
              <span className="profile-chip is-plain">{percent}%</span>
            </div>
            <p className="profile-strength-copy">
              {filled.length === fields.length
                ? "Every personal detail is filled in. Teammates see a complete profile."
                : "Complete the remaining details so teammates know who they are working with."}
            </p>
            <ul className="profile-checklist">
              {fields.map((field) => {
                const done = filled.some((item) => item.key === field.key);
                return (
                  <li key={field.key} className={done ? "is-done" : undefined}>
                    <i aria-hidden="true">
                      {done ? <Icon name="check" size={11} /> : null}
                    </i>
                    <span>{field.label}</span>
                    {done ? (
                      <em>Added</em>
                    ) : (
                      <a href={`#profile-${field.key}`}>Add</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="profile-card" aria-labelledby="workspace-title">
            <div className="profile-card-head">
              <div>
                <span className="profile-kicker">Account</span>
                <h2 id="workspace-title">Workspace</h2>
              </div>
              <Link className="profile-link" href="/app/dashboard">
                Overview
                <Icon name="arrow" size={13} />
              </Link>
            </div>
            <ul className="profile-rows">
              <li>
                <Icon name="building" size={15} />
                <span>Company</span>
                <strong className={draft.company?.trim() ? undefined : "is-empty"}>
                  {draft.company?.trim() || "Not set"}
                </strong>
              </li>
              <li>
                <Icon name="target" size={15} />
                <span>Handle</span>
                <strong className={draft.handle?.trim() ? undefined : "is-empty"}>
                  {draft.handle?.trim() ? `@${draft.handle.replace(/^@/, "")}` : "Not set"}
                </strong>
              </li>
              <li>
                <Icon name="shield" size={15} />
                <span>Country</span>
                <strong className={draft.country?.trim() ? undefined : "is-empty"}>
                  {draft.country?.trim() || "Not set"}
                </strong>
              </li>
              <li>
                <Icon name="users" size={15} />
                <span>Team size</span>
                <strong className={draft.teamSize?.trim() ? undefined : "is-empty"}>
                  {draft.teamSize?.trim() || "Not set"}
                </strong>
              </li>
              <li>
                <Icon name="trend" size={15} />
                <span>Billing</span>
                <strong className={draft.billingCycle ? undefined : "is-empty"}>
                  {draft.billingCycle === "annual"
                    ? "Annual"
                    : draft.billingCycle === "monthly"
                      ? "Monthly"
                      : "Not set"}
                </strong>
              </li>
            </ul>
          </section>
        </div>

        <section className="profile-card span-12" aria-labelledby="security-title">
          <div className="profile-card-head">
            <div>
              <span className="profile-kicker">Account</span>
              <h2 id="security-title">Sign-in & security</h2>
            </div>
            <span className={`profile-chip ${accountServiceOnline ? "is-online" : "is-preview"}`}>
              <i aria-hidden="true" />
              {accountServiceOnline ? "Connected" : "Preview mode"}
            </span>
          </div>
          <div className="profile-security">
            {security.map((item) => (
              <article className="profile-sec" key={item.title}>
                <div className="profile-sec-top">
                  <span className="profile-sec-icon">
                    <Icon name={item.icon} size={16} />
                  </span>
                  <h3>{item.title}</h3>
                  <span className={`profile-sec-state is-${item.tone}`}>{item.state}</span>
                </div>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <p className="profile-security-note">
            <Icon name="lock" size={14} />
            {accountServiceOnline
              ? "These controls connect to the account service next."
              : "Preview mode keeps your details in this browser session only. Security controls activate with the account service."}
          </p>
        </section>
      </div>
    </div>
  );
}
