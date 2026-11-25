"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";

export function Panel({
  title,
  kicker,
  action,
  children,
  className,
}: {
  title?: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`screen-panel${className ? ` ${className}` : ""}`}>
      {(title || kicker || action) && (
        <header className="screen-panel-head">
          <div>
            {kicker && <span className="screen-panel-kicker">{kicker}</span>}
            {title && <h2>{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  icon = "spark",
  title,
  body,
  action,
}: {
  icon?: string;
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="screen-empty">
      <span className="screen-empty-icon" aria-hidden="true">
        <Icon name={icon} size={19} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
        {action && (
          <Link className="screen-empty-link" href={action.href}>
            {action.label}
            <Icon name="arrow" size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

const GOOD = ["answered", "available", "connected", "resolved", "won", "within target", "completed", "healthy", "active", "running"];
const WARN = ["waiting", "pending", "open", "paused", "break", "scheduled", "queued", "invited"];
const BAD = ["missed", "abandoned", "offline", "breach", "failed", "lost", "overdue"];

export function toneClass(value: string): string | undefined {
  const key = value.toLowerCase();
  if (GOOD.some((word) => key.includes(word))) return "is-good";
  if (WARN.some((word) => key.includes(word))) return "is-warn";
  if (BAD.some((word) => key.includes(word))) return "is-bad";
  return undefined;
}

export function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows?: string[][];
  empty: ReactNode;
}) {
  const hasRows = Boolean(rows && rows.length > 0);
  return (
    <div className="screen-tablewrap">
      <table className="screen-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows ? (
            rows?.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row[0]}`}>
                {row.map((cell, cellIndex) => {
                  const tone = toneClass(cell);
                  return (
                    <td key={`${cellIndex}-${cell}`} className={tone}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr className="screen-table-empty">
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="screen-table-foot">
        <span>{rows?.length ?? 0} records</span>
        <div className="screen-pager">
          <button type="button" disabled>
            Previous
          </button>
          <button type="button" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function StatGrid({
  items,
}: {
  items: { label: string; unit: string; hint: string; value?: string; suffix?: string }[];
}) {
  return (
    <div className="screen-stats">
      {items.map((item) => (
        <div className="screen-stat" key={item.label}>
          <span className="screen-stat-label">{item.label}</span>
          <span className="screen-stat-value">
            <strong>{item.value ?? "—"}</strong>
            {(item.suffix ?? item.unit) && <em>{item.suffix ?? item.unit}</em>}
          </span>
          <span className="screen-stat-hint">
            <i aria-hidden="true" />
            {item.hint}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Note({
  icon = "pulse",
  title,
  children,
}: {
  icon?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="screen-note" role="note">
      <span className="screen-note-icon" aria-hidden="true">
        <Icon name={icon} size={17} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function ServiceMessage({ children }: { children: ReactNode }) {
  return (
    <p className="screen-service" role="status">
      <Icon name="lock" size={14} />
      {children}
    </p>
  );
}
