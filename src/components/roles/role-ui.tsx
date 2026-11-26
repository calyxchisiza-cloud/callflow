"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { initialsFrom } from "@/lib/onboarding";
import {
  campaignStatusLabel,
  leadStages,
  stageLabel,
  updateLead,
  type AgentStatus,
  type CampaignStatus,
  type LeadStage,
  type Presence,
} from "@/lib/workspace";

export function RoleHead({
  eyebrow,
  title,
  lede,
  meta,
  actions,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="screen-head">
      <div className="screen-head-copy">
        <p className="screen-eyebrow">
          <span className="screen-eyebrow-dot" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="screen-lede">{lede}</p>
        {meta && <div className="screen-meta">{meta}</div>}
      </div>
      {actions && <div className="screen-head-actions">{actions}</div>}
    </header>
  );
}

export function LocalNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="role-notice" role="note">
      <span className="role-notice-icon" aria-hidden="true">
        <Icon name="lock" size={14} />
      </span>
      <p>
        <strong>{title}</strong> {children}
      </p>
    </div>
  );
}

const AVATAR_TINTS = ["is-sage", "is-sand", "is-forest", "is-lime"];

export function AgentAvatar({ name, size = 34 }: { name: string; size?: number }) {
  const tint = AVATAR_TINTS[(name.charCodeAt(0) + name.length) % AVATAR_TINTS.length];
  return (
    <span
      className={`role-avatar ${tint}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      aria-hidden="true"
    >
      {initialsFrom(name) || <Icon name="user" size={Math.round(size * 0.46)} />}
    </span>
  );
}

const agentStatusLabel: Record<AgentStatus, string> = {
  active: "Active",
  invited: "Invited",
  paused: "Paused",
};

export function AgentStatusChip({ status }: { status: AgentStatus }) {
  return (
    <span className={`role-status is-${status}`}>
      <i aria-hidden="true" />
      {agentStatusLabel[status]}
    </span>
  );
}

const stageTone: Record<LeadStage, string> = {
  new: "is-new",
  contacted: "is-progress",
  qualified: "is-progress",
  proposal: "is-progress",
  won: "is-won",
  lost: "is-lost",
};

export function StageChip({ stage }: { stage: LeadStage }) {
  return <span className={`role-stage ${stageTone[stage]}`}>{stageLabel(stage)}</span>;
}

export function CampaignStatusChip({ status }: { status: CampaignStatus }) {
  return (
    <span className={`role-status is-campaign-${status}`}>
      <i aria-hidden="true" />
      {campaignStatusLabel(status)}
    </span>
  );
}

export function LeadStageSelect({
  leadId,
  stage,
  name,
}: {
  leadId: string;
  stage: LeadStage;
  name: string;
}) {
  return (
    <select
      aria-label={`Stage for ${name}`}
      className={`screen-select is-compact role-stage-select is-${stage}`}
      value={stage}
      onChange={(event) => updateLead(leadId, { stage: event.target.value as LeadStage })}
    >
      {leadStages.map((item) => (
        <option key={item.id} value={item.id}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

export const presenceOptions: { id: Presence; label: string; hint: string }[] = [
  { id: "available", label: "Available", hint: "Ready for the next call" },
  { id: "busy", label: "On a call", hint: "Finish the current conversation" },
  { id: "away", label: "Away", hint: "Short break, back shortly" },
  { id: "offline", label: "Offline", hint: "Not taking calls right now" },
];

export const presenceLabel: Record<Presence, string> = {
  available: "Available",
  busy: "On a call",
  away: "Away",
  offline: "Offline",
};

export function PresenceDot({
  presence,
  withLabel = false,
}: {
  presence: Presence;
  withLabel?: boolean;
}) {
  return (
    <span className={`role-presence is-${presence}`}>
      <i aria-hidden="true" />
      {withLabel && presenceLabel[presence]}
    </span>
  );
}

export function RoleAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p className={`role-alert is-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon name={tone === "error" ? "close" : "check"} size={14} />
      {children}
    </p>
  );
}

export function RoleEmpty({
  icon,
  title,
  body,
  actions,
}: {
  icon: string;
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="role-empty">
      <span className="role-empty-icon" aria-hidden="true">
        <Icon name={icon} size={21} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
        {actions && <div className="role-empty-actions">{actions}</div>}
      </div>
    </div>
  );
}
