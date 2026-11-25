import type { FormField, FormScreen } from "./types";

function form(
  lede: string,
  sections: FormScreen["sections"],
  submit: string,
  extra: Partial<FormScreen> = {},
): FormScreen {
  return { template: "FRM", lede, sections, submit, ...extra };
}

const field = (
  name: string,
  label: string,
  type: FormField["type"] = "text",
  extra: Partial<FormField> = {},
): FormField => ({ name, label, type, ...extra });

const contactFields: FormField[] = [
  field("firstName", "First name", "text", { required: true }),
  field("lastName", "Last name", "text", { required: true }),
  field("email", "Email", "email"),
  field("phone", "Phone", "tel"),
  field("company", "Company"),
  field("jobTitle", "Job title"),
  field("owner", "Owner"),
  field("tags", "Tags", "text", { full: true, hint: "Comma-separated, for example vip, billing." }),
  field("notes", "Notes", "textarea", { full: true }),
];

const companyFields: FormField[] = [
  field("name", "Company name", "text", { required: true, full: true }),
  field("industry", "Industry"),
  field("website", "Website", "text", { placeholder: "https://" }),
  field("phone", "Phone", "tel"),
  field("owner", "Owner"),
  field("address", "Address", "textarea", { full: true }),
  field("notes", "Notes", "textarea", { full: true }),
];

const leadFields: FormField[] = [
  field("name", "Lead name", "text", { required: true }),
  field("company", "Company"),
  field("email", "Email", "email"),
  field("phone", "Phone", "tel"),
  field("source", "Source", "select", { options: ["Inbound call", "Web form", "Import", "Referral", "Manual"] }),
  field("owner", "Owner"),
  field("score", "Score", "number"),
  field("notes", "Notes", "textarea", { full: true }),
];

const dealFields: FormField[] = [
  field("name", "Deal name", "text", { required: true, full: true }),
  field("company", "Company"),
  field("value", "Value", "number", { placeholder: "0.00" }),
  field("currency", "Currency", "select", { options: ["MWK", "USD", "EUR", "GBP", "ZAR"] }),
  field("pipeline", "Pipeline", "select"),
  field("stage", "Stage", "select"),
  field("owner", "Owner"),
  field("closeDate", "Expected close", "date"),
  field("source", "Source"),
  field("notes", "Notes", "textarea", { full: true }),
];

const ticketFields: FormField[] = [
  field("subject", "Subject", "text", { required: true, full: true }),
  field("contact", "Contact"),
  field("company", "Company"),
  field("priority", "Priority", "select", { options: ["Low", "Normal", "High", "Urgent"] }),
  field("category", "Category", "select"),
  field("assignee", "Assignee"),
  field("description", "Description", "textarea", { full: true, required: true }),
];

const campaignFields: FormField[] = [
  field("name", "Campaign name", "text", { required: true, full: true }),
  field("type", "Type", "select", { options: ["Outbound voice", "Progressive", "Predictive", "SMS"] }),
  field("list", "Contact list", "select"),
  field("script", "Call script", "select"),
  field("agents", "Assigned agents", "text", { full: true, hint: "Names or team, separated by commas." }),
  field("startDate", "Start date", "date"),
  field("endDate", "End date", "date"),
  field("notes", "Notes", "textarea", { full: true }),
];

const agentFields: FormField[] = [
  field("fullName", "Full name", "text", { required: true }),
  field("email", "Work email", "email", { required: true }),
  field("role", "Role", "select", { options: ["Agent", "Supervisor", "QA reviewer", "Admin"] }),
  field("team", "Team", "select"),
  field("extension", "Extension", "text", { hint: "Provision one in PBX → Extensions first." }),
  field("queue", "Primary queue", "select"),
  field("notes", "Notes", "textarea", { full: true }),
];

const teamFields: FormField[] = [
  field("name", "Team name", "text", { required: true, full: true }),
  field("lead", "Team lead"),
  field("queues", "Queues", "text", { full: true, hint: "Comma-separated queue names." }),
  field("description", "Description", "textarea", { full: true }),
];

const trunkFields: FormField[] = [
  field("name", "Trunk name", "text", { required: true }),
  field("host", "Host", "text", { required: true, placeholder: "sip.provider.com" }),
  field("port", "Port", "number", { placeholder: "5060" }),
  field("username", "Username"),
  field("password", "Password", "text", { hint: "Stored encrypted; never shown again." }),
  field("callerId", "Caller ID", "tel"),
  field("codecs", "Codecs", "select", { options: ["Opus, ulaw, alaw", "ulaw, alaw", "alaw only"], full: true }),
];

const extensionFields: FormField[] = [
  field("number", "Extension number", "text", { required: true }),
  field("displayName", "Display name", "text", { required: true }),
  field("agent", "Assigned agent", "select"),
  field("type", "Type", "select", { options: ["WebRTC (browser)", "Desk phone", "Softphone"] }),
  field("callerId", "Outbound caller ID", "tel"),
  field("voicemail", "Voicemail", "select", { options: ["Disabled", "Enabled"] }),
  field("notes", "Notes", "textarea", { full: true }),
];

const userFields: FormField[] = [
  field("fullName", "Full name", "text", { required: true }),
  field("email", "Email", "email", { required: true }),
  field("role", "Role", "select"),
  field("team", "Team", "select"),
  field("sendInvite", "Send invitation", "select", { options: ["Yes", "No"], full: true }),
];

const roleFields: FormField[] = [
  field("name", "Role name", "text", { required: true, full: true }),
  field("description", "Description", "textarea", { full: true }),
  field("scope", "Data scope", "select", {
    options: ["Own records", "Team records", "Whole organisation"],
    full: true,
  }),
  field("pages", "Page access", "textarea", {
    full: true,
    hint: "Grant page groups here; fine-grained actions are set in Permissions.",
  }),
];

export const formScreens: Record<string, FormScreen> = {
  "/app/queues/new": form(
    "Set the queue name, routing strategy and service target. Members and routing rules are added after the queue exists.",
    [
      {
        title: "Queue",
        fields: [
          field("name", "Queue name", "text", { required: true, full: true }),
          field("number", "Queue number", "text", { placeholder: "Optional internal number" }),
          field("strategy", "Routing strategy", "select", {
            options: ["Ring all", "Longest idle", "Round robin", "Fewest calls", "Random"],
            required: true,
          }),
          field("sla", "Service level (seconds)", "number", { placeholder: "20" }),
          field("maxWait", "Max wait (seconds)", "number", { placeholder: "300" }),
          field("wrapUp", "Wrap-up time (seconds)", "number", { placeholder: "30" }),
        ],
      },
      {
        title: "Caller experience",
        description: "What callers hear while they wait, and where they go if nobody answers.",
        fields: [
          field("welcome", "Welcome prompt", "select"),
          field("music", "Hold music", "select"),
          field("overflow", "Overflow destination", "select"),
          field("description", "Internal description", "textarea", { full: true }),
        ],
      },
    ],
    "Create queue",
    { secondary: { label: "All queues", href: "/app/queues/all" } },
  ),
  "/app/queues/[id]/edit": form(
    "Update this queue's name, routing strategy, service target and caller experience.",
    [
      {
        title: "Queue",
        fields: [
          field("name", "Queue name", "text", { required: true, full: true }),
          field("number", "Queue number"),
          field("strategy", "Routing strategy", "select", {
            options: ["Ring all", "Longest idle", "Round robin", "Fewest calls", "Random"],
            required: true,
          }),
          field("sla", "Service level (seconds)", "number"),
          field("maxWait", "Max wait (seconds)", "number"),
          field("wrapUp", "Wrap-up time (seconds)", "number"),
        ],
      },
      {
        title: "Caller experience",
        fields: [
          field("welcome", "Welcome prompt", "select"),
          field("music", "Hold music", "select"),
          field("overflow", "Overflow destination", "select"),
          field("description", "Internal description", "textarea", { full: true }),
        ],
      },
    ],
    "Save changes",
    { secondary: { label: "Back to queues", href: "/app/queues/all" } },
  ),
  "/app/queues/[id]/routing": form(
    "Decide how calls move through this queue: ring time, overflow, voicemail and retry behaviour.",
    [
      {
        title: "Routing",
        fields: [
          field("strategy", "Strategy", "select", {
            options: ["Ring all", "Longest idle", "Round robin", "Fewest calls", "Random"],
          }),
          field("ringTime", "Ring time (seconds)", "number", { placeholder: "20" }),
          field("retry", "Retry delay (seconds)", "number", { placeholder: "60" }),
          field("maxAttempts", "Max attempts", "number", { placeholder: "3" }),
        ],
      },
      {
        title: "Fallbacks",
        description: "Used when the queue is full, outside hours, or no agent answers.",
        fields: [
          field("overflow", "Overflow destination", "select"),
          field("timeout", "Timeout destination", "select"),
          field("voicemail", "Voicemail box", "select"),
          field("outOfHours", "Outside-hours destination", "select"),
        ],
      },
    ],
    "Save routing",
    { secondary: { label: "Back to queue", href: "/app/queues/all" } },
  ),
  "/app/ivr/new": form(
    "Create an IVR entry point: the number it answers, the greeting callers hear, and the menu they navigate.",
    [
      {
        title: "Entry point",
        fields: [
          field("name", "IVR name", "text", { required: true, full: true }),
          field("number", "Inbound number", "select"),
          field("greeting", "Greeting prompt", "select"),
          field("language", "Language", "select"),
          field("timeout", "Input timeout (seconds)", "number", { placeholder: "5" }),
          field("attempts", "Max attempts", "number", { placeholder: "3" }),
        ],
      },
      {
        title: "Default handling",
        fields: [
          field("invalid", "Invalid input destination", "select", { full: true }),
          field("timeoutDestination", "No input destination", "select", { full: true }),
          field("description", "Internal notes", "textarea", { full: true }),
        ],
      },
    ],
    "Create IVR",
    { secondary: { label: "Open builder", href: "/app/ivr/builder" } },
  ),
  "/app/ivr/[id]/edit": form(
    "Update this IVR's entry point, greeting and fallback destinations. Menu options live in the flow builder.",
    [
      {
        title: "Entry point",
        fields: [
          field("name", "IVR name", "text", { required: true, full: true }),
          field("number", "Inbound number", "select"),
          field("greeting", "Greeting prompt", "select"),
          field("language", "Language", "select"),
          field("timeout", "Input timeout (seconds)", "number"),
          field("attempts", "Max attempts", "number"),
        ],
      },
      {
        title: "Default handling",
        fields: [
          field("invalid", "Invalid input destination", "select", { full: true }),
          field("timeoutDestination", "No input destination", "select", { full: true }),
          field("description", "Internal notes", "textarea", { full: true }),
        ],
      },
    ],
    "Save changes",
    { secondary: { label: "Open builder", href: "/app/ivr/builder" } },
  ),
  "/app/crm/contacts/new": form(
    "Add a person to the CRM. Company and owner are optional, but they make reporting and assignment useful.",
    [
      { title: "Contact", fields: contactFields },
      {
        title: "Communication",
        description: "Only add numbers and addresses the customer has agreed to be contacted on.",
        fields: [
          field("preferredChannel", "Preferred channel", "select", {
            options: ["Call", "Email", "SMS", "WhatsApp"],
          }),
          field("consent", "Contact consent", "select", { options: ["Granted", "Not recorded", "Withdrawn"] }),
        ],
      },
    ],
    "Create contact",
    { secondary: { label: "All contacts", href: "/app/crm/contacts" } },
  ),
  "/app/crm/contacts/[id]/edit": form(
    "Update this contact's details, owner, tags and communication preferences.",
    [
      { title: "Contact", fields: contactFields },
      {
        title: "Communication",
        fields: [
          field("preferredChannel", "Preferred channel", "select", {
            options: ["Call", "Email", "SMS", "WhatsApp"],
          }),
          field("consent", "Contact consent", "select", { options: ["Granted", "Not recorded", "Withdrawn"] }),
        ],
      },
    ],
    "Save contact",
    { secondary: { label: "All contacts", href: "/app/crm/contacts" } },
  ),
  "/app/crm/contacts/import": form(
    "Upload a CSV of contacts. The import runs as a background job and reports row-level errors without inventing records.",
    [
      {
        title: "File",
        fields: [
          field("file", "CSV file", "file", { required: true, full: true, hint: "UTF-8 CSV, up to 20 MB." }),
          field("owner", "Assign owner", "text", { full: true }),
          field("tags", "Tags for imported contacts", "text", { full: true }),
        ],
      },
      {
        title: "Duplicates",
        fields: [
          field("duplicates", "When a match is found", "select", {
            options: ["Skip the row", "Update the existing contact", "Create anyway"],
            full: true,
          }),
        ],
      },
    ],
    "Start import",
    {
      secondary: { label: "Export instead", href: "/app/crm/contacts/export" },
      action: { label: "All contacts", href: "/app/crm/contacts" },
    },
  ),
  "/app/crm/contacts/export": form(
    "Choose the contacts to export and the file format. The job runs server-side and appears in Export history.",
    [
      {
        title: "Scope",
        fields: [
          field("segment", "Segment", "select"),
          field("owner", "Owner", "select"),
          field("dateRange", "Updated", "select", {
            options: ["All time", "Last 7 days", "Last 30 days", "This year"],
          }),
        ],
      },
      {
        title: "File",
        fields: [
          field("format", "Format", "select", { options: ["CSV", "XLSX"] }),
          field("columns", "Columns", "select", {
            options: ["Standard", "All contact fields"],
            full: true,
          }),
        ],
      },
    ],
    "Start export",
    { secondary: { label: "Export history", href: "/app/reports/exports" } },
  ),
  "/app/crm/companies/new": form(
    "Add an organisation so contacts, deals and tickets can be grouped under one account.",
    [{ title: "Company", fields: companyFields }],
    "Create company",
    { secondary: { label: "All companies", href: "/app/crm/companies" } },
  ),
  "/app/crm/companies/[id]/edit": form(
    "Update this company's profile, owner and address.",
    [{ title: "Company", fields: companyFields }],
    "Save company",
    { secondary: { label: "All companies", href: "/app/crm/companies" } },
  ),
  "/app/crm/leads/new": form(
    "Capture an enquiry before it becomes a contact or deal. Source and owner decide who follows up.",
    [
      { title: "Lead", fields: leadFields },
      {
        title: "Follow-up",
        fields: [
          field("priority", "Priority", "select", { options: ["Low", "Normal", "High"] }),
          field("nextStep", "Next step", "date"),
        ],
      },
    ],
    "Create lead",
    { secondary: { label: "All leads", href: "/app/crm/leads/all" } },
  ),
  "/app/crm/leads/[id]/edit": form(
    "Update this lead's details, score, source and owner.",
    [{ title: "Lead", fields: leadFields }],
    "Save lead",
    { secondary: { label: "All leads", href: "/app/crm/leads/all" } },
  ),
  "/app/crm/leads/[id]/convert": form(
    "Turn this qualified lead into a contact and an optional deal. The conversion is one transaction in the API.",
    [
      {
        title: "Contact",
        fields: [
          field("firstName", "First name", "text", { required: true }),
          field("lastName", "Last name", "text", { required: true }),
          field("email", "Email", "email"),
          field("phone", "Phone", "tel"),
          field("company", "Company", "select"),
        ],
      },
      {
        title: "Deal",
        description: "Leave the deal name blank to convert the lead without creating an opportunity.",
        fields: [
          field("dealName", "Deal name", "text", { full: true }),
          field("value", "Value", "number"),
          field("pipeline", "Pipeline", "select"),
          field("owner", "Owner", "select"),
        ],
      },
    ],
    "Convert lead",
    { secondary: { label: "All leads", href: "/app/crm/leads/all" } },
  ),
  "/app/sales/deals/new": form(
    "Create an opportunity with its value, owner and expected close date.",
    [
      { title: "Deal", fields: dealFields },
      {
        title: "Stage",
        description: "Leave the stage empty to start at the first stage of the chosen pipeline.",
        fields: [
          field("probability", "Probability (%)", "number"),
          field("nextStep", "Next step", "date"),
        ],
      },
    ],
    "Create deal",
    { secondary: { label: "Pipeline", href: "/app/sales/pipeline" } },
  ),
  "/app/sales/deals/[id]/edit": form(
    "Update this deal's value, stage, owner and close date.",
    [{ title: "Deal", fields: dealFields }],
    "Save deal",
    { secondary: { label: "All deals", href: "/app/sales/deals" } },
  ),
  "/app/work/activities/new": form(
    "Log a call, meeting, note or follow-up and link it to the contact, company or deal it belongs to.",
    [
      {
        title: "Activity",
        fields: [
          field("type", "Type", "select", {
            options: ["Call", "Meeting", "Note", "Follow-up", "Task"],
            required: true,
          }),
          field("subject", "Subject", "text", { required: true, full: true }),
          field("relatedTo", "Related to", "select"),
          field("owner", "Owner", "select"),
          field("dueDate", "Due date", "date"),
          field("dueTime", "Due time", "time"),
        ],
      },
      {
        title: "Details",
        fields: [
          field("outcome", "Outcome", "select", {
            options: ["Completed", "No answer", "Left voicemail", "Rescheduled"],
          }),
          field("notes", "Notes", "textarea", { full: true }),
        ],
      },
    ],
    "Save activity",
    { secondary: { label: "All activities", href: "/app/work/activities/all" } },
  ),
  "/app/support/tickets/new": form(
    "Open a support ticket with the contact, priority, category and the customer's description of the issue.",
    [{ title: "Ticket", fields: ticketFields }],
    "Create ticket",
    { secondary: { label: "All tickets", href: "/app/support/tickets" } },
  ),
  "/app/support/tickets/[id]/edit": form(
    "Update this ticket's priority, category and assignee. Status changes are recorded in the activity log.",
    [{ title: "Ticket", fields: ticketFields }],
    "Save ticket",
    { secondary: { label: "All tickets", href: "/app/support/tickets" } },
  ),
  "/app/campaigns/new": form(
    "Create an outbound campaign and attach the list, script and agents it will use.",
    [{ title: "Campaign", fields: campaignFields }],
    "Create campaign",
    { secondary: { label: "All campaigns", href: "/app/campaigns/all" } },
  ),
  "/app/campaigns/[id]/edit": form(
    "Update this campaign's name, list, script and assigned agents.",
    [{ title: "Campaign", fields: campaignFields }],
    "Save campaign",
    { secondary: { label: "All campaigns", href: "/app/campaigns/all" } },
  ),
  "/app/campaigns/[id]/schedule": form(
    "Set when this campaign may dial: date range, daily window, timezone and retry behaviour.",
    [
      {
        title: "Window",
        fields: [
          field("startDate", "Start date", "date", { required: true }),
          field("endDate", "End date", "date"),
          field("from", "Daily start", "time", { required: true }),
          field("to", "Daily end", "time", { required: true }),
          field("timezone", "Timezone", "select", { full: true }),
        ],
      },
      {
        title: "Attempts",
        fields: [
          field("retry", "Retry delay (minutes)", "number"),
          field("maxAttempts", "Max attempts", "number"),
          field("weekend", "Weekend dialing", "select", { options: ["Off", "On"] }),
        ],
      },
    ],
    "Save schedule",
    { secondary: { label: "All campaigns", href: "/app/campaigns/all" } },
  ),
  "/app/campaigns/[id]/scripts": form(
    "Write the opening, qualifying questions and objection handling agents see during a campaign call.",
    [
      {
        title: "Opening",
        fields: [field("opening", "Opening script", "textarea", { full: true, required: true })],
      },
      {
        title: "Qualifying questions",
        fields: [field("questions", "Questions", "textarea", { full: true })],
      },
      {
        title: "Objections",
        fields: [field("objections", "Handling notes", "textarea", { full: true })],
      },
    ],
    "Save script",
    { secondary: { label: "All campaigns", href: "/app/campaigns/all" } },
  ),
  "/app/agents/new": form(
    "Add an agent, assign their role and team, and connect the extension they will use for calls.",
    [
      { title: "Agent", fields: agentFields },
      {
        title: "Access",
        fields: [
          field("access", "Workspace access", "select", {
            options: ["Agent workspace only", "Supervisor", "Full admin"],
            full: true,
          }),
        ],
      },
    ],
    "Create agent",
    { secondary: { label: "All agents", href: "/app/agents/all" } },
  ),
  "/app/agents/[id]/edit": form(
    "Update this agent's role, team, queue and extension assignment.",
    [{ title: "Agent", fields: agentFields }],
    "Save agent",
    { secondary: { label: "All agents", href: "/app/agents/all" } },
  ),
  "/app/teams/new": form(
    "Create a team so agents can be grouped for routing, scheduling and reporting.",
    [{ title: "Team", fields: teamFields }],
    "Create team",
    { secondary: { label: "All teams", href: "/app/teams/all" } },
  ),
  "/app/teams/[id]/edit": form(
    "Update this team's lead, queues and description.",
    [{ title: "Team", fields: teamFields }],
    "Save team",
    { secondary: { label: "All teams", href: "/app/teams/all" } },
  ),
  "/app/qa/forms/new": form(
    "Build an evaluation form with weighted sections. Supervisors use it to score recorded calls consistently.",
    [
      {
        title: "Form",
        fields: [
          field("name", "Form name", "text", { required: true, full: true }),
          field("description", "Description", "textarea", { full: true }),
        ],
      },
      {
        title: "Scoring",
        fields: [
          field("scale", "Score scale", "select", { options: ["1–5", "1–10", "Yes / No / N/A"] }),
          field("passScore", "Passing score", "number"),
          field("critical", "Critical questions required", "select", { options: ["Yes", "No"] }),
        ],
      },
      {
        title: "Questions",
        fields: [
          field("questions", "Sections and questions", "textarea", {
            full: true,
            hint: "One per line. Use a heading line ending with a colon to start a section.",
          }),
        ],
      },
    ],
    "Create form",
    { secondary: { label: "All forms", href: "/app/qa/forms" } },
  ),
  "/app/qa/forms/[id]/edit": form(
    "Update this evaluation form's questions, weights and passing score. Existing evaluations keep their version.",
    [
      {
        title: "Form",
        fields: [
          field("name", "Form name", "text", { required: true, full: true }),
          field("description", "Description", "textarea", { full: true }),
        ],
      },
      {
        title: "Scoring",
        fields: [
          field("scale", "Score scale", "select", { options: ["1–5", "1–10", "Yes / No / N/A"] }),
          field("passScore", "Passing score", "number"),
        ],
      },
      {
        title: "Questions",
        fields: [
          field("questions", "Sections and questions", "textarea", { full: true }),
        ],
      },
    ],
    "Save form",
    { secondary: { label: "All forms", href: "/app/qa/forms" } },
  ),
  "/app/pbx/sip-trunks/new": form(
    "Register a carrier trunk. The API writes PJSIP configuration and reloads Asterisk.",
    [{ title: "Trunk", fields: trunkFields }],
    "Create trunk",
    { secondary: { label: "All trunks", href: "/app/pbx/sip-trunks" } },
  ),
  "/app/pbx/sip-trunks/[id]/edit": form(
    "Update this trunk's host, credentials and channel limits, then reload Asterisk.",
    [{ title: "Trunk", fields: trunkFields }],
    "Save trunk",
    { secondary: { label: "All trunks", href: "/app/pbx/sip-trunks" } },
  ),
  "/app/pbx/extensions/new": form(
    "Provision a SIP extension for an agent's browser or desk phone.",
    [{ title: "Extension", fields: extensionFields }],
    "Create extension",
    { secondary: { label: "All extensions", href: "/app/pbx/extensions" } },
  ),
  "/app/pbx/extensions/[id]/edit": form(
    "Update this extension's assignment, device type and caller ID.",
    [{ title: "Extension", fields: extensionFields }],
    "Save extension",
    { secondary: { label: "All extensions", href: "/app/pbx/extensions" } },
  ),
  "/app/access/users/new": form(
    "Invite a teammate and assign the role that decides which pages and actions they can use.",
    [
      { title: "User", fields: userFields },
      {
        title: "Permissions",
        description: "Roles are checked by the API guard as well as hidden in the interface.",
        fields: [
          field("department", "Department", "select"),
          field("dataScope", "Data scope", "select", {
            options: ["Own records", "Team records", "Whole organisation"],
            full: true,
          }),
        ],
      },
    ],
    "Send invitation",
    { secondary: { label: "All users", href: "/app/access/users" } },
  ),
  "/app/access/users/[id]/edit": form(
    "Update this user's role, team and data scope.",
    [{ title: "User", fields: userFields }],
    "Save user",
    { secondary: { label: "All users", href: "/app/access/users" } },
  ),
  "/app/access/roles/new": form(
    "Create a role bundling page and action permissions. Start narrow; permissions can be widened later.",
    [{ title: "Role", fields: roleFields }],
    "Create role",
    { secondary: { label: "All roles", href: "/app/access/roles" } },
  ),
  "/app/access/roles/[id]/edit": form(
    "Update this role's name, data scope and page access.",
    [{ title: "Role", fields: roleFields }],
    "Save role",
    { secondary: { label: "All roles", href: "/app/access/roles" } },
  ),
  "/app/developer/api-keys/new": form(
    "Issue a key for a server-to-server integration. The secret is shown once and stored hashed.",
    [
      {
        title: "Key",
        fields: [
          field("name", "Key name", "text", { required: true, full: true }),
          field("environment", "Environment", "select", { options: ["Live", "Test"] }),
          field("scopes", "Scopes", "text", { full: true, hint: "Comma-separated permission strings." }),
          field("expires", "Expiry", "date"),
        ],
      },
      {
        title: "Restrictions",
        fields: [
          field("allowedIps", "Allowed IPs", "textarea", { full: true, hint: "Leave blank to allow any origin." }),
        ],
      },
    ],
    "Create key",
    { secondary: { label: "API docs", href: "/app/developer/docs" } },
  ),
  "/app/me/edit": form(
    "Update the personal details shown across the workspace. Changes are kept in this browser session until the account service is connected.",
    [
      {
        title: "Personal details",
        fields: [
          field("fullName", "Full name", "text", { required: true }),
          field("email", "Email", "email", { required: true }),
          field("jobTitle", "Job title"),
          field("phone", "Phone", "tel"),
        ],
      },
    ],
    "Save changes",
    { secondary: { label: "Back to profile", href: "/app/me" } },
  ),
  "/app/me/password": form(
    "Passwords are hashed with Argon2id by the account service. This form activates when that service is connected.",
    [
      {
        title: "Change password",
        fields: [
          field("current", "Current password", "text", { required: true, full: true }),
          field("next", "New password", "text", { required: true }),
          field("confirm", "Confirm new password", "text", { required: true }),
        ],
      },
    ],
    "Update password",
    { secondary: { label: "Back to profile", href: "/app/me" } },
  ),
};
