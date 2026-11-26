"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import {
  createLead,
  leadStages,
  useWorkspace,
  type Lead,
  type LeadStage,
} from "@/lib/workspace";
import { LocalNotice, RoleAlert, RoleHead, StageChip } from "./role-ui";

const SOURCES = ["Website", "Referral", "Event", "Outbound", "Partner", "Social", "Other"];

export function OwnerLeadFormView({ campaignId }: { campaignId?: string }) {
  const { workspace } = useWorkspace();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Website");
  const [stage, setStage] = useState<LeadStage>("new");
  const [ownerId, setOwnerId] = useState("");
  const [campaign, setCampaign] = useState(campaignId ?? "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Lead | null>(null);

  const agents = workspace.agents.filter((agent) => agent.status !== "paused");
  const campaigns = workspace.campaigns;
  const activeCampaign = campaigns.find((item) => item.id === campaignId);

  function reset() {
    setSaved(null);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setSource("Website");
    setStage("new");
    setOwnerId("");
    setCampaign(campaignId ?? "");
    setNotes("");
    setError("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const result = createLead({
      name,
      company,
      email,
      phone,
      source,
      stage,
      ownerId: ownerId || null,
      campaignId: campaign || null,
      notes,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(result.value);
  }

  if (saved) {
    const savedCampaign = saved.campaignId
      ? workspace.campaigns.find((item) => item.id === saved.campaignId)
      : undefined;
    return (
      <article className="screen">
        <RoleHead
          eyebrow="Customers · CRM — leads"
          title="Lead added"
          lede={`${saved.name} is in the inbox. ${
            savedCampaign
              ? `It joins ${savedCampaign.name} and is visible to that campaign's agents.`
              : saved.ownerId
                ? "It is already on the agent's desk."
                : "Assign an owner so it reaches an agent."
          }`}
          meta={
            <>
              <StageChip stage={saved.stage} />
              {savedCampaign && (
                <span className="screen-chip">
                  <Icon name="megaphone" size={12} />
                  {savedCampaign.name}
                </span>
              )}
              {saved.company && <span className="screen-chip">{saved.company}</span>}
            </>
          }
        />
        <Panel>
          <div className="role-created">
            <span className="role-created-icon" aria-hidden="true">
              <Icon name="check" size={22} />
            </span>
            <div className="role-created-copy">
              <strong>{saved.name}</strong>
              <p>
                {saved.email || saved.phone}
                {saved.source ? ` · ${saved.source}` : ""}
              </p>
              {saved.notes && <p className="role-created-note">“{saved.notes}”</p>}
            </div>
          </div>
          <div className="role-inline-links">
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Add another lead
            </button>
            {savedCampaign ? (
              <Link className="btn btn-primary" href={`/app/campaigns/${savedCampaign.id}`}>
                Open {savedCampaign.name}
                <Icon name="arrow" size={15} />
              </Link>
            ) : (
              <Link className="btn btn-primary" href="/app/crm/leads/all">
                Open lead inbox
                <Icon name="arrow" size={15} />
              </Link>
            )}
            <Link className="text-link" href="/app/crm/leads/import">
              Import a CSV instead
            </Link>
          </div>
        </Panel>
        <LocalNotice title="Saved locally.">
          The lead lives in this browser until the Callflow API is connected, then it syncs to the
          shared inbox.
        </LocalNotice>
      </article>
    );
  }

  return (
    <article className="screen">
      <RoleHead
        eyebrow="Customers · CRM — leads"
        title="Add a lead"
        lede={
          activeCampaign
            ? `Capture a lead straight into ${activeCampaign.name}. Campaign agents see it on their desk once it is saved.`
            : "Capture one lead by hand. Give it an owner now, or leave it unassigned and route it later from the inbox."
        }
        meta={
          activeCampaign ? (
            <span className="screen-chip">
              <Icon name="megaphone" size={12} />
              {activeCampaign.name}
            </span>
          ) : undefined
        }
        actions={
          <Link
            className="btn btn-ghost"
            href={campaignId ? `/app/campaigns/${campaignId}` : "/app/crm/leads/all"}
          >
            {campaignId ? "Back to campaign" : "Back to inbox"}
          </Link>
        }
      />

      <div className="role-split">
        <Panel kicker="New lead" title="Lead details">
          <form className="screen-form" onSubmit={onSubmit} noValidate>
            <div className="screen-fields">
              <div className="screen-field">
                <label htmlFor="lead-name">
                  Full name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="lead-name"
                  name="name"
                  autoComplete="off"
                  placeholder="e.g. Kwame Osei"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="screen-field">
                <label htmlFor="lead-company">Company</label>
                <input
                  id="lead-company"
                  name="company"
                  autoComplete="off"
                  placeholder="e.g. Accra Textiles"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>

              <div className="screen-field">
                <label htmlFor="lead-email">Email</label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="screen-field">
                <label htmlFor="lead-phone">Phone</label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  autoComplete="off"
                  placeholder="+263 77 000 0000"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
                <span className="screen-field-hint">Email or phone is required.</span>
              </div>

              <div className="screen-field">
                <label htmlFor="lead-source">Source</label>
                <select
                  id="lead-source"
                  name="source"
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                >
                  {SOURCES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="screen-field">
                <label htmlFor="lead-stage">Stage</label>
                <select
                  id="lead-stage"
                  name="stage"
                  value={stage}
                  onChange={(event) => setStage(event.target.value as LeadStage)}
                >
                  {leadStages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="screen-field is-full">
                <label htmlFor="lead-owner">Assign to</label>
                <select
                  id="lead-owner"
                  name="owner"
                  value={ownerId}
                  onChange={(event) => setOwnerId(event.target.value)}
                >
                  <option value="">Leave unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} · {agent.team}
                    </option>
                  ))}
                </select>
                {agents.length === 0 && (
                  <span className="screen-field-hint">
                    No agents yet — <Link href="/app/agents/new">invite one</Link> to assign leads.
                  </span>
                )}
              </div>

              <div className="screen-field is-full">
                <label htmlFor="lead-campaign">Campaign</label>
                <select
                  id="lead-campaign"
                  name="campaign"
                  value={campaign}
                  onChange={(event) => setCampaign(event.target.value)}
                >
                  <option value="">Not in a campaign</option>
                  {campaigns.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="screen-field-hint">
                  {campaigns.length === 0 ? (
                    <>
                      No campaigns yet — <Link href="/app/campaigns/new">create one</Link> to group
                      leads for a calling push.
                    </>
                  ) : (
                    "Agents assigned to the campaign will see this lead."
                  )}
                </span>
              </div>

              <div className="screen-field is-full">
                <label htmlFor="lead-notes">Notes</label>
                <textarea
                  id="lead-notes"
                  name="notes"
                  rows={4}
                  placeholder="What did they ask for? When should someone call back?"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>

            {error && <RoleAlert>{error}</RoleAlert>}

            <div className="role-form-actions">
              <button type="submit" className="btn btn-primary">
                Save lead
                <Icon name="arrow" size={15} />
              </button>
              <span className="role-form-hint">Duplicates by email are rejected automatically.</span>
            </div>
          </form>
        </Panel>

        <div className="role-stack">
          <Panel kicker="Capture tips" title="Good lead hygiene">
            <ul className="role-perm">
              <li>
                <Icon name="target" size={16} />
                <div>
                  <strong>One lead, one record</strong>
                  <p>Use email or phone as the unique key so imports do not duplicate.</p>
                </div>
              </li>
              <li>
                <Icon name="badge" size={16} />
                <div>
                  <strong>Name the owner early</strong>
                  <p>Assigned leads show up on the agent desk the next time they open it.</p>
                </div>
              </li>
              <li>
                <Icon name="pulse" size={16} />
                <div>
                  <strong>Notes beat memory</strong>
                  <p>Add what they asked for so the agent can open with context.</p>
                </div>
              </li>
            </ul>
          </Panel>

          <Panel kicker="Going big" title="Importing a list?">
            <p className="role-panel-copy">
              Uploading hundreds of leads works best as a CSV. Download the template, keep the
              headers, and preview every row before it lands in the inbox.
            </p>
            <Link className="screen-empty-link" href="/app/crm/leads/import">
              Open CSV import
              <Icon name="arrow" size={14} />
            </Link>
          </Panel>
        </div>
      </div>
    </article>
  );
}
