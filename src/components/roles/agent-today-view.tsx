"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { Panel, StatGrid } from "@/components/screens/ui";
import {
  agentVisibleLeads,
  campaignName,
  campaignsForAgent,
  formatRelative,
  setPresence,
} from "@/lib/workspace";
import { AgentGate, useAgentSession } from "./agent-gate";
import {
  AgentAvatar,
  AgentStatusChip,
  CampaignStatusChip,
  LeadStageSelect,
  LocalNotice,
  PresenceDot,
  RoleEmpty,
  RoleHead,
  presenceOptions,
} from "./role-ui";

export function AgentTodayView() {
  return (
    <AgentGate>
      <AgentToday />
    </AgentGate>
  );
}

function AgentToday() {
  const { agent, workspace, presence } = useAgentSession();

  if (!agent) return null;

  const leads = agentVisibleLeads(workspace, agent.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const campaigns = campaignsForAgent(workspace, agent.id);
  const counts = {
    total: leads.length,
    fresh: leads.filter((lead) => lead.stage === "new").length,
    working: leads.filter((lead) =>
      ["contacted", "qualified", "proposal"].includes(lead.stage),
    ).length,
    won: leads.filter((lead) => lead.stage === "won").length,
  };
  const schedule = agent.schedule;
  const topLeads = leads.slice(0, 5);

  const setup = [
    {
      id: "account",
      label: "Seat activated",
      hint: "Your invite has been claimed.",
      done: agent.status === "active",
      href: "/app/me",
      action: "View profile",
    },
    {
      id: "presence",
      label: "Presence set",
      hint: "Route calls to you when queues go live.",
      done: presence !== "offline",
      href: "/app/agent/availability",
      action: "Set presence",
    },
    {
      id: "hours",
      label: "Working hours",
      hint: "Tell the team when you are on shift.",
      done: Boolean(schedule),
      href: "/app/agent/availability",
      action: "Add hours",
    },
    {
      id: "lead",
      label: "First lead assigned",
      hint: "Your owner assigns leads to your desk.",
      done: leads.length > 0,
      href: "/app/agent/leads",
      action: "My leads",
    },
  ];

  const workspaceName = agent.team;

  return (
    <article className="screen">
      <RoleHead
        eyebrow={`Agent desk · ${workspaceName}`}
        title="Today"
        lede="Your leads, campaigns, presence and call desk in one place. This desk only shows records assigned to you or to a campaign you work."
        meta={
          <>
            <AgentStatusChip status={agent.status} />
            <span className="screen-chip">
              <Icon name="phone" size={12} />
              Ext. {agent.extension}
            </span>
            {campaigns.length > 0 && (
              <span className="screen-chip">
                <Icon name="megaphone" size={12} />
                {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
              </span>
            )}
            <span className="screen-chip">
              <PresenceDot presence={presence} withLabel />
            </span>
          </>
        }
        actions={
          <>
            <Link className="btn btn-ghost" href="/app/agent/leads">
              My leads
            </Link>
            <Link className="btn btn-primary" href="/app/calls/workspace">
              Call workspace
              <Icon name="arrow" size={15} />
            </Link>
          </>
        }
      />

      <div className="role-stats">
        <StatGrid
          items={[
            { label: "On your desk", unit: counts.total === 1 ? "lead" : "leads", hint: "Assigned or in your campaigns", value: String(counts.total) },
            { label: "New", unit: counts.fresh === 1 ? "lead" : "leads", hint: "Not contacted yet", value: String(counts.fresh) },
            { label: "In progress", unit: counts.working === 1 ? "lead" : "leads", hint: "Contacted to proposal", value: String(counts.working) },
            { label: "Won", unit: counts.won === 1 ? "lead" : "leads", hint: "Closed by you", value: String(counts.won) },
          ]}
        />
      </div>

      <div className="role-split">
        <Panel
          kicker="Your pipeline"
          title="Leads on your desk"
          action={
            <Link className="text-link" href="/app/agent/leads">
              All {counts.total} lead{counts.total === 1 ? "" : "s"}
            </Link>
          }
        >
          {topLeads.length === 0 ? (
            <RoleEmpty
              icon="target"
              title="No leads on your desk yet"
              body="Your organisation owner assigns leads directly or adds you to a campaign. Leads land here the moment they are routed to you."
            />
          ) : (
            <ul className="role-mini-leads">
              {topLeads.map((lead) => (
                <li key={lead.id}>
                  <span className="role-person">
                    <AgentAvatar name={lead.name} size={32} />
                    <span>
                      <strong>{lead.name}</strong>
                      <em>
                        {lead.company || lead.email || lead.phone}
                        {campaignName(workspace, lead.campaignId)
                          ? ` · ${campaignName(workspace, lead.campaignId)}`
                          : ""}
                      </em>
                    </span>
                  </span>
                  <span className="role-mini-meta">{formatRelative(lead.updatedAt)}</span>
                  <LeadStageSelect leadId={lead.id} stage={lead.stage} name={lead.name} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="role-stack">
          <Panel
            kicker="Shift"
            title="Your presence"
            action={<PresenceDot presence={presence} withLabel />}
          >
            <div className="role-presence-grid is-compact">
              {presenceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={presence === option.id ? "is-active" : undefined}
                  aria-pressed={presence === option.id}
                  onClick={() => setPresence(agent.id, option.id)}
                >
                  <i className={`is-${option.id}`} aria-hidden="true" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            <div className="role-shift">
              <div>
                <span>Working hours</span>
                <strong>{schedule ? `${schedule.start} – ${schedule.end}` : "Not set"}</strong>
              </div>
              <div>
                <span>Days</span>
                <strong>{schedule && schedule.days.length > 0 ? schedule.days.join(" · ") : "Not set"}</strong>
              </div>
              <Link className="screen-empty-link" href="/app/agent/availability">
                Edit availability
                <Icon name="arrow" size={13} />
              </Link>
            </div>
          </Panel>

          {campaigns.length > 0 && (
            <Panel kicker="Campaigns" title="Work you are on">
              <ul className="role-campaign-agents">
                {campaigns.map((item) => {
                  const total = workspace.leads.filter(
                    (lead) => lead.campaignId === item.id,
                  ).length;
                  return (
                    <li key={item.id}>
                      <span className="role-campaign-mark" aria-hidden="true">
                        <Icon name="megaphone" size={15} />
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <em>
                          {total} lead{total === 1 ? "" : "s"} in the campaign
                        </em>
                      </div>
                      <CampaignStatusChip status={item.status} />
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          <Panel kicker="Setup" title="Get your desk ready">
            <ol className="role-checklist">
              {setup.map((item) => (
                <li key={item.id} className={item.done ? "is-done" : undefined}>
                  <Icon name={item.done ? "check" : "spark"} size={15} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.hint}</p>
                  </div>
                  {!item.done && (
                    <Link className="role-mini-btn" href={item.href}>
                      {item.action}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>

      <LocalNotice title="Your desk, your records.">
        Leads, presence and working hours are saved in this browser until the Callflow API is
        connected. Calls go live once telephony is deployed.
      </LocalNotice>
    </article>
  );
}
