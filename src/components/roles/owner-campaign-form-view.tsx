"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import {
  campaignStatuses,
  createCampaign,
  updateCampaign,
  useWorkspace,
  type CampaignStatus,
} from "@/lib/workspace";
import { AgentAvatar, CampaignStatusChip, LocalNotice, RoleAlert, RoleHead } from "./role-ui";

export function OwnerCampaignFormView({ campaignId }: { campaignId?: string }) {
  const router = useRouter();
  const { workspace, ready } = useWorkspace();
  const campaign = campaignId
    ? workspace.campaigns.find((item) => item.id === campaignId)
    : undefined;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("draft");
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    if (!campaign || loadedId === campaign.id) return;
    setName(campaign.name);
    setDescription(campaign.description);
    setStatus(campaign.status);
    setAgentIds(campaign.agentIds);
    setLoadedId(campaign.id);
  }, [campaign, loadedId]);

  const agents = workspace.agents.filter((agent) => agent.status !== "paused");

  function toggleAgent(agentId: string) {
    setAgentIds((current) =>
      current.includes(agentId)
        ? current.filter((id) => id !== agentId)
        : [...current, agentId],
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (campaignId) {
      const result = updateCampaign(campaignId, { name, description, status, agentIds });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/app/campaigns/${result.value.id}`);
      return;
    }

    const result = createCampaign({ name, description, status, agentIds });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/app/campaigns/${result.value.id}`);
  }

  if (campaignId && ready && !campaign) {
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

  return (
    <article className="screen">
      <RoleHead
        eyebrow="Conversations · Campaigns"
        title={campaignId ? "Edit campaign" : "New campaign"}
        lede={
          campaignId
            ? "Update the campaign details, its status and which agents work it."
            : "Name the calling push, pick its status and choose the agents who will work the leads."
        }
        meta={campaign ? <CampaignStatusChip status={campaign.status} /> : undefined}
        actions={
          <Link
            className="btn btn-ghost"
            href={campaignId ? `/app/campaigns/${campaignId}` : "/app/campaigns"}
          >
            Cancel
          </Link>
        }
      />

      <div className="role-split">
        <Panel kicker="Campaign" title="Details">
          <form className="screen-form" onSubmit={onSubmit} noValidate>
            <div className="screen-fields">
              <div className="screen-field is-full">
                <label htmlFor="campaign-name">
                  Campaign name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="campaign-name"
                  name="name"
                  autoComplete="off"
                  placeholder="e.g. Q4 Zambezi renewal push"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="screen-field is-full">
                <label htmlFor="campaign-description">What is this campaign for?</label>
                <textarea
                  id="campaign-description"
                  name="description"
                  rows={3}
                  placeholder="Who should agents call, what should they offer, and when does it run?"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="screen-field">
                <label htmlFor="campaign-status">Status</label>
                <select
                  id="campaign-status"
                  name="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as CampaignStatus)}
                >
                  {campaignStatuses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <span className="screen-field-hint">
                  Active campaigns are what agents see as live work.
                </span>
              </div>

              <div className="screen-field">
                <span className="role-field-label">Agents on this campaign</span>
                {agents.length === 0 ? (
                  <p className="role-panel-copy">
                    No agents yet — <Link href="/app/agents/new">invite one</Link> to assign this
                    campaign.
                  </p>
                ) : (
                  <div className="role-agent-pick">
                    {agents.map((agent) => {
                      const picked = agentIds.includes(agent.id);
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          className={picked ? "is-picked" : undefined}
                          aria-pressed={picked}
                          onClick={() => toggleAgent(agent.id)}
                        >
                          <AgentAvatar name={agent.name} size={28} />
                          <span className="role-agent-name">
                            <strong>{agent.name}</strong>
                            <em>
                              {agent.team} · Ext. {agent.extension}
                            </em>
                          </span>
                          <span className="role-agent-tick" aria-hidden="true">
                            {picked ? <Icon name="check" size={13} /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <span className="screen-field-hint">
                  Agents see every lead in this campaign on their desk.
                </span>
              </div>
            </div>

            {error && <RoleAlert>{error}</RoleAlert>}

            <div className="role-form-actions">
              <button type="submit" className="btn btn-primary">
                {campaignId ? "Save changes" : "Create campaign"}
                <Icon name="arrow" size={15} />
              </button>
              <span className="role-form-hint">
                {campaignId
                  ? "Lead and agent assignments are kept."
                  : "You can add leads once the campaign exists."}
              </span>
            </div>
          </form>
        </Panel>

        <div className="role-stack">
          <Panel kicker="How it works" title="Campaigns in Callflow">
            <ul className="role-perm">
              <li>
                <Icon name="megaphone" size={16} />
                <div>
                  <strong>One campaign, one list</strong>
                  <p>Upload or add leads into the campaign so everyone works the same contacts.</p>
                </div>
              </li>
              <li>
                <Icon name="users" size={16} />
                <div>
                  <strong>Assign the agents</strong>
                  <p>Only agents on the campaign see its leads in My leads and My calls.</p>
                </div>
              </li>
              <li>
                <Icon name="pulse" size={16} />
                <div>
                  <strong>Status drives the work</strong>
                  <p>Mark a campaign active while it runs, then pause or complete it.</p>
                </div>
              </li>
            </ul>
          </Panel>

          <Panel kicker="Leads" title="Getting contacts in">
            <p className="role-panel-copy">
              Add leads one at a time, import a CSV, or attach existing inbox leads from the
              campaign page after saving.
            </p>
            <Link className="screen-empty-link" href="/app/crm/leads/all">
              Browse the lead inbox
              <Icon name="arrow" size={14} />
            </Link>
          </Panel>
        </div>
      </div>

      <LocalNotice title="Saved locally.">
        Campaigns are stored in this browser until the Callflow API is connected.
      </LocalNotice>
    </article>
  );
}
