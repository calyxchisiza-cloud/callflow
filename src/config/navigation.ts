import registry from "./pages.json";

export type PageTemplate =
  | "DSH"
  | "LST"
  | "DTL"
  | "FRM"
  | "BLD"
  | "MON"
  | "MED"
  | "LOG"
  | "SET"
  | "CAL"
  | "DOC"
  | "WRK";

export type PageEntry = {
  number: number;
  title: string;
  route: string;
  template: PageTemplate;
  module: string;
  reference: "strong" | "partial" | "none";
};

export type Cluster = {
  id: string;
  label: string;
  icon: string;
  modules: string[];
};

export const pages = registry.pages as PageEntry[];

export const moduleOrder = [
  "Dashboards",
  "Call center & telephony",
  "Queue management",
  "IVR & call flows",
  "CRM — contacts",
  "CRM — companies",
  "CRM — leads",
  "CRM — sales & deals",
  "Tasks & activities",
  "Support & ticketing",
  "Campaigns",
  "Agent management",
  "Team & workforce",
  "Quality assurance",
  "Reports & analytics",
  "Telephony & PBX configuration",
  "Users & access",
  "Organisation",
  "Integrations & developer tools",
  "Notifications & communication",
  "System administration",
  "Personal settings",
] as const;

export const modules: string[] = [...moduleOrder];

export const clusters: Cluster[] = [
  { id: "home", label: "Home", icon: "grid", modules: ["Dashboards"] },
  {
    id: "conversations",
    label: "Conversations",
    icon: "headset",
    modules: [
      "Call center & telephony",
      "Queue management",
      "IVR & call flows",
      "Campaigns",
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: "users",
    modules: [
      "CRM — contacts",
      "CRM — companies",
      "CRM — leads",
      "Support & ticketing",
    ],
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: "trend",
    modules: ["CRM — sales & deals", "Tasks & activities"],
  },
  {
    id: "people",
    label: "People",
    icon: "badge",
    modules: ["Agent management", "Team & workforce", "Quality assurance"],
  },
  { id: "insights", label: "Insights", icon: "chart", modules: ["Reports & analytics"] },
  {
    id: "platform",
    label: "Platform",
    icon: "server",
    modules: [
      "Telephony & PBX configuration",
      "Users & access",
      "Organisation",
      "Integrations & developer tools",
      "Notifications & communication",
      "System administration",
      "Personal settings",
    ],
  },
];

export const moduleMeta: Record<string, { label: string; icon: string }> = {
  Dashboards: { label: "Overview", icon: "grid" },
  "Call center & telephony": { label: "Calls & telephony", icon: "headset" },
  "Queue management": { label: "Queues", icon: "queue" },
  "IVR & call flows": { label: "IVR & flows", icon: "flow" },
  "CRM — contacts": { label: "Contacts", icon: "user" },
  "CRM — companies": { label: "Companies", icon: "building" },
  "CRM — leads": { label: "Leads", icon: "target" },
  "CRM — sales & deals": { label: "Sales", icon: "trend" },
  "Tasks & activities": { label: "Tasks", icon: "check" },
  "Support & ticketing": { label: "Support", icon: "ticket" },
  Campaigns: { label: "Campaigns", icon: "megaphone" },
  "Agent management": { label: "Agents", icon: "badge" },
  "Team & workforce": { label: "Workforce", icon: "users" },
  "Quality assurance": { label: "Quality", icon: "shield" },
  "Reports & analytics": { label: "Reports", icon: "chart" },
  "Telephony & PBX configuration": { label: "PBX & routing", icon: "server" },
  "Users & access": { label: "Users & access", icon: "key" },
  Organisation: { label: "Organisation", icon: "building" },
  "Integrations & developer tools": { label: "Integrations", icon: "plug" },
  "Notifications & communication": { label: "Notifications", icon: "bell" },
  "System administration": { label: "System", icon: "cpu" },
  "Personal settings": { label: "My settings", icon: "userCircle" },
};

export function modulePages(module: string): PageEntry[] {
  return pages.filter((page) => page.module === module);
}

export function isConcreteRoute(route: string): boolean {
  return !route.includes("[");
}

export const concretePages = pages.filter((page) => isConcreteRoute(page.route));

export function moduleEntry(module: string): PageEntry | undefined {
  return modulePages(module).find((page) => isConcreteRoute(page.route));
}

function matches(route: string, pathname: string): boolean {
  const routeParts = route.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (routeParts.length !== pathParts.length) return false;
  return routeParts.every(
    (part, index) => part.startsWith("[") || part === pathParts[index],
  );
}

export function pageForPath(pathname: string): PageEntry | undefined {
  const cleaned = pathname.replace(/\/+$/, "");

  const literal = pages.find((page) => page.route === cleaned);
  if (literal) return literal;

  return pages.find(
    (page) => !isConcreteRoute(page.route) && matches(page.route, cleaned),
  );
}

export function activeModule(pathname: string): string | undefined {
  return pageForPath(pathname)?.module;
}

export function phaseForPage(pageNumber: number): number {
  if (pageNumber >= 213 && pageNumber <= 215) return 0;
  if ([113, 117].includes(pageNumber) || (pageNumber >= 1 && pageNumber <= 4)) return 1;
  if (pageNumber === 5) return 3;
  if (pageNumber === 6) return 2;
  if (pageNumber >= 7 && pageNumber <= 34) return 1;
  if (pageNumber >= 35 && pageNumber <= 45) return 5;
  if (pageNumber >= 46 && pageNumber <= 67) return 2;
  if (pageNumber >= 68 && pageNumber <= 76) return 3;
  if (pageNumber >= 77 && pageNumber <= 85) return 2;
  if (pageNumber >= 86 && pageNumber <= 107) return 3;
  if (pageNumber >= 108 && pageNumber <= 139) return 4;
  if (pageNumber >= 140 && pageNumber <= 168) return 5;
  if (pageNumber >= 169 && pageNumber <= 212) return 6;
  if (pageNumber >= 216 && pageNumber <= 222) return 4;
  return 6;
}

export function clusterForModule(module: string): Cluster | undefined {
  return clusters.find((cluster) => cluster.modules.includes(module));
}
