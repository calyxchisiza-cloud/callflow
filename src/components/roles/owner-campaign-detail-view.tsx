"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Panel, StatGrid } from "@/components/screens/ui";
import {
  attachLeadToCampaign,
  campaignStatuses,
  deleteCampaign,
  formatDate,
  formatRelative,
  leadStages,
  toggleCampaignAgent,
  updateCampaign,
  updateLead,
  useWorkspace,
  type CampaignStatus,
  type LeadStage,
} from "@/lib/workspace";
import {
  AgentAvatar,
  CampaignStatusChip,
  LocalNotice,
  PresenceDot,
  RoleEmpty,
  RoleHead,
} from "./role-ui";

export function OwnerCampaignDetailView({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const { workspace, ready } = useWorkspace();
  const [confirming, setConfirming] = useState(false);
  const [attachId, setAttachId] = useState("");

  const campaign = workspace.campaigns.find((item) => item.id === campaignId);

  const leads = useMemo(
    () =>
      workspace.leads
        .filter((lead) => lead.campaignId === campaignId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [campaignId, workspace.leads],
  );

  const attachable = useMemo(
    () =>
      workspace.leads
        .filter((lead) => lead.campaignId !== campaignId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [campaignId, workspace.leads],
  );

  const agents = workspace.agents.filter((agent) => agent.status !== "paused");
  const ownerChoices = workspace.agents.filter((agent) => agent.status !== "paused");

  if (!ready) {
    return (
      <article className="screen">
        <p className="role-loading">Loading campaign…</p>
      </article>
    );
  }

  if (!campaign) {
    return (
      <article className="screen">
        <RoleHead
          eyebrow="Conversations · Campaigns"
          title="Campaign not found"
          lede="That campaign is not in this workspace. It may have been deleted in another tab."
          actions={
            <Link className="btn btn-ghost" href="/app/campaigns">
              Back to campaigns
            </Link>
          }
        />
        <Panel>
          <p className="role-panel-copy">
            Open the campaign list to pick an existing campaign or create a new one.
          </p>
          <div className="role-inline-links">
            <Link className="btn btn-primary" href="/app/campaigns">
              View campaigns
              <Icon name="arrow" size={15} />
            </Link>
          </div>
        </Panel>
      </article>
    );
  }

  const won = leads.filter((lead) => lead.stage === "won").length;
  const toCall = leads.filter((lead) => ["new", "contacted"].includes(lead.stage)).length;
  const assignedAgents = agents.filter((agent) => campaign.agentIds.includes(agent.id));

  return (
    <article className="screen">
      <RoleHead
        eyebrow="Conversations · Campaigns"
        title={campaign.name}
        lede={
          campaign.description ||
          "No description yet. Edit the campaign to explain what agents should offer on these calls."
        }
        meta={
          <>
            <CampaignStatusChip status={campaign.status} />
            <span className="screen-chip">
              <Icon name="target" size={12} />
              {leads.length} lead{leads.length === 1 ? "" : "s"}
            </span>
            <span className="screen-chip">
              <Icon name="users" size={12} />
              {campaign.agentIds.length} agent{campaign.agentIds.length === 1 ? "" : "s"}
            </span>
          </>
        }
        actions={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setConfirming((open) => !open)}
            >
              <Icon name="trash" size={14} />
              Delete
            </button>
            <Link className="btn btn-primary" href={`/app/campaigns/${campaign.id}/edit`}>
              <Icon name="edit" size={14} />
              Edit campaign
            </Link>
          </>
        }
      />

      {confirming && (
        <div className="role-dangerbar" role="alertdialog" aria-label="Delete campaign">
          <div>
            <strong>Delete “{campaign.name}”?</strong>
            <p>
              Its {leads.length} lead{leads.length === 1 ? "" : "s"} stay in the lead inbox without a
              campaign. Agents lose the campaign from their desk.
            </p>
          </div>
          <div className="role-confirm-actions">
            <button
              type="button"
              className="role-mini-btn is-danger"
              onClick={() => {
                deleteCampaign(campaign.id);
                router.push("/app/campaigns");
              }}
            >
              Delete campaign
            </button>
            <button
              type="button"
              className="role-mini-btn is-quiet"
              onClick={() => setConfirming(false)}
            >
              Keep it
            </button>
          </div>
        </div>
      )}

      <div className="role-stats">
        <StatGrid
          items={[
            { label: "Leads", unit: leads.length === 1 ? "lead" : "leads", hint: "In this campaign", value: String(leads.length) },
            { label: "Agents", unit: campaign.agentIds.length === 1 ? "agent" : "agents", hint: "Working this campaign", value: String(campaign.agentIds.length) },
            { label: "Won", unit: won === 1 ? "lead" : "leads", hint: "Closed from this campaign", value: String(won) },
            { label: "To call", unit: toCall === 1 ? "lead" : "leads", hint: "New or contacted", value: String(toCall) },
          ]}
        />
      </div>

      <div className="role-split is-campaign-detail">
        <div className="role-stack">
          <Panel
            kicker="Lead list"
            title="Leads in this campaign"
            action={<span className="role-panel-count">{leads.length} total</span>}
            className="screen-list-panel"
          >
            <div className="role-campaign-tools">
              <Link
                className="btn btn-primary"
                href={`/app/crm/leads/new?campaign=${campaign.id}`}
              >
                <Icon name="plus" size={14} />
                Add lead
              </Link>
              <Link
                className="btn btn-ghost"
                href={`/app/crm/leads/import?campaign=${campaign.id}`}
              >
                <Icon name="plug" size={14} />
                Import CSV
              </Link>
              <label className="role-attach">
                <span className="role-sr">Attach an existing lead</span>
                <select
                  className="screen-select is-compact"
                  value={attachId}
                  onChange={(event) => {
                    const leadId = event.target.value;
                    setAttachId("");
                    if (leadId) attachLeadToCampaign(leadId, campaign.id);
                  }}
                >
                  <option value="">Attach existing lead…</option>
                  {attachable.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                      {lead.company ? ` · ${lead.company}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {leads.length === 0 ? (
              <RoleEmpty
                icon="target"
                title="No leads in this campaign yet"
                body="Add leads by hand, import a CSV, or attach leads that are already in the inbox. Only agents on this campaign will see them."
                actions={
                  <>
                    <Link
                      className="btn btn-primary"
                      href={`/app/crm/leads/new?campaign=${campaign.id}`}
                    >
                      Add a lead
                    </Link>
                    <Link
                      className="btn btn-ghost"
                      href={`/app/crm/leads/import?campaign=${campaign.id}`}
                    >
                      Import a CSV
                    </Link>
                  </>
                }
              />
            ) : (
              <div className="screen-tablewrap">
                <table className="screen-table role-table role-lead-table is-campaign-leads">
                  <thead>
                    <tr>
                      <th scope="col">Lead</th>
                      <th scope="col">Contact</th>
                      <th scope="col">Stage</th>
                      <th scope="col">Owner</th>
                      <th scope="col">
                        <span className="role-sr">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <span className="role-person">
                            <AgentAvatar name={lead.name} />
                            <span>
                              <strong>{lead.name}</strong>
                              <em>{lead.company || lead.source || "No company"}</em>
                            </span>
                          </span>
                        </td>
                        <td>
                          <span className="role-contact">
                            {lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>}
                            {lead.phone && (
                              <a href={`tel:${lead.phone.replace(/\s+/g, "")}`}>{lead.phone}</a>
                            )}
                            {!lead.email && !lead.phone && <span className="role-muted">—</span>}
                          </span>
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
                            {ownerChoices.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="role-cell-actions">
                          <button
                            type="button"
                            className="role-mini-btn is-quiet"
                            onClick={() => attachLeadToCampaign(lead.id, null)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="screen-table-foot">
                  <span>
                    {leads.length} lead{leads.length === 1 ? "" : "s"} in this campaign
                  </span>
                  <span className="role-table-note">
                    Stage and owner changes save straight away.
                  </span>
                </div>
              </div>
            )}
          </Panel>
        </div>

        <div className="role-stack">
          <Panel
            kicker="Team"
            title="Agents on this campaign"
            action={<span className="role-panel-count">{campaign.agentIds.length} assigned</span>}
          >
            {agents.length === 0 ? (
              <RoleEmpty
                icon="users"
                title="No agents to assign"
                body="Invite agents first, then come back and add them to this campaign."
                actions={
                  <Link className="btn btn-ghost" href="/app/agents/new">
                    Invite an agent
                  </Link>
                }
              />
            ) : (
              <ul className="role-campaign-agents">
                {agents.map((agent) => {
                  const picked = campaign.agentIds.includes(agent.id);
                  const presence = workspace.presence[agent.id] ?? "offline";
                  return (
                    <li key={agent.id}>
                      <AgentAvatar name={agent.name} size={30} />
                      <div>
                        <strong>{agent.name}</strong>
                        <em>
                          {agent.team} · Ext. {agent.extension}
                        </em>
                      </div>
                      {agent.status === "active" && <PresenceDot presence={presence} />}
                      <button
                        type="button"
                        className={`role-mini-btn${picked ? " is-quiet" : ""}`}
                        onClick={() => toggleCampaignAgent(campaign.id, agent.id)}
                      >
                        {picked ? "Remove" : "Add"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {assignedAgents.length === 0 && agents.length > 0 && (
              <p className="role-table-note">
                No agents assigned yet — leads here stay visible only in the inbox.
              </p>
            )}
          </Panel>

          <Panel kicker="Settings" title="Campaign details">
            <dl className="role-facts">
              <div>
                <dt>Status</dt>
                <dd>
                  <select
                    aria-label="Campaign status"
                    className={`screen-select is-compact role-campaign-status is-${campaign.status}`}
                    value={campaign.status}
                    onChange={(event) =>
                      updateCampaign(campaign.id, {
                        status: event.target.value as CampaignStatus,
                      })
                    }
                  >
                    {campaignStatuses.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDate(campaign.createdAt)}</dd>
              </div>
              <div>
                <dt>Last change</dt>
                <dd>{formatRelative(campaign.updatedAt)}</dd>
              </div>
            </dl>
            <div className="role-inline-links">
              <Link className="screen-empty-link" href={`/app/campaigns/${campaign.id}/edit`}>
                Edit name and agents
                <Icon name="arrow" size={14} />
              </Link>
            </div>
          </Panel>
        </div>
      </div>

      <LocalNotice title="Saved in this browser.">
        Campaign leads, stages and agent assignments are stored locally until the Callflow API is
        connected.
      </LocalNotice>
    </article>
  );
}
