import type { PageEntry } from "@/config/navigation";
import { dashboardScreens } from "./dashboards";
import { detailScreens } from "./details";
import { formScreens } from "./forms";
import { listScreens } from "./lists";
import { settingsScreens } from "./settings";
import {
  builderScreens,
  calendarScreens,
  docScreens,
  logScreens,
  mediaScreens,
  monitorScreens,
  workspaceScreens,
} from "./special";
import type { ScreenConfig } from "./types";

const byRoute: Record<string, ScreenConfig> = {
  ...dashboardScreens,
  ...listScreens,
  ...formScreens,
  ...settingsScreens,
  ...detailScreens,
  ...monitorScreens,
  ...workspaceScreens,
  ...builderScreens,
  ...mediaScreens,
  ...logScreens,
  ...calendarScreens,
  ...docScreens,
};

export const screenRoutes = Object.keys(byRoute);

function fallback(page: PageEntry): ScreenConfig {
  switch (page.template) {
    case "DSH":
      return {
        template: "DSH",
        lede: `${page.title} reports activate once its API endpoints are published.`,
        kpis: [],
        chartLabel: "Trend",
        tableTitle: `${page.title} records`,
        columns: ["Name", "Status", "Updated"],
        tableEmpty: "No records yet. This screen reads live data only, so it stays empty until its API is connected.",
      };
    case "LST":
      return {
        template: "LST",
        lede: `${page.title} activates once its API endpoints are published.`,
        columns: ["Name", "Status", "Updated"],
        emptyTitle: `No ${page.title.toLowerCase()} yet`,
        emptyBody: "This screen reads live data only, so it stays empty until its API is connected.",
      };
    case "FRM":
      return {
        template: "FRM",
        lede: `${page.title} activates once its API endpoints are published.`,
        sections: [
          {
            title: page.title,
            fields: [
              { name: "name", label: "Name", type: "text", required: true, full: true },
              { name: "notes", label: "Notes", type: "textarea", full: true },
            ],
          },
        ],
        submit: "Save",
      };
    case "DTL":
      return {
        template: "DTL",
        lede: `${page.title} loads from its record endpoint once the API is connected.`,
        tabs: [{ label: "Overview", rows: [{ label: "Record", value: "—" }] }],
      };
    case "SET":
      return {
        template: "SET",
        lede: `${page.title} activates once its settings endpoint is published.`,
        sections: [
          {
            title: page.title,
            rows: [{ label: "Status", description: "Waiting for the settings API", control: "link", href: "/app/system/config" }],
          },
        ],
      };
    case "MON":
      return {
        template: "MON",
        lede: `${page.title} streams from the realtime gateway once it is connected.`,
        tiles: [],
      };
    case "MED":
      return { template: "MED", kind: "recording", lede: `${page.title} needs the media service.` };
    case "LOG":
      return {
        template: "LOG",
        lede: `${page.title} reads from the logging service once it is connected.`,
        columns: ["Time", "Level", "Message"],
      };
    case "BLD":
      return {
        template: "BLD",
        lede: `${page.title} opens once its builder service is connected.`,
        canvasTitle: page.title,
        canvasBody: "The canvas loads from its API. Nothing is generated until then.",
        palette: [],
      };
    case "CAL":
      return {
        template: "CAL",
        kind: "tasks",
        lede: `${page.title} loads scheduled records once the API is connected.`,
      };
    case "DOC":
      return {
        template: "DOC",
        lede: `${page.title} is served by the documentation module.`,
        sections: [{ heading: page.title, paragraphs: ["This document loads from its API once connected."] }],
      };
    case "WRK":
      return {
        template: "WRK",
        kind: "agent",
        lede: `${page.title} activates once telephony and the account service are connected.`,
      };
    default:
      return {
        template: "LST",
        lede: page.title,
        columns: ["Name", "Status"],
        emptyTitle: "Nothing here yet",
        emptyBody: "This screen reads live data only.",
      };
  }
}

export function screenConfigFor(page: PageEntry): ScreenConfig {
  return byRoute[page.route] ?? fallback(page);
}

export function screenCoverage(pages: PageEntry[]): { total: number; configured: number; missing: string[] } {
  const missing = pages.filter((page) => !byRoute[page.route]).map((page) => `${page.number} ${page.route}`);
  return { total: pages.length, configured: pages.length - missing.length, missing };
}
