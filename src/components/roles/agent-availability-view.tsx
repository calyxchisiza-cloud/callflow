"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { Panel } from "@/components/screens/ui";
import { formatRelative, setPresence, updateAgentSchedule } from "@/lib/workspace";
import { AgentGate, useAgentSession } from "./agent-gate";
import {
  AgentStatusChip,
  LocalNotice,
  PresenceDot,
  RoleAlert,
  RoleHead,
  presenceOptions,
} from "./role-ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function AgentAvailabilityView() {
  return (
    <AgentGate>
      <AgentAvailability />
    </AgentGate>
  );
}

function AgentAvailability() {
  const { agent, presence, workspace } = useAgentSession();
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("17:00");
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const scheduleStart = agent?.schedule?.start;
  const scheduleEnd = agent?.schedule?.end;
  const scheduleDays = agent?.schedule?.days.join(",");

  useEffect(() => {
    if (!scheduleStart || !scheduleEnd) return;
    setStart(scheduleStart);
    setEnd(scheduleEnd);
  }, [scheduleStart, scheduleEnd]);

  useEffect(() => {
    if (!scheduleDays) return;
    setDays(scheduleDays.split(",").filter(Boolean));
  }, [scheduleDays]);

  if (!agent) return null;

  const assigned = workspace.leads.filter((lead) => lead.ownerId === agent.id).length;

  function toggleDay(day: string) {
    setSaved(false);
    setDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  }

  function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agent) return;
    setError("");
    if (!start || !end) {
      setError("Set both a start and an end time.");
      return;
    }
    if (start === end) {
      setError("Start and end time cannot be the same.");
      return;
    }
    if (days.length === 0) {
      setError("Pick at least one working day.");
      return;
    }
    const ordered = DAYS.filter((day) => days.includes(day));
    updateAgentSchedule(agent.id, { start, end, days: ordered });
    setSaved(true);
  }

  return (
    <article className="screen">
      <RoleHead
        eyebrow={`Agent desk · ${agent.team}`}
        title="Availability"
        lede="Your presence tells the team where you are right now. Working hours keep queue routing fair once telephony connects."
        meta={
          <>
            <span className="screen-chip">
              <PresenceDot presence={presence} withLabel />
            </span>
            <span className="screen-chip">
              <Icon name="phone" size={12} />
              Ext. {agent.extension}
            </span>
          </>
        }
      />

      <div className="role-split">
        <div className="role-stack">
          <Panel
            kicker="Right now"
            title="Presence"
            action={<PresenceDot presence={presence} withLabel />}
          >
            <div className="role-availability-list" role="group" aria-label="Set your presence">
              {presenceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={presence === option.id ? "is-active" : undefined}
                  aria-pressed={presence === option.id}
                  onClick={() => setPresence(agent.id, option.id)}
                >
                  <i className={`is-${option.id}`} aria-hidden="true" />
                  <span>
                    <strong>{option.label}</strong>
                    <em>{option.hint}</em>
                  </span>
                  {presence === option.id && <Icon name="check" size={16} />}
                </button>
              ))}
            </div>
          </Panel>

          <Panel kicker="Schedule" title="Working hours">
            <form className="screen-form" onSubmit={onSave}>
              <div className="screen-fields">
                <div className="screen-field">
                  <label htmlFor="shift-start">Shift starts</label>
                  <input
                    id="shift-start"
                    type="time"
                    value={start}
                    onChange={(event) => {
                      setSaved(false);
                      setStart(event.target.value);
                    }}
                  />
                </div>
                <div className="screen-field">
                  <label htmlFor="shift-end">Shift ends</label>
                  <input
                    id="shift-end"
                    type="time"
                    value={end}
                    onChange={(event) => {
                      setSaved(false);
                      setEnd(event.target.value);
                    }}
                  />
                </div>
                <div className="screen-field is-full">
                  <span className="role-field-label">Working days</span>
                  <div className="role-days" role="group" aria-label="Working days">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={days.includes(day) ? "is-active" : undefined}
                        aria-pressed={days.includes(day)}
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <RoleAlert>{error}</RoleAlert>}

              <div className="role-form-actions">
                <button type="submit" className="btn btn-primary">
                  Save hours
                  <Icon name="arrow" size={15} />
                </button>
                {saved && (
                  <p className="screen-saved">
                    <Icon name="check" size={14} />
                    Hours saved
                  </p>
                )}
              </div>
            </form>
          </Panel>
        </div>

        <div className="role-stack">
          <Panel kicker="Your seat" title="Agent summary">
            <dl className="role-facts">
              <div>
                <dt>Status</dt>
                <dd>
                  <AgentStatusChip status={agent.status} />
                </dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>{agent.team}</dd>
              </div>
              <div>
                <dt>Extension</dt>
                <dd className="role-mono">{agent.extension}</dd>
              </div>
              <div>
                <dt>Assigned leads</dt>
                <dd>
                  <Link className="role-count-link" href="/app/agent/leads">
                    {assigned}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Last sign-in</dt>
                <dd>{agent.lastSignIn ? formatRelative(agent.lastSignIn) : "—"}</dd>
              </div>
            </dl>
          </Panel>

          <Panel kicker="Routing" title="How availability is used">
            <ul className="role-perm">
              <li>
                <Icon name="headset" size={16} />
                <div>
                  <strong>Queue routing</strong>
                  <p>Available agents receive calls first once queues go live.</p>
                </div>
              </li>
              <li>
                <Icon name="users" size={16} />
                <div>
                  <strong>Owner visibility</strong>
                  <p>Your owner sees who is on the floor from the agents roster.</p>
                </div>
              </li>
              <li>
                <Icon name="pulse" size={16} />
                <div>
                  <strong>Break protection</strong>
                  <p>Away and offline tell routing to leave you alone.</p>
                </div>
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <LocalNotice title="Saved in this browser.">
        Presence and working hours are stored locally until the Callflow API is connected. Your
        owner already sees the same values on the roster.
      </LocalNotice>
    </article>
  );
}
