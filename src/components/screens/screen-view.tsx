"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import {
  clusterForModule,
  moduleMeta,
  type PageEntry,
} from "@/config/navigation";
import type { ScreenConfig } from "@/config/screen/types";
import { accountServiceOnline } from "@/lib/onboarding";
import { previewAvailable, usePreview } from "@/lib/preview";
import { ScreenBody } from "./views";

export function ScreenView({ page, config }: { page: PageEntry; config: ScreenConfig }) {
  const pathname = usePathname() ?? "";
  const [preview, setPreview] = usePreview();
  const segments = pathname.split("/").filter(Boolean);
  const routeParts = page.route.split("/").filter(Boolean);
  const dynamicIndex = routeParts.findIndex((part) => part.startsWith("["));
  const recordId = dynamicIndex >= 0 ? decodeURIComponent(segments[dynamicIndex] ?? "") : "";
  const resolveHref = (href: string) =>
    recordId ? href.replace(/\[[^\]]+\]/g, encodeURIComponent(recordId)) : href;
  const linkable = (href: string) => !href.includes("[") || Boolean(recordId);

  const moduleLabel = moduleMeta[page.module]?.label ?? page.module;
  const cluster = clusterForModule(page.module);

  return (
    <article className="screen">
      <header className="screen-head">
        <div className="screen-head-copy">
          <p className="screen-eyebrow">
            <span className="screen-eyebrow-dot" aria-hidden="true" />
            {cluster?.label ?? "Workspace"} · {moduleLabel}
          </p>
          <h1>{page.title}</h1>
          <p className="screen-lede">{config.lede}</p>
          {recordId && (
            <div className="screen-meta">
              <span className="screen-chip is-record">
                <Icon name="key" size={12} />
                {recordId}
              </span>
            </div>
          )}
        </div>

        {(config.action || config.secondary) && (
          <div className="screen-head-actions">
            {config.secondary && linkable(config.secondary.href) && (
              <Link className="btn btn-ghost" href={resolveHref(config.secondary.href)}>
                {config.secondary.label}
              </Link>
            )}
            {config.action && linkable(config.action.href) && (
              <Link className="btn btn-primary" href={resolveHref(config.action.href)}>
                {config.action.label}
                <Icon name="arrow" size={15} />
              </Link>
            )}
          </div>
        )}
      </header>

      <div className={`screen-banner${accountServiceOnline ? " is-online" : ""}${preview ? " is-preview" : ""}`}>
        <span className="screen-banner-icon" aria-hidden="true">
          <Icon name={preview ? "spark" : accountServiceOnline ? "pulse" : "lock"} size={17} />
        </span>
        <div>
          <strong>
            {preview
              ? "Preview data is on"
              : accountServiceOnline
                ? "Connected to the Callflow API"
                : "Screen ready — API not connected"}
          </strong>
          <p>
            {preview
              ? "Sample records fill this screen so you can review the layout. They are generated in this browser, never saved and never sent to the API. Turn preview off to see the honest empty states."
              : accountServiceOnline
                ? "Reads and writes use the generated API client. Empty states mean there are no records yet."
                : "Nothing on this screen is simulated. Data comes from the Callflow API; until it is deployed, the screen shows empty states and actions report that the service is unavailable."}
          </p>
        </div>
        <div className="screen-banner-actions">
          {previewAvailable && (
            <button
              type="button"
              className={`screen-preview-toggle${preview ? " is-on" : ""}`}
              aria-pressed={preview}
              onClick={() => setPreview(!preview)}
            >
              <Icon name={preview ? "close" : "spark"} size={12} />
              {preview ? "Turn preview off" : "Preview with sample data"}
            </button>
          )}
          <Link className="screen-banner-link" href="/app/system/health">
            Service status
            <Icon name="chevron" size={13} />
          </Link>
        </div>
      </div>

      <ScreenBody config={config} route={page.route} title={page.title} preview={preview} />
    </article>
  );
}
