import type { ListScreen } from "./types";

function list(
  lede: string,
  columns: string[],
  emptyTitle: string,
  emptyBody: string,
  extra: Partial<ListScreen> = {},
): ListScreen {
  return { template: "LST", lede, columns, emptyTitle, emptyBody, ...extra };
}

const callColumns = ["Caller", "Direction", "Agent", "Queue", "Duration", "Disposition", "Started"];
const agentCallColumns = ["Caller", "Direction", "Queue", "Duration", "Disposition", "Started"];
const contactColumns = ["Name", "Company", "Email", "Phone", "Owner", "Updated"];
const ticketColumns = ["Ticket", "Contact", "Priority", "Assignee", "SLA", "Status", "Updated"];
const agentColumns = ["Agent", "Role", "Extension", "Status", "Queue", "Updated"];
const teamColumns = ["Team", "Lead", "Members", "Queues", "Updated"];

export const listScreens: Record<string, ListScreen> = {
  "/app/calls/history": list(
    "Every completed inbound and outbound call, with the agent, queue, duration and saved disposition.",
    callColumns,
    "No calls recorded",
    "Calls appear here from the Asterisk CDR the moment telephony is connected and the first call completes.",
    {
      filters: ["All", "Inbound", "Outbound", "Answered", "Missed"],
      secondary: { label: "PBX status", href: "/app/pbx/status" },
    },
  ),
  "/app/calls/incoming": list(
    "Inbound calls only, so the team can review answer rates, wait times and abandoned attempts.",
    callColumns,
    "No inbound calls",
    "Inbound traffic lands here once an extension, queue or IVR is provisioned in Asterisk.",
    {
      filters: ["All", "Answered", "Abandoned", "Outside hours"],
      secondary: { label: "Inbound routes", href: "/app/pbx/inbound-routes" },
    },
  ),
  "/app/calls/outgoing": list(
    "Outbound calls placed by agents from the workspace, softphone or a campaign dialer.",
    callColumns,
    "No outbound calls",
    "Outbound calls are written to the CDR when an agent dials through a provisioned trunk.",
    {
      filters: ["All", "Answered", "Failed", "No answer"],
      secondary: { label: "Outbound routes", href: "/app/pbx/outbound-routes" },
    },
  ),
  "/app/calls/missed": list(
    "Calls that rang and were never answered, with the queue, wait time and whether anyone called back.",
    callColumns,
    "No missed calls",
    "Missed calls are recorded once queues and agents are live, so the team can follow up before the customer calls again.",
    {
      filters: ["All", "Pending callback", "Returned"],
      secondary: { label: "Callbacks", href: "/app/calls/callbacks" },
    },
  ),
  "/app/calls/recordings": list(
    "Stored call recordings with the agent, queue and disposition, ready for playback and QA review.",
    ["Recording", "Caller", "Agent", "Queue", "Duration", "Disposition", "Recorded"],
    "No recordings",
    "Recording starts when object storage and the Asterisk recording hook are configured. Playback links are permission-checked.",
    {
      filters: ["All", "Inbound", "Outbound"],
      secondary: { label: "QA evaluations", href: "/app/qa/evaluations" },
    },
  ),
  "/app/calls/voicemail": list(
    "Voicemail left for extensions and queues, with read state and the mailbox that received it.",
    ["From", "Mailbox", "Duration", "Status", "Received"],
    "Mailbox is empty",
    "Voicemail is delivered here once a mailbox is attached to an extension or IVR destination.",
    {
      filters: ["All", "New", "Heard"],
      secondary: { label: "PBX extensions", href: "/app/pbx/extensions" },
    },
  ),
  "/app/calls/callbacks": list(
    "Callback requests captured from queues or created by agents, with the due time and owner.",
    ["Contact", "Number", "Requested", "Agent", "Status", "Due"],
    "No callbacks waiting",
    "Callback requests are created by queue exits, missed calls or an agent. None have been requested yet.",
    {
      filters: ["All", "Waiting", "In progress", "Done"],
      action: { label: "Call history", href: "/app/calls/history" },
    },
  ),
  "/app/settings/dispositions": list(
    "The disposition codes agents pick when a call ends, grouped by category and note requirement.",
    ["Name", "Code", "Category", "Requires note", "Updated"],
    "No disposition codes",
    "Add the codes your team uses on wrap-up so reporting groups outcomes consistently.",
    {
      filters: ["All", "Connected", "Not connected"],
      action: { label: "Call history", href: "/app/calls/history" },
    },
  ),
  "/app/calls/transfers": list(
    "Blind and attended transfers between agents and queues, with the original call and outcome.",
    ["Caller", "From agent", "To agent", "Type", "Status", "Started"],
    "No transfers",
    "Transfers appear as soon as agents start moving live calls through the workspace.",
    {
      filters: ["All", "Blind", "Attended"],
      secondary: { label: "Agent workspace", href: "/app/calls/workspace" },
    },
  ),
  "/app/calls/notes": list(
    "Free-text call notes saved with a disposition, linked back to the call and contact.",
    ["Note", "Caller", "Agent", "Disposition", "Created"],
    "No call notes",
    "Notes are saved from the wrap-up panel in the agent workspace after a call ends.",
    {
      filters: ["All", "This week", "This month"],
      secondary: { label: "Dispositions", href: "/app/settings/dispositions" },
    },
  ),
  "/app/queues/all": list(
    "The calling queues in this workspace, with routing strategy, membership and service level.",
    ["Queue", "Strategy", "Members", "Waiting", "SLA", "Status"],
    "No queues yet",
    "Create a queue to decide how inbound calls are ordered and which agents receive them.",
    {
      filters: ["All", "Active", "Paused"],
      action: { label: "Create queue", href: "/app/queues/new" },
    },
  ),
  "/app/queues/[id]/members": list(
    "Agents assigned to this queue, their extension, penalty level and current availability.",
    ["Agent", "Extension", "Penalty", "Status", "Joined"],
    "No members in this queue",
    "Add agents to the queue after their extensions are provisioned. Assignment controls who rings first.",
    {
      action: { label: "All agents", href: "/app/agents/all" },
    },
  ),
  "/app/ivr/routing": list(
    "Rules that map a dialled number, time window or caller input to a queue, IVR or extension.",
    ["Rule", "Priority", "Match", "Destination", "Status"],
    "No routing rules",
    "Routing rules decide where inbound calls go. Add them after your numbers and destinations exist.",
    {
      filters: ["All", "Inbound", "Time-based"],
      secondary: { label: "Inbound routes", href: "/app/pbx/inbound-routes" },
    },
  ),
  "/app/ivr/holidays": list(
    "Exception dates when normal business hours are replaced by a holiday message or destination.",
    ["Holiday", "Date", "Region", "Queues", "Status"],
    "No holidays configured",
    "Add the days your call floor is closed so callers hear the right message instead of ringing.",
    {
      filters: ["Upcoming", "Past"],
      secondary: { label: "Business hours", href: "/app/ivr/business-hours" },
    },
  ),
  "/app/ivr/ring-groups": list(
    "Ring groups that call several extensions together, with their strategy and member count.",
    ["Ring group", "Strategy", "Members", "Number", "Status"],
    "No ring groups",
    "Ring groups are useful for small teams that answer together. Create one from an IVR destination.",
    {
      filters: ["All", "Simultaneous", "Sequential"],
      secondary: { label: "IVR flows", href: "/app/ivr" },
    },
  ),
  "/app/crm/contacts": list(
    "Every customer and prospect in the workspace, with owner, contact details and last update.",
    contactColumns,
    "No contacts yet",
    "Create a contact or import a list. Imported files are processed as real jobs, never sample data.",
    {
      filters: ["All", "Mine", "Recently added", "No owner"],
      action: { label: "New contact", href: "/app/crm/contacts/new" },
      secondary: { label: "Import", href: "/app/crm/contacts/import" },
    },
  ),
  "/app/crm/segments": list(
    "Saved groups of contacts based on filters such as source, owner or last activity.",
    ["Segment", "Type", "Contacts", "Updated"],
    "No segments",
    "Segments are saved filters you can use in campaigns, reports and assignment rules.",
    {
      action: { label: "All contacts", href: "/app/crm/contacts" },
    },
  ),
  "/app/crm/companies": list(
    "Companies linked to contacts, deals and tickets, with their owner and contact count.",
    ["Company", "Industry", "Contacts", "Owner", "Updated"],
    "No companies yet",
    "Add the organisations your team sells to or supports. Contacts can then be linked to them.",
    {
      filters: ["All", "Mine", "No owner"],
      action: { label: "New company", href: "/app/crm/companies/new" },
    },
  ),
  "/app/crm/companies/[id]/contacts": list(
    "People at this company, with their role, contact details and deal or ticket activity.",
    ["Name", "Email", "Phone", "Role", "Owner"],
    "No contacts at this company",
    "Link existing contacts to this company or create a new one from the company record.",
    {
      action: { label: "All contacts", href: "/app/crm/contacts" },
    },
  ),
  "/app/crm/leads/all": list(
    "Unqualified enquiries with source, score and owner, ready to work or convert.",
    ["Lead", "Company", "Source", "Score", "Owner", "Status"],
    "No leads",
    "Leads arrive from imports, forms or manual entry. Nothing has been captured yet.",
    {
      filters: ["All", "New", "Working", "Qualified", "Unqualified"],
      action: { label: "New lead", href: "/app/crm/leads/new" },
    },
  ),
  "/app/sales/deals": list(
    "Open and closed opportunities with their stage, value, owner and expected close date.",
    ["Deal", "Company", "Stage", "Value", "Owner", "Close date"],
    "No deals",
    "Deals track revenue from first conversation to close. Create one directly or convert a qualified lead.",
    {
      filters: ["All", "Open", "Won", "Lost"],
      action: { label: "New deal", href: "/app/sales/deals/new" },
      secondary: { label: "Pipeline", href: "/app/sales/pipeline" },
    },
  ),
  "/app/sales/activities": list(
    "Calls, meetings and follow-ups attached to deals, with owner and due date.",
    ["Activity", "Deal", "Type", "Owner", "Due", "Status"],
    "No sales activities",
    "Log a call, meeting or follow-up against a deal so the next step is never lost.",
    {
      filters: ["All", "Due today", "Overdue", "Done"],
      action: { label: "New activity", href: "/app/work/activities/new" },
    },
  ),
  "/app/work/activities/all": list(
    "Every logged call, meeting, note and follow-up across the workspace.",
    ["Activity", "Related to", "Type", "Owner", "Due", "Status"],
    "No activities",
    "Activities record the work behind each relationship. Log the first one from a contact or deal.",
    {
      filters: ["All", "Calls", "Meetings", "Notes", "Follow-ups"],
      action: { label: "New activity", href: "/app/work/activities/new" },
    },
  ),
  "/app/work/tasks": list(
    "Tasks assigned to you and your team, with priority, owner and due date.",
    ["Task", "Related to", "Priority", "Owner", "Due", "Status"],
    "No tasks",
    "Tasks keep follow-up work visible. Create one from an activity or add it here.",
    {
      filters: ["All", "Mine", "Due today", "Overdue", "Done"],
      action: { label: "New activity", href: "/app/work/activities/new" },
    },
  ),
  "/app/work/meetings": list(
    "Scheduled meetings with attendees, owner, start time and duration.",
    ["Meeting", "Attendees", "Owner", "Starts", "Duration", "Status"],
    "No meetings",
    "Meetings booked from activities or the calendar appear here with their attendees.",
    {
      filters: ["Upcoming", "Past", "Cancelled"],
      action: { label: "Open calendar", href: "/app/work/calendar" },
    },
  ),
  "/app/work/notes": list(
    "Internal notes attached to contacts, companies, deals and tickets.",
    ["Note", "Related to", "Author", "Created"],
    "No notes",
    "Notes capture context that does not belong in a call disposition or a customer email.",
    {
      action: { label: "All activities", href: "/app/work/activities/all" },
    },
  ),
  "/app/work/reminders": list(
    "Time-based reminders sent to an owner through in-app notifications, email or SMS.",
    ["Reminder", "Related to", "When", "Channel", "Status"],
    "No reminders",
    "Set a reminder on a task or deal so a follow-up is not missed when the day gets busy.",
    {
      filters: ["All", "Upcoming", "Sent"],
      secondary: { label: "Notification settings", href: "/app/me/notifications" },
    },
  ),
  "/app/support/tickets": list(
    "Support tickets with priority, assignee, SLA state and the latest customer update.",
    ticketColumns,
    "No tickets yet",
    "Create a ticket from a call, email or the ticket form. SLAs start the moment it is opened.",
    {
      filters: ["All", "Open", "Pending", "Resolved", "Breached"],
      action: { label: "New ticket", href: "/app/support/tickets/new" },
      secondary: { label: "SLA rules", href: "/app/support/sla" },
    },
  ),
  "/app/support/feedback": list(
    "Customer satisfaction responses collected after calls, tickets or campaigns.",
    ["Response", "Contact", "Channel", "Score", "Received"],
    "No feedback yet",
    "Feedback requests are sent after a completed interaction once a survey is attached to the workflow.",
    {
      filters: ["All", "Promoters", "Passive", "Detractors"],
      secondary: { label: "CSAT reports", href: "/app/qa/csat" },
    },
  ),
  "/app/support/knowledge-base": list(
    "Published help articles for agents and customers, grouped by category and audience.",
    ["Article", "Category", "Audience", "Updated"],
    "No articles",
    "Write the first article to give agents consistent answers and reduce repeat tickets.",
    {
      filters: ["All", "Internal", "Public", "Draft"],
      action: { label: "Ticket categories", href: "/app/support/categories" },
    },
  ),
  "/app/campaigns/all": list(
    "Outbound calling campaigns with their contact list, schedule, assigned agents and status.",
    ["Campaign", "Type", "Contacts", "Agents", "Schedule", "Status"],
    "No campaigns",
    "A campaign connects a contact list, a script and a dialing mode. Create one when a list is ready.",
    {
      filters: ["All", "Draft", "Scheduled", "Running", "Paused", "Completed"],
      action: { label: "New campaign", href: "/app/campaigns/new" },
    },
  ),
  "/app/campaigns/[id]/lists": list(
    "Contact lists attached to this campaign, with source, size and import status.",
    ["List", "Contacts", "Source", "Added", "Status"],
    "No contact lists",
    "Upload a CSV or choose a saved segment. Imports run as background jobs with a real progress record.",
    {
      action: { label: "All contacts", href: "/app/crm/contacts" },
    },
  ),
  "/app/campaigns/do-not-call": list(
    "Numbers and channels that must never be dialled or messaged, with the reason and date added.",
    ["Number", "Channel", "Reason", "Added"],
    "No opt-outs",
    "DNC entries are added here or automatically from a customer request. Dialers check the list before every attempt.",
    {
      filters: ["All", "Voice", "SMS", "Email"],
      secondary: { label: "Campaigns", href: "/app/campaigns/all" },
    },
  ),
  "/app/agents/all": list(
    "Everyone who can take calls, with role, extension, queue membership and availability.",
    agentColumns,
    "No agents yet",
    "Invite an agent and provision an extension before they can go available on the call floor.",
    {
      filters: ["All", "Available", "Busy", "Offline"],
      action: { label: "Add agent", href: "/app/agents/new" },
      secondary: { label: "Availability", href: "/app/agents/availability" },
    },
  ),
  "/app/agents/activity": list(
    "Agent state changes and call events: available, ringing, talking, paused and offline.",
    ["Agent", "Event", "Channel", "Duration", "Occurred"],
    "No agent activity",
    "State changes are streamed from the realtime gateway once agents sign in and go available.",
    {
      filters: ["All", "Calls", "Status changes", "Breaks"],
      secondary: { label: "Agent availability", href: "/app/agents/availability" },
    },
  ),
  "/app/agents/[id]/calls": list(
    "Calls handled by this agent, with direction, queue, duration and disposition.",
    agentCallColumns,
    "No calls for this agent",
    "This agent has not completed a call yet. History appears from the CDR as soon as they do.",
    {
      filters: ["All", "Inbound", "Outbound"],
      secondary: { label: "Agent performance", href: "/app/reports/agents" },
    },
  ),
  "/app/teams/all": list(
    "Teams grouping agents by function, queue or shift, with their lead and membership.",
    teamColumns,
    "No teams",
    "Create a team to group agents for reporting, scheduling and queue assignment.",
    {
      filters: ["All", "Mine"],
      action: { label: "Create team", href: "/app/teams/new" },
    },
  ),
  "/app/teams/[id]/members": list(
    "Agents in this team, with role, extension and current status.",
    ["Agent", "Role", "Extension", "Status", "Joined"],
    "No members in this team",
    "Add agents to the team from the agent directory or when creating the team.",
    {
      action: { label: "All agents", href: "/app/agents/all" },
    },
  ),
  "/app/teams/shifts": list(
    "Shift patterns available to teams, with start and end windows and the days they cover.",
    ["Shift", "Team", "Window", "Days", "Status"],
    "No shifts",
    "Define shifts before building the weekly schedule so coverage and conflicts can be checked.",
    {
      action: { label: "Scheduling", href: "/app/teams/schedule" },
    },
  ),
  "/app/teams/attendance": list(
    "Clock-in and clock-out records per agent and shift, including lateness and absence.",
    ["Agent", "Shift", "Clock in", "Clock out", "Status"],
    "No attendance records",
    "Attendance starts being recorded when agents clock in from the workspace or a shared terminal.",
    {
      filters: ["Today", "This week", "All"],
      secondary: { label: "Break management", href: "/app/teams/breaks" },
    },
  ),
  "/app/qa/evaluations": list(
    "Scored call reviews with the form used, evaluator, agent and final result.",
    ["Call", "Agent", "Form", "Score", "Evaluator", "Date"],
    "No evaluations",
    "Evaluations start from a recorded call. Recordings become available once recording storage is connected.",
    {
      filters: ["All", "Draft", "Submitted", "Disputed"],
      action: { label: "Recordings", href: "/app/calls/recordings" },
    },
  ),
  "/app/qa/forms": list(
    "Scoring forms used by evaluators, with their questions, sections and score weights.",
    ["Form", "Questions", "Sections", "Used by", "Status"],
    "No evaluation forms",
    "Build the first form so supervisors can score calls consistently across the team.",
    {
      action: { label: "New form", href: "/app/qa/forms/new" },
    },
  ),
  "/app/qa/coaching": list(
    "Coaching sessions planned from evaluation results, with agent, coach and next review.",
    ["Agent", "Coach", "Topic", "Sessions", "Next session"],
    "No coaching plans",
    "Coaching is created from an evaluation or manually. Sessions appear here with their outcome.",
    {
      action: { label: "Evaluation forms", href: "/app/qa/forms" },
    },
  ),
  "/app/qa/coaching/history": list(
    "Completed coaching sessions with the topic, coach, date and recorded outcome.",
    ["Agent", "Coach", "Topic", "Date", "Outcome"],
    "No coaching history",
    "Completed sessions are kept here so progress can be compared with evaluation scores over time.",
    {
      filters: ["All", "This quarter", "This year"],
      secondary: { label: "Active coaching", href: "/app/qa/coaching" },
    },
  ),
  "/app/reports/scheduled": list(
    "Reports set to run on a schedule, with recipients, format and the next delivery time.",
    ["Report", "Frequency", "Recipients", "Format", "Next run", "Status"],
    "No scheduled reports",
    "Schedule a report to send itself to the people who need it, without anyone opening the dashboard.",
    {
      filters: ["All", "Daily", "Weekly", "Monthly"],
      secondary: { label: "Report builder", href: "/app/reports/builder" },
    },
  ),
  "/app/reports/exports": list(
    "Exports requested from a list or report, with row counts, format and processing status.",
    ["Export", "Resource", "Rows", "Format", "Requested", "Status"],
    "No exports yet",
    "Exports run as background jobs. The finished file is available here with a signed download link.",
    {
      filters: ["All", "Processing", "Ready", "Failed"],
      secondary: { label: "Analytics", href: "/app/reports" },
    },
  ),
  "/app/pbx/sip-trunks": list(
    "SIP trunks that connect the PBX to a carrier, with host, channel limits and registration state.",
    ["Trunk", "Host", "Channels", "Caller ID", "Status"],
    "No SIP trunks",
    "Add a trunk from your carrier credentials before any outbound call can leave the workspace.",
    {
      action: { label: "New trunk", href: "/app/pbx/sip-trunks/new" },
      secondary: { label: "Asterisk server", href: "/app/pbx/asterisk" },
    },
  ),
  "/app/pbx/extensions": list(
    "SIP extensions agents register from the browser or a desk phone, with their device state.",
    ["Extension", "Agent", "Type", "Device", "Status"],
    "No extensions",
    "Provision an extension for each agent so the softphone can register and calls can be routed.",
    {
      filters: ["All", "Registered", "Unregistered"],
      action: { label: "New extension", href: "/app/pbx/extensions/new" },
      secondary: { label: "SIP trunks", href: "/app/pbx/sip-trunks" },
    },
  ),
  "/app/pbx/numbers": list(
    "Phone numbers owned by the workspace, with provider, assignment and inbound route.",
    ["Number", "Provider", "Assignment", "Route", "Status"],
    "No phone numbers",
    "Add the numbers provisioned by your carrier, then point each one at an inbound route.",
    {
      action: { label: "Inbound routes", href: "/app/pbx/inbound-routes" },
    },
  ),
  "/app/pbx/inbound-routes": list(
    "How each inbound number is handled: queue, IVR, ring group or a single extension.",
    ["Route", "Number", "Destination", "Priority", "Status"],
    "No inbound routes",
    "Create a route for every number you expect calls on. Without one, the carrier has nowhere to send the call.",
    {
      action: { label: "Phone numbers", href: "/app/pbx/numbers" },
    },
  ),
  "/app/pbx/outbound-routes": list(
    "Rules that choose a trunk and caller ID for outbound dialling patterns.",
    ["Route", "Pattern", "Trunk", "Priority", "Status"],
    "No outbound routes",
    "Outbound routing decides which trunk carries a call. Add routes after a trunk is registered.",
    {
      action: { label: "SIP trunks", href: "/app/pbx/sip-trunks" },
    },
  ),
  "/app/access/users": list(
    "Everyone with a login to this workspace, with role, team, status and last activity.",
    ["User", "Role", "Team", "Status", "Last active"],
    "No users yet",
    "Invite the first teammate and assign a role. Access is checked by the API, not just hidden in the UI.",
    {
      filters: ["All", "Active", "Invited", "Suspended"],
      action: { label: "Invite user", href: "/app/access/users/new" },
      secondary: { label: "Roles", href: "/app/access/roles" },
    },
  ),
  "/app/access/roles": list(
    "Roles that bundle page and action permissions, with their member count.",
    ["Role", "Members", "Pages", "Updated"],
    "No custom roles",
    "Start from a default role or create a narrower one for supervisors, QA or read-only viewers.",
    {
      action: { label: "New role", href: "/app/access/roles/new" },
      secondary: { label: "Permissions", href: "/app/access/permissions" },
    },
  ),
  "/app/access/invitations": list(
    "Pending and accepted invitations, with the role offered and who sent them.",
    ["Email", "Role", "Invited by", "Sent", "Status"],
    "No invitations",
    "Invitations appear here when someone is added. Links expire and can be revoked before acceptance.",
    {
      filters: ["All", "Pending", "Accepted", "Expired"],
      action: { label: "Invite user", href: "/app/access/users/new" },
    },
  ),
  "/app/access/sessions": list(
    "Signed-in sessions across the workspace, with device, browser, location and last activity.",
    ["User", "Device", "Browser", "Location", "Last active"],
    "No active sessions",
    "Session records appear once sign-in runs through the Callflow API with real cookies and refresh rotation.",
    {
      filters: ["All", "This hour", "This week"],
      secondary: { label: "Audit logs", href: "/app/access/audit-logs" },
    },
  ),
  "/app/org/departments": list(
    "Departments that group people for reporting, routing and permissions.",
    ["Department", "Lead", "Members", "Queues", "Updated"],
    "No departments",
    "Create departments when the organisation is large enough to need separate reporting or routing.",
    {
      action: { label: "Organisation", href: "/app/org/profile" },
    },
  ),
  "/app/org/members": list(
    "Everyone in the organisation with their role, department and membership status.",
    ["Member", "Role", "Department", "Status", "Joined"],
    "No members",
    "Members are added through invitations. Their role and department decide what they can see and do.",
    {
      filters: ["All", "Active", "Invited"],
      action: { label: "Invite member", href: "/app/access/users/new" },
    },
  ),
  "/app/org/billing": list(
    "Invoices and payments for the subscription, with period, amount and status.",
    ["Invoice", "Period", "Amount", "Method", "Status", "Issued"],
    "No billing history",
    "Invoices appear after the first paid period. The workspace is on a trial until a plan is confirmed.",
    {
      filters: ["All", "Paid", "Open", "Failed"],
      secondary: { label: "Subscription", href: "/app/org/subscription" },
    },
  ),
  "/app/integrations/available": list(
    "Integrations Callflow supports, grouped by category, with connection state.",
    ["Integration", "Category", "Provider", "Status"],
    "No integrations listed",
    "Available integrations load from the Callflow API catalogue once the integration service is deployed.",
    {
      filters: ["All", "CRM", "Telephony", "Productivity", "Messaging"],
      secondary: { label: "Connected apps", href: "/app/integrations/connected" },
    },
  ),
  "/app/integrations/connected": list(
    "Applications currently connected to this workspace, who connected them and the scopes granted.",
    ["Application", "Connected by", "Scopes", "Connected"],
    "Nothing connected",
    "Connect an app from the catalogue. Tokens are stored server-side and can be revoked at any time.",
    {
      action: { label: "Available integrations", href: "/app/integrations/available" },
    },
  ),
  "/app/developer/api-keys": list(
    "API keys used by external systems, with environment, creation date and last use.",
    ["Key", "Environment", "Created", "Last used", "Status"],
    "No API keys",
    "Create a key for each integration and keep it server-side. Keys are shown once and can be revoked here.",
    {
      filters: ["All", "Live", "Test", "Revoked"],
      action: { label: "Create key", href: "/app/developer/api-keys/new" },
      secondary: { label: "API docs", href: "/app/developer/docs" },
    },
  ),
  "/app/developer/webhooks": list(
    "Endpoints that receive Callflow events, with subscribed events and delivery state.",
    ["Endpoint", "Events", "Secret", "Status", "Updated"],
    "No webhooks",
    "Webhooks push events such as call.ended or ticket.updated to your systems. Every delivery is signed.",
    {
      secondary: { label: "Webhook logs", href: "/app/developer/webhooks/logs" },
    },
  ),
  "/app/notifications": list(
    "In-app notifications for this user, grouped by type and read state.",
    ["Notification", "Type", "Channel", "Received", "Status"],
    "No notifications",
    "Notifications arrive here when calls, tickets, jobs or mentions need your attention.",
    {
      filters: ["All", "Unread", "Mentions", "System"],
      secondary: { label: "Notification settings", href: "/app/me/notifications" },
    },
  ),
  "/app/notifications/email-templates": list(
    "Transactional email templates with the event that triggers them and last edit.",
    ["Template", "Event", "Subject", "Updated"],
    "No email templates",
    "Templates define the messages sent for invitations, tickets and scheduled reports.",
    {
      filters: ["All", "Transactional", "Reports"],
      secondary: { label: "Notification settings", href: "/app/notifications/settings" },
    },
  ),
  "/app/notifications/sms-templates": list(
    "SMS templates used by campaigns, reminders and callbacks, with sender and trigger.",
    ["Template", "Event", "Sender", "Updated"],
    "No SMS templates",
    "Add a sender and approved template before the API can deliver SMS through your provider.",
    {
      filters: ["All", "Campaigns", "Alerts"],
      secondary: { label: "Communication logs", href: "/app/notifications/logs" },
    },
  ),
  "/app/system/jobs": list(
    "Background jobs across imports, exports, campaigns, reports and webhook retries.",
    ["Job", "Queue", "Attempts", "Progress", "Started", "Status"],
    "No jobs",
    "Jobs appear when a real import, export or scheduled task is queued. Progress is streamed from the worker.",
    {
      filters: ["All", "Running", "Completed", "Failed"],
      secondary: { label: "System health", href: "/app/system/health" },
    },
  ),
  "/app/system/backups": list(
    "Database and object-storage backups with size, schedule and retention.",
    ["Backup", "Type", "Size", "Created", "Retention"],
    "No backups",
    "Backups are created by the database and storage services once the deployment target is configured.",
    {
      secondary: { label: "Storage", href: "/app/system/storage" },
    },
  ),
  "/app/me/devices": list(
    "Devices that have signed in to your account, with browser and last activity.",
    ["Device", "Browser", "Last active", "Trusted"],
    "Only this browser",
    "Device records become available with the account service. They are used to review and revoke access.",
    {
      secondary: { label: "Active sessions", href: "/app/me/sessions" },
    },
  ),
  "/app/me/sessions": list(
    "Current and recent sign-ins for your account, with device, browser and last activity.",
    ["Device", "Browser", "IP", "Started", "Last active"],
    "No tracked sessions",
    "Session tracking starts when sign-in runs through the Callflow API with rotating refresh tokens.",
    {
      secondary: { label: "Change password", href: "/app/me/password" },
    },
  ),
};
