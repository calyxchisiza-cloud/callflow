"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Panel, StatGrid } from "@/components/screens/ui";
import {
  formatRelative,
  leadStages,
  updateLead,
  useWorkspace,
  type LeadStage,
} from "@/lib/workspace";
import { AgentAvatar, LocalNotice, RoleEmpty, RoleHead } from "./role-ui";

type StageFilter = "all" | LeadStage;

export function OwnerLeadsView() {
  const { workspace, ready } = useWorkspace();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<StageFilter>("all");
  const [owner, setOwner] = useState("all");
  const [campaign, setCampaign] = useState("all");

  const { leads, agents, campaigns } = workspace;

  const counts = useMemo(
    () => ({
      total: leads.length,
      unassigned: leads.filter((lead) => !lead.ownerId).length,
      working: leads.filter((lead) =>
        ["contacted", "qualified", "proposal"].includes(lead.stage),
      ).length,
      won: leads.filter((lead) => lead.stage === "won").length,
      inCampaign: leads.filter((lead) => lead.campaignId).length,
    }),
    [leads],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...leads]
      .filter((lead) => {
        if (stage !== "all" && lead.stage !== stage) return false;
        if (owner === "unassigned" && lead.ownerId) return false;
        if (owner !== "all" && owner !== "unassigned" && lead.ownerId !== owner) return false;
        if (campaign === "none" && lead.campaignId) return false;
        if (campaign !== "all" && campaign !== "none" && lead.campaignId !== campaign) return false;
        if (!term) return true;
        const campaignLabel =
          campaigns.find((item) => item.id === lead.campaignId)?.name.toLowerCase() ?? "";
        return (
          lead.name.toLowerCase().includes(term) ||
          lead.company.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          lead.phone.toLowerCase().includes(term) ||
          lead.source.toLowerCase().includes(term) ||
          campaignLabel.includes(term)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [campaign, campaigns, leads, owner, query, stage]);

  const activeAgents = agents.filter((agent) => agent.status !== "paused");

  return (
    <article className="screen">
      <RoleHead
        eyebrow="Customers · CRM — leads"
        title="Lead inbox"
        lede="Every lead the organisation has captured. Assign them to agents, move them through stages and keep the pipeline honest."
        meta={
          <>
            <span className="screen-chip">
              <Icon name="target" size={12} />
              {counts.total} lead{counts.total === 1 ? "" : "s"}
            </span>
            {counts.unassigned > 0 && (
              <span className="screen-chip is-record">{counts.unassigned} unassigned</span>
            )}
            {counts.inCampaign > 0 && (
              <span className="screen-chip">
                <Icon name="megaphone" size={12} />
                {counts.inCampaign} in campaigns
              </span>
            )}
          </>
        }
        actions={
          <>
            <Link className="btn btn-ghost" href="/app/crm/leads/import">
              <Icon name="plug" size={15} />
              Import CSV
            </Link>
            <Link className="btn btn-primary" href="/app/crm/leads/new">
              Add lead
              <Icon name="arrow" size={15} />
            </Link>
          </>
        }
      />

      <div className="role-stats">
        <StatGrid
          items={[
            { label: "All leads", unit: "captured", hint: "Inbox total", value: String(counts.total) },
            { label: "Unassigned", unit: counts.unassigned === 1 ? "lead" : "leads", hint: "No agent owns them yet", value: String(counts.unassigned) },
            { label: "In progress", unit: counts.working === 1 ? "lead" : "leads", hint: "Contacted to proposal", value: String(counts.working) },
            { label: "Won", unit: counts.won === 1 ? "lead" : "leads", hint: "Closed successfully", value: String(counts.won) },
          ]}
        />
      </div>

      {counts.unassigned > 0 && (
        <LocalNotice title={`${counts.unassigned} lead${counts.unassigned === 1 ? "" : "s"} waiting for an owner.`}>
          Use the Owner column to assign them. Assigned leads appear on that agent&apos;s desk
          immediately after they sign in.
        </LocalNotice>
      )}

      <Panel
        kicker="All leads"
        title="Pipeline"
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
              placeholder="Search name, company, email or phone"
              aria-label="Search leads"
            />
          </label>

          <label className="role-filter-select">
            <span className="role-sr">Owner</span>
            <select
              className="screen-select"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
            >
              <option value="all">All owners</option>
              <option value="unassigned">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <label className="role-filter-select">
            <span className="role-sr">Campaign</span>
            <select
              className="screen-select"
              value={campaign}
              onChange={(event) => setCampaign(event.target.value)}
            >
              <option value="all">All campaigns</option>
              <option value="none">Not in a campaign</option>
              {campaigns.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="screen-filters role-stage-filters" role="group" aria-label="Filter by stage">
          <button
            type="button"
            className={stage === "all" ? "is-active" : undefined}
            aria-pressed={stage === "all"}
            onClick={() => setStage("all")}
          >
            All stages
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

        {!ready ? (
          <p className="role-loading">Loading leads…</p>
        ) : leads.length === 0 ? (
          <RoleEmpty
            icon="target"
            title="No leads yet"
            body="Import a CSV from your old CRM or add the first lead by hand. Every lead shows up here, unassigned until you give it to an agent."
            actions={
              <>
                <Link className="btn btn-primary" href="/app/crm/leads/import">
                  Import a CSV
                </Link>
                <Link className="btn btn-ghost" href="/app/crm/leads/new">
                  Add a lead
                </Link>
              </>
            }
          />
        ) : visible.length === 0 ? (
          <RoleEmpty
            icon="search"
            title="No leads match these filters"
            body="Clear the search or switch back to all stages, owners and campaigns."
            actions={
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setQuery("");
                  setStage("all");
                  setOwner("all");
                  setCampaign("all");
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="screen-tablewrap">
            <table className="screen-table role-table role-lead-table">
              <thead>
                <tr>
                  <th scope="col">Lead</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Source</th>
                  <th scope="col">Campaign</th>
                  <th scope="col">Stage</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Updated</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <span className="role-person">
                        <AgentAvatar name={lead.name} />
                        <span>
                          <strong>{lead.name}</strong>
                          <em>{lead.company || "No company"}</em>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="role-contact">
                        {lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>}
                        {lead.phone && <a href={`tel:${lead.phone.replace(/\s+/g, "")}`}>{lead.phone}</a>}
                        {!lead.email && !lead.phone && <span className="role-muted">—</span>}
                      </span>
                    </td>
                    <td>{lead.source || <span className="role-muted">—</span>}</td>
                    <td>
                      <select
                        aria-label={`Campaign for ${lead.name}`}
                        className={`screen-select is-compact role-campaign-pick${
                          lead.campaignId ? "" : " is-unassigned"
                        }`}
                        value={lead.campaignId ?? ""}
                        onChange={(event) =>
                          updateLead(lead.id, { campaignId: event.target.value || null })
                        }
                      >
                        <option value="">No campaign</option>
                        {campaigns.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        aria-label={`Stage for ${lead.name}`}
                        className={`screen-select is-compact role-stage-select is-${lead.stage}`}
                        value={lead.stage}
                        onChange={(event) =>
                          updateLead(lead.id, { stage: event.target.value as LeadStage })
                        }
                      >
                        {leadStages.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        aria-label={`Owner for ${lead.name}`}
                        className={`screen-select is-compact${lead.ownerId ? "" : " is-unassigned"}`}
                        value={lead.ownerId ?? ""}
                        onChange={(event) =>
                          updateLead(lead.id, { ownerId: event.target.value || null })
                        }
                      >
                        <option value="">Unassigned</option>
                        {activeAgents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="role-updated">{formatRelative(lead.updatedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="screen-table-foot">
              <span>
                {visible.length} of {leads.length} lead{leads.length === 1 ? "" : "s"}
              </span>
              <span className="role-table-note">
                Stage, owner and campaign changes save straight away.
              </span>
            </div>
          </div>
        )}
      </Panel>

      {agents.length === 0 && leads.length > 0 && (
        <LocalNotice title="No agents to assign leads to yet.">
          <Link href="/app/agents/new">Invite an agent</Link> first, then come back and give them
          their leads.
        </LocalNotice>
      )}

      {ready && campaigns.length === 0 && leads.length > 0 && (
        <LocalNotice title="No campaigns yet.">
          Group leads into a campaign so a team of agents works the same list.{" "}
          <Link href="/app/campaigns/new">Create a campaign</Link>.
        </LocalNotice>
      )}
    </article>
  );
}
