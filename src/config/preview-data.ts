/* Development-only sample data for screen layout review. Never persisted, never sent. */

const NAMES = [
  "Tariro Banda",
  "Chikondi Phiri",
  "Thandiwe Moyo",
  "Mphatso Gondwe",
  "Limbani Nyirenda",
  "Rutendo Chirwa",
  "Blessings Kamanga",
  "Nomsa Tembo",
  "Kelvin Mwale",
  "Esnart Jere",
];

const COMPANIES = [
  "Mzuzu Coffee Union",
  "Kasungu Agri",
  "Lilongwe Dairy",
  "Blantyre Freight",
  "Zomba Textiles",
  "Karonga Fisheries",
];

const QUEUES = ["Support", "Sales", "Billing", "Reception"];
const STAGES = ["Qualified", "Proposal", "Negotiation", "Discovery", "Won"];
const OUTCOMES = ["Resolved", "Follow-up", "Transferred", "Voicemail", "No answer"];
const PRIORITIES = ["High", "Normal", "Urgent", "Low"];
const DATES = ["Today 09:42", "Today 10:18", "Yesterday 16:04", "24 Nov 14:22", "23 Nov 11:05"];
const DEALS = ["Support retainer", "Annual renewal", "Onboarding package", "Extra seats"];
const CAMPAIGNS = ["Renewal outreach", "Onboarding follow-up", "Win-back", "Upsell"];
const REPORTS = ["Call volume", "Queue service level", "Agent productivity", "Ticket backlog"];
const APPS = ["Payments", "Email", "Calendar", "Webhook relay"];
const TEAMS = ["Support floor", "Sales desk", "Billing", "Reception"];
const FLOWS = ["Main menu", "After hours", "Sales routing", "Billing menu"];

function hash(value: string): number {
  let out = 0;
  for (let index = 0; index < value.length; index += 1) {
    out = (out * 31 + value.charCodeAt(index)) % 100000;
  }
  return out;
}

function pick<T>(list: T[], seed: number): T {
  return list[Math.abs(seed) % list.length];
}

function nameAt(seed: number): string {
  return pick(NAMES, seed);
}

function emailFor(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@mzuzu-support.mw`;
}

function phoneAt(seed: number): string {
  return `+265 99${(seed % 8) + 1} ${String(120 + (seed % 800)).padStart(3, "0")} ${String(
    100 + (seed % 900),
  ).padStart(3, "0")}`;
}

function statusFor(route: string, seed: number): string {
  if (route.includes("/calls")) return pick(["Answered", "Answered", "Missed", "Voicemail"], seed);
  if (route.includes("/support/tickets")) return pick(["Open", "Pending", "Resolved"], seed);
  if (route.includes("/agents")) return pick(["Available", "On call", "Break", "Offline"], seed);
  if (route.includes("/campaigns")) return pick(["Running", "Scheduled", "Completed"], seed);
  if (route.includes("/integrations")) return "Connected";
  if (route.includes("/system/jobs")) return pick(["Completed", "Running", "Queued"], seed);
  if (route.includes("/access/users")) return pick(["Active", "Invited"], seed);
  if (route.includes("/queues")) return pick(["Active", "Paused"], seed);
  return pick(["Active", "Pending"], seed);
}

function cellValue(column: string, route: string, row: number, columnIndex: number): string {
  const key = column.toLowerCase();
  const seed = hash(route) + row * 17 + columnIndex * 31;
  const person = nameAt(seed);

  if (key === "caller" || key === "contact" || key === "name" || key === "lead") return person;
  if (key === "agent" || key === "evaluator" || key === "owner" || key === "assignee") return person;
  if (key === "actor" || key === "user") return person;
  if (key === "team lead") return nameAt(seed + 3);
  if (key === "company") return pick(COMPANIES, seed);
  if (key === "email") return emailFor(person);
  if (key === "phone" || key === "number" || key === "destination" || key === "caller id" || key === "dialed") {
    return phoneAt(seed);
  }
  if (key === "direction") return pick(["Inbound", "Outbound"], seed);
  if (key === "duration" || key === "handle time" || key === "avg handle") {
    return `0${(seed % 6) + 1}:${String(10 + (seed % 50)).padStart(2, "0")}`;
  }
  if (key === "disposition" || key === "outcome") return pick(OUTCOMES, seed);
  if (
    key === "started" ||
    key === "updated" ||
    key === "when" ||
    key === "last active" ||
    key === "date" ||
    key === "time" ||
    key === "created" ||
    key === "due" ||
    key === "last attempt" ||
    key === "first seen" ||
    key === "last seen" ||
    key === "finished" ||
    key === "published" ||
    key === "starts" ||
    key === "from" ||
    key === "to"
  ) {
    return pick(DATES, seed);
  }
  if (key === "queue" || key === "queues") return pick(QUEUES, seed);
  if (key === "status" || key === "state") return statusFor(route, seed);
  if (key === "priority") return pick(PRIORITIES, seed);
  if (key === "sla") return pick(["Within target", "Within target", "Breach"], seed);
  if (key === "stage") return pick(STAGES, seed);
  if (key === "score" || key === "qa score" || key === "%") return `${76 + (seed % 21)}%`;
  if (key === "value") return `ZMW ${(8 + (seed % 40)) * 500}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (key === "tags") return pick(["vip", "billing", "new"], seed);
  if (key === "role") return pick(["Agent", "Supervisor", "Admin"], seed);
  if (key === "extension") return `10${(seed % 8) + 1}`;
  if (key === "ticket") return `TK-${2400 + (seed % 90)}`;
  if (key === "deal") return pick(DEALS, seed);
  if (key === "campaign") return pick(CAMPAIGNS, seed);
  if (key === "report") return pick(REPORTS, seed);
  if (key === "application") return pick(APPS, seed);
  if (key === "team" || key === "teams") return pick(TEAMS, seed);
  if (key === "flow") return pick(FLOWS, seed);
  if (key === "server") return pick(["asterisk-01", "asterisk-02"], seed);
  if (key === "bucket") return pick(["recordings", "voicemail", "exports"], seed);
  if (key === "module") return pick(["Calls", "Support", "Sales", "CRM"], seed);
  if (key === "type") return pick(["Call", "Task", "Note", "Meeting"], seed);
  if (key === "subject" || key === "message" || key === "event" || key === "detail") {
    return pick(["Invoice query", "SIP registration", "Plan upgrade", "Callback requested"], seed);
  }
  if (key === "action") return pick(["user.login", "queue.updated", "role.granted"], seed);
  if (key === "error") {
    return pick(["ARI connection reset", "Queue member not found", "Webhook returned 502"], seed);
  }
  if (key === "channel") return pick(["Email", "SMS", "WhatsApp"], seed);
  if (key === "level") return pick(["Info", "Info", "Warning", "Error"], seed);
  if (key === "service" || key === "source") return pick(["api", "worker", "ari"], seed);
  if (key === "browser") return pick(["Chrome 131", "Safari 18", "Edge 131"], seed);
  if (key === "device") return pick(["MacBook Pro", "Windows desktop", "Pixel 8"], seed);
  if (key === "ip") return `10.20.${seed % 40}.${(seed % 200) + 10}`;
  if (key === "role" || key === "template" || key === "recipient" || key === "endpoint" || key === "target") {
    return pick(["Support", "Sales", "Billing"], seed);
  }
  if (key === "retention") return pick(["90 days", "1 year"], seed);
  if (key === "members" || key === "objects" || key === "count" || key === "attempts" || key === "participants") {
    return String(2 + (seed % 18));
  }
  if (
    key === "contacts" ||
    key === "companies" ||
    key === "leads" ||
    key === "deals" ||
    key === "activities" ||
    key === "calls" ||
    key === "tickets" ||
    key === "agents" ||
    key === "answered"
  ) {
    return String(3 + (seed % 64));
  }
  if (key === "calls today" || key === "online" || key === "waiting") {
    return String(3 + (seed % 24));
  }
  if (key === "size" || key === "used") return `${(4 + (seed % 40))}.${seed % 10} GB`;
  if (key === "schedule") return pick(["Daily 06:00", "Weekly Mon", "Manual"], seed);
  if (key === "last run" || key === "next run" || key === "last used" || key === "next session") {
    return pick(DATES, seed);
  }
  if (key === "result") return pick(["200", "204", "200"], seed);

  if (["author", "coach", "member", "invited by", "connected by", "changed by", "from agent", "to agent", "used by", "sender"].includes(key)) {
    return person;
  }
  if (key === "recipients" || key === "attendees" || key === "questions" || key === "sections" || key === "sessions") {
    return String(2 + (seed % 18));
  }
  if (key === "penalty" || key === "order" || key === "attempts" || key === "weight") {
    return String(1 + (seed % 5));
  }
  if (key === "points" || key === "pages" || key === "rows" || key === "days" || key === "actual") {
    return String(2 + (seed % 40));
  }
  if (key === "key") return String(1 + (seed % 9));
  if (key === "industry") return pick(["Agriculture", "Logistics", "Retail", "Finance"], seed);
  if (key === "region") return pick(["Northern", "Central", "Southern"], seed);
  if (key === "department" || key === "segment") return pick(["Support", "Sales", "Billing", "Retention"], seed);
  if (key === "category" || key === "topic") return pick(["Billing", "Onboarding", "Technical", "Retention"], seed);
  if (key === "channels" || key === "channel") return pick(["Email, SMS", "SMS, WhatsApp"], seed);
  if (key === "provider") return pick(["SMS gateway", "SMTP relay", "WhatsApp Cloud"], seed);
  if (key === "environment") return pick(["Production", "Staging"], seed);
  if (key === "host") return pick(["asterisk-01", "worker-02"], seed);
  if (key === "integration") return pick(APPS, seed);
  if (key === "strategy") return pick(["Ring all", "Round robin", "Longest idle"], seed);
  if (key === "route" || key === "list" || key === "entry point") return pick(FLOWS, seed);
  if (key === "ring group") return pick(["Support ring", "Sales ring", "Reception ring"], seed);
  if (key === "trunk") return pick(["SIP-Trunk-A", "SIP-Trunk-B"], seed);
  if (key === "holiday") return pick(["Christmas Day", "Labour Day", "Independence Day"], seed);
  if (key === "shift") return pick(["Early", "Late", "Night"], seed);
  if (key === "break") return "12:30 – 13:00";
  if (key === "clock in") return `0${7 + (seed % 3)}:${String(seed % 60).padStart(2, "0")}`;
  if (key === "clock out") return `1${6 + (seed % 3)}:${String(seed % 60).padStart(2, "0")}`;
  if (key === "window" || key === "pattern") return "Mon – Fri · 08:00 – 17:00";
  if (key === "period") return pick(["Monthly", "Weekly", "Quarterly"], seed);
  if (key === "frequency") return pick(["Weekly", "Daily", "Monthly"], seed);
  if (key === "format") return pick(["CSV", "PDF"], seed);
  if (key === "export") return "CSV";
  if (key === "audience") return pick(["All contacts", "Support leads", "Renewals"], seed);
  if (key === "form") return pick(["Contact us", "Callback request", "Demo request"], seed);
  if (key === "article") return pick(["Getting started", "Routing calls", "Billing FAQ"], seed);
  if (key === "invoice") return `INV-${2500 + (seed % 90)}`;
  if (key === "code") return `CF-${100 + (seed % 900)}`;
  if (key === "call") return `CALL-${2400 + (seed % 90)}`;
  if (key === "secret") return "••••••••";
  if (key === "backup") return "Nightly 02:00";
  if (key === "method") return pick(["POST", "GET"], seed);
  if (key === "match") return pick(["Exact", "Partial"], seed);
  if (key === "scope") return "read, write";
  if (key === "scopes") return "read, write, admin";
  if (key === "rule") return pick(["VIP to Sales", "After hours to voicemail"], seed);
  if (key === "resource") return pick(["recordings", "contacts", "exports"], seed);
  if (key === "progress") return `${40 + (seed % 50)}%`;
  if (key === "connect rate" || key === "adherence") return `${68 + (seed % 28)}%`;
  if (key === "avg wait") return `00:${String(8 + (seed % 42)).padStart(2, "0")}`;
  if (key === "amount" || key === "avg deal size") {
    return `ZMW ${(6 + (seed % 30)) * 500}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  if (key === "response") return pick(["200 OK", "204 No content", "Queued"], seed);
  if (key === "reason") return pick(["Resolved on first contact", "Callback requested", "Duplicate", "Outside hours"], seed);
  if (key === "note" || key === "comment" || key === "reminder" || key === "assignment" || key === "activity") {
    return pick(["Invoice query", "SIP registration", "Plan upgrade", "Callback requested"], seed);
  }
  if (key === "task" || key === "meeting" || key === "related to" || key === "notification") {
    return pick(["Follow up: renewal", "Quarterly check-in", "Onboarding call"], seed);
  }
  if (key === "job") return pick(["nightly.digest", "recordings.prune", "crm.sync"], seed);
  if (key === "close date" || key === "issued" || key === "sent" || key === "received" || key === "occurred") {
    return pick(DATES, seed);
  }
  if (key === "joined") return "2025";
  if (key === "added" || key === "requested") return pick(DATES, seed);
  if (key === "events") return String(4 + (seed % 30));
  if (key === "location") return pick(["Lilongwe", "Mzuzu", "Blantyre"], seed);
  if (key === "mailbox") return `20${1 + (seed % 9)}`;
  if (key === "included" || key === "trusted" || key === "attended" || key === "called back") {
    return pick(["Yes", "No"], seed);
  }
  if (key === "requires note") return pick(["No", "Yes"], seed);
  if (key === "connected" || key === "converted") return pick(["Yes", "Yes", "No"], seed);
  if (key === "recording" || key === "recorded") return "On";
  if (key === "created") return pick(DATES, seed);

  return pick(["Recorded", "Complete", "Standard", "Primary"], seed);
}

export function previewRows(columns: string[], count: number, route: string): string[][] {
  return Array.from({ length: count }, (_, row) =>
    columns.map((column, columnIndex) => cellValue(column, route, row, columnIndex)),
  );
}

export function previewDetail(label: string, route: string, index = 0): string {
  const key = label.toLowerCase();
  const seed = hash(route) + index * 23;
  if (key === "direction") return pick(["Inbound", "Outbound"], seed);
  if (key === "duration" || key === "average handle") return `03:${String(10 + (seed % 50)).padStart(2, "0")}`;
  if (key === "average wait" || key === "ring time" || key === "first response") {
    return `00:${String(8 + (seed % 42)).padStart(2, "0")}`;
  }
  if (key === "disposition") return pick(OUTCOMES, seed);
  if (key === "name") {
    if (route.includes("/queues/")) return pick(QUEUES, seed);
    if (route.includes("/ivr/")) return pick(FLOWS, seed);
    if (route.includes("/campaigns/")) return pick(CAMPAIGNS, seed);
    if (route.includes("/teams/")) return pick(TEAMS, seed);
    if (route.includes("/integrations/")) return pick(APPS, seed);
    if (route.includes("/crm/companies/")) return pick(COMPANIES, seed);
    return nameAt(seed);
  }
  if (key === "caller" || key === "contact" || key === "agent" || key === "evaluator" || key === "owner") {
    return nameAt(seed);
  }
  if (key === "email") return emailFor(nameAt(seed));
  if (key === "company") return pick(COMPANIES, seed);
  if (key === "queue") return pick(QUEUES, seed);
  if (key === "status") return statusFor(route, seed);
  if (key === "score" || key === "qa score" || key === "service level" || key === "coverage" || key === "resolved") {
    return `${76 + (seed % 18)}%`;
  }
  if (key === "occupancy") return `${64 + (seed % 24)}%`;
  if (key === "value") return "ZMW 18,500";
  if (key === "stage") return pick(STAGES, seed);
  if (key === "priority") return pick(PRIORITIES, seed);
  if (key === "phone" || key === "caller id" || key === "destination" || key === "fallback destination" || key === "dialed") {
    return phoneAt(seed);
  }
  if (key === "overflow destination") return phoneAt(seed + 5);
  if (key === "tags") return "vip, billing";
  if (key === "role" || key === "assigned role") return "Agent";
  if (key === "extension" || key === "primary extension") return `10${(seed % 8) + 1}`;
  if (key === "deal") return pick(DEALS, seed);
  if (key === "dial mode") return "Progressive";
  if (key === "strategy") return pick(["Ring all", "Round robin", "Longest idle"], seed);
  if (key === "service target") return "80% in 20s";
  if (key === "music on hold") return "Default hold · 48 s loop";
  if (key === "label") return pick(["Sales", "Support", "Billing", "Voicemail"], seed);
  if (key === "key") return String(1 + (seed % 9));
  if (key === "entry point") return "Main line · +265 991 200 100";
  if (key === "greeting") return "Welcome v3";
  if (key === "max wait") return "120 s";
  if (key === "ring time") return "00:25";
  if (key === "retry limit") return "3 attempts";
  if (key === "recording") return "On · stereo";
  if (key === "script") return "Support opener v2";
  if (key === "breaks") return "Lunch 12:30 · tea 15:00";
  if (key === "webrtc") return "WSS registered";
  if (key === "user agent") return "Chrome 131 · Windows";
  if (key === "calling window") return "08:00 – 17:00";
  if (key === "shift pattern") return "Mon – Fri · 07:00 – 15:00";
  if (key === "voicemail") return "Enabled · 30 s greeting";
  if (key === "opt-outs") return `${2 + (seed % 6)} this month`;
  if (key === "offered" || key === "connected") return String(12 + (seed % 60));
  if (key === "answered") return route.includes("/calls/") ? pick(DATES, seed) : String(12 + (seed % 60));
  if (key === "converted") return `${1 + (seed % 4)} of ${6 + (seed % 8)}`;
  if (key === "converted at") return pick(DATES, seed);
  if (key === "expires") return "12 Dec 2026";
  if (key === "first response target") return "Within 1 h";
  if (key === "resolution target") return "Within 24 h";
  return pick(DATES, seed);
}

export function previewKpi(label: string, unit: string): { value: string; unit: string } {
  const seed = hash(label);
  const numeric = (base: number, span: number) => String(base + (seed % span));
  switch (unit) {
    case "%":
      return { value: String(68 + (seed % 28)), unit: "%" };
    case "s":
      return { value: numeric(14, 160), unit: "s" };
    case "min":
      return { value: numeric(2, 38), unit: "min" };
    case "h":
      return { value: String(1 + (seed % 8)), unit: "h" };
    case "days":
      return { value: String(3 + (seed % 26)), unit: "days" };
    case "ms":
      return { value: numeric(18, 60), unit: "ms" };
    case "GB":
      return { value: String(4 + (seed % 128)), unit: "GB" };
    case "seats":
      return { value: String(8 + (seed % 32)), unit: "seats" };
    case "requests":
      return { value: (1200 + (seed % 8400)).toLocaleString("en-US"), unit: "requests" };
    case "calls":
    case "tickets":
    case "contacts":
    case "companies":
    case "leads":
    case "deals":
    case "activities":
    case "evaluations":
    case "responses":
    case "recordings":
    case "agents":
    case "channels":
    case "bridges":
    case "endpoints":
    case "trunks":
    case "extensions":
    case "flows":
    case "queues":
    case "campaigns":
    case "teams":
    case "sessions":
    case "scorecards":
    case "sections":
    case "questions":
    case "people":
    case "items":
    case "callbacks":
    case "shifts":
      return { value: numeric(4, 38), unit };
    case "state":
    case "status":
      return { value: "Healthy", unit: "" };
    case "":
      return { value: "ZMW 18,400", unit: "" };
    default:
      return { value: numeric(6, 40), unit };
  }
}

export function previewSeries(label: string): number[] {
  const seed = hash(label);
  return Array.from({ length: 7 }, (_, index) => 32 + ((seed + index * 37) % 58));
}

export function previewCalendar(kind: "tasks" | "shifts"): { day: number; title: string; meta: string }[] {
  if (kind === "shifts") {
    return [
      { day: 3, title: "Early shift · Support", meta: "07:00 – 15:00 · 6 agents" },
      { day: 10, title: "Late shift · Sales", meta: "13:00 – 21:00 · 4 agents" },
      { day: 17, title: "Early shift · Billing", meta: "07:00 – 15:00 · 3 agents" },
      { day: 24, title: "Late shift · Support", meta: "13:00 – 21:00 · 5 agents" },
    ];
  }
  return [
    { day: 4, title: "Follow up: renewal", meta: "Assigned to Tariro · Sales" },
    { day: 9, title: "Call Mzuzu Coffee", meta: "Assigned to Chikondi · Support" },
    { day: 13, title: "Send onboarding pack", meta: "Assigned to Thandiwe · Success" },
    { day: 18, title: "Review invoice query", meta: "Assigned to Mphatso · Billing" },
    { day: 24, title: "Quarterly check-in", meta: "Assigned to Limbani · Sales" },
  ];
}
