import type { BillingCycle } from "@/config/plans";

export type OnboardingDraft = {
  fullName?: string;
  email?: string;
  company?: string;
  handle?: string;
  country?: string;
  teamSize?: string;
  phone?: string;
  jobTitle?: string;
  planId?: string;
  billingCycle?: BillingCycle;
};

const STORAGE_KEY = "callflow-onboarding";

export const accountServiceUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
export const accountServiceOnline = accountServiceUrl.length > 0;

export function readDraft(): OnboardingDraft {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}") as OnboardingDraft;
  } catch {
    return {};
  }
}

export const DRAFT_EVENT = "callflow:draft-updated";

export function saveDraft(patch: OnboardingDraft) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readDraft(), ...patch }));
  window.dispatchEvent(new Event(DRAFT_EVENT));
}

export function initialsFrom(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${accountServiceUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message ?? `Request failed (${response.status}).`);
  }
  return (await response.json()) as T;
}
