"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import {
  useSession,
  useWorkspace,
  type Agent,
  type Presence,
  type RoleSession,
  type Workspace,
} from "@/lib/workspace";
import { RoleEmpty, RoleHead } from "./role-ui";

export function useAgentSession(): {
  session: RoleSession | null;
  workspace: Workspace;
  agent?: Agent;
  presence: Presence;
  ready: boolean;
} {
  const { session, ready: sessionReady } = useSession();
  const { workspace, ready: workspaceReady } = useWorkspace();
  const email = session?.role === "agent" ? session.email.toLowerCase() : "";
  const agent = email
    ? workspace.agents.find((item) => item.email.toLowerCase() === email)
    : undefined;
  return {
    session,
    workspace,
    agent,
    presence: agent ? workspace.presence[agent.id] ?? "offline" : "offline",
    ready: sessionReady && workspaceReady,
  };
}

export function AgentGate({ children }: { children: ReactNode }) {
  const { session, agent, ready } = useAgentSession();

  if (!ready) {
    return (
      <article className="screen">
        <RoleHead
          eyebrow="Agent desk"
          title="Opening your desk"
          lede="Checking this browser for an agent seat."
        />
        <p className="role-loading">Loading agent desk…</p>
      </article>
    );
  }

  if (!session || session.role !== "agent") {
    return (
      <article className="screen">
        <RoleHead
          eyebrow="Agent desk · Restricted"
          title="Sign in as an agent"
          lede="The agent desk is a limited workspace for invited agents. Organisation owners use the main workspace instead."
        />
        <div className="role-split">
          <Panel kicker="Agent access" title="Open your desk">
            <RoleEmpty
              icon="lock"
              title="Agent sign-in required"
              body="Sign in with the work email your organisation owner invited. You will only see the leads, calls and availability that belong to you."
              actions={
                <Link className="btn btn-primary" href="/login">
                  Agent sign-in
                  <Icon name="arrow" size={14} />
                </Link>
              }
            />
            <div className="role-gate-foot">
              <p>
                Not an agent yet? Ask your owner to invite you from{" "}
                <Link href="/app/agents/new">Agents → Invite agent</Link>.
              </p>
            </div>
          </Panel>

          <div className="role-stack">
            <Panel kicker="Different desk" title="Organisation owner?">
              <p className="role-panel-copy">
                Owners keep the full workspace: agents, the lead inbox, imports, billing and every
                other screen.
              </p>
              <Link className="screen-empty-link" href="/app/dashboard">
                Go to the owner dashboard
                <Icon name="arrow" size={14} />
              </Link>
            </Panel>
            <Panel kicker="Preview" title="No real sign-in yet">
              <p className="role-panel-copy">
                Accounts are stored in this browser until the Callflow API is connected. Agent seats
                created from the owner workspace work immediately.
              </p>
            </Panel>
          </div>
        </div>
      </article>
    );
  }

  if (!agent) {
    return (
      <article className="screen">
        <RoleHead
          eyebrow="Agent desk · Restricted"
          title="Seat not found"
          lede="This browser has an agent session, but the seat it points to no longer exists."
        />
        <Panel>
          <RoleEmpty
            icon="badge"
            title="That agent seat was removed"
            body="Ask your organisation owner for a new invitation, then sign in with the email on that invitation."
            actions={
              <Link className="btn btn-primary" href="/login">
                Back to sign-in
              </Link>
            }
          />
        </Panel>
      </article>
    );
  }

  return <>{children}</>;
}
