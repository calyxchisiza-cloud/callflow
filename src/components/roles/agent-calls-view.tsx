"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { Panel, StatGrid } from "@/components/screens/ui";
import {
  agentVisibleLeads,
  campaignName,
  campaignsForAgent,
  formatRelative,
} from "@/lib/workspace";
import { AgentGate, useAgentSession } from "./agent-gate";
import { AgentAvatar, LocalNotice, RoleEmpty, RoleHead, StageChip } from "./role-ui";

export function AgentCallsView() {
  return (
    <AgentGate>
      <AgentCalls />
    </AgentGate>
  );
}

function AgentCalls() {
  const { agent, workspace } = useAgentSession();
  if (!agent) return null;

  const campaigns = campaignsForAgent(workspace, agent.id);
  const activeCampaignIds = new Set(
    campaigns.filter((item) => item.status === "active").map((item) => item.id),
  );
  const ready = agentVisibleLeads(workspace, agent.id)
    .filter((lead) => ["new", "contacted"].includes(lead.stage))
    .filter(
      (lead) =>
        !lead.campaignId || activeCampaignIds.has(lead.campaignId) || lead.ownerId === agent.id,
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const leads = ready.slice(0, 6);

  return (
    <article className="screen">
      <RoleHead
        eyebrow={`Agent desk · ${agent.team}`}
        title="My calls"
        lede="Your call activity for this seat. Until telephony is connected, start calls from the ready list and log the outcome on the lead."
        meta={
          <>
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
            <span className="screen-chip">Dialer offline</span>
          </>
        }
        actions={
          <Link className="btn btn-primary" href="/app/calls/workspace">
            Open call workspace
            <Icon name="arrow" size={15} />
          </Link>
        }
      />

      <div className="role-stats">
        <StatGrid
          items={[
            { label: "Calls logged", unit: "today", hint: "Recorded in Callflow", value: "0" },
            { label: "Talk time", unit: "minutes", hint: "Connected conversations", value: "0" },
            { label: "Leads to call", unit: ready.length === 1 ? "lead" : "leads", hint: "New or contacted", value: String(ready.length) },
            { label: "Callbacks due", unit: "today", hint: "Scheduled follow-ups", value: "0" },
          ]}
        />
      </div>

      <div className="role-split">
        <Panel kicker="Activity" title="Call log">
          <RoleEmpty
            icon="phone"
            title="No calls recorded yet"
            body="The in-app dialer, recordings and call notes arrive with the telephony API. When they do, every call you take or make appears here automatically."
            actions={
              <Link className="btn btn-ghost" href="/app/calls/workspace">
                Preview the call workspace
              </Link>
            }
          />
          <div className="role-calllog-note">
            <Icon name="pulse" size={15} />
            <p>
              Calls made from the ready list below go through your phone. Update the lead stage after
              each one so your pipeline stays accurate.
            </p>
          </div>
        </Panel>

        <div className="role-stack">
          <Panel
            kicker="Up next"
            title="Ready to call"
            action={<span className="role-panel-count">{leads.length}</span>}
          >
            {leads.length === 0 ? (
              <RoleEmpty
                icon="check"
                title="Nothing waiting"
                body="Every lead on your desk is past the first-contact stage. Your owner or an active campaign will send more when they are ready."
              />
            ) : (
              <ul className="role-calllist">
                {leads.map((lead) => (
                  <li key={lead.id}>
                    <AgentAvatar name={lead.name} size={32} />
                    <div>
                      <strong>{lead.name}</strong>
                      <em>{lead.company || lead.phone || lead.email}</em>
                      <span>
                        {campaignName(workspace, lead.campaignId)
                          ? `${campaignName(workspace, lead.campaignId)} · `
                          : ""}
                        {formatRelative(lead.updatedAt)}
                      </span>
                    </div>
                    <StageChip stage={lead.stage} />
                    {lead.phone ? (
                      <a
                        className="role-call-btn"
                        href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                        aria-label={`Call ${lead.name}`}
                      >
                        <Icon name="phone" size={14} />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel kicker="Telephony" title="Not connected yet">
            <p className="role-panel-copy">
              Queue routing, voicemail and recordings switch on with the Callflow telephony service.
              Nothing on this page is simulated in the meantime.
            </p>
            <Link className="screen-empty-link" href="/app/calls/workspace">
              Open call workspace
              <Icon name="arrow" size={14} />
            </Link>
          </Panel>
        </div>
      </div>

      <LocalNotice title="No calls are being simulated.">
        Call counts stay at zero until real telephony is connected. Lead stages are the source of
        truth for your follow-ups.
      </LocalNotice>
    </article>
  );
}
