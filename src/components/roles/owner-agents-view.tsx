"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Panel, StatGrid } from "@/components/screens/ui";
import {
  formatDate,
  leadCount,
  setAgentStatus,
  useWorkspace,
  type AgentStatus,
} from "@/lib/workspace";
import {
  AgentAvatar,
  AgentStatusChip,
  LocalNotice,
  PresenceDot,
  RoleEmpty,
  RoleHead,
} from "./role-ui";

type StatusFilter = "all" | AgentStatus;

const filters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "active", label: "Active" },
  { id: "invited", label: "Invited" },
  { id: "paused", label: "Paused" },
];

export function OwnerAgentsView() {
  const { workspace, ready } = useWorkspace();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const agents = workspace.agents;
  const leads = workspace.leads;

  const counts = useMemo(
    () => ({
      active: agents.filter((agent) => agent.status === "active").length,
      invited: agents.filter((agent) => agent.status === "invited").length,
      paused: agents.filter((agent) => agent.status === "paused").length,
      assigned: leads.filter((lead) => lead.ownerId).length,
      unassigned: leads.filter((lead) => !lead.ownerId).length,
    }),
    [agents, leads],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return agents.filter((agent) => {
      if (status !== "all" && agent.status !== status) return false;
      if (!term) return true;
      return (
        agent.name.toLowerCase().includes(term) ||
        agent.email.toLowerCase().includes(term) ||
        agent.team.toLowerCase().includes(term) ||
        agent.extension.includes(term)
      );
    });
  }, [agents, query, status]);

  return (
    <article className="screen">
      <RoleHead
        eyebrow="People · Agent management"
        title="Agents"
        lede="Invite the people who answer calls and work leads. Each agent signs in with their own account and only sees the agent desk."
        meta={
          <>
            <span className="screen-chip">
              <Icon name="users" size={12} />
              {agents.length} {agents.length === 1 ? "seat" : "seats"}
            </span>
            <span className={`screen-chip${counts.unassigned > 0 ? " is-record" : ""}`}>
              {counts.unassigned} unassigned lead{counts.unassigned === 1 ? "" : "s"}
            </span>
          </>
        }
        actions={
          <>
            <Link className="btn btn-ghost" href="/app/crm/leads/all">
              Lead inbox
            </Link>
            <Link className="btn btn-primary" href="/app/agents/new">
              Invite agent
              <Icon name="arrow" size={15} />
            </Link>
          </>
        }
      />

      <div className="role-stats">
        <StatGrid
          items={[
            { label: "Active agents", unit: counts.active === 1 ? "seat" : "seats", hint: "Signed in at least once", value: String(counts.active) },
            { label: "Invitations", unit: "waiting", hint: "Not signed in yet", value: String(counts.invited) },
            { label: "Leads assigned", unit: counts.assigned === 1 ? "lead" : "leads", hint: "Owned by an agent", value: String(counts.assigned) },
            { label: "Unassigned", unit: counts.unassigned === 1 ? "lead" : "leads", hint: "Waiting for an owner", value: String(counts.unassigned) },
          ]}
        />
      </div>

      <LocalNotice title="Saved in this browser.">
        Agents you invite here are stored locally until the Callflow API is connected. Once it is, the
        same roster syncs to the server and invitations are emailed automatically.
      </LocalNotice>

      <Panel
        kicker="Team roster"
        title="Everyone with access"
        action={
          <Link className="text-link" href="/app/agents/new">
            Invite agent
          </Link>
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
              placeholder="Search name, email, team or extension"
              aria-label="Search agents"
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
          <p className="role-loading">Loading roster…</p>
        ) : agents.length === 0 ? (
          <RoleEmpty
            icon="users"
            title="No agents yet"
            body="Invite your first agent to give them an agent desk with leads, calls and availability. They sign in with the work email you add here."
            actions={
              <Link className="btn btn-primary" href="/app/agents/new">
                Invite an agent
                <Icon name="arrow" size={14} />
              </Link>
            }
          />
        ) : visible.length === 0 ? (
          <RoleEmpty
            icon="search"
            title="No agents match"
            body="Try a different search term or switch the status filter back to everyone."
          />
        ) : (
          <div className="screen-tablewrap">
            <table className="screen-table role-table">
              <thead>
                <tr>
                  <th scope="col">Agent</th>
                  <th scope="col">Team</th>
                  <th scope="col">Ext.</th>
                  <th scope="col">Leads</th>
                  <th scope="col">Presence</th>
                  <th scope="col">Status</th>
                  <th scope="col">Added</th>
                  <th scope="col">
                    <span className="role-sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((agent) => {
                  const presence = workspace.presence[agent.id] ?? "offline";
                  return (
                    <tr key={agent.id}>
                      <td>
                        <span className="role-person">
                          <AgentAvatar name={agent.name} />
                          <span>
                            <strong>{agent.name}</strong>
                            <em>{agent.email}</em>
                          </span>
                        </span>
                      </td>
                      <td>{agent.team}</td>
                      <td className="role-mono">{agent.extension}</td>
                      <td>
                        <Link className="role-count-link" href="/app/crm/leads/all">
                          {leadCount(workspace, agent.id)}
                        </Link>
                      </td>
                      <td>
                        {agent.status === "active" ? (
                          <PresenceDot presence={presence} withLabel />
                        ) : (
                          <span className="role-muted">—</span>
                        )}
                      </td>
                      <td>
                        <AgentStatusChip status={agent.status} />
                      </td>
                      <td>{formatDate(agent.createdAt)}</td>
                      <td className="role-cell-actions">
                        {agent.status === "paused" ? (
                          <button
                            type="button"
                            className="role-mini-btn"
                            onClick={() => setAgentStatus(agent.id, "active")}
                          >
                            Resume
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="role-mini-btn is-quiet"
                            onClick={() => setAgentStatus(agent.id, "paused")}
                          >
                            Pause
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="screen-table-foot">
              <span>
                {visible.length} of {agents.length} agent{agents.length === 1 ? "" : "s"}
              </span>
              <span className="role-table-note">Pausing blocks sign-in without removing the seat.</span>
            </div>
          </div>
        )}
      </Panel>

      <div className="role-split">
        <Panel kicker="Access" title="Who can do what">
          <ul className="role-access">
            <li>
              <AgentAvatar name="Owner" size={30} />
              <div>
                <strong>Organisation owner</strong>
                <p>You · full workspace, agents, leads, billing and settings.</p>
              </div>
              <span className="role-access-tag is-owner">Owner</span>
            </li>
            <li>
              <AgentAvatar name="Agent" size={30} />
              <div>
                <strong>Agent</strong>
                <p>Assigned leads, calls, availability and their own profile.</p>
              </div>
              <span className="role-access-tag">Limited</span>
            </li>
          </ul>
        </Panel>

        <Panel kicker="Next steps" title="Finish setting up the team">
          <ol className="role-checklist">
            <li className={agents.length > 0 ? "is-done" : undefined}>
              <Icon name={agents.length > 0 ? "check" : "badge"} size={16} />
              <div>
                <strong>Invite your agents</strong>
                <p>Each seat gets its own sign-in and agent desk.</p>
              </div>
            </li>
            <li className={leads.length > 0 ? "is-done" : undefined}>
              <Icon name={leads.length > 0 ? "check" : "target"} size={16} />
              <div>
                <strong>Add or import leads</strong>
                <p>Upload a CSV or add leads one at a time.</p>
              </div>
            </li>
            <li className={counts.assigned > 0 ? "is-done" : undefined}>
              <Icon name={counts.assigned > 0 ? "check" : "users"} size={16} />
              <div>
                <strong>Assign leads to agents</strong>
                <p>Agents only see leads that belong to them.</p>
              </div>
            </li>
          </ol>
          <div className="role-inline-links">
            <Link className="screen-empty-link" href="/app/crm/leads/import">
              Import a CSV
              <Icon name="arrow" size={14} />
            </Link>
            <Link className="screen-empty-link" href="/app/crm/leads/new">
              Add a lead
              <Icon name="arrow" size={14} />
            </Link>
          </div>
        </Panel>
      </div>
    </article>
  );
}
