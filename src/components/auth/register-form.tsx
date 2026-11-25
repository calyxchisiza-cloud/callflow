"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { accountServiceOnline, postJson, readDraft, saveDraft } from "@/lib/onboarding";
import { AuthBrand } from "./auth-brand";
import { DraftBanner } from "./draft-banner";
import { StepIndicator } from "./step-indicator";

const countries = [
  "Malawi",
  "Zambia",
  "Zimbabwe",
  "South Africa",
  "Kenya",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Nigeria",
  "Ghana",
  "Botswana",
  "Mozambique",
  "Namibia",
  "Eswatini",
  "Lesotho",
  "Other",
];

const teamSizes = ["1–5 agents", "6–20 agents", "21–50 agents", "51–200 agents", "200+ agents"];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export function RegisterForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [handle, setHandle] = useState("");
  const [country, setCountry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  function fillHandleFromCompany() {
    if (!handle.trim() && company.trim()) setHandle(slugify(company));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (company.trim().length < 2) {
      setMessage({ tone: "error", text: "Enter your company or team name." });
      return;
    }
    if (!/^[a-z0-9-]{3,30}$/.test(handle.trim())) {
      setMessage({
        tone: "error",
        text: "Workspace handles need 3–30 lowercase letters, numbers or dashes.",
      });
      return;
    }
    if (!country) {
      setMessage({ tone: "error", text: "Select your country." });
      return;
    }
    if (!teamSize) {
      setMessage({ tone: "error", text: "Select your team size." });
      return;
    }
    if (phone.trim() && phone.replace(/[^\d]/g, "").length < 7) {
      setMessage({ tone: "error", text: "Enter a full phone number or leave it blank." });
      return;
    }

    const draft = {
      company: company.trim(),
      handle: handle.trim(),
      country,
      teamSize,
      phone: phone.trim(),
    };

    if (!accountServiceOnline) {
      saveDraft(draft);
      router.push("/subscribe");
      return;
    }

    setPending(true);
    try {
      const { fullName, email } = readDraft();
      await postJson("/workspaces", { ...draft, fullName, email });
      saveDraft(draft);
      router.push("/subscribe");
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not register the workspace.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-content">
      <AuthBrand />
      <StepIndicator active={2} />

      <div className="auth-heading">
        <p className="auth-eyebrow">Step 2 of 3</p>
        <h1 className="auth-title">Register your workspace</h1>
        <p className="auth-sub">Tell us how your team operates so the workspace is set up right.</p>
      </div>

      <DraftBanner />

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-field-label" htmlFor="company">
            Company or team name
          </label>
          <div className="auth-input-wrap">
            <Icon name="building" size={17} className="auth-input-icon" />
            <input
              id="company"
              name="company"
              autoComplete="organization"
              placeholder="e.g. Mzuzu Support Desk"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              onBlur={fillHandleFromCompany}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-field-label" htmlFor="handle">
            Workspace handle
          </label>
          <div className="auth-input-wrap">
            <input
              id="handle"
              name="handle"
              autoComplete="off"
              placeholder="mzuzu-support"
              value={handle}
              onChange={(event) => setHandle(slugify(event.target.value))}
              required
            />
          </div>
          <p className="auth-hint">Lowercase letters, numbers and dashes. Used to reach your workspace.</p>
        </div>

        <div className="auth-field">
          <label className="auth-field-label" htmlFor="country">
            Country
          </label>
          <div className="auth-input-wrap auth-select">
            <select
              id="country"
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              required
            >
              <option value="" disabled>
                Select country
              </option>
              {countries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={14} className="auth-caret" />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-field-label" htmlFor="teamSize">
            Team size
          </label>
          <div className="auth-input-wrap auth-select">
            <select
              id="teamSize"
              name="teamSize"
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value)}
              required
            >
              <option value="" disabled>
                Select team size
              </option>
              {teamSizes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={14} className="auth-caret" />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-field-label" htmlFor="phone">
            Phone number <span className="auth-optional">(optional)</span>
          </label>
          <div className="auth-input-wrap">
            <Icon name="phone" size={17} className="auth-input-icon" />
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+265 000 000 000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={pending}>
          {pending ? "Saving workspace…" : "Continue to plans"}
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

      <Link className="auth-back" href="/">
        <Icon name="chevron" size={13} />
        Back to account
      </Link>
    </div>
  );
}
