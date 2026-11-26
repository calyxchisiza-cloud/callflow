"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import { createAgent, nextExtension, useWorkspace, type Agent } from "@/lib/workspace";
import { AgentAvatar, AgentStatusChip, LocalNotice, RoleAlert, RoleHead } from "./role-ui";

const TEAMS = ["Sales", "Support", "Retention", "Outbound"];

export function OwnerAgentInviteView() {
  const { workspace } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("Sales");
  const [extension, setExtension] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Agent | null>(null);

  const suggested = useMemo(() => nextExtension(workspace.agents), [workspace.agents]);

  function reset() {
    setCreated(null);
    setName("");
    setEmail("");
    setTeam("Sales");
    setExtension("");
    setError("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const result = createAgent({ name, email, team, extension });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCreated(result.value);
  }

  if (created) {
    return (
      <article className="screen">
        <RoleHead
          eyebrow="People · Agent management"
          title="Agent invited"
          lede={`${created.name} now has a seat on the ${created.team} team. Share how they sign in, then assign their first leads.`}
        />
        <Panel>
          <div className="role-created">
            <span className="role-created-icon" aria-hidden="true">
              <Icon name="check" size={22} />
            </span>
            <div className="role-created-copy">
              <div className="role-created-head">
                <AgentAvatar name={created.name} size={42} />
                <div>
                  <strong>{created.name}</strong>
                  <p>{created.email}</p>
                </div>
                <AgentStatusChip status={created.status} />
              </div>
              <dl className="role-created-facts">
                <div>
                  <dt>Team</dt>
                  <dd>{created.team}</dd>
                </div>
                <div>
                  <dt>Extension</dt>
                  <dd className="role-mono">{created.extension}</dd>
                </div>
                <div>
                  <dt>Access</dt>
                  <dd>Agent desk</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="role-steps">
            <h3>How {created.name.split(" ")[0]} signs in</h3>
            <ol>
              <li>
                <span>1</span>
                Open <Link href="/login">the sign-in page</Link> and choose the{" "}
                <strong>Agent</strong> tab.
              </li>
              <li>
                <span>2</span>
                Enter <strong>{created.email}</strong> with their password.
              </li>
              <li>
                <span>3</span>
                They land on the agent desk with only their own leads and calls.
              </li>
            </ol>
          </div>

          <div className="role-inline-links">
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Invite another agent
            </button>
            <Link className="btn btn-primary" href="/app/agents">
              View roster
              <Icon name="arrow" size={15} />
            </Link>
            <Link className="text-link" href="/app/crm/leads/all">
              Assign leads
            </Link>
          </div>
        </Panel>

        <LocalNotice title="Preview note.">
          In this build the seat is saved in this browser only. When the Callflow API is connected the
          invitation is delivered by email and the seat appears for the whole team.
        </LocalNotice>
      </article>
    );
  }

  return (
    <article className="screen">
      <RoleHead
        eyebrow="People · Agent management"
        title="Invite an agent"
        lede="Create a seat for someone who answers calls and works leads. They get the agent desk — not the owner workspace."
        actions={
          <Link className="btn btn-ghost" href="/app/agents">
            Back to roster
          </Link>
        }
      />

      <div className="role-split">
        <Panel kicker="New seat" title="Agent details">
          <form className="screen-form" onSubmit={onSubmit} noValidate>
            <div className="screen-fields">
              <div className="screen-field">
                <label htmlFor="agent-name">
                  Full name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="agent-name"
                  name="name"
                  autoComplete="name"
                  placeholder="e.g. Thandi Moyo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="screen-field">
                <label htmlFor="agent-email">
                  Work email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="agent-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <span className="screen-field-hint">This is how the agent signs in.</span>
              </div>

              <div className="screen-field">
                <label htmlFor="agent-team">Team</label>
                <input
                  id="agent-team"
                  name="team"
                  list="agent-teams"
                  placeholder="Sales"
                  value={team}
                  onChange={(event) => setTeam(event.target.value)}
                />
                <datalist id="agent-teams">
                  {TEAMS.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <div className="screen-field">
                <label htmlFor="agent-extension">Extension</label>
                <input
                  id="agent-extension"
                  name="extension"
                  inputMode="numeric"
                  placeholder={suggested}
                  value={extension}
                  onChange={(event) => setExtension(event.target.value)}
                />
                <span className="screen-field-hint">
                  Leave blank to use the next free number ({suggested}).
                </span>
              </div>
            </div>

            {error && <RoleAlert>{error}</RoleAlert>}

            <div className="role-form-actions">
              <button type="submit" className="btn btn-primary">
                Create seat
                <Icon name="arrow" size={15} />
              </button>
              <span className="role-form-hint">
                The seat starts as <strong>Invited</strong> until the agent signs in.
              </span>
            </div>
          </form>
        </Panel>

        <div className="role-stack">
          <Panel kicker="Agent access" title="What the agent can open">
            <ul className="role-perm">
              <li>
                <Icon name="grid" size={16} />
                <div>
                  <strong>Today</strong>
                  <p>Their shift, assigned leads and setup checklist.</p>
                </div>
              </li>
              <li>
                <Icon name="target" size={16} />
                <div>
                  <strong>My leads</strong>
                  <p>Only leads the owner assigns to them.</p>
                </div>
              </li>
              <li>
                <Icon name="phone" size={16} />
                <div>
                  <strong>My calls & call workspace</strong>
                  <p>Dialling and call notes when telephony connects.</p>
                </div>
              </li>
              <li>
                <Icon name="pulse" size={16} />
                <div>
                  <strong>Availability</strong>
                  <p>Presence and working hours for queue routing.</p>
                </div>
              </li>
            </ul>
          </Panel>

          <Panel kicker="Owner only" title="Kept away from agents">
            <ul className="role-locked">
              <li>
                <Icon name="lock" size={13} />
                Agents, seats and invitations
              </li>
              <li>
                <Icon name="lock" size={13} />
                The full lead inbox and CSV imports
              </li>
              <li>
                <Icon name="lock" size={13} />
                Billing, reports and platform settings
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <LocalNotice title="Preview note.">
        Nothing is emailed yet and the seat is stored in this browser. It is ready to sync the moment
        the API is deployed.
      </LocalNotice>
    </article>
  );
}
