import type { SettingRow, SettingsScreen } from "./types";

function set(
  lede: string,
  sections: SettingsScreen["sections"],
  extra: Partial<SettingsScreen> = {},
): SettingsScreen {
  return { template: "SET", lede, sections, ...extra };
}

const toggle = (label: string, description: string, enabled = false): SettingRow => ({
  label,
  description,
  control: "switch",
  enabled,
});

const select = (
  label: string,
  description: string,
  value: string,
  options: string[],
): SettingRow => ({ label, description, control: "select", value, options });

const text = (label: string, description: string, value = ""): SettingRow => ({
  label,
  description,
  control: "text",
  value,
});

const link = (label: string, description: string, href: string): SettingRow => ({
  label,
  description,
  control: "link",
  href,
});

export const settingsScreens: Record<string, SettingsScreen> = {
  "/app/ivr/business-hours": set(
    "When queues and IVR flows accept calls, and what callers hear outside those hours.",
    [
      {
        title: "Weekly hours",
        description: "Callers outside these hours follow the after-hours route on each flow.",
        rows: [
          text("Monday to Friday", "Open hours", "09:00 – 17:00"),
          text("Saturday", "Open hours", "09:00 – 13:00"),
          text("Sunday", "Open hours", "Closed"),
        ],
      },
      {
        title: "Holidays",
        description: "Holiday dates reuse the after-hours route unless a flow overrides it.",
        rows: [
          link("Holiday calendar", "Add and review closed dates", "/app/ivr/holidays"),
          toggle("Observe public holidays", "Close on published public holidays", true),
        ],
      },
    ],
    { secondary: { label: "IVR flows", href: "/app/ivr" } },
  ),
  "/app/crm/leads/sources": set(
    "Where leads come from and which sources stay active for capture.",
    [
      {
        title: "Capture sources",
        description: "Deactivating a source stops new leads from being tagged with it.",
        rows: [
          toggle("Inbound call", "Created from a call disposition", true),
          toggle("Web form", "Created from an embedded form", true),
          toggle("Import", "Created by a CSV import", true),
          toggle("Referral", "Created manually as a referral", true),
        ],
      },
      {
        title: "Defaults",
        rows: [
          select("Default source", "Applied when a lead arrives without one", "Web form", [
            "Inbound call",
            "Web form",
            "Import",
            "Referral",
            "Manual",
          ]),
        ],
      },
    ],
    { secondary: { label: "Leads", href: "/app/crm/leads" } },
  ),
  "/app/crm/leads/assignment": set(
    "How new leads are routed to owners, and who receives them when nobody is available.",
    [
      {
        title: "Assignment",
        rows: [
          select("Strategy", "How a new lead picks an owner", "Round robin", [
            "Round robin",
            "Load balanced",
            "Manual",
          ]),
          text("Fallback owner", "Receives leads when the strategy finds nobody", ""),
          toggle("Notify owner", "Send a notification when a lead is assigned", true),
        ],
      },
      {
        title: "Rules",
        rows: [
          toggle("Reassign on absence", "Route around owners who are offline", false),
          select("Reassignment window", "How long an owner has before reassignment", "4 hours", [
            "1 hour",
            "4 hours",
            "1 day",
          ]),
        ],
      },
    ],
    { secondary: { label: "Lead sources", href: "/app/crm/leads/sources" } },
  ),
  "/app/sales/pipelines": set(
    "The pipelines deals move through and which one new deals start in.",
    [
      {
        title: "Pipelines",
        rows: [
          link("Sales pipeline", "Stages, probabilities and rotting rules", "/app/sales/pipeline"),
          select("Default pipeline", "Used for new deals", "Sales", ["Sales"]),
        ],
      },
      {
        title: "Behaviour",
        rows: [
          toggle("Require a lost reason", "Ask why when a deal is marked lost", true),
          toggle("Notify on stage change", "Alert the owner when a deal moves", true),
        ],
      },
    ],
    { secondary: { label: "Deals", href: "/app/sales/deals" } },
  ),
  "/app/support/assignment": set(
    "How tickets are routed to teams and agents, and the limits that keep queues fair.",
    [
      {
        title: "Routing",
        rows: [
          select("Strategy", "How a new ticket picks an assignee", "Round robin", [
            "Round robin",
            "Load balanced",
            "Manual",
          ]),
          toggle("Auto-assign by category", "Use category ownership before the strategy", true),
          text("Open ticket limit", "Maximum open tickets per agent", "15"),
        ],
      },
      {
        title: "Escalation",
        rows: [
          toggle("Escalate on SLA breach", "Move breaching tickets to the team lead", true),
          select("Reassign after", "Idle time before a ticket is reassigned", "2 hours", [
            "1 hour",
            "2 hours",
            "1 day",
          ]),
        ],
      },
    ],
    { secondary: { label: "Ticket categories", href: "/app/support/categories" } },
  ),
  "/app/support/categories": set(
    "Ticket categories used for routing, reporting and knowledge base grouping.",
    [
      {
        title: "Categories",
        description: "Categories are stored with the support module and can own a default team.",
        rows: [
          toggle("Billing", "Payments, invoices and plan changes", true),
          toggle("Technical", "Product faults and configuration", true),
          toggle("Account", "Access, users and permissions", true),
          toggle("General", "Anything that does not fit another category", true),
        ],
      },
      {
        title: "Defaults",
        rows: [
          select("Fallback category", "Applied when a ticket arrives uncategorised", "General", [
            "Billing",
            "Technical",
            "Account",
            "General",
          ]),
          toggle("Require a category", "Block submission without one", false),
        ],
      },
    ],
    { secondary: { label: "Tickets", href: "/app/support/tickets" } },
  ),
  "/app/support/priorities": set(
    "Priority levels, their response targets and which level escalates automatically.",
    [
      {
        title: "Levels",
        rows: [
          select("Urgent", "First response target", "15 minutes", ["15 minutes", "30 minutes", "1 hour"]),
          select("High", "First response target", "1 hour", ["30 minutes", "1 hour", "2 hours"]),
          select("Normal", "First response target", "4 hours", ["2 hours", "4 hours", "8 hours"]),
          select("Low", "First response target", "1 day", ["8 hours", "1 day", "2 days"]),
        ],
      },
      {
        title: "Escalation",
        rows: [
          toggle("Escalate urgent tickets", "Notify the team lead on creation", true),
          toggle("Allow priority overrides", "Let agents change priority after creation", true),
        ],
      },
    ],
    { secondary: { label: "SLA management", href: "/app/support/sla" } },
  ),
  "/app/support/sla": set(
    "Response and resolution commitments for tickets, and what happens when one is missed.",
    [
      {
        title: "Targets",
        rows: [
          text("First response", "Time to first reply", "4 hours"),
          text("Resolution", "Time to close", "2 business days"),
          toggle("Use business hours", "Pause the clock outside opening hours", true),
        ],
      },
      {
        title: "Breaches",
        rows: [
          toggle("Notify on breach", "Email the team lead when a target is missed", true),
          select("Escalation owner", "Who receives breach alerts", "Team lead", [
            "Team lead",
            "Support manager",
            "Organisation admin",
          ]),
        ],
      },
    ],
    { secondary: { label: "SLA reports", href: "/app/reports/sla" } },
  ),
  "/app/agents/[id]/extensions": set(
    "Which SIP extensions this agent may register and how calls reach them.",
    [
      {
        title: "Extension",
        rows: [
          text("Primary extension", "Assigned SIP endpoint", ""),
          toggle("WebRTC enabled", "Allow browser registration for this agent", true),
          toggle("Voicemail enabled", "Send unanswered calls to voicemail", true),
        ],
      },
      {
        title: "Device behaviour",
        rows: [
          select("Ring strategy", "How simultaneous devices are tried", "All at once", [
            "All at once",
            "Sequential",
          ]),
          text("Ring timeout", "Seconds before the next step", "20"),
        ],
      },
    ],
    {
      secondary: { label: "PBX extensions", href: "/app/pbx/extensions" },
      action: { label: "Agent details", href: "/app/agents" },
    },
  ),
  "/app/teams/breaks": set(
    "Break types the floor can use, their length and limits on how many agents leave at once.",
    [
      {
        title: "Break types",
        rows: [
          text("Lunch", "Minutes", "30"),
          text("Short break", "Minutes", "10"),
          text("Coaching", "Minutes", "15"),
        ],
      },
      {
        title: "Limits",
        rows: [
          toggle("Limit concurrent breaks", "Cap how many agents leave a queue at once", true),
          text("Maximum concurrent", "Agents per break type", "2"),
          toggle("Require approval", "A team lead approves long breaks", false),
        ],
      },
    ],
    { secondary: { label: "Shift scheduling", href: "/app/teams/schedule" } },
  ),
  "/app/pbx/asterisk": set(
    "Connection details for the Asterisk host that carries calls, and how configuration is reloaded.",
    [
      {
        title: "ARI connection",
        description: "The API connects to Asterisk over ARI. Use a dedicated Stasis user with limited scope.",
        rows: [
          text("ARI endpoint", "WebSocket base URL", ""),
          text("ARI user", "Dedicated Stasis user", ""),
          text("Stasis application", "Application name", ""),
        ],
      },
      {
        title: "Reload behaviour",
        rows: [
          toggle("Reload PJSIP automatically", "Apply extension and trunk changes on save", true),
          toggle("Reload dialplan automatically", "Apply routing changes on save", true),
          link("PBX system status", "Channel counts, uptime and last reload", "/app/pbx/status"),
        ],
      },
    ],
    { secondary: { label: "SIP trunks", href: "/app/pbx/sip-trunks" } },
  ),
  "/app/access/permissions": set(
    "How permissions are enforced across the API and the workspace, and the default role for new members.",
    [
      {
        title: "Enforcement",
        rows: [
          toggle("Strict permission checks", "Deny any action not granted to the role", true),
          toggle("Audit privileged actions", "Write an audit entry for every admin mutation", true),
          select("Default role", "Assigned to invited members", "Agent", ["Admin", "Supervisor", "Agent"]),
        ],
      },
      {
        title: "Matrix",
        description: "Page and action grants are edited per role, not globally.",
        rows: [
          link("Roles management", "Create roles and grant page access", "/app/access/roles"),
          link("Users", "Assign roles to members", "/app/access/users"),
        ],
      },
    ],
    { secondary: { label: "Audit logs", href: "/app/access/audit-logs" } },
  ),
  "/app/org/profile": set(
    "The legal identity of this organisation, used on invoices and outbound communication.",
    [
      {
        title: "Identity",
        rows: [
          text("Legal name", "Registered organisation name", ""),
          text("Trading name", "Shown in the workspace", ""),
          text("Registration number", "Company or business registration", ""),
          text("Tax identifier", "Used on invoices", ""),
        ],
      },
      {
        title: "Contact",
        rows: [
          text("Contact email", "Billing and administrative contact", ""),
          text("Phone", "Main organisation number", ""),
          text("Address", "Registered address", ""),
        ],
      },
    ],
    { secondary: { label: "Organisation settings", href: "/app/org/settings" } },
  ),
  "/app/org/settings": set(
    "Regional defaults applied across the workspace, including how dates and numbers are displayed.",
    [
      {
        title: "Regional",
        rows: [
          select("Time zone", "Used for reports and business hours", "Africa/Lusaka", [
            "Africa/Lusaka",
            "Africa/Harare",
            "Africa/Johannesburg",
            "UTC",
          ]),
          select("Currency", "Used for deal and invoice values", "ZMW", ["ZMW", "USD", "ZAR"]),
          select("Week starts on", "Calendar and report grouping", "Monday", ["Monday", "Sunday"]),
          select("Date format", "Display format", "DD MMM YYYY", ["DD MMM YYYY", "YYYY-MM-DD"]),
        ],
      },
      {
        title: "Workspace",
        rows: [
          toggle("Show recorded calls to supervisors", "Allow playback from call details", true),
          toggle("Require dispositions", "Block wrap-up until a disposition is saved", true),
        ],
      },
    ],
    { secondary: { label: "Preferences", href: "/app/org/preferences" } },
  ),
  "/app/org/preferences": set(
    "Organisation-wide defaults for the workspace and the floor.",
    [
      {
        title: "Defaults",
        rows: [
          select("Landing page", "Where members start after sign-in", "Dashboard", [
            "Dashboard",
            "Call history",
            "My tasks",
          ]),
          select("Table density", "Default row height", "Comfortable", [
            "Comfortable",
            "Compact",
          ]),
          toggle("Show live caller details", "Screen pop on inbound calls", true),
        ],
      },
      {
        title: "Notifications",
        rows: [
          toggle("Daily digest", "Send a morning summary to supervisors", false),
          select("Digest time", "When the summary is sent", "08:00", ["07:00", "08:00", "09:00"]),
        ],
      },
    ],
    { secondary: { label: "Organisation settings", href: "/app/org/settings" } },
  ),
  "/app/org/subscription": set(
    "The plan this organisation runs on, its seats and renewal terms.",
    [
      {
        title: "Plan",
        rows: [
          select("Plan", "Current subscription", "Growth", ["Starter", "Growth", "Scale"]),
          select("Billing cycle", "How often the plan renews", "Monthly", ["Monthly", "Annual"]),
          text("Seats", "Billable member seats", ""),
          toggle("Auto-renew", "Renew at the end of the cycle", true),
        ],
      },
      {
        title: "Billing",
        rows: [
          link("Billing history", "Invoices and receipts", "/app/org/billing"),
          link("Usage and limits", "Seats, storage and API traffic", "/app/org/usage"),
        ],
      },
    ],
    { secondary: { label: "Usage", href: "/app/org/usage" } },
  ),
  "/app/developer/settings": set(
    "Defaults for API clients and webhooks created by this organisation.",
    [
      {
        title: "API",
        rows: [
          select("API version", "Pinned version for new keys", "v1", ["v1"]),
          select("Rate limit tier", "Requests per minute per key", "Standard", [
            "Standard",
            "Elevated",
          ]),
          link("API keys", "Create and revoke keys", "/app/developer/api-keys"),
        ],
      },
      {
        title: "Webhooks",
        rows: [
          text("Retry window", "How long failed deliveries are retried", "24 hours"),
          toggle("Sign payloads", "Include a signature header for verification", true),
          link("Webhook logs", "Delivery attempts and responses", "/app/developer/webhooks/logs"),
        ],
      },
    ],
    { secondary: { label: "API documentation", href: "/app/developer/docs" } },
  ),
  "/app/notifications/settings": set(
    "Which events notify your team and through which channels.",
    [
      {
        title: "Channels",
        rows: [
          toggle("Email", "Deliver to member inboxes", true),
          toggle("SMS", "Deliver to verified numbers", false),
          toggle("In-app", "Show in the notification centre", true),
        ],
      },
      {
        title: "Events",
        rows: [
          toggle("Missed calls", "When a call is not answered", true),
          toggle("SLA breaches", "When a ticket passes its target", true),
          toggle("Campaign completion", "When a campaign finishes dialing", false),
          toggle("Failed webhooks", "When deliveries fail repeatedly", true),
        ],
      },
    ],
    { secondary: { label: "Email templates", href: "/app/notifications/email-templates" } },
  ),
  "/app/system/security": set(
    "Account security policy for the workspace, including sessions, passwords and two-factor enforcement.",
    [
      {
        title: "Sessions",
        rows: [
          select("Session lifetime", "Before re-authentication", "8 hours", [
            "1 hour",
            "8 hours",
            "24 hours",
          ]),
          toggle("Rotate refresh tokens", "Invalidate the previous token on refresh", true),
          link("Active sessions", "Review and revoke sign-ins", "/app/access/sessions"),
        ],
      },
      {
        title: "Authentication",
        rows: [
          select("Password policy", "Minimum strength", "12 characters, mixed case", [
            "10 characters",
            "12 characters, mixed case",
            "16 characters",
          ]),
          toggle("Require two-factor", "All members must enrol before access", false),
          select("Failed login lockout", "Attempts before a temporary lock", "5 attempts", [
            "3 attempts",
            "5 attempts",
            "10 attempts",
          ]),
        ],
      },
    ],
    { secondary: { label: "Audit logs", href: "/app/access/audit-logs" } },
  ),
  "/app/system/retention": set(
    "How long call, message and audit data is kept before deletion.",
    [
      {
        title: "Call data",
        rows: [
          select("Recordings", "Retention after the call", "90 days", [
            "30 days",
            "90 days",
            "1 year",
            "Keep",
          ]),
          select("Voicemail", "Retention after receipt", "90 days", [
            "30 days",
            "90 days",
            "1 year",
            "Keep",
          ]),
          select("Call metadata", "CDR and dispositions", "1 year", ["90 days", "1 year", "Keep"]),
        ],
      },
      {
        title: "System data",
        rows: [
          select("Audit logs", "Privileged action history", "1 year", ["90 days", "1 year", "Keep"]),
          select("Report exports", "Generated files", "30 days", ["7 days", "30 days", "90 days"]),
          toggle("Delete on expiry", "Remove expired objects automatically", true),
        ],
      },
    ],
    { secondary: { label: "Storage management", href: "/app/system/storage" } },
  ),
  "/app/system/config": set(
    "Platform-level configuration for this deployment.",
    [
      {
        title: "Service endpoints",
        rows: [
          text("API base URL", "Where the workspace sends requests", ""),
          text("WebSocket URL", "Realtime gateway for calls and status", ""),
          select("Log level", "Retained in system logs", "Info", ["Debug", "Info", "Warn", "Error"]),
        ],
      },
      {
        title: "Operation",
        rows: [
          toggle("Maintenance mode", "Block workspace access except admins", false),
          toggle("Send telemetry", "Share anonymous performance metrics", false),
          link("Background jobs", "Inspect the worker queue", "/app/system/jobs"),
        ],
      },
    ],
    { secondary: { label: "System health", href: "/app/system/health" } },
  ),
  "/app/me": set(
    "Your account details, sign-in security and workspace preferences.",
    [
      {
        title: "Account",
        rows: [
          link("Edit profile", "Name, job title and contact details", "/app/me/edit"),
          link("Change password", "Update your sign-in password", "/app/me/password"),
          link("Two-factor authentication", "Add a second factor", "/app/me/2fa"),
        ],
      },
      {
        title: "Preferences",
        rows: [
          link("Preferences", "Language, time zone and start page", "/app/me/preferences"),
          link("Appearance", "Theme and density", "/app/me/appearance"),
          link("My notifications", "Channels and events", "/app/me/notifications"),
        ],
      },
    ],
  ),
  "/app/me/2fa": set(
    "Add a second factor to your account. Enrolment requires the account service to be connected.",
    [
      {
        title: "Second factor",
        rows: [
          toggle("Require a second factor at sign-in", "Applies to this account", false),
          select("Method", "How the second factor is delivered", "Authenticator app", [
            "Authenticator app",
            "SMS",
          ]),
        ],
      },
      {
        title: "Recovery",
        rows: [
          text("Recovery codes", "Generated at enrolment and shown once", "—"),
          link("Trusted devices", "Devices that skip the second step", "/app/me/devices"),
          link("Active sessions", "Review current sign-ins", "/app/me/sessions"),
        ],
      },
    ],
    { secondary: { label: "Security settings", href: "/app/system/security" } },
  ),
  "/app/me/preferences": set(
    "Personal workspace defaults. These apply only to your account.",
    [
      {
        title: "Display",
        rows: [
          select("Language", "Interface language", "English", ["English"]),
          select("Time zone", "Matches your working day", "Africa/Lusaka", [
            "Africa/Lusaka",
            "Africa/Harare",
            "Africa/Johannesburg",
            "UTC",
          ]),
          select("Start page", "First screen after sign-in", "Dashboard", [
            "Dashboard",
            "Call history",
            "My tasks",
          ]),
          toggle("Compact tables", "Fit more rows on screen", false),
        ],
      },
      {
        title: "Formats",
        rows: [
          select("Date format", "How dates are shown", "DD MMM YYYY", ["DD MMM YYYY", "YYYY-MM-DD"]),
          select("Time format", "12 or 24 hour clock", "24 hour", ["24 hour", "12 hour"]),
        ],
      },
    ],
    { secondary: { label: "Appearance", href: "/app/me/appearance" } },
  ),
  "/app/me/appearance": set(
    "Theme, accent and motion preferences for your workspace.",
    [
      {
        title: "Theme",
        rows: [
          select("Colour mode", "Light or match the operating system", "System", ["System", "Light"]),
          select("Accent", "Used for primary actions", "Lime", ["Lime", "Forest"]),
          select("Density", "Spacing across tables and forms", "Comfortable", [
            "Comfortable",
            "Compact",
          ]),
        ],
      },
      {
        title: "Motion",
        rows: [
          toggle("Reduce motion", "Minimise transitions and animation", false),
          toggle("Page transitions", "Animate between modules", true),
        ],
      },
    ],
    { secondary: { label: "Language", href: "/app/me/language" } },
  ),
  "/app/me/language": set(
    "Interface language and regional formats for your account.",
    [
      {
        title: "Language",
        rows: [
          select("Interface language", "Menus, labels and messages", "English", ["English"]),
          select("Date format", "How dates are shown", "DD MMM YYYY", ["DD MMM YYYY", "YYYY-MM-DD"]),
          select("Time format", "12 or 24 hour clock", "24 hour", ["24 hour", "12 hour"]),
          select("Week starts on", "Calendar grouping", "Monday", ["Monday", "Sunday"]),
        ],
      },
      {
        title: "Numbers",
        rows: [
          select("Decimal separator", "For values and metrics", "Point (1.234,56)", [
            "Point (1.234,56)",
            "Comma (1,234.56)",
          ]),
        ],
      },
    ],
    { secondary: { label: "Preferences", href: "/app/me/preferences" } },
  ),
  "/app/me/notifications": set(
    "What reaches you and through which channel.",
    [
      {
        title: "Channels",
        rows: [
          toggle("Email", "Send to your account email", true),
          toggle("In-app", "Show in the notification centre", true),
          toggle("SMS", "Send to your verified number", false),
        ],
      },
      {
        title: "Events",
        rows: [
          toggle("Assigned calls and tickets", "When work is assigned to you", true),
          toggle("Missed calls", "When a call is not answered", true),
          toggle("Mentions and notes", "When someone mentions you", true),
          toggle("Daily digest", "A morning summary", false),
        ],
      },
    ],
    { secondary: { label: "Notification settings", href: "/app/notifications/settings" } },
  ),
};
