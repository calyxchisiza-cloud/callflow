"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import type {
  BuilderScreen,
  CalendarScreen,
  DashboardScreen,
  DetailScreen,
  DocScreen,
  FormScreen,
  ListScreen,
  LogScreen,
  MediaScreen,
  MonitorScreen,
  ScreenConfig,
  SettingsScreen,
  WorkspaceScreen,
} from "@/config/screen/types";
import {
  previewCalendar,
  previewDetail,
  previewKpi,
  previewRows,
  previewSeries,
} from "@/config/preview-data";
import { DataTable, EmptyState, Note, Panel, ServiceMessage, StatGrid } from "./ui";

type Common = { route: string; title: string; preview: boolean };

export function ScreenBody({ config, ...common }: Common & { config: ScreenConfig }) {
  switch (config.template) {
    case "DSH":
      return <DashboardView config={config} {...common} />;
    case "LST":
      return <ListView config={config} {...common} />;
    case "FRM":
      return <FormView config={config} {...common} />;
    case "SET":
      return <SettingsView config={config} {...common} />;
    case "DTL":
      return <DetailView config={config} {...common} />;
    case "MON":
      return <MonitorView config={config} {...common} />;
    case "WRK":
      return <WorkspaceView config={config} />;
    case "BLD":
      return <BuilderView config={config} />;
    case "MED":
      return <MediaView config={config} {...common} />;
    case "LOG":
      return <LogView config={config} {...common} />;
    case "CAL":
      return <CalendarView config={config} {...common} />;
    case "DOC":
      return <DocView config={config} />;
  }
}

function ChartGraph({ series }: { series: number[] }) {
  const width = 620;
  const height = 158;
  const max = Math.max(...series, 1);
  const points = series.map((value, index) => ({
    x: (index * width) / (series.length - 1),
    y: height - 12 - (value / max) * (height - 30),
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;

  return (
    <svg className="screen-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="screen-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#b2e64b" stopOpacity=".34" />
          <stop offset="100%" stopColor="#b2e64b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#screen-chart-fill)" />
      <path d={line} fill="none" stroke="#8fc93f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point) => (
        <circle key={point.x} cx={point.x} cy={point.y} r="3" fill="#fff" stroke="#8fc93f" strokeWidth="2" />
      ))}
    </svg>
  );
}

function DashboardView({ config, route, preview }: { config: DashboardScreen } & Common) {
  const kpis = config.kpis.map((item) => {
    if (!preview) return item;
    const sample = previewKpi(item.label, item.unit);
    return { ...item, value: sample.value, suffix: sample.unit };
  });

  return (
    <>
      <StatGrid items={kpis} />
      <div className="screen-split">
        <Panel kicker="Trend" title={config.chartLabel} className="screen-chart-panel">
          <div className="screen-chart">
            <div className="screen-chart-grid" />
            {preview ? (
              <ChartGraph series={previewSeries(config.chartLabel)} />
            ) : (
              <div className="screen-chart-empty">
                <Icon name="chart" size={18} />
                <span>No series yet</span>
              </div>
            )}
            <div className="screen-chart-axis">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </Panel>
        <Panel kicker="Snapshot" title="Source status">
          <ul className="screen-source">
            <li>
              <span className="screen-source-dot" aria-hidden="true" />
              <div>
                <strong>Telephony events</strong>
                <p>Asterisk ARI stream not connected</p>
              </div>
              <em>Offline</em>
            </li>
            <li>
              <span className="screen-source-dot" aria-hidden="true" />
              <div>
                <strong>Records API</strong>
                <p>Aggregates from calls, queues and CRM</p>
              </div>
              <em>Pending</em>
            </li>
            <li>
              <span className="screen-source-dot is-live" aria-hidden="true" />
              <div>
                <strong>Workspace</strong>
                <p>This screen renders from the live API only</p>
              </div>
              <em>Ready</em>
            </li>
          </ul>
        </Panel>
      </div>
      <Panel kicker="Latest" title={config.tableTitle}>
        <DataTable
          columns={config.columns}
          rows={preview ? previewRows(config.columns, 5, route) : undefined}
          empty={<EmptyState title="No rows yet" body={config.tableEmpty} />}
        />
      </Panel>
    </>
  );
}

function ListView({ config, route, preview }: { config: ListScreen } & Common) {
  const filters = config.filters ?? [];
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(filters[0] ?? "");

  const term = query.trim().toLowerCase();
  const scope = ["mine", "no owner", "this week", "this month", "upcoming", "past", "due today", "overdue", "recently added"];
  const filterTerm =
    preview && active && active !== "All" && filters[0] === "All" && !scope.includes(active.toLowerCase())
      ? active.toLowerCase()
      : "";
  const rows = preview
    ? previewRows(config.columns, 8, route).filter(
        (row) =>
          (!term || row.join(" ").toLowerCase().includes(term)) &&
          (!filterTerm || row.some((cell) => cell.toLowerCase().includes(filterTerm))),
      )
    : undefined;

  return (
    <>
      <Panel className="screen-list-panel">
        <div className="screen-toolbar">
          <label className="screen-search">
            <Icon name="search" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${config.columns[0].toLowerCase()}…`}
              aria-label="Search records"
            />
            {query && (
              <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                <Icon name="close" size={13} />
              </button>
            )}
          </label>
          {filters.length > 0 && (
            <div className="screen-filters" role="group" aria-label="Filter records">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={filter === active ? "is-active" : undefined}
                  aria-pressed={filter === active}
                  onClick={() => setActive(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
        <DataTable
          columns={config.columns}
          rows={rows}
          empty={
            preview ? (
              <EmptyState
                icon="search"
                title="No matching records"
                body="Nothing in the sample dataset matches this search or filter. Clear it to see the full preview list."
              />
            ) : (
              <EmptyState
                icon="queue"
                title={config.emptyTitle}
                body={config.emptyBody}
                action={config.action}
              />
            )
          }
        />
      </Panel>
    </>
  );
}

function FormView({ config, route }: { config: FormScreen } & Common) {
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const missing: string[] = [];
    config.sections.forEach((section) =>
      section.fields.forEach((field) => {
        if (!field.required) return;
        const value = data.get(field.name);
        if (typeof value !== "string" || value.trim() === "") missing.push(field.name);
      }),
    );
    setErrors(missing);
    setSubmitted(missing.length === 0);
  };

  return (
    <form className="screen-form" onSubmit={onSubmit} noValidate>
      {config.sections.map((section, sectionIndex) => (
        <Panel
          key={section.title}
          kicker={`Section ${String(sectionIndex + 1).padStart(2, "0")}`}
          title={section.title}
        >
          {section.description && <p className="screen-panel-lede">{section.description}</p>}
          <div className="screen-fields">
            {section.fields.map((field) => {
              const id = `${route}-${field.name}-${sectionIndex}`;
              const invalid = errors.includes(field.name);
              return (
                <div
                  className={`screen-field${field.full ? " is-full" : ""}`}
                  key={`${section.title}-${field.name}`}
                >
                  <label htmlFor={id}>
                    {field.label}
                    {field.required && <span aria-hidden="true"> *</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={id}
                      name={field.name}
                      placeholder={field.placeholder}
                      rows={4}
                      aria-invalid={invalid}
                    />
                  ) : field.type === "select" ? (
                    <select id={id} name={field.name} defaultValue="" aria-invalid={invalid}>
                      <option value="" disabled>
                        Select…
                      </option>
                      {(field.options ?? []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "file" ? (
                    <input id={id} name={field.name} type="file" />
                  ) : (
                    <input
                      id={id}
                      name={field.name}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      aria-invalid={invalid}
                    />
                  )}
                  {field.hint && <span className="screen-field-hint">{field.hint}</span>}
                  {invalid && <span className="screen-field-error">This field is required.</span>}
                </div>
              );
            })}
          </div>
        </Panel>
      ))}

      <div className="screen-form-foot">
        <div>
          {submitted ? (
            <ServiceMessage>
              Nothing was saved. The form validated, but writes require the Callflow API, which is not
              connected yet.
            </ServiceMessage>
          ) : (
            <ServiceMessage>
              Submissions are sent to the Callflow API. Until it is connected, nothing is written and no
              sample record is created.
            </ServiceMessage>
          )}
        </div>
        <div className="screen-form-actions">
          {config.secondary && (
            <Link className="btn btn-ghost" href={config.secondary.href}>
              {config.secondary.label}
            </Link>
          )}
          <button className="btn btn-primary" type="submit">
            {config.submit}
            <Icon name="check" size={15} />
          </button>
        </div>
      </div>
    </form>
  );
}

function SettingsView({ config, route }: { config: SettingsScreen } & Common) {
  const storageKey = `callflow:screen-settings:${route}`;
  const initial = useMemo(() => {
    const map: Record<string, string | boolean> = {};
    config.sections.forEach((section, si) =>
      section.rows.forEach((row, ri) => {
        const key = `${si}:${ri}`;
        map[key] = row.control === "switch" ? Boolean(row.enabled) : row.value ?? "";
      }),
    );
    return map;
  }, [config]);
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) setValues({ ...initial, ...(JSON.parse(raw) as Record<string, string | boolean>) });
    } catch {
      /* stored values are optional */
    }
  }, [initial, storageKey]);

  const update = (key: string, value: string | boolean) => {
    setSaved(false);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      /* session storage may be unavailable */
    }
    setSaved(true);
  };

  return (
    <div className="screen-settings">
      <Note icon="lock" title="Preview settings, stored in this browser">
        The settings API is not connected. Changes below are kept for this browser session only and are
        never sent or applied to the platform.
      </Note>

      {config.sections.map((section, si) => (
        <Panel key={section.title} kicker={`Settings ${String(si + 1).padStart(2, "0")}`} title={section.title}>
          {section.description && <p className="screen-panel-lede">{section.description}</p>}
          <div className="screen-rows">
            {section.rows.map((row, ri) => {
              const key = `${si}:${ri}`;
              const id = `${route}-${si}-${ri}`;
              return (
                <div className="screen-row" key={`${section.title}-${row.label}`}>
                  <div className="screen-row-copy">
                    {row.control === "link" ? (
                      <span className="screen-row-title">{row.label}</span>
                    ) : (
                      <label htmlFor={id}>{row.label}</label>
                    )}
                    {row.description && <p>{row.description}</p>}
                  </div>
                  <div className="screen-row-control">
                    {row.control === "switch" && (
                      <button
                        type="button"
                        id={id}
                        role="switch"
                        aria-checked={Boolean(values[key])}
                        aria-label={row.label}
                        className={`screen-switch${values[key] ? " is-on" : ""}`}
                        onClick={() => update(key, !values[key])}
                      >
                        <span aria-hidden="true" />
                      </button>
                    )}
                    {row.control === "select" && (
                      <select
                        id={id}
                        value={String(values[key] ?? "")}
                        onChange={(event) => update(key, event.target.value)}
                      >
                        {(row.options ?? [row.value ?? ""]).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {row.control === "text" && (
                      <input
                        id={id}
                        type="text"
                        value={String(values[key] ?? "")}
                        onChange={(event) => update(key, event.target.value)}
                      />
                    )}
                    {row.control === "link" && row.href && (
                      <Link className="screen-row-link" href={row.href} id={id}>
                        Open
                        <Icon name="chevron" size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      ))}

      <div className="screen-form-foot">
        <div>
          <ServiceMessage>
            Saved values stay in this browser session; applying them needs the settings API.
          </ServiceMessage>
        </div>
        <div className="screen-form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setValues(initial)}>
            Reset
          </button>
          <button type="button" className="btn btn-primary" onClick={save}>
            Save for this session
            <Icon name="check" size={15} />
          </button>
        </div>
      </div>
      {saved && (
        <p className="screen-saved" role="status">
          <Icon name="check" size={14} />
          Saved in this browser session. The platform was not updated.
        </p>
      )}
    </div>
  );
}

function DetailView({ config, route, preview }: { config: DetailScreen } & Common) {
  const [tab, setTab] = useState(0);
  const current = config.tabs[tab];

  return (
    <Panel className="screen-detail">
      <div className="screen-tabs" role="tablist" aria-label="Record sections">
        {config.tabs.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            id={`tab-${index}`}
            aria-selected={index === tab}
            aria-controls={`panel-${index}`}
            className={index === tab ? "is-active" : undefined}
            onClick={() => setTab(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="screen-tabpanel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {current.rows && (
          <dl className="screen-dl">
            {current.rows.map((item, index) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{preview ? previewDetail(item.label, route, tab * 10 + index) : item.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {current.columns && (
          <DataTable
            columns={current.columns}
            rows={preview ? previewRows(current.columns, 4, `${route}#${tab}`) : undefined}
            empty={<EmptyState title="Nothing recorded" body="Rows load from the record endpoint when the API is connected." />}
          />
        )}
        {current.empty && <EmptyState icon="spark" title={current.label} body={current.empty} />}
      </div>
    </Panel>
  );
}

function MonitorView({ config, route, preview }: { config: MonitorScreen } & Common) {
  const tiles = config.tiles.map((item) => {
    if (!preview) return item;
    const sample = previewKpi(item.label, item.unit);
    return { ...item, value: sample.value, suffix: sample.unit };
  });

  return (
    <>
      <StatGrid items={tiles} />
      <Panel
        kicker="Live"
        title="Event stream"
        action={
          <span className={`screen-live-pill${preview ? " is-preview" : ""}`}>
            <i aria-hidden="true" />
            {preview ? "Preview" : "Offline"}
          </span>
        }
      >
        <DataTable
          columns={["Time", "Event", "Source", "Detail"]}
          rows={preview ? previewRows(["Time", "Event", "Source", "Detail"], 6, route) : undefined}
          empty={
            <EmptyState
              icon="pulse"
              title="No live events"
              body="This board updates from the realtime gateway. Events appear here the moment the gateway and telephony are connected."
            />
          }
        />
      </Panel>
    </>
  );
}

function WorkspaceView({ config }: { config: WorkspaceScreen }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Offline");
  const [number, setNumber] = useState("");

  const requireService = (action: string) =>
    setMessage(`${action} needs the telephony service. Nothing was dialled or saved.`);

  if (config.kind === "softphone") {
    return (
      <>
        <div className="screen-workspace">
          <Panel kicker="WebRTC" title="Softphone">
            <div className="screen-dial-display">{number || "Enter a number"}</div>
            <div className="screen-keypad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNumber((current) => (current + key).slice(0, 18))}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="screen-dial-actions">
              <button type="button" className="screen-dial-call" onClick={() => requireService("Calling")}>
                <Icon name="phone" size={18} />
                Call
              </button>
              <button type="button" className="screen-dial-erase" onClick={() => setNumber("")}>
                Clear
              </button>
            </div>
            {message && <ServiceMessage>{message}</ServiceMessage>}
          </Panel>
          <Panel kicker="Session" title="Registration">
            <ul className="screen-source">
              <li>
                <span className="screen-source-dot" aria-hidden="true" />
                <div>
                  <strong>SIP registration</strong>
                  <p>Requires WSS and TURN credentials</p>
                </div>
                <em>Offline</em>
              </li>
              <li>
                <span className="screen-source-dot" aria-hidden="true" />
                <div>
                  <strong>Microphone</strong>
                  <p>Granted when a session starts</p>
                </div>
                <em>Idle</em>
              </li>
            </ul>
            <Note icon="lock" title="Not registered">
              The softphone registers only after the telephony service issues credentials. No call can be
              placed from this screen yet.
            </Note>
          </Panel>
        </div>
      </>
    );
  }

  if (config.kind === "dialer") {
    return (
      <div className="screen-workspace">
        <Panel kicker="Campaign" title="Dial session">
          <div className="screen-dialer-empty">
            <Icon name="megaphone" size={20} />
            <strong>No campaign loaded</strong>
            <p>Start a campaign with a contact list to run a dial session. Leads are fetched one at a time from the API.</p>
          </div>
          <div className="screen-dial-actions">
            <button type="button" className="screen-dial-call" onClick={() => requireService("Starting a session")}>
              Next contact
            </button>
            <button type="button" className="screen-dial-erase" onClick={() => requireService("Saving an outcome")}>
              Save outcome
            </button>
          </div>
          {message && <ServiceMessage>{message}</ServiceMessage>}
        </Panel>
        <Panel kicker="Outcomes" title="Dispositions">
          <div className="screen-outcomes">
            {["Interested", "Callback", "Not interested", "Wrong number", "Do not call"].map((outcome) => (
              <button type="button" key={outcome} onClick={() => requireService("Recording a disposition")}>
                {outcome}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  if (config.kind === "click-to-call") {
    return (
      <div className="screen-workspace">
        <Panel kicker="Quick dial" title="Click to call">
          <div className="screen-ctc">
            <label htmlFor="ctc-number">Number</label>
            <div>
              <input
                id="ctc-number"
                type="tel"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                placeholder="+260 …"
              />
              <button type="button" className="btn btn-primary" onClick={() => requireService("Dialling")}>
                <Icon name="phone" size={15} />
                Call
              </button>
            </div>
          </div>
          {message && <ServiceMessage>{message}</ServiceMessage>}
        </Panel>
        <Panel kicker="Contact" title="Match">
          <EmptyState
            icon="user"
            title="No contact selected"
            body="Search contacts, then place a call against the record so the conversation is logged automatically."
            action={{ label: "Open contacts", href: "/app/crm/contacts" }}
          />
        </Panel>
      </div>
    );
  }

  return (
    <div className="screen-workspace">
      <Panel kicker="Agent state" title="Your status">
        <div className="screen-status-group" role="group" aria-label="Agent status">
          {["Offline", "Available", "Break", "After-call"].map((option) => (
            <button
              type="button"
              key={option}
              className={option === status ? "is-active" : undefined}
              aria-pressed={option === status}
              onClick={() => {
                setStatus(option);
                requireService(`Switching to ${option}`);
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <ul className="screen-source">
          <li>
            <span className="screen-source-dot" aria-hidden="true" />
            <div>
              <strong>Current call</strong>
              <p>Idle, timer stops at 00:00</p>
            </div>
            <em>No call</em>
          </li>
          <li>
            <span className="screen-source-dot" aria-hidden="true" />
            <div>
              <strong>Queue</strong>
              <p>No queue assigned to this agent yet</p>
            </div>
            <em>—</em>
          </li>
        </ul>
      </Panel>
      <Panel kicker="Wrap-up" title="Disposition">
        <div className="screen-outcomes">
          {["Resolved", "Follow-up", "Transferred", "Voicemail", "No answer"].map((outcome) => (
            <button type="button" key={outcome} onClick={() => requireService("Saving a disposition")}>
              {outcome}
            </button>
          ))}
        </div>
        <div className="screen-field">
          <label htmlFor="wrap-notes">Notes</label>
          <textarea id="wrap-notes" rows={3} placeholder="What happened on the call?" />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => requireService("Saving wrap-up")}
        >
          Save and finish
        </button>
        {message && <ServiceMessage>{message}</ServiceMessage>}
      </Panel>
    </div>
  );
}

function BuilderView({ config }: { config: BuilderScreen }) {
  const [nodes, setNodes] = useState<{ id: number; title: string; body: string }[]>([]);
  const [message, setMessage] = useState("");

  const add = (title: string, body: string) =>
    setNodes((current) => [...current, { id: Date.now() + current.length, title, body }]);

  return (
    <div className="screen-builder">
      <Panel kicker="Palette" title="Blocks">
        <div className="screen-palette">
          {config.palette.map((item) => (
            <button type="button" key={item.title} onClick={() => add(item.title, item.body)}>
              <span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </span>
              <Icon name="spark" size={14} />
            </button>
          ))}
        </div>
      </Panel>
      <Panel
        kicker="Canvas"
        title={config.canvasTitle}
        action={
          <button
            type="button"
            className="screen-mini-button"
            onClick={() => setMessage("Publishing needs the builder service. This canvas is local to your browser.")}
          >
            Publish
          </button>
        }
      >
        <p className="screen-panel-lede">{config.canvasBody}</p>
        {nodes.length === 0 ? (
          <EmptyState icon="flow" title="Canvas is empty" body="Add a block from the palette. Nothing is saved until the builder service is connected." />
        ) : (
          <ol className="screen-canvas">
            {nodes.map((node) => (
              <li key={node.id}>
                <span className="screen-node-index">{String(nodes.indexOf(node) + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{node.title}</strong>
                  <p>{node.body}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${node.title}`}
                  onClick={() => setNodes((current) => current.filter((item) => item.id !== node.id))}
                >
                  <Icon name="close" size={14} />
                </button>
              </li>
            ))}
          </ol>
        )}
        {message && <ServiceMessage>{message}</ServiceMessage>}
      </Panel>
    </div>
  );
}

function MediaView({ config, route, preview }: { config: MediaScreen } & Common) {
  const [message, setMessage] = useState("");
  const isRecording = config.kind === "recording";
  const total = preview ? previewDetail("Duration", route, 3).replace(/^0/, "") : "—:—";

  return (
    <div className="screen-split">
      <Panel kicker={isRecording ? "Recording" : "Voicemail"} title={isRecording ? "Playback" : "Message"}>
        <div className="screen-player">
          <span className="screen-player-art" aria-hidden="true">
            <Icon name={isRecording ? "pulse" : "mail"} size={22} />
          </span>
          <div className="screen-player-main">
            <div className="screen-player-track">
              <span>0:00</span>
              <div className="screen-player-bar">
                <i style={{ width: preview ? "38%" : "0%" }} />
              </div>
              <span>{total}</span>
            </div>
            <div className="screen-player-actions">
              <button
                type="button"
                className="screen-player-play"
                aria-label="Play"
                onClick={() =>
                  setMessage(
                    "Playback needs a signed URL from the media service. No audio is stored in the browser.",
                  )
                }
              >
                <span className="screen-play-glyph" aria-hidden="true" />
              </button>
              <button type="button" className="screen-player-secondary" disabled>
                Download
              </button>
            </div>
          </div>
        </div>
        {message && <ServiceMessage>{message}</ServiceMessage>}
        <Note icon="lock" title="Signed playback">
          Recordings are served through short-lived signed URLs and checked against your permissions before
          the player loads.
        </Note>
      </Panel>
      <Panel kicker="Details" title={isRecording ? "Call" : "Transcript"}>
        {isRecording ? (
          <dl className="screen-dl">
            {["Caller", "Agent", "Queue", "Duration", "Recorded"].map((label, index) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{preview ? previewDetail(label, route, index) : "—"}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <EmptyState
            icon="mail"
            title="No transcript"
            body="A transcript appears when speech-to-text has processed the message. Audio is never transcribed in the browser."
          />
        )}
      </Panel>
    </div>
  );
}

function LogView({ config, route, preview }: { config: LogScreen } & Common) {
  const [level, setLevel] = useState("All levels");
  const [query, setQuery] = useState("");

  const levelIndex = config.columns.indexOf("Level");
  const term = query.trim().toLowerCase();
  const rows = preview
    ? previewRows(config.columns, 8, route).filter(
        (row) =>
          (!term || row.join(" ").toLowerCase().includes(term)) &&
          (level === "All levels" || levelIndex < 0 || row[levelIndex] === level),
      )
    : undefined;

  return (
    <Panel className="screen-list-panel">
      <div className="screen-toolbar">
        <label className="screen-search">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search entries…"
            aria-label="Search log entries"
          />
        </label>
        <select className="screen-select" value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter by level">
          {["All levels", "Info", "Warning", "Error"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <DataTable
        columns={config.columns}
        rows={rows}
        empty={
          preview ? (
            <EmptyState
              icon="search"
              title="No entries match"
              body="The sample log has nothing for this search or level. Clear the filters to see every entry."
            />
          ) : (
            <EmptyState
              icon="pulse"
              title="No entries"
              body="Logs stream here once the service writing them is connected. Filters apply to live entries, not samples."
            />
          )
        }
      />
    </Panel>
  );
}

function CalendarView({ config, preview }: { config: CalendarScreen } & Common) {
  const [cursor, setCursor] = useState<Date | null>(null);
  const [today, setToday] = useState("");
  const events = preview ? previewCalendar(config.kind) : [];
  const eventDays = new Set(events.map((item) => item.day));

  useEffect(() => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setToday(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`);
  }, []);

  if (!cursor) {
    return (
      <Panel>
        <div className="screen-cal-skeleton" aria-hidden="true" />
      </Panel>
    );
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const label = cursor.toLocaleString("en", { month: "long", year: "numeric" });
  const move = (delta: number) => setCursor(new Date(year, month + delta, 1));

  return (
    <div className="screen-calendar">
      <Panel
        kicker={config.kind === "shifts" ? "Workforce" : "Schedule"}
        title={label}
        action={
          <div className="screen-cal-nav">
            <button type="button" aria-label="Previous month" onClick={() => move(-1)}>
              <Icon name="chevron" size={15} />
            </button>
            <button type="button" aria-label="Next month" onClick={() => move(1)}>
              <Icon name="chevron" size={15} />
            </button>
          </div>
        }
      >
        <div className="screen-cal">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span className="screen-cal-dow" key={day}>
              {day}
            </span>
          ))}
          {cells.map((day, index) => (
            <div
              className={`screen-cal-day${day === null ? " is-blank" : ""}${
                day !== null && `${year}-${month}-${day}` === today ? " is-today" : ""
              }`}
              key={index}
            >
              {day !== null && <span>{day}</span>}
              {day !== null && eventDays.has(day) && <i className="screen-cal-dot" aria-hidden="true" />}
            </div>
          ))}
        </div>
        <p className="screen-cal-foot">
          <Icon name="spark" size={13} />
          {preview
            ? "Sample items for layout review. Nothing is scheduled in the API."
            : config.kind === "shifts"
              ? "Shifts and breaks appear when scheduling is published for this team."
              : "Tasks appear on their due date once the activities API is connected."}
        </p>
      </Panel>
      <Panel kicker="Agenda" title={preview ? "This month" : "Nothing scheduled"}>
        {preview ? (
          <ul className="screen-agenda">
            {events.map((item) => (
              <li key={`${item.day}-${item.title}`}>
                <span className="screen-agenda-day">{item.day}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={config.kind === "shifts" ? "users" : "check"}
            title={config.kind === "shifts" ? "No shifts published" : "No tasks due"}
            body="This calendar reads scheduled records from the API and shows nothing until they exist."
          />
        )}
      </Panel>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function DocView({ config }: { config: DocScreen }) {
  return (
    <div className="screen-doc">
      <Panel className="screen-doc-body">
        {config.sections.map((section) => (
          <section key={section.heading} id={slugify(section.heading)}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.code && <pre>{section.code}</pre>}
          </section>
        ))}
      </Panel>
      <nav className="screen-toc" aria-label="On this page">
        <span>On this page</span>
        {config.sections.map((section) => (
          <a key={section.heading} href={`#${slugify(section.heading)}`}>
            {section.heading}
          </a>
        ))}
      </nav>
    </div>
  );
}
