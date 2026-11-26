"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import {
  agentVisibleLeads,
  campaignName,
  campaignsForAgent,
  formatRelative,
  leadStages,
  type LeadStage,
} from "@/lib/workspace";
import { AgentGate, useAgentSession } from "./agent-gate";
import {
  AgentAvatar,
  LeadStageSelect,
  LocalNotice,
  RoleEmpty,
  RoleHead,
} from "./role-ui";

type StageFilter = "all" | LeadStage;

export function AgentLeadsView() {
  return (
    <AgentGate>
      <AgentLeads />
    </AgentGate>
  );
}

function AgentLeads() {
  const { agent, workspace } = useAgentSession();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<StageFilter>("all");
  const [campaign, setCampaign] = useState("all");

  const campaigns = useMemo(
    () => (agent ? campaignsForAgent(workspace, agent.id) : []),
    [agent, workspace],
  );

  const leads = useMemo(
    () =>
      agent
        ? agentVisibleLeads(workspace, agent.id).sort((a, b) =>
            b.updatedAt.localeCompare(a.updatedAt),
          )
        : [],
    [agent, workspace],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (stage !== "all" && lead.stage !== stage) return false;
      if (campaign === "none" && lead.campaignId) return false;
      if (campaign !== "all" && campaign !== "none" && lead.campaignId !== campaign) return false;
      if (!term) return true;
      return (
        lead.name.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term)
      );
    });
  }, [campaign, leads, query, stage]);

  if (!agent) return null;

  const fresh = leads.filter((lead) => lead.stage === "new").length;

  return (
    <article className="screen">
      <RoleHead
        eyebrow={`Agent desk · ${agent.team}`}
        title="My leads"
        lede="Leads assigned to you plus every lead in a campaign you work. Move each one through its stage as soon as you have an outcome."
        meta={
          <>
            <span className="screen-chip">
              <Icon name="target" size={12} />
              {leads.length} on your desk
            </span>
            {campaigns.length > 0 && (
              <span className="screen-chip">
                <Icon name="megaphone" size={12} />
                {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
              </span>
            )}
            {fresh > 0 && <span className="screen-chip is-record">{fresh} still new</span>}
          </>
        }
      />

      <Panel
        kicker="On your desk"
        title="Lead list"
        action={<span className="role-panel-count">{visible.length} shown</span>}
        className="screen-list-panel"
      >
        <div className="screen-toolbar">
          <label className="screen-search">
            <Icon name="search" size={15} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your leads"
              aria-label="Search your leads"
            />
          </label>
          {campaigns.length > 0 && (
            <label className="role-filter-select">
              <span className="role-sr">Campaign</span>
              <select
                className="screen-select"
                value={campaign}
                onChange={(event) => setCampaign(event.target.value)}
              >
                <option value="all">All campaigns</option>
                <option value="none">Direct leads</option>
                {campaigns.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="screen-filters role-stage-filters" role="group" aria-label="Filter by stage">
          <button
            type="button"
            className={stage === "all" ? "is-active" : undefined}
            aria-pressed={stage === "all"}
            onClick={() => setStage("all")}
          >
            All
          </button>
          {leadStages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={stage === item.id ? "is-active" : undefined}
              aria-pressed={stage === item.id}
              onClick={() => setStage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {leads.length === 0 ? (
          <RoleEmpty
            icon="target"
            title="No leads on your desk yet"
            body="Your organisation owner assigns leads directly or adds you to a campaign. Anything routed to you shows up here, with contact details and notes."
          />
        ) : visible.length === 0 ? (
          <RoleEmpty
            icon="search"
            title="No leads match"
            body="Try a different search term or switch back to all stages and campaigns."
            actions={
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setQuery("");
                  setStage("all");
                  setCampaign("all");
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="role-lead-grid">
            {visible.map((lead) => (
              <article className="role-leadcard" key={lead.id}>
                <header>
                  <AgentAvatar name={lead.name} size={38} />
                  <div className="role-leadcard-copy">
                    <strong>{lead.name}</strong>
                    <em>{lead.company || "No company"}</em>
                  </div>
                  <LeadStageSelect leadId={lead.id} stage={lead.stage} name={lead.name} />
                </header>

                <div className="role-leadcard-contact">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`}>
                      <Icon name="mail" size={13} />
                      {lead.email}
                    </a>
                  ) : null}
                  {lead.phone ? (
                    <a href={`tel:${lead.phone.replace(/\s+/g, "")}`}>
                      <Icon name="phone" size={13} />
                      {lead.phone}
                    </a>
                  ) : null}
                  {!lead.email && !lead.phone && <span className="role-muted">No contact details</span>}
                </div>

                {lead.notes ? (
                  <p className="role-leadcard-note">{lead.notes}</p>
                ) : (
                  <p className="role-leadcard-note is-empty">No notes from the owner yet.</p>
                )}

                <footer>
                  <span className="role-mini-meta">
                    {campaignName(workspace, lead.campaignId)
                      ? `Campaign · ${campaignName(workspace, lead.campaignId)}`
                      : "Direct lead"}
                  </span>
                  <span className="role-mini-meta">Updated {formatRelative(lead.updatedAt)}</span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <LocalNotice title="Set by your owner.">
        Only leads assigned to you or to a campaign you work appear here. Stage changes save in this
        browser and sync when the Callflow API is connected.
      </LocalNotice>
    </article>
  );
}
