"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { toneClass } from "@/components/screens/ui";
import { planById } from "@/config/plans";
import { previewRows, previewSeries } from "@/config/preview-data";
import {
  accountServiceOnline,
  readDraft,
  type OnboardingDraft,
} from "@/lib/onboarding";
import { previewAvailable, usePreview } from "@/lib/preview";

const kpis = [
  { label: "Calls today", icon: "headset", unit: "calls", hint: "Awaiting CDR data", sample: "342", previewHint: "Sample · last 24 hours" },
  { label: "Answer rate", icon: "pulse", unit: "%", hint: "Awaiting queue data", sample: "86", previewHint: "Sample · last 7 days" },
  { label: "Avg. handle time", icon: "queue", unit: "min", hint: "Awaiting call events", sample: "4", previewHint: "Sample · completed calls" },
  { label: "Agents online", icon: "users", unit: "agents", hint: "No agents invited", sample: "12", previewHint: "Sample · agent roster" },
];

const lanes = [
  { id: "waiting", label: "Waiting", tone: "wait", sample: 3, detail: "Support · Billing" },
  { id: "ringing", label: "Ringing", tone: "ring", sample: 2, detail: "Sales · Reception" },
  { id: "in-call", label: "In call", tone: "live", sample: 9, detail: "Across 4 queues" },
];

const recentColumns = ["Caller", "Direction", "Agent", "Queue", "Duration", "Time"];

const goLive = [
  {
    step: "01",
    title: "Nest API online",
    body: "Identity, tenancy and the realtime gateway.",
    status: "Offline",
    tone: "offline",
    href: "/app/system/health",
  },
  {
    step: "02",
    title: "Telephony connected",
    body: "Asterisk ARI, SIP extensions and media.",
    status: "Not configured",
    tone: "wait",
    href: "/app/pbx/status",
  },
  {
    step: "03",
    title: "First queue created",
    body: "Routing rules and business hours.",
    status: "Not started",
    tone: "idle",
    href: "/app/queues/new",
  },
  {
    step: "04",
    title: "First agent invited",
    body: "Assign a role and a SIP endpoint.",
    status: "Not started",
    tone: "idle",
    href: "/app/agents/new",
  },
];

const platform = [
  { icon: "cpu", label: "API", value: accountServiceOnline ? "Online" : "Offline", tone: "offline" },
  { icon: "pulse", label: "Realtime", value: "Offline", tone: "offline" },
  { icon: "server", label: "Telephony", value: "Not configured", tone: "wait" },
  { icon: "plug", label: "Storage", value: "Not configured", tone: "wait" },
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function VolumeChart({ series }: { series: number[] }) {
  const width = 640;
  const height = 196;
  const max = Math.max(...series, 1);
  const points = series.map((value, index) => ({
    x: (index * width) / (series.length - 1),
    y: height - 16 - (value / max) * (height - 44),
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;

  return (
    <svg className="dash-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="dash-volume-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#b2e64b" stopOpacity=".36" />
          <stop offset="100%" stopColor="#b2e64b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#dash-volume-fill)" />
      <path d={line} fill="none" stroke="#8fc93f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point) => (
        <circle key={point.x} cx={point.x} cy={point.y} r="3" fill="#fff" stroke="#8fc93f" strokeWidth="2" />
      ))}
    </svg>
  );
}

export function DashboardOverview() {
  const [draft, setDraft] = useState<OnboardingDraft>({});
  const [preview, setPreview] = usePreview();

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  const firstName = draft.fullName?.trim().split(/\s+/)[0];
  const plan = draft.planId ? planById(draft.planId) : undefined;
  const recentCalls = preview ? previewRows(recentColumns, 5, "/app/calls/history") : [];

  return (
    <div className="dash">
      <header className="dash-head">
        <div className="dash-head-copy">
          <p className="dash-eyebrow">
            <span className="dash-eyebrow-dot" aria-hidden="true" />
            Workspace overview
          </p>
          <h1>{firstName ? `Welcome back, ${firstName}.` : "Command center"}</h1>
          <p className="dash-lede">
            {preview
              ? "Your call floor, queues and team in one view. Preview figures are on for layout review; setup and system status stay honest."
              : "Your call floor, queues and team in one view. Live figures appear the moment the Nest API and telephony are connected — nothing on this screen is simulated."}
          </p>
          <div className="dash-meta">
            <span className="dash-workspace">
              <Icon name="building" size={13} />
              {draft.company?.trim() || "Your workspace"}
            </span>
            {plan && <span className="dash-tag">{plan.name} plan · Trial</span>}
            <span className={`dash-tag ${accountServiceOnline ? "is-online" : "is-quiet"}`}>
              {accountServiceOnline ? "API online" : "API offline"}
            </span>
          </div>
        </div>
        <div className="dash-head-actions">
          {previewAvailable && (
            <button
              type="button"
              className={`dash-preview-toggle${preview ? " is-on" : ""}`}
              aria-pressed={preview}
              onClick={() => setPreview(!preview)}
            >
              <Icon name={preview ? "close" : "spark"} size={14} />
              {preview ? "Turn preview off" : "Preview data"}
            </button>
          )}
          <Link className="btn btn-ghost" href="/app/calls/history">
            <Icon name="phone" size={16} />
            Call history
          </Link>
          <Link className="btn btn-primary" href="/app/calls/workspace">
            Open workspace
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </header>

      {preview ? (
        <section className="dash-banner is-preview" aria-label="Preview data status">
          <span className="dash-banner-icon" aria-hidden="true">
            <Icon name="spark" size={18} />
          </span>
          <div className="dash-banner-copy">
            <strong>Preview data is on</strong>
            <p>
              Sample figures fill this overview so you can review the layout. They are generated in
              this browser, never saved and never sent to the API. Setup progress and system status
              stay honest.
            </p>
          </div>
          <Link className="dash-banner-link" href="/app/system/health">
            System health
            <Icon name="arrow" size={14} />
          </Link>
        </section>
      ) : (
        !accountServiceOnline && (
          <section className="dash-banner" aria-label="Live data status">
            <span className="dash-banner-icon" aria-hidden="true">
              <Icon name="pulse" size={18} />
            </span>
            <div className="dash-banner-copy">
              <strong>Live data isn&rsquo;t connected yet</strong>
              <p>
                Connect the Nest API and telephony to stream calls, agent presence and queue
                health into this dashboard.
              </p>
            </div>
            <Link className="dash-banner-link" href="/app/system/health">
              System health
              <Icon name="arrow" size={14} />
            </Link>
          </section>
        )
      )}

      <section className="dash-kpis" aria-label="Key figures">
        {kpis.map((kpi) => (
          <article className="dash-kpi" key={kpi.label}>
            <div className="dash-kpi-top">
              <span>{kpi.label}</span>
              <span className="dash-kpi-icon">
                <Icon name={kpi.icon} size={15} />
              </span>
            </div>
            <div className="dash-kpi-value">
              <strong>{preview ? kpi.sample : "—"}</strong>
              <span>{kpi.unit}</span>
            </div>
            <p className="dash-kpi-foot">
              <span aria-hidden="true" />
              {preview ? kpi.previewHint : kpi.hint}
            </p>
          </article>
        ))}
      </section>

      <div className="dash-grid">
        <section className="dash-card span-8" aria-labelledby="volume-title">
          <div className="dash-card-head">
            <div>
              <span className="dash-kicker">Volume</span>
              <h2 id="volume-title">Call volume</h2>
            </div>
            <span className="dash-chip">Last 7 days</span>
          </div>
          <div
            className="dash-chart"
            role="img"
            aria-label={preview ? "Sample call volume for the last seven days" : "No call volume data yet"}
          >
            {preview ? (
              <VolumeChart series={previewSeries("Call volume")} />
            ) : (
              <div className="dash-chart-empty">
                <span className="dash-chart-icon" aria-hidden="true">
                  <Icon name="chart" size={18} />
                </span>
                <div>
                  <strong>No call volume yet</strong>
                  <p>Daily totals appear once calls start flowing through Asterisk.</p>
                </div>
              </div>
            )}
          </div>
          <div className="dash-axis" aria-hidden="true">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </section>

        <section className="dash-card span-4" aria-labelledby="golive-title">
          <div className="dash-card-head">
            <div>
              <span className="dash-kicker">Setup</span>
              <h2 id="golive-title">Go live</h2>
            </div>
            <span className="dash-chip">0 / 4</span>
          </div>
          <div className="dash-progress" aria-hidden="true">
            <span />
          </div>
          <p className="dash-progress-copy">
            Nothing is connected yet. Start with the API, then telephony, a queue and your first
            agent.
          </p>
          <ol className="dash-steps">
            {goLive.map((item) => (
              <li key={item.step}>
                <Link className="dash-step" href={item.href}>
                  <span className="dash-step-num">{item.step}</span>
                  <span className="dash-step-copy">
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </span>
                  <span className={`dash-state is-${item.tone}`}>{item.status}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="dash-card span-8" aria-labelledby="floor-title">
          <div className="dash-card-head">
            <div>
              <span className="dash-kicker">Realtime</span>
              <h2 id="floor-title">Call floor</h2>
            </div>
            <span className={`status-chip ${preview ? "status-live" : "status-offline"}`}>
              <i aria-hidden="true" />
              {preview ? "Preview" : "Offline"}
            </span>
          </div>
          <div className="dash-floor">
            {lanes.map((lane) => (
              <div className={`dash-lane is-${lane.tone}`} key={lane.id}>
                <div className="dash-lane-head">
                  <span>{lane.label}</span>
                  <strong>{preview ? lane.sample : 0}</strong>
                </div>
                <div className="dash-lane-body">
                  <Icon name="headset" size={15} />
                  {preview ? lane.detail : "No live calls"}
                </div>
              </div>
            ))}
          </div>
          <p className="dash-card-foot">
            <Icon name="plug" size={14} />
            {preview ? "Sample call floor — telephony is not configured." : "Telephony is not configured."}
            <Link href="/app/pbx/status">Review PBX status</Link>
          </p>
        </section>

        <section className="dash-card span-4" aria-labelledby="agents-title">
          <div className="dash-card-head">
            <div>
              <span className="dash-kicker">People</span>
              <h2 id="agents-title">Agents</h2>
            </div>
            <span className="dash-chip">{preview ? "12 online" : "0 online"}</span>
          </div>
          <div className="dash-team">
            <div className="dash-avatars" aria-hidden="true">
              {preview ? (
                <>
                  <span className="is-initials">TB</span>
                  <span className="is-initials">CP</span>
                  <span className="is-initials">TM</span>
                </>
              ) : (
                <>
                  <span />
                  <span />
                  <span />
                </>
              )}
            </div>
            <strong>{preview ? "12 agents across 4 queues" : "No agents yet"}</strong>
            <p>
              {preview
                ? "Sample roster for layout review. Invite real agents to route calls, monitor presence and coach."
                : "Invite your team so calls can be routed, monitored and coached."}
            </p>
            <Link className="dash-btn" href="/app/agents/new">
              Invite an agent
              <Icon name="arrow" size={14} />
            </Link>
          </div>
        </section>

        <section className="dash-card span-8" aria-labelledby="recent-title">
          <div className="dash-card-head">
            <div>
              <span className="dash-kicker">Activity</span>
              <h2 id="recent-title">Latest calls</h2>
            </div>
            <Link className="dash-inline-link" href="/app/calls/history">
              All calls
              <Icon name="arrow" size={13} />
            </Link>
          </div>
          <div className="dash-table">
            <table className="data-table">
              <thead>
                <tr>
                  {recentColumns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              {preview && (
                <tbody>
                  {recentCalls.map((row, rowIndex) => (
                    <tr key={`${rowIndex}-${row[0]}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${cellIndex}-${cell}`} className={toneClass(cell)}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {!preview && (
              <div className="dash-table-empty">
                <span className="dash-chart-icon" aria-hidden="true">
                  <Icon name="phone" size={16} />
                </span>
                <p>No calls yet. The first call through Asterisk will appear here.</p>
              </div>
            )}
          </div>
        </section>

        <section className="dash-card span-4" aria-labelledby="status-title">
          <div className="dash-card-head">
            <div>
              <span className="dash-kicker">Platform</span>
              <h2 id="status-title">System status</h2>
            </div>
            <Link className="dash-inline-link" href="/app/system/health">
              Details
              <Icon name="arrow" size={13} />
            </Link>
          </div>
          <ul className="status-list">
            {platform.map((item) => (
              <li key={item.label}>
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
                <em className={item.tone === "offline" ? "is-offline" : undefined}>{item.value}</em>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
