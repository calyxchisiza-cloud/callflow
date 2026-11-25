import type { DetailScreen, DetailTab } from "./types";

function detail(
  lede: string,
  tabs: DetailTab[],
  extra: Partial<DetailScreen> = {},
): DetailScreen {
  return { template: "DTL", lede, tabs, ...extra };
}

const row = (label: string, value = "—") => ({ label, value });

const overview = (...labels: string[]): DetailTab => ({
  label: "Overview",
  rows: labels.map((label) => row(label)),
});

const callColumns = ["Caller", "Direction", "Agent", "Duration", "Started"];

export const detailScreens: Record<string, DetailScreen> = {
  "/app/calls/[id]": detail(
    "The full record of one call: who called, who answered, how long it lasted and what was saved.",
    [
      overview("Direction", "Caller", "Destination", "Agent", "Queue", "Started", "Answered", "Duration", "Disposition"),
      { label: "Recording", empty: "No recording is stored for this call. Playback appears once object storage is configured and the call is recorded." },
      { label: "Notes", empty: "No notes have been written on this call." },
      { label: "Events", columns: ["Time", "Event", "Detail"] },
    ],
    { secondary: { label: "Call history", href: "/app/calls/history" } },
  ),
  "/app/queues/[id]": detail(
    "Queue configuration, members and performance for this queue.",
    [
      overview("Name", "Strategy", "Service target", "Music on hold", "Created"),
      { label: "Members", columns: ["Agent", "Extension", "Status", "Penalty"] },
      overview("Ring time", "Max wait", "Overflow destination"),
      { label: "Performance", rows: [row("Offered"), row("Answered"), row("Average wait"), row("Service level")] },
    ],
    { secondary: { label: "All queues", href: "/app/queues/all" } },
  ),
  "/app/ivr/[id]": detail(
    "This IVR's entry point, options and published state.",
    [
      overview("Name", "Entry point", "Greeting", "Status", "Last published"),
      { label: "Options", columns: ["Key", "Label", "Destination"] },
      { label: "Flow", empty: "Open the flow builder to review the published sequence of prompts and branches." },
      { label: "Versions", columns: ["Version", "Published by", "Published"] },
    ],
    {
      action: { label: "Open flow builder", href: "/app/ivr/builder" },
      secondary: { label: "All flows", href: "/app/ivr" },
    },
  ),
  "/app/ivr/ring-groups/[id]": detail(
    "Who rings when this group is dialled, in what order and for how long.",
    [
      overview("Name", "Strategy", "Ring timeout", "Fallback", "Status"),
      { label: "Members", columns: ["Agent", "Extension", "Order", "Status"] },
      { label: "Behaviour", rows: [row("Ring time"), row("Voicemail"), row("Fallback destination")] },
    ],
    { secondary: { label: "Ring groups", href: "/app/ivr/ring-groups" } },
  ),
  "/app/crm/contacts/[id]": detail(
    "Everything known about this contact: details, activity, deals and support history.",
    [
      overview("Name", "Email", "Phone", "Company", "Job title", "Owner", "Tags", "Created"),
      { label: "Activity", columns: ["Type", "Subject", "Owner", "When"] },
      { label: "Deals", columns: ["Deal", "Stage", "Value", "Owner"] },
      { label: "Tickets", columns: ["Ticket", "Priority", "Status", "Updated"] },
      { label: "Notes", empty: "No notes have been added for this contact." },
    ],
    { secondary: { label: "All contacts", href: "/app/crm/contacts" } },
  ),
  "/app/crm/contacts/[id]/timeline": detail(
    "Every interaction with this contact in time order — calls, notes, tasks, deals and tickets.",
    [
      { label: "Timeline", empty: "No interactions recorded yet. Calls, notes, tasks and tickets appear here as they are logged." },
      { label: "Calls", columns: callColumns },
      { label: "Tasks", columns: ["Subject", "Owner", "Status", "Due"] },
    ],
    { secondary: { label: "Contact details", href: "/app/crm/contacts" } },
  ),
  "/app/crm/companies/[id]": detail(
    "The company record with its contacts, deals and recent activity.",
    [
      overview("Name", "Industry", "Website", "Phone", "Owner", "Address", "Created"),
      { label: "Contacts", columns: ["Name", "Role", "Email", "Phone"] },
      { label: "Deals", columns: ["Deal", "Stage", "Value", "Owner"] },
      { label: "Activity", columns: ["Type", "Subject", "Owner", "When"] },
    ],
    { secondary: { label: "All companies", href: "/app/crm/companies" } },
  ),
  "/app/crm/leads/[id]": detail(
    "Lead details, source and the path to conversion.",
    [
      overview("Name", "Company", "Email", "Phone", "Source", "Owner", "Score", "Status"),
      { label: "Activity", columns: ["Type", "Subject", "Owner", "When"] },
      { label: "Conversion", rows: [row("Converted"), row("Converted at"), row("Contact"), row("Deal")] },
    ],
    {
      action: { label: "Convert lead", href: "/app/crm/leads/[id]/convert" },
      secondary: { label: "All leads", href: "/app/crm/leads/all" },
    },
  ),
  "/app/sales/deals/[id]": detail(
    "Deal value, stage history and the people involved.",
    [
      overview("Deal", "Company", "Stage", "Value", "Owner", "Expected close", "Probability", "Created"),
      { label: "Stage history", columns: ["Stage", "Changed by", "When"] },
      { label: "Contacts", columns: ["Name", "Role", "Email"] },
      { label: "Notes", empty: "No notes have been added for this deal." },
    ],
    { secondary: { label: "Open pipeline", href: "/app/sales/pipeline" } },
  ),
  "/app/work/activities/[id]": detail(
    "One logged activity: who it belongs to, when it happened and what came out of it.",
    [
      overview("Subject", "Type", "Contact", "Owner", "Due", "Status", "Completed"),
      { label: "Attendees", columns: ["Name", "Role", "Response"] },
      { label: "Notes", empty: "No notes have been added to this activity." },
    ],
    { secondary: { label: "All tasks", href: "/app/work/tasks" } },
  ),
  "/app/support/tickets/[id]": detail(
    "The ticket, its conversation history and how it is tracking against SLA.",
    [
      overview("Ticket", "Contact", "Category", "Priority", "Assignee", "Status", "Created"),
      { label: "Conversation", empty: "No messages on this ticket yet. Replies from every channel appear here in order." },
      { label: "SLA", rows: [row("First response target"), row("First response"), row("Resolution target"), row("Resolved")] },
      { label: "Related", columns: ["Record", "Type", "Updated"] },
    ],
    { secondary: { label: "All tickets", href: "/app/support/tickets" } },
  ),
  "/app/campaigns/[id]": detail(
    "Campaign setup, progress and per-contact results.",
    [
      overview("Name", "Type", "List size", "Assignee", "Start", "End", "Status"),
      { label: "Contacts", columns: ["Contact", "Phone", "Attempts", "Outcome"] },
      { label: "Results", rows: [row("Dialed"), row("Connected"), row("Converted"), row("Opt-outs")] },
      { label: "Settings", rows: [row("Dial mode"), row("Retry limit"), row("Calling window"), row("Script")] },
    ],
    {
      action: { label: "Campaign performance", href: "/app/campaigns" },
      secondary: { label: "All campaigns", href: "/app/campaigns/all" },
    },
  ),
  "/app/agents/[id]": detail(
    "Agent profile, current status, schedule and recent performance.",
    [
      overview("Name", "Role", "Team", "Extension", "Status", "Created"),
      { label: "Performance", rows: [row("Answered"), row("Average handle"), row("Occupancy"), row("QA score")] },
      { label: "Schedule", columns: ["Day", "Shift", "Break", "Team"] },
      { label: "Extensions", rows: [row("Primary extension"), row("WebRTC"), row("Voicemail")] },
    ],
    { secondary: { label: "All agents", href: "/app/agents/all" } },
  ),
  "/app/teams/[id]": detail(
    "Team membership, queues and the shift pattern in use.",
    [
      overview("Team", "Lead", "Members", "Queues", "Created"),
      { label: "Members", columns: ["Agent", "Role", "Extension", "Status"] },
      { label: "Queues", columns: ["Queue", "Strategy", "Service target"] },
      { label: "Schedule", rows: [row("Shift pattern"), row("Coverage"), row("Breaks")] },
    ],
    { secondary: { label: "All teams", href: "/app/teams/all" } },
  ),
  "/app/qa/evaluations/[id]": detail(
    "A scored call: each answer, the weighted result and any coaching that followed.",
    [
      overview("Agent", "Form", "Call", "Evaluator", "Score", "Completed"),
      { label: "Answers", columns: ["Question", "Answer", "Weight", "Points"] },
      { label: "Coaching", empty: "No coaching session has been logged for this evaluation." },
    ],
    { secondary: { label: "All evaluations", href: "/app/qa/evaluations" } },
  ),
  "/app/pbx/extensions/[id]": detail(
    "An extension's SIP endpoint, registration state and routing.",
    [
      overview("Extension", "Display name", "Agent", "Transport", "Context", "Created"),
      { label: "Registration", rows: [row("Contact"), row("User agent"), row("Expires"), row("Status")] },
      { label: "Routing", rows: [row("Voicemail"), row("Recording"), row("Caller ID")] },
      { label: "Activity", columns: ["Time", "Event", "Detail"] },
    ],
    { secondary: { label: "All extensions", href: "/app/pbx/extensions" } },
  ),
  "/app/access/users/[id]": detail(
    "A member's roles, sessions and recent privileged activity.",
    [
      overview("Name", "Email", "Role", "Status", "Last sign-in", "Created"),
      { label: "Roles", columns: ["Role", "Scope", "Granted"] },
      { label: "Sessions", columns: ["Device", "Browser", "Started", "Last active"] },
      { label: "Activity", columns: ["Time", "Action", "Target"] },
    ],
    { secondary: { label: "All users", href: "/app/access/users" } },
  ),
  "/app/integrations/[id]": detail(
    "What this integration can access, who connected it and what it has done.",
    [
      overview("Application", "Category", "Connected by", "Connected", "Status"),
      { label: "Permissions", columns: ["Scope", "Description", "Granted"] },
      { label: "Activity", columns: ["Time", "Event", "Result"] },
    ],
    { secondary: { label: "Connected applications", href: "/app/integrations/connected" } },
  ),
  "/app/system/jobs/[id]": detail(
    "One background job: its payload, attempts and the result.",
    [
      overview("Job", "Queue", "Status", "Attempts", "Created", "Finished"),
      { label: "Payload", empty: "The job payload is available once the worker has processed it." },
      { label: "Attempts", columns: ["Attempt", "Started", "Finished", "Result"] },
    ],
    { secondary: { label: "Background jobs", href: "/app/system/jobs" } },
  ),
};
