import type {
  BuilderScreen,
  CalendarScreen,
  DocScreen,
  LogScreen,
  MediaScreen,
  MonitorScreen,
  WorkspaceScreen,
} from "./types";

const tile = (label: string, unit: string, hint: string) => ({ label, unit, hint });

const mon = (
  lede: string,
  tiles: MonitorScreen["tiles"],
  extra: Partial<MonitorScreen> = {},
): MonitorScreen => ({ template: "MON", lede, tiles, ...extra });

const work = (
  lede: string,
  kind: WorkspaceScreen["kind"],
  extra: Partial<WorkspaceScreen> = {},
): WorkspaceScreen => ({ template: "WRK", lede, kind, ...extra });

const build = (
  lede: string,
  canvasTitle: string,
  canvasBody: string,
  palette: BuilderScreen["palette"],
  extra: Partial<BuilderScreen> = {},
): BuilderScreen => ({ template: "BLD", lede, canvasTitle, canvasBody, palette, ...extra });

const log = (lede: string, columns: string[], extra: Partial<LogScreen> = {}): LogScreen => ({
  template: "LOG",
  lede,
  columns,
  ...extra,
});

const calendar = (
  lede: string,
  kind: CalendarScreen["kind"],
  extra: Partial<CalendarScreen> = {},
): CalendarScreen => ({ template: "CAL", lede, kind, ...extra });

const doc = (
  lede: string,
  sections: DocScreen["sections"],
  extra: Partial<DocScreen> = {},
): DocScreen => ({ template: "DOC", lede, sections, ...extra });

export const monitorScreens: Record<string, MonitorScreen> = {
  "/app/dashboard/live": mon(
    "Calls in progress right now, updated straight from the Asterisk event stream.",
    [
      tile("Active calls", "calls", "Channels currently bridged"),
      tile("Waiting", "calls", "Callers in a queue"),
      tile("Agents on call", "agents", "Talking or in wrap-up"),
      tile("Longest call", "s", "Oldest active channel"),
    ],
    {
      action: { label: "Active calls", href: "/app/calls/active" },
      secondary: { label: "Queue monitoring", href: "/app/queues/monitor" },
    },
  ),
  "/app/calls/active": mon(
    "Every channel Asterisk currently holds, with the agent and queue attached to it.",
    [
      tile("Active calls", "calls", "In progress"),
      tile("Inbound", "calls", "Arriving from a trunk"),
      tile("Outbound", "calls", "Placed by an agent"),
      tile("Bridged", "calls", "Connected to an agent"),
    ],
    {
      action: { label: "Call history", href: "/app/calls/history" },
      secondary: { label: "Live dashboard", href: "/app/dashboard/live" },
    },
  ),
  "/app/calls/conferences": mon(
    "Conference bridges in use, who is on each and how long they have been open.",
    [
      tile("Open bridges", "bridges", "Conference rooms with participants"),
      tile("Participants", "people", "Across all bridges"),
      tile("Longest bridge", "min", "Current duration"),
      tile("Recorded", "bridges", "Bridges with recording on"),
    ],
    {
      action: { label: "Call history", href: "/app/calls/history" },
      secondary: { label: "Active calls", href: "/app/calls/active" },
    },
  ),
  "/app/queues/monitor": mon(
    "Real-time queue position: waiting callers, available agents and service level for today.",
    [
      tile("Waiting", "calls", "Across all queues"),
      tile("Available agents", "agents", "Ready to answer"),
      tile("Longest wait", "s", "Oldest waiting caller"),
      tile("Service level", "%", "Answered within target today"),
    ],
    {
      action: { label: "Queue settings", href: "/app/queues/all" },
      secondary: { label: "Queue performance", href: "/app/queues/performance" },
    },
  ),
  "/app/agents/availability": mon(
    "Who is online, what state they are in and which queue will route to them.",
    [
      tile("Online", "agents", "Registered and logged in"),
      tile("Available", "agents", "Ready for a call"),
      tile("On call", "agents", "Talking"),
      tile("Away", "agents", "Break, coaching or after-call"),
    ],
    {
      action: { label: "Agent dashboard", href: "/app/agents" },
      secondary: { label: "Break management", href: "/app/teams/breaks" },
    },
  ),
  "/app/pbx/status": mon(
    "Asterisk uptime, ARI connection state and live channel counts for this host.",
    [
      tile("Uptime", "days", "Since the last restart"),
      tile("Active channels", "channels", "In progress"),
      tile("Registered endpoints", "endpoints", "PJSIP contacts"),
      tile("Trunk latency", "ms", "Average response time"),
    ],
    {
      action: { label: "Asterisk settings", href: "/app/pbx/asterisk" },
      secondary: { label: "PBX event logs", href: "/app/pbx/logs" },
    },
  ),
  "/app/system/health": mon(
    "Service health for the API, worker, database, cache and realtime gateway.",
    [
      tile("API", "status", "Request latency and error rate"),
      tile("Worker", "status", "Queue depth and failed jobs"),
      tile("Database", "status", "Connections and slow queries"),
      tile("Realtime", "status", "Connected clients"),
    ],
    {
      action: { label: "Background jobs", href: "/app/system/jobs" },
      secondary: { label: "System logs", href: "/app/system/logs" },
    },
  ),
};

export const workspaceScreens: Record<string, WorkspaceScreen> = {
  "/app/calls/workspace": work(
    "Your working surface: current call, caller record, disposition and wrap-up in one place.",
    "agent",
    { secondary: { label: "Call history", href: "/app/calls/history" } },
  ),
  "/app/calls/softphone": work(
    "Register a WebRTC session, place and receive calls, hold, mute and transfer.",
    "softphone",
    { secondary: { label: "Agent workspace", href: "/app/calls/workspace" } },
  ),
  "/app/calls/dialer": work(
    "Work through a campaign contact list with preview, progressive or manual dialing.",
    "dialer",
    { secondary: { label: "All campaigns", href: "/app/campaigns/all" } },
  ),
  "/app/calls/click-to-call": work(
    "Dial any number from the workspace after checking the contact record.",
    "click-to-call",
    { secondary: { label: "Contacts", href: "/app/crm/contacts" } },
  ),
};

export const builderScreens: Record<string, BuilderScreen> = {
  "/app/ivr/builder": build(
    "Assemble a call flow from prompts, menus, queues and routing branches, then publish it to Asterisk.",
    "Untitled flow",
    "Add a prompt or menu from the palette to begin. The canvas writes a dialplan flow that is validated before publishing.",
    [
      { title: "Prompt", body: "Play a greeting or recorded message." },
      { title: "Menu", body: "Offer keypad options and route each one." },
      { title: "Queue", body: "Send the caller to a queue with a service target." },
      { title: "Extension", body: "Dial a specific SIP extension." },
      { title: "Schedule", body: "Branch on business hours or holidays." },
      { title: "Voicemail", body: "Take a message when nobody answers." },
    ],
    { secondary: { label: "All flows", href: "/app/ivr" } },
  ),
  "/app/ivr/flows/[id]": build(
    "Edit the published call flow, review validation and publish a new version.",
    "Flow canvas",
    "The flow loads once the IVR service is connected. Published versions are kept so a flow can be rolled back.",
    [
      { title: "Prompt", body: "Play a greeting or recorded message." },
      { title: "Menu", body: "Offer keypad options and route each one." },
      { title: "Queue", body: "Send the caller to a queue with a service target." },
      { title: "Schedule", body: "Branch on business hours or holidays." },
    ],
    { secondary: { label: "IVR details", href: "/app/ivr" } },
  ),
  "/app/sales/pipeline": build(
    "Order the stages a deal moves through and set the probability and rotting rules for each.",
    "Sales pipeline",
    "Stages load once the sales module is connected. Drag to reorder, then save to apply to every deal.",
    [
      { title: "Stage", body: "A point in the sales process." },
      { title: "Won", body: "Closes the deal as won." },
      { title: "Lost", body: "Closes the deal as lost with a reason." },
    ],
    { secondary: { label: "Pipeline settings", href: "/app/sales/pipelines" } },
  ),
  "/app/reports/builder": build(
    "Combine measures, dimensions and filters into a saved report, then schedule or export it.",
    "New report",
    "Pick a module, then add measures and dimensions. Nothing is generated until the reporting service runs the definition.",
    [
      { title: "Calls", body: "Volume, duration, answer and disposition." },
      { title: "Queues", body: "Wait, service level and abandonment." },
      { title: "Agents", body: "Handle time, occupancy and QA scores." },
      { title: "Support", body: "Ticket volume, resolution and SLA." },
      { title: "Sales", body: "Pipeline, wins and cycle time." },
      { title: "Contacts", body: "Growth, ownership and activity." },
    ],
    { secondary: { label: "Scheduled reports", href: "/app/reports/scheduled" } },
  ),
  "/app/pbx/dialplans": build(
    "Inspect and edit the dialplan contexts that Asterisk applies to inbound and outbound calls.",
    "Dialplan contexts",
    "Contexts load from Asterisk once the PBX service is connected. Changes are validated before a reload is issued.",
    [
      { title: "Extension", body: "Match a dialled number or pattern." },
      { title: "Answer", body: "Answer the channel and start audio." },
      { title: "Queue", body: "Enter a queue with a priority." },
      { title: "Dial", body: "Ring a PJSIP endpoint for a timeout." },
      { title: "Voicemail", body: "Leave a message in a mailbox." },
      { title: "Hangup", body: "End the call with a cause code." },
    ],
    { secondary: { label: "Inbound routes", href: "/app/pbx/inbound-routes" } },
  ),
};

export const mediaScreens: Record<string, MediaScreen> = {
  "/app/calls/recordings/[id]": {
    template: "MED",
    kind: "recording",
    lede: "Play the stored recording for this call, with permission checks and a signed URL.",
    secondary: { label: "Call history", href: "/app/calls/history" },
  },
  "/app/calls/voicemail/[id]": {
    template: "MED",
    kind: "voicemail",
    lede: "Play this voicemail, read the transcription and call the person back.",
    secondary: { label: "Voicemail", href: "/app/calls/voicemail" },
  },
};

export const logScreens: Record<string, LogScreen> = {
  "/app/pbx/logs": log(
    "Asterisk events as they arrive — registrations, reloads, channel state and errors.",
    ["Time", "Level", "Source", "Event"],
    { secondary: { label: "PBX status", href: "/app/pbx/status" } },
  ),
  "/app/access/audit-logs": log(
    "Every privileged action in the workspace, with who did it and what changed.",
    ["Time", "Actor", "Action", "Target", "IP"],
    { secondary: { label: "Users", href: "/app/access/users" } },
  ),
  "/app/developer/webhooks/logs": log(
    "Webhook delivery attempts, response codes and retries.",
    ["Time", "Endpoint", "Event", "Status", "Duration"],
    { secondary: { label: "Webhook management", href: "/app/developer/webhooks" } },
  ),
  "/app/notifications/logs": log(
    "Email, SMS and WhatsApp delivery history with provider responses.",
    ["Time", "Channel", "Recipient", "Template", "Status"],
    { secondary: { label: "Notification settings", href: "/app/notifications/settings" } },
  ),
  "/app/system/logs": log(
    "Application logs from the API and worker, filtered by level and source.",
    ["Time", "Level", "Service", "Message"],
    { secondary: { label: "Error monitoring", href: "/app/system/errors" } },
  ),
  "/app/system/errors": log(
    "Grouped errors with occurrence counts and the release that introduced them.",
    ["First seen", "Last seen", "Service", "Error", "Count"],
    { secondary: { label: "System logs", href: "/app/system/logs" } },
  ),
};

export const calendarScreens: Record<string, CalendarScreen> = {
  "/app/work/calendar": calendar(
    "Tasks and activities laid out by due date, so nothing slips.",
    "tasks",
    { secondary: { label: "All tasks", href: "/app/work/tasks" } },
  ),
  "/app/teams/schedule": calendar(
    "Shifts, breaks and coverage for the team across the month.",
    "shifts",
    { secondary: { label: "Break management", href: "/app/teams/breaks" } },
  ),
};

export const docScreens: Record<string, DocScreen> = {
  "/app/support/knowledge-base/[slug]": doc(
    "A knowledge base article rendered from the support module.",
    [
      {
        heading: "Article",
        paragraphs: [
          "Articles are stored with the support module and served to agents while they work a ticket.",
          "This article will render here once the knowledge base service is connected and the article is published.",
        ],
      },
      {
        heading: "Related",
        paragraphs: [
          "Related tickets and articles are linked from the support desk, not hard-coded on this page.",
        ],
      },
    ],
    { secondary: { label: "Knowledge base", href: "/app/support/knowledge-base" } },
  ),
  "/app/developer/docs": doc(
    "Reference for the Callflow API: authentication, base URL, errors, filtering and pagination.",
    [
      {
        heading: "Base URL",
        paragraphs: [
          "The API is served by the NestJS application for this deployment. The base URL is configured in System configuration and is not published until the API is deployed.",
        ],
      },
      {
        heading: "Authentication",
        paragraphs: [
          "Requests authenticate with a bearer API key created under API key management. Keys are shown once at creation and can be revoked at any time.",
          "Keys are scoped to the organisation and never grant access to another organisation's records.",
        ],
        code: "Authorization: Bearer cf_live_…",
      },
      {
        heading: "Errors",
        paragraphs: [
          "Every error uses the same envelope, with a machine-readable code and a human message. Validation failures list the offending fields.",
        ],
        code: '{\n  "error": {\n    "code": "validation_failed",\n    "message": "The request body is invalid.",\n    "fields": { "email": "Already in use" }\n  }\n}',
      },
      {
        heading: "Filtering and pagination",
        paragraphs: [
          "Collections accept page and perPage plus field filters using the filter[field]=value grammar. Sorts use sort=field or sort=-field for descending.",
        ],
        code: "GET /v1/calls?filter[direction]=inbound&sort=-started&page=2&perPage=50",
      },
      {
        heading: "OpenAPI",
        paragraphs: [
          "The OpenAPI document is generated by the API and consumed by this workspace. Until the API is deployed, these screens render honest empty states rather than sample records.",
        ],
      },
    ],
    { secondary: { label: "API keys", href: "/app/developer/api-keys" } },
  ),
};
