"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Panel, StatGrid } from "@/components/screens/ui";
import {
  campaignLeadCount,
  campaignStatuses,
  deleteCampaign,
  formatRelative,
  useWorkspace,
  type CampaignStatus,
} from "@/lib/workspace";
import { CampaignStatusChip, LocalNotice, RoleEmpty, RoleHead } from "./role-ui";

type StatusFilter = "all" | CampaignStatus;

const filters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...campaignStatuses,
];

export function OwnerCampaignsView() {
  const { workspace, ready } = useWorkspace();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [confirming, setConfirming] = useState<string | null>(null);

  const campaigns = workspace.campaigns;
  const inCampaign = workspace.leads.filter((lead) => lead.campaignId).length;
  const agentsAssigned = new Set(campaigns.flatMap((campaign) => campaign.agentIds)).size;

  const counts = useMemo(
    () => ({
      active: campaigns.filter((campaign) => campaign.status === "active").length,
      draft: campaigns.filter((campaign) => campaign.status === "draft").length,
    }),
    [campaigns],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...campaigns]
      .filter((campaign) => {
        if (status !== "all" && campaign.status !== status) return false;
        if (!term) return true;
        return (
          campaign.name.toLowerCase().includes(term) ||
          campaign.description.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [campaigns, query, status]);

  return (
    <article className="screen">
      <RoleHead
        eyebrow="Conversations · Campaigns"
        title="Campaigns"
        lede="Group leads into a calling push, choose the agents who work it, then let them see and call those leads from their desk."
        meta={
          <>
            <span className="screen-chip">
              <Icon name="megaphone" size={12} />
              {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"}
            </span>
            <span className="screen-chip">
              <Icon name="target" size={12} />
              {inCampaign} lead{inCampaign === 1 ? "" : "s"} in campaigns
            </span>
          </>
        }
        actions={
          <Link className="btn btn-primary" href="/app/campaigns/new">
            <Icon name="plus" size={15} />
            New campaign
          </Link>
        }
      />

      <div className="role-stats">
        <StatGrid
          items={[
            { label: "Campaigns", unit: campaigns.length === 1 ? "campaign" : "campaigns", hint: "Across every status", value: String(campaigns.length) },
            { label: "Active", unit: campaigns.length === 1 ? "campaign" : "campaigns", hint: "Live calling pushes", value: String(counts.active) },
            { label: "Leads in campaigns", unit: inCampaign === 1 ? "lead" : "leads", hint: "Visible to campaign agents", value: String(inCampaign) },
            { label: "Agents assigned", unit: agentsAssigned === 1 ? "agent" : "agents", hint: "On at least one campaign", value: String(agentsAssigned) },
          ]}
        />
      </div>

      <LocalNotice title="Saved in this browser.">
        Campaigns, their agent teams and lead assignments live locally until the Callflow API is
        connected. Once it is, the same campaigns sync to the server.
      </LocalNotice>

      <Panel
        kicker="Outbound calling"
        title="All campaigns"
        action={
          <span className="role-panel-count">
            {visible.length} shown
          </span>
        }
        className="screen-list-panel"
      >
        <div className="screen-toolbar">
          <label className="screen-search">
            <Icon name="search" size={15} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search campaigns"
              aria-label="Search campaigns"
            />
          </label>
          <div className="screen-filters" role="group" aria-label="Filter by status">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={status === filter.id ? "is-active" : undefined}
                aria-pressed={status === filter.id}
                onClick={() => setStatus(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {!ready ? (
          <p className="role-loading">Loading campaigns…</p>
        ) : campaigns.length === 0 ? (
          <RoleEmpty
            icon="megaphone"
            title="No campaigns yet"
            body="Create a campaign to group leads for a calling push, then assign the agents who should work it. Leads you add or import into the campaign show up on those agents' desks."
            actions={
              <Link className="btn btn-primary" href="/app/campaigns/new">
                Create a campaign
                <Icon name="arrow" size={14} />
              </Link>
            }
          />
        ) : visible.length === 0 ? (
          <RoleEmpty
            icon="search"
            title="No campaigns match"
            body="Try a different search term or switch the status filter."
            actions={
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="role-campaign-grid">
            {visible.map((campaign) => {
              const leads = campaignLeadCount(workspace, campaign.id);
              return (
                <article className="role-campaign-card" key={campaign.id}>
                  <header>
                    <span className="role-campaign-mark" aria-hidden="true">
                      <Icon name="megaphone" size={17} />
                    </span>
                    <div className="role-campaign-copy">
                      <strong>{campaign.name}</strong>
                      <em>{campaign.description || "No description yet"}</em>
                    </div>
                    <CampaignStatusChip status={campaign.status} />
                  </header>

                  <dl className="role-campaign-facts">
                    <div>
                      <dt>Leads</dt>
                      <dd>{leads}</dd>
                    </div>
                    <div>
                      <dt>Agents</dt>
                      <dd>{campaign.agentIds.length}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>{formatRelative(campaign.updatedAt)}</dd>
                    </div>
                  </dl>

                  {confirming === campaign.id ? (
                    <div className="role-confirm">
                      <p>
                        Delete <strong>{campaign.name}</strong>? Its {leads} lead
                        {leads === 1 ? "" : "s"} stay in the inbox but leave the campaign.
                      </p>
                      <div className="role-confirm-actions">
                        <button
                          type="button"
                          className="role-mini-btn is-danger"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          Delete campaign
                        </button>
                        <button
                          type="button"
                          className="role-mini-btn is-quiet"
                          onClick={() => setConfirming(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <footer>
                      <Link className="role-campaign-open" href={`/app/campaigns/${campaign.id}`}>
                        Open campaign
                        <Icon name="arrow" size={13} />
                      </Link>
                      <div className="role-campaign-actions">
                        <Link
                          className="role-mini-btn is-quiet"
                          href={`/app/campaigns/${campaign.id}/edit`}
                        >
                          <Icon name="edit" size={12} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="role-mini-btn is-quiet"
                          onClick={() => setConfirming(campaign.id)}
                        >
                          <Icon name="trash" size={12} />
                          Delete
                        </button>
                      </div>
                    </footer>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      {campaigns.length === 0 && counts.draft === 0 && workspace.leads.length > 0 && (
        <LocalNotice title={`${workspace.leads.length} lead${workspace.leads.length === 1 ? " is" : "s are"} not in a campaign yet.`}>
          Campaigns give a group of agents the same list to call. <Link href="/app/campaigns/new">Create one</Link>{" "}
          and add the leads you want worked.
        </LocalNotice>
      )}
    </article>
  );
}
