"use client";

import { useEffect, useState } from "react";

const WORKSPACE_KEY = "callflow:workspace";
const WORKSPACE_EVENT = "callflow:workspace-updated";
const ROLE_KEY = "callflow:role";
const AGENT_EMAIL_KEY = "callflow:agent-email";
const ROLE_EVENT = "callflow:role-updated";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AgentStatus = "invited" | "active" | "paused";
export type Presence = "available" | "busy" | "away" | "offline";

export type AgentSchedule = { start: string; end: string; days: string[] };

export type Agent = {
  id: string;
  name: string;
  email: string;
  team: string;
  extension: string;
  status: AgentStatus;
  createdAt: string;
  lastSignIn?: string;
  schedule?: AgentSchedule;
};

export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export const leadStages: { id: LeadStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export const stageLabel = (stage: LeadStage): string =>
  leadStages.find((item) => item.id === stage)?.label ?? stage;

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: LeadStage;
  ownerId: string | null;
  campaignId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export const campaignStatuses: { id: CampaignStatus; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "completed", label: "Completed" },
];

export const campaignStatusLabel = (status: CampaignStatus): string =>
  campaignStatuses.find((item) => item.id === status)?.label ?? status;

export type Campaign = {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  agentIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Workspace = {
  agents: Agent[];
  leads: Lead[];
  campaigns: Campaign[];
  presence: Record<string, Presence>;
};

export type AgentDraft = {
  name: string;
  email: string;
  team: string;
  extension?: string;
};

export type LeadDraft = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  stage?: LeadStage;
  ownerId?: string | null;
  campaignId?: string | null;
  notes?: string;
};

export type CampaignDraft = {
  name: string;
  description?: string;
  status?: CampaignStatus;
  agentIds?: string[];
};

export type SaveResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function emptyWorkspace(): Workspace {
  return { agents: [], leads: [], campaigns: [], presence: {} };
}

function normalize(parsed: Partial<Workspace> | null): Workspace {
  return {
    agents: Array.isArray(parsed?.agents) ? parsed.agents : [],
    leads: Array.isArray(parsed?.leads) ? parsed.leads : [],
    campaigns: Array.isArray(parsed?.campaigns)
      ? parsed.campaigns.map((campaign) => ({
          ...campaign,
          agentIds: Array.isArray(campaign.agentIds) ? campaign.agentIds : [],
        }))
      : [],
    presence:
      parsed?.presence && typeof parsed.presence === "object" ? parsed.presence : {},
  };
}

export function readWorkspace(): Workspace {
  if (typeof window === "undefined") return emptyWorkspace();
  try {
    const raw = window.localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return emptyWorkspace();
    return normalize(JSON.parse(raw) as Partial<Workspace>);
  } catch {
    return emptyWorkspace();
  }
}

function saveWorkspace(next: Workspace) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
  } catch {
    /* local storage may be unavailable */
  }
  window.dispatchEvent(new Event(WORKSPACE_EVENT));
}

function makeId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}`;
}

const now = () => new Date().toISOString();

function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function nextExtension(agents: Agent[]): string {
  const used = new Set(agents.map((agent) => agent.extension));
  let candidate = 102;
  while (used.has(String(candidate))) candidate += 1;
  return String(candidate);
}

export function createAgent(draft: AgentDraft): SaveResult<Agent> {
  const name = draft.name.trim();
  const email = draft.email.trim();
  const team = draft.team.trim();
  const extension = (draft.extension ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Enter the agent's full name." };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid work email." };
  if (team.length < 2) return { ok: false, error: "Choose or type a team name." };
  if (extension && !/^\d{2,5}$/.test(extension))
    return { ok: false, error: "Extensions use 2–5 digits." };

  const workspace = readWorkspace();
  if (workspace.agents.some((agent) => sameEmail(agent.email, email)))
    return { ok: false, error: "An agent with that email already exists." };

  const agent: Agent = {
    id: makeId("agt"),
    name,
    email,
    team,
    extension: extension || nextExtension(workspace.agents),
    status: "invited",
    createdAt: now(),
  };

  saveWorkspace({ ...workspace, agents: [...workspace.agents, agent] });
  return { ok: true, value: agent };
}

export function setAgentStatus(agentId: string, status: AgentStatus) {
  const workspace = readWorkspace();
  saveWorkspace({
    ...workspace,
    agents: workspace.agents.map((agent) =>
      agent.id === agentId ? { ...agent, status } : agent,
    ),
  });
}

export function updateAgentSchedule(agentId: string, schedule: AgentSchedule) {
  const workspace = readWorkspace();
  saveWorkspace({
    ...workspace,
    agents: workspace.agents.map((agent) =>
      agent.id === agentId ? { ...agent, schedule } : agent,
    ),
  });
}

export function setPresence(agentId: string, presence: Presence) {
  const workspace = readWorkspace();
  saveWorkspace({
    ...workspace,
    presence: { ...workspace.presence, [agentId]: presence },
  });
}

/* Campaigns --------------------------------------------------------------- */

export function createCampaign(draft: CampaignDraft): SaveResult<Campaign> {
  const name = draft.name.trim();
  if (name.length < 2) return { ok: false, error: "Give the campaign a name." };

  const workspace = readWorkspace();
  if (workspace.campaigns.some((item) => item.name.toLowerCase() === name.toLowerCase()))
    return { ok: false, error: "A campaign with that name already exists." };

  const stamp = now();
  const campaign: Campaign = {
    id: makeId("cmp"),
    name,
    description: (draft.description ?? "").trim(),
    status: draft.status ?? "draft",
    agentIds: draft.agentIds ?? [],
    createdAt: stamp,
    updatedAt: stamp,
  };

  saveWorkspace({ ...workspace, campaigns: [campaign, ...workspace.campaigns] });
  return { ok: true, value: campaign };
}

export function updateCampaign(
  campaignId: string,
  patch: Partial<Pick<Campaign, "name" | "description" | "status" | "agentIds">>,
): SaveResult<Campaign> {
  const workspace = readWorkspace();
  const current = workspace.campaigns.find((item) => item.id === campaignId);
  if (!current) return { ok: false, error: "That campaign no longer exists." };

  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (name.length < 2) return { ok: false, error: "Give the campaign a name." };
    if (
      workspace.campaigns.some(
        (item) => item.id !== campaignId && item.name.toLowerCase() === name.toLowerCase(),
      )
    )
      return { ok: false, error: "A campaign with that name already exists." };
  }

  const next: Campaign = {
    ...current,
    ...patch,
    name: patch.name !== undefined ? patch.name.trim() : current.name,
    description:
      patch.description !== undefined ? patch.description.trim() : current.description,
    updatedAt: now(),
  };

  saveWorkspace({
    ...workspace,
    campaigns: workspace.campaigns.map((item) => (item.id === campaignId ? next : item)),
  });
  return { ok: true, value: next };
}

export function deleteCampaign(campaignId: string) {
  const workspace = readWorkspace();
  saveWorkspace({
    ...workspace,
    campaigns: workspace.campaigns.filter((item) => item.id !== campaignId),
    leads: workspace.leads.map((lead) =>
      lead.campaignId === campaignId
        ? { ...lead, campaignId: null, updatedAt: now() }
        : lead,
    ),
  });
}

export function setCampaignAgents(campaignId: string, agentIds: string[]) {
  updateCampaign(campaignId, { agentIds });
}

export function toggleCampaignAgent(campaignId: string, agentId: string) {
  const workspace = readWorkspace();
  const campaign = workspace.campaigns.find((item) => item.id === campaignId);
  if (!campaign) return;
  const agentIds = campaign.agentIds.includes(agentId)
    ? campaign.agentIds.filter((id) => id !== agentId)
    : [...campaign.agentIds, agentId];
  setCampaignAgents(campaignId, agentIds);
}

export function attachLeadToCampaign(leadId: string, campaignId: string | null) {
  updateLead(leadId, { campaignId });
}

export function campaignName(workspace: Workspace, campaignId: string | null): string | null {
  if (!campaignId) return null;
  return workspace.campaigns.find((item) => item.id === campaignId)?.name ?? null;
}

export function campaignsForAgent(workspace: Workspace, agentId: string): Campaign[] {
  return workspace.campaigns.filter((campaign) => campaign.agentIds.includes(agentId));
}

export function agentVisibleLeads(workspace: Workspace, agentId: string): Lead[] {
  const campaignIds = new Set(
    campaignsForAgent(workspace, agentId).map((campaign) => campaign.id),
  );
  return workspace.leads.filter(
    (lead) => lead.ownerId === agentId || (lead.campaignId ? campaignIds.has(lead.campaignId) : false),
  );
}

export function campaignLeadCount(workspace: Workspace, campaignId: string): number {
  return workspace.leads.filter((lead) => lead.campaignId === campaignId).length;
}

export function createLead(draft: LeadDraft): SaveResult<Lead> {
  const name = (draft.name ?? "").trim();
  const email = (draft.email ?? "").trim();
  const phone = (draft.phone ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Enter the lead's full name." };
  if (email && !EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid email." };
  if (!email && !phone) return { ok: false, error: "Add an email or a phone number." };

  const workspace = readWorkspace();
  if (email && workspace.leads.some((lead) => sameEmail(lead.email, email)))
    return { ok: false, error: "A lead with that email already exists." };

  const stamp = now();
  const lead: Lead = {
    id: makeId("lead"),
    name,
    company: (draft.company ?? "").trim(),
    email,
    phone,
    source: (draft.source ?? "").trim(),
    stage: draft.stage ?? "new",
    ownerId: draft.ownerId ?? null,
    campaignId: draft.campaignId ?? null,
    notes: (draft.notes ?? "").trim(),
    createdAt: stamp,
    updatedAt: stamp,
  };

  saveWorkspace({ ...workspace, leads: [lead, ...workspace.leads] });
  return { ok: true, value: lead };
}

export function updateLead(
  leadId: string,
  patch: Partial<Pick<Lead, "stage" | "ownerId" | "campaignId" | "notes">>,
) {
  const workspace = readWorkspace();
  saveWorkspace({
    ...workspace,
    leads: workspace.leads.map((lead) =>
      lead.id === leadId ? { ...lead, ...patch, updatedAt: now() } : lead,
    ),
  });
}

export function deleteLead(leadId: string) {
  const workspace = readWorkspace();
  saveWorkspace({ ...workspace, leads: workspace.leads.filter((lead) => lead.id !== leadId) });
}

export type ImportSummary = { added: number; duplicates: number; skipped: number };

export function importLeads(drafts: LeadDraft[]): ImportSummary {
  const workspace = readWorkspace();
  const seenEmails = new Set(
    workspace.leads.map((lead) => lead.email.trim().toLowerCase()).filter(Boolean),
  );
  const seenPhones = new Set(
    workspace.leads.map((lead) => lead.phone.replace(/\D/g, "")).filter(Boolean),
  );
  const stamp = now();
  const added: Lead[] = [];
  let duplicates = 0;
  let skipped = 0;

  for (const draft of drafts) {
    const email = (draft.email ?? "").trim();
    const phone = (draft.phone ?? "").trim();
    const phoneKey = phone.replace(/\D/g, "");
    if (!email && !phoneKey) {
      skipped += 1;
      continue;
    }
    if (
      (email && seenEmails.has(email.toLowerCase())) ||
      (phoneKey && seenPhones.has(phoneKey))
    ) {
      duplicates += 1;
      continue;
    }
    if (email) seenEmails.add(email.toLowerCase());
    if (phoneKey) seenPhones.add(phoneKey);
    added.push({
      id: makeId("lead"),
      name: draft.name.trim(),
      company: (draft.company ?? "").trim(),
      email,
      phone: (draft.phone ?? "").trim(),
      source: (draft.source ?? "").trim(),
      stage: draft.stage ?? "new",
      ownerId: draft.ownerId ?? null,
      campaignId: draft.campaignId ?? null,
      notes: (draft.notes ?? "").trim(),
      createdAt: stamp,
      updatedAt: stamp,
    });
  }

  if (added.length > 0) saveWorkspace({ ...workspace, leads: [...added, ...workspace.leads] });
  return { added: added.length, duplicates, skipped };
}

/* Role session ------------------------------------------------------------ */

export type RoleSession = { role: "owner" } | { role: "agent"; email: string };

export function readSession(): RoleSession | null {
  if (typeof window === "undefined") return null;
  try {
    const role = window.sessionStorage.getItem(ROLE_KEY);
    if (role === "owner") return { role: "owner" };
    if (role === "agent") {
      const email = window.sessionStorage.getItem(AGENT_EMAIL_KEY) ?? "";
      return email ? { role: "agent", email } : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function setSession(session: RoleSession) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ROLE_KEY, session.role);
    if (session.role === "agent") {
      window.sessionStorage.setItem(AGENT_EMAIL_KEY, session.email);
    } else {
      window.sessionStorage.removeItem(AGENT_EMAIL_KEY);
    }
  } catch {
    /* session storage may be unavailable */
  }
  window.dispatchEvent(new Event(ROLE_EVENT));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ROLE_KEY);
    window.sessionStorage.removeItem(AGENT_EMAIL_KEY);
  } catch {
    /* session storage may be unavailable */
  }
  window.dispatchEvent(new Event(ROLE_EVENT));
}

export function findAgentByEmail(email: string): Agent | undefined {
  return readWorkspace().agents.find((agent) => sameEmail(agent.email, email));
}

export function signInAgent(email: string): SaveResult<Agent> {
  const workspace = readWorkspace();
  const match = workspace.agents.find((agent) => sameEmail(agent.email, email));
  if (!match) {
    return {
      ok: false,
      error: "No agent matches that email. Ask your organisation owner to invite you first.",
    };
  }

  const agent: Agent = {
    ...match,
    status: "active",
    lastSignIn: now(),
  };
  saveWorkspace({
    ...workspace,
    agents: workspace.agents.map((item) => (item.id === agent.id ? agent : item)),
    presence: { ...workspace.presence, [agent.id]: workspace.presence[agent.id] ?? "available" },
  });
  setSession({ role: "agent", email: agent.email });
  return { ok: true, value: agent };
}

/* React bindings ---------------------------------------------------------- */

export function useWorkspace(): { workspace: Workspace; ready: boolean } {
  const [workspace, setWorkspaceState] = useState<Workspace>(emptyWorkspace);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setWorkspaceState(readWorkspace());
    sync();
    setReady(true);
    window.addEventListener(WORKSPACE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WORKSPACE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { workspace, ready };
}

export function useSession(): { session: RoleSession | null; ready: boolean } {
  const [session, setSessionState] = useState<RoleSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSessionState(readSession());
    sync();
    setReady(true);
    window.addEventListener(ROLE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ROLE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { session, ready };
}

export function leadCount(workspace: Workspace, agentId: string): number {
  return agentVisibleLeads(workspace, agentId).length;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  if (Number.isNaN(diff)) return "—";
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(iso);
}
