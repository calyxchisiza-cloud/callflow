# Callflow CRM — Application Build Plan

**Scope:** 222 product pages for the Callflow system started in this repo (sign-up at `/`, marketing at `/landing/`).
**Design:** keep the Verdant/Callflow brand (forest, lime, sage, Manrope + DM Sans) and the PayChangu-grade motion language already implemented.
**Data:** real API data only. No demo rows, fixtures, or fake sign-ins anywhere in the product.
**Backend:** new, owned by this project — NestJS + PostgreSQL + Redis, talking to Asterisk over ARI, browsers over WebRTC. The existing `../callcenterfrontend` and `../callcenter-api` are read-only behaviour references; no code, schema, or endpoint from them is reused.
**Date:** 2026-11-25

---

## 1. What this plan decides

| Decision | Choice |
|---|---|
| Product home | Same repo/system as the landing + sign-up pages |
| Front end | Next.js App Router + TypeScript + Tailwind + Radix primitives |
| Marketing pages | Ported into the same Next app, visuals unchanged |
| Backend | New NestJS API (TypeScript) + PostgreSQL + Redis + BullMQ |
| Telephony | Asterisk controlled via ARI Stasis; WebRTC clients on WSS; TURN for media |
| Reference | studio-admin screens are inspected for behaviour only — no code or endpoints reused |
| Design | Verdant tokens + app shell; light canvas, forest sidebar, lime accents |
| Permission model | RBAC per page, permission-aware nav and route guards |
| First phase | Telephony core (agent workspace → calls → queues) |

The 222 list is a **screen inventory**, not 222 bespoke designs. It resolves to:

- **≈ 150 route files** (create/edit are separate URLs, detail tabs are separate routes).
- **12 screen templates** that carry all 222 pages.
- **≈ 70 thin configs** (list columns, form schemas, dashboard widgets) instead of hand-built screens.

If a page cannot be expressed as a template + config, it is flagged as a **builder** or **monitor** and gets its own component work.

---

## 2. Route map

| Area | Route | Notes |
|---|---|---|
| Sign-up | `/` | Existing page, kept |
| Marketing | `/landing/` | Existing page, kept |
| Login | `/login` | New, mirrors sign-up design |
| Product app | `/app/...` | All 222 pages under one authenticated shell |
| Legacy redirect | `/dashboard/*` → `/app/*` | Only if old links must survive |

Page transitions stay: the lime wipe fires between marketing and the app, and inside the app only on module changes (not every sidebar click) so the product stays fast.

---

## 3. App shell and navigation

222 pages cannot live in a flat sidebar. Use six clusters, each with collapsible sections, plus a command palette (`⌘K`) that indexes every page.

| Cluster | Contains | Pages |
|---|---|---|
| **Home** | All dashboards, live boards, system health | 1–6, 26, 35, 46, 60, 68, 77, 86, 98, 108, 118, 129, 140, 154, 188, 203 |
| **Conversations** | Calls, softphone, recordings/voicemail, callbacks, queues, IVR, ring groups, campaigns | 7–45, 98–107 |
| **Customers** | Contacts, companies, leads, tickets, knowledge base, feedback | 46–67, 86–97 |
| **Revenue** | Sales pipeline, deals, activities, tasks, calendar | 68–85 |
| **People** | Agents, teams, shifts, attendance, QA and coaching | 108–139 |
| **Insights** | Reports, report builder, scheduled reports, exports | 140–153 |
| **Platform** | PBX/SIP/extensions, access control, organisation, integrations, notifications, system, personal settings | 154–222 |

Shell anatomy:

- **Left rail:** 264px forest panel, cluster switcher at top, icon + label sections, active item gets a lime edge and soft glow. Collapses to 72px, and to a bottom sheet under 900px.
- **Top bar:** breadcrumb, global search, live-status pill (agent state), notifications, org switcher, avatar menu.
- **Context bar:** per-module sub-navigation (e.g. Calls → Active / History / Recordings / Voicemail).
- **Global command palette:** jumps to any of the 222 pages, contacts, tickets, calls by number.
- **Agent dock:** persistent softphone strip available on every app page, collapses to a floating call pill during an active call.

---

## 4. Design system (Verdant)

Tokens carried from the marketing site:

- Forest `#203f30`, deep ink `#202923`, lime `#b2e64b`, lime-deep `#82bd35`, sage `#edf2e6`, mist `#f6f7f3`, muted `#778278`.
- Manrope for headings, DM Sans for UI and tables. Tabular numerals for metrics.
- Motion: 120ms micro, 200ms hover, 320ms panel, 650ms page; easing `cubic-bezier(.16,1,.3,1)`.
- Table density: 40px rows, 13px base text, sticky header, zebra-free with hairline dividers.
- Focus rings: 2px lime ring, never removed.

Shared components to build once (Phase 0):

`Button` · `IconButton` · `Input` · `Textarea` · `Select` · `Combobox` · `MultiSelect` · `Checkbox` · `Switch` · `RadioGroup` · `Tabs` · `Panel` · `KpiCard` · `ChartCard` · `DataTable` · `ColumnChooser` · `FilterBar` · `SavedView` · `BulkActionBar` · `Drawer` · `Modal` · `ConfirmDialog` · `Toast` · `Timeline` · `Avatar` · `Badge`/`StatusPill` · `EmptyState` · `PermissionGate` · `PageHeader` · `FormSection` · `Stepper` · `CommandMenu` · `AudioPlayer` · `Keypad` · `WallboardTile` · `OrgSwitcher` · `NotificationMenu`

Rule: a page may only use these components plus its own layout. New visual patterns need sign-off before they multiply.

---

## 5. Screen templates (12)

| Code | Template | Used by | Required states |
|---|---|---|---|
| **DSH** | Dashboard: KPI row, chart grid, recent table | 21 pages | loading, empty (no calls yet), partial widget error, date-range |
| **LST** | List: filter bar, saved views, table, bulk actions, pagination | ≈ 65 pages | loading, empty, filtered-empty, no-permission, error |
| **DTL** | Detail: header, status, tabs, activity, related side rail | ≈ 22 pages | loading, not-found, deleted, permission-limited |
| **FRM** | Create/Edit: sectioned form, sticky save bar, validation | ≈ 40 pages | pristine, dirty, validating, saving, conflict, success |
| **BLD** | Builder: canvas/board (IVR, pipeline, report, dialplan) | 6 pages | empty canvas, drag, save, unsaved warning |
| **MON** | Realtime monitor/wallboard | 7 pages | connecting, live, stale, disconnected |
| **MED** | Media player: recording/voicemail + metadata | 3 pages | loading, buffering, unavailable recording |
| **LOG** | Event log: filter, row expand, detail drawer | 7 pages | live tail, paused, empty |
| **SET** | Settings: grouped sections, per-group save | ≈ 28 pages | read-only role, unsaved, success |
| **CAL** | Calendar/scheduling | 2 pages | empty, conflict, drag |
| **DOC** | Article/document reader | 2 pages | loading, missing article |
| **WRK** | Composite workspace (agent workspace, softphone, dialer) | 3 pages | idle, ringing, active, wrap-up, offline |

Every template ships with its own loading skeleton, empty state, error state, and reduced-motion behavior. The empty state always offers the real next action (e.g. "Provision an extension", "Import contacts"), never dummy rows.

---

## 6. Backend architecture (greenfield)

Everything the app reads or writes comes from the new Callflow API. The 222 pages are therefore also a **backend scope**, not just a UI scope.

### 6.1 Runtime

| Layer | Choice |
|---|---|
| Language / framework | TypeScript, NestJS 11, Node 24 |
| Database | PostgreSQL 16 (Prisma migrations) |
| Cache / pub-sub | Redis 7 |
| Jobs | BullMQ workers in a separate process (imports, exports, campaigns, report snapshots, webhook retries, retention) |
| Realtime | Nest WebSocket gateway (Socket.IO protocol) with Redis adapter |
| Media storage | S3-compatible object storage for recordings, voicemail, imports, exports |
| Telephony | Asterisk 20+, ARI Stasis application, PJSIP, WSS for browser SIP, coturn for TURN |
| Contract | OpenAPI 3.1 generated from controllers, published to the front end; typed client generated from it |

### 6.2 Domain modules

| Module | Owns | Pages |
|---|---|---|
| **Identity & Access** | users, sessions, devices, 2FA, roles, permissions, invitations, audit log | 169–179, 213–216, 221–222 |
| **Organisation** | org profile, settings, departments, members, preferences, subscription, billing, usage | 180–187 |
| **Directory** | agents, extensions, teams, shifts, attendance, breaks | 108–128 |
| **Telephony** | trunks, numbers, extensions, inbound/outbound routes, dialplans, PBX status/events | 154–168 |
| **Calls** | CDR, live channels, recordings, voicemail, callbacks, dispositions, transfers, conferences, notes | 7–25 |
| **Queues** | queues, members, routing rules, live queue state | 26–34 |
| **Flows** | IVR graphs, call flows, ring groups, business hours, holidays | 35–45 |
| **CRM** | contacts, companies, leads, segments, activity timeline | 46–67 |
| **Sales** | pipelines, deals, sales activities, forecast | 68–76 |
| **Work** | activities, tasks, meetings, notes, reminders, calendar | 77–85 |
| **Support** | tickets, categories, priorities, SLA, feedback, knowledge base | 86–97 |
| **Campaigns** | campaigns, contact lists, scheduling, scripts, DNC | 98–107 |
| **QA** | evaluation forms, evaluations, scorecards, coaching, CSAT | 129–139 |
| **Reporting** | report definitions, run history, scheduled reports, exports | 140–153 |
| **Notifications** | in-app centre, email/SMS templates, communication logs | 198–202 |
| **Integrations** | providers, connections, API keys, webhooks, delivery logs | 188–197 |
| **System** | health, jobs, logs, errors, backups, storage, security, retention, config | 203–212 |

Dashboard pages consume read models produced by their owning modules; they do not get their own tables.

### 6.3 API conventions

- REST under `/api/v1`, resource-oriented; aggregates exposed as read endpoints (`/dashboard/*`, `/reports/*`).
- Cursor pagination (`?cursor=&limit=`), stable sort, explicit `total` only when cheap.
- Errors as RFC 7807 problem details with a stable `code` the UI can map to a message.
- Mutations accept `Idempotency-Key`; destructive actions require a confirm token in the body.
- Every list endpoint supports the same filter grammar (`filter[field][op]=value`), so one FilterBar drives all 65 lists.
- OpenAPI is the source of truth; the front end's typed client and MSW-free local development depend on it. No hand-written duplicate types.
- Server-side export jobs for CSV/XLSX; the UI polls job status, never streams huge tables through the browser.

### 6.4 Auth, tenancy, permissions

- httpOnly, Secure, SameSite=Lax cookies; short access token + rotating refresh; Argon2id password hashing; TOTP 2FA with recovery codes.
- Every table carries `organisation_id`; Prisma middleware enforces tenant scoping so a missing `where` cannot leak rows.
- Permission strings (`calls.recordings.listen`, `crm.contacts.write`) are seeded as real data, grouped into roles; the API guard is authoritative, the UI only hides what it cannot do.
- Session and device records are first-class (page 178, 221, 222), revocable per device.
- Audit log is append-only, written by the API for every privileged mutation (page 179).

### 6.5 Realtime

- One authenticated WebSocket per session; topics: `call.started|answered|ended`, `channel.state`, `agent.status`, `queue.waiting`, `ticket.updated`, `notification.created`, `job.progress`.
- ARI events are normalised into the same call model the CDR uses, so live and historical calls share one shape.
- Live pages subscribe only; they never poll faster than 5s. Reconnect resumes from a cursor, and the UI shows `stale`/`disconnected` states instead of pretending to be live.

### 6.6 Telephony (Asterisk + ARI)

- A dedicated Stasis application receives channel, bridge and recording events; call control (answer, hold, transfer, conference, hangup) goes through ARI, not dialplan hacks.
- Backend generates PJSIP endpoint/auth config and dialplan contexts from the database, then reloads Asterisk; extensions and trunks are data, not hand-edited files.
- Browser softphone registers over WSS with short-lived SIP credentials issued by the API; media uses TURN.
- Recordings and voicemail land in object storage; playback uses short-lived signed URLs, and access is permission-checked per request.
- ARI event ingestion, bridge state and CDR writing run in the telephony worker with idempotent handlers, so a reconnect cannot duplicate calls.
- Dialer/campaigns (progressive, power, predictive) are backend orchestration jobs, not UI timers.

### 6.7 Data rules

- Local development runs against a real, empty local Postgres — no seeded demo tenant, no fake rows in any environment.
- If a feature's API is not shipped, the UI shows a `NotConfigured` empty state with the real next action; it never renders invented data.
- Imports/exports are real jobs with real files; there are no sample CSVs committed to the repo.
- All dashboards and reports must reconcile with the same CDR/CRM tables the list pages use.

### 6.8 Deployment implications

- The product can no longer be a static `serve`; it needs a Node host for the Next app, a Node host for the Nest API and workers, PostgreSQL, Redis, object storage, coturn, and Asterisk with ARI enabled.
- TLS is mandatory end-to-end: secure cookies, WSS for signalling, TURN over TLS.
- Phase 0 must confirm the target hosting before any schema is written.

### 6.9 Front-end data layer

- TanStack Query owns all server state; no server data in Redux or React context.
- One query-key convention per resource (`calls`, `calls/{id}`, `queues/{id}/members`) so realtime events and mutations invalidate precisely.
- WebSocket events patch or invalidate the matching query; screens never merge live data into local state by hand.
- Optimistic updates only for idempotent, reversible actions; destructive actions wait for the server.
- The generated OpenAPI client is the only network boundary; no ad-hoc `fetch` calls in components.

---

## 7. Page inventory (all 222)

**Status** — every page is **new** and will be built against our own API. This column only records whether the old studio-admin app has a screen worth studying:
`E` = strong reference screen exists, `P` = partial/related reference, `N` = no reference at all. No old code, schema, or endpoint is reused.
**Template** — DSH, LST, DTL, FRM, BLD, MON, MED, LOG, SET, CAL, DOC, WRK.

### 7.1 Dashboards

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 1 | Main Dashboard | `/app/dashboard` | DSH | E · `/dashboard` |
| 2 | Live Call Dashboard | `/app/dashboard/live` | MON | P · `/dashboard/inbound/live` |
| 3 | Agent Performance Dashboard | `/app/dashboard/agent-performance` | DSH | E · `/dashboard/reports/phone/agent-performance` |
| 4 | Queue Performance Dashboard | `/app/dashboard/queue-performance` | DSH | P · `/dashboard/inbound/reports/queues` |
| 5 | Sales Overview Dashboard | `/app/dashboard/sales` | DSH | N |
| 6 | Customer Activity Dashboard | `/app/dashboard/customer-activity` | DSH | P · `/dashboard/crm` |

### 7.2 Call center & telephony

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 7 | Agent Workspace | `/app/calls/workspace` | WRK | E · `/dashboard/agent/overview` |
| 8 | Softphone | `/app/calls/softphone` | WRK | E · `/dashboard/agent/phone` |
| 9 | Active Calls | `/app/calls/active` | MON | P · `/dashboard/inbound/live` |
| 10 | Call History | `/app/calls/history` | LST | E · `/dashboard/reports/phone/cdr` |
| 11 | Incoming Calls | `/app/calls/incoming` | LST | P · CDR filter |
| 12 | Outgoing Calls | `/app/calls/outgoing` | LST | P · CDR filter |
| 13 | Missed Calls | `/app/calls/missed` | LST | E · `/dashboard/inbound/missed-calls` |
| 14 | Call Details | `/app/calls/[id]` | DTL | P · CDR row only |
| 15 | Call Recordings | `/app/calls/recordings` | LST | P · recording API exists |
| 16 | Recording Details / Playback | `/app/calls/recordings/[id]` | MED | N |
| 17 | Voicemail Inbox | `/app/calls/voicemail` | LST | N |
| 18 | Voicemail Details | `/app/calls/voicemail/[id]` | MED | N |
| 19 | Callback Management | `/app/calls/callbacks` | LST | E · `/dashboard/callbacks` |
| 20 | Call Disposition Management | `/app/settings/dispositions` | LST | E · `/dashboard/configuration/disposition` |
| 21 | Call Transfer Management | `/app/calls/transfers` | LST | P · `/dashboard/customer-service/transfers` |
| 22 | Conference Calls | `/app/calls/conferences` | MON | N |
| 23 | Dialer | `/app/calls/dialer` | WRK | E · `/dashboard/phone/dial-methods` |
| 24 | Click-to-Call | `/app/calls/click-to-call` | WRK | E · embedded in agent phone |
| 25 | Call Notes | `/app/calls/notes` | LST | P · notes live inside dispositions |

### 7.3 Queue management

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 26 | Queue Dashboard | `/app/queues` | DSH | P · `/dashboard/phone/queues` |
| 27 | All Queues | `/app/queues/all` | LST | E · `/dashboard/phone/queues` |
| 28 | Create Queue | `/app/queues/new` | FRM | E · queue dialog |
| 29 | Edit Queue | `/app/queues/[id]/edit` | FRM | E · queue dialog |
| 30 | Queue Details | `/app/queues/[id]` | DTL | E · `/dashboard/phone/queues/[id]` |
| 31 | Queue Members | `/app/queues/[id]/members` | LST | E · `/dashboard/phone/queues/[id]/members` |
| 32 | Queue Monitoring | `/app/queues/monitor` | MON | P · `/dashboard/inbound/live` |
| 33 | Queue Performance | `/app/queues/performance` | DSH | E · `/dashboard/inbound/reports/queues` |
| 34 | Queue Routing Rules | `/app/queues/[id]/routing` | FRM | E · `/dashboard/phone/routing` |

### 7.4 IVR & call flows

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 35 | IVR Dashboard | `/app/ivr` | DSH | P · `/dashboard/inbound/ivr` |
| 36 | IVR Flow Builder | `/app/ivr/builder` | BLD | N |
| 37 | Create IVR | `/app/ivr/new` | FRM | P · `/dashboard/inbound/ivr` |
| 38 | Edit IVR | `/app/ivr/[id]/edit` | FRM | P |
| 39 | IVR Details | `/app/ivr/[id]` | DTL | P |
| 40 | Call Flow Builder | `/app/ivr/flows/[id]` | BLD | N |
| 41 | Call Routing Rules | `/app/ivr/routing` | LST | E · `/dashboard/phone/routing` |
| 42 | Business Hours | `/app/ivr/business-hours` | SET | P · `/dashboard/inbound/schedule` |
| 43 | Holiday Schedules | `/app/ivr/holidays` | LST | P |
| 44 | Ring Groups | `/app/ivr/ring-groups` | LST | E · `/dashboard/inbound/agent-groups` |
| 45 | Ring Group Details | `/app/ivr/ring-groups/[id]` | DTL | E · `/dashboard/configuration/groups/[id]` |

### 7.5 CRM — contacts

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 46 | CRM Dashboard | `/app/crm` | DSH | E · `/dashboard/crm` |
| 47 | All Contacts | `/app/crm/contacts` | LST | P · `/dashboard/crm` |
| 48 | Create Contact | `/app/crm/contacts/new` | FRM | P |
| 49 | Edit Contact | `/app/crm/contacts/[id]/edit` | FRM | P |
| 50 | Contact Details | `/app/crm/contacts/[id]` | DTL | P · `/dashboard/customer-service/profiles` |
| 51 | Contact Activity Timeline | `/app/crm/contacts/[id]/timeline` | DTL | P · `/dashboard/customer-service/interactions` |
| 52 | Contact Import | `/app/crm/contacts/import` | FRM | E · `/dashboard/inbound/customer-import` |
| 53 | Contact Export | `/app/crm/contacts/export` | FRM | P · export API exists |
| 54 | Contact Segments | `/app/crm/segments` | LST | N |

### 7.6 CRM — companies

| # | Page | Route | Tpl | Reference |
|---|---|---|---|---|
| 55 | All Companies | `/app/crm/companies` | LST | N |
| 56 | Create Company | `/app/crm/companies/new` | FRM | N |
| 57 | Edit Company | `/app/crm/companies/[id]/edit` | FRM | N |
| 58 | Company Details | `/app/crm/companies/[id]` | DTL | N |
| 59 | Company Contacts | `/app/crm/companies/[id]/contacts` | LST | N |

### 7.7 CRM — leads

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 60 | Leads Dashboard | `/app/crm/leads` | DSH | E · `/dashboard/agent/leads` |
| 61 | All Leads | `/app/crm/leads/all` | LST | E · leads API |
| 62 | Create Lead | `/app/crm/leads/new` | FRM | P · dynamic forms |
| 63 | Edit Lead | `/app/crm/leads/[id]/edit` | FRM | P |
| 64 | Lead Details | `/app/crm/leads/[id]` | DTL | E · `/dashboard/leads/[id]` |
| 65 | Lead Sources | `/app/crm/leads/sources` | SET | P · lead config |
| 66 | Lead Assignment | `/app/crm/leads/assignment` | SET | P · campaign assignment |
| 67 | Lead Conversion | `/app/crm/leads/[id]/convert` | FRM | N |

### 7.8 CRM — sales & deals

| # | Page | Route | Tpl | Reference |
|---|---|---|---|---|
| 68 | Sales Dashboard | `/app/sales` | DSH | N |
| 69 | Sales Pipeline | `/app/sales/pipeline` | BLD | N |
| 70 | Pipeline Management | `/app/sales/pipelines` | SET | N |
| 71 | All Deals | `/app/sales/deals` | LST | N |
| 72 | Create Deal | `/app/sales/deals/new` | FRM | N |
| 73 | Edit Deal | `/app/sales/deals/[id]/edit` | FRM | N |
| 74 | Deal Details | `/app/sales/deals/[id]` | DTL | N |
| 75 | Sales Activities | `/app/sales/activities` | LST | N |
| 76 | Sales Forecast | `/app/sales/forecast` | DSH | N |

### 7.9 Tasks & activities

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 77 | Activities Dashboard | `/app/work/activities` | DSH | P · `/dashboard/reports/activity` |
| 78 | All Activities | `/app/work/activities/all` | LST | P |
| 79 | Create Activity | `/app/work/activities/new` | FRM | N |
| 80 | Activity Details | `/app/work/activities/[id]` | DTL | N |
| 81 | Task Management | `/app/work/tasks` | LST | N |
| 82 | Task Calendar | `/app/work/calendar` | CAL | P · `/dashboard/agent/calendar` |
| 83 | Meeting Management | `/app/work/meetings` | LST | N |
| 84 | Notes Management | `/app/work/notes` | LST | N |
| 85 | Reminders | `/app/work/reminders` | LST | N |

### 7.10 Support & ticketing

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 86 | Support Dashboard | `/app/support` | DSH | P · `/dashboard/customer-service` |
| 87 | All Tickets | `/app/support/tickets` | LST | E · `/dashboard/customer-service/tickets` |
| 88 | Create Ticket | `/app/support/tickets/new` | FRM | P |
| 89 | Ticket Details | `/app/support/tickets/[id]` | DTL | P |
| 90 | Edit Ticket | `/app/support/tickets/[id]/edit` | FRM | P |
| 91 | Ticket Assignment | `/app/support/assignment` | SET | P |
| 92 | Ticket Categories | `/app/support/categories` | SET | N |
| 93 | Ticket Priorities | `/app/support/priorities` | SET | N |
| 94 | SLA Management | `/app/support/sla` | SET | E · `/dashboard/inbound/sla` |
| 95 | Customer Feedback | `/app/support/feedback` | LST | N |
| 96 | Knowledge Base | `/app/support/knowledge-base` | LST | E · `/dashboard/customer-service/knowledge-base` |
| 97 | Knowledge Base Article | `/app/support/knowledge-base/[slug]` | DOC | P |

### 7.11 Campaigns

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 98 | Campaign Dashboard | `/app/campaigns` | DSH | P · `/dashboard/campaigns` |
| 99 | All Campaigns | `/app/campaigns/all` | LST | E |
| 100 | Create Campaign | `/app/campaigns/new` | FRM | P |
| 101 | Edit Campaign | `/app/campaigns/[id]/edit` | FRM | P |
| 102 | Campaign Details | `/app/campaigns/[id]` | DTL | E · `/dashboard/campaigns/[id]` |
| 103 | Campaign Contact Lists | `/app/campaigns/[id]/lists` | LST | P · upload API |
| 104 | Campaign Scheduling | `/app/campaigns/[id]/schedule` | FRM | P |
| 105 | Campaign Call Scripts | `/app/campaigns/[id]/scripts` | FRM | E · `/dashboard/configuration/scripts` |
| 106 | Campaign Performance | `/app/campaigns/[id]/performance` | DSH | E · `/dashboard/reports/phone/campaigns` |
| 107 | Do Not Call Management | `/app/campaigns/do-not-call` | LST | P · opt-out lists exist per channel |

### 7.12 Agent management

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 108 | Agent Dashboard | `/app/agents` | DSH | E · `/dashboard/agent/overview` |
| 109 | All Agents | `/app/agents/all` | LST | E · agents API |
| 110 | Create Agent | `/app/agents/new` | FRM | E |
| 111 | Edit Agent | `/app/agents/[id]/edit` | FRM | E |
| 112 | Agent Details | `/app/agents/[id]` | DTL | E · `/dashboard/configuration/users/[id]` |
| 113 | Agent Availability | `/app/agents/availability` | MON | P · phone status store |
| 114 | Agent Activity | `/app/agents/activity` | LST | P · `/dashboard/reports/activity` |
| 115 | Agent Call History | `/app/agents/[id]/calls` | LST | E · `/dashboard/reports/phone/agent-performance/[id]` |
| 116 | Agent Performance | `/app/agents/[id]/performance` | DSH | E |
| 117 | Agent Extensions | `/app/agents/[id]/extensions` | SET | P · extension API |

### 7.13 Team & workforce

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 118 | Team Dashboard | `/app/teams` | DSH | N |
| 119 | All Teams | `/app/teams/all` | LST | P · `/dashboard/configuration/groups` |
| 120 | Create Team | `/app/teams/new` | FRM | P |
| 121 | Edit Team | `/app/teams/[id]/edit` | FRM | P |
| 122 | Team Details | `/app/teams/[id]` | DTL | E · `/dashboard/configuration/groups/[id]` |
| 123 | Team Members | `/app/teams/[id]/members` | LST | E · `.../groups/[id]/agents` |
| 124 | Shift Management | `/app/teams/shifts` | LST | N |
| 125 | Shift Scheduling | `/app/teams/schedule` | CAL | N |
| 126 | Attendance Management | `/app/teams/attendance` | LST | N |
| 127 | Break Management | `/app/teams/breaks` | SET | P · pause summary reports |
| 128 | Workforce Reports | `/app/teams/reports` | DSH | P · `/dashboard/reports/general/pause-summary` |

### 7.14 Quality assurance

| # | Page | Route | Tpl | Reference |
|---|---|---|---|---|
| 129 | QA Dashboard | `/app/qa` | DSH | N |
| 130 | Call Evaluation | `/app/qa/evaluations` | LST | N |
| 131 | Evaluation Details | `/app/qa/evaluations/[id]` | DTL | N |
| 132 | Evaluation Forms | `/app/qa/forms` | LST | N |
| 133 | Create Evaluation Form | `/app/qa/forms/new` | FRM | N |
| 134 | Edit Evaluation Form | `/app/qa/forms/[id]/edit` | FRM | N |
| 135 | Scorecards | `/app/qa/scorecards` | DSH | N |
| 136 | Agent Coaching | `/app/qa/coaching` | LST | N |
| 137 | Coaching History | `/app/qa/coaching/history` | LST | N |
| 138 | Quality Reports | `/app/qa/reports` | DSH | N |
| 139 | Customer Satisfaction Reports | `/app/qa/csat` | DSH | N |

### 7.15 Reports & analytics

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 140 | Analytics Dashboard | `/app/reports` | DSH | E · `/dashboard/analytics` |
| 141 | Call Reports | `/app/reports/calls` | DSH | E · phone report suite |
| 142 | Agent Reports | `/app/reports/agents` | DSH | E |
| 143 | Queue Reports | `/app/reports/queues` | DSH | E |
| 144 | Abandoned Call Reports | `/app/reports/abandoned-calls` | DSH | P · call-type report |
| 145 | Missed Call Reports | `/app/reports/missed-calls` | DSH | P · missed list only |
| 146 | SLA Reports | `/app/reports/sla` | DSH | E · `/dashboard/inbound/reports/sla` |
| 147 | Campaign Reports | `/app/reports/campaigns` | DSH | E |
| 148 | CRM Reports | `/app/reports/crm` | DSH | P |
| 149 | Sales Reports | `/app/reports/sales` | DSH | N |
| 150 | Ticket Reports | `/app/reports/tickets` | DSH | N |
| 151 | Custom Report Builder | `/app/reports/builder` | BLD | N |
| 152 | Scheduled Reports | `/app/reports/scheduled` | LST | N |
| 153 | Export History | `/app/reports/exports` | LST | P · export API |

### 7.16 Telephony & PBX configuration

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 154 | PBX Dashboard | `/app/pbx` | DSH | P · `/dashboard/phone` |
| 155 | Asterisk Server Management | `/app/pbx/asterisk` | SET | N |
| 156 | SIP Trunk Management | `/app/pbx/sip-trunks` | LST | N |
| 157 | Create SIP Trunk | `/app/pbx/sip-trunks/new` | FRM | N |
| 158 | Edit SIP Trunk | `/app/pbx/sip-trunks/[id]/edit` | FRM | N |
| 159 | SIP Extension Management | `/app/pbx/extensions` | LST | P |
| 160 | Create Extension | `/app/pbx/extensions/new` | FRM | P |
| 161 | Edit Extension | `/app/pbx/extensions/[id]/edit` | FRM | P |
| 162 | Extension Details | `/app/pbx/extensions/[id]` | DTL | P |
| 163 | Phone Number Management | `/app/pbx/numbers` | LST | P · `/dashboard/inbound/did` |
| 164 | Inbound Routes | `/app/pbx/inbound-routes` | LST | E · `/dashboard/inbound/routing` |
| 165 | Outbound Routes | `/app/pbx/outbound-routes` | LST | P |
| 166 | Dialplan Management | `/app/pbx/dialplans` | BLD | N |
| 167 | PBX Event Logs | `/app/pbx/logs` | LOG | N |
| 168 | PBX System Status | `/app/pbx/status` | MON | N |

### 7.17 Users & access

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 169 | User Management | `/app/access/users` | LST | E · `/dashboard/configuration/users` |
| 170 | Create User | `/app/access/users/new` | FRM | E |
| 171 | Edit User | `/app/access/users/[id]/edit` | FRM | E |
| 172 | User Details | `/app/access/users/[id]` | DTL | E |
| 173 | Roles Management | `/app/access/roles` | LST | E · `/dashboard/configuration/roles` |
| 174 | Create Role | `/app/access/roles/new` | FRM | E |
| 175 | Edit Role | `/app/access/roles/[id]/edit` | FRM | E |
| 176 | Permissions Management | `/app/access/permissions` | SET | E · `/dashboard/configuration/permissions` |
| 177 | User Invitations | `/app/access/invitations` | LST | N |
| 178 | Session Management | `/app/access/sessions` | LST | N |
| 179 | Audit Logs | `/app/access/audit-logs` | LOG | P · `/dashboard/reports/general/activity-logs` |

### 7.18 Organisation

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 180 | Organisation Profile | `/app/org/profile` | SET | P · `/dashboard/settings` |
| 181 | Organisation Settings | `/app/org/settings` | SET | E · `/dashboard/configuration/settings` |
| 182 | Department Management | `/app/org/departments` | LST | P · groups |
| 183 | Organisation Members | `/app/org/members` | LST | P · users |
| 184 | Organisation Preferences | `/app/org/preferences` | SET | P |
| 185 | Subscription Management | `/app/org/subscription` | SET | N |
| 186 | Billing History | `/app/org/billing` | LST | N |
| 187 | Usage & Limits | `/app/org/usage` | DSH | N |

### 7.19 Integrations & developer tools

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 188 | Integrations Dashboard | `/app/integrations` | DSH | E · `/dashboard/configuration/integrations` |
| 189 | Available Integrations | `/app/integrations/available` | LST | E |
| 190 | Integration Details | `/app/integrations/[id]` | DTL | E |
| 191 | Connected Applications | `/app/integrations/connected` | LST | E |
| 192 | API Key Management | `/app/developer/api-keys` | LST | N |
| 193 | Create API Key | `/app/developer/api-keys/new` | FRM | N |
| 194 | Webhook Management | `/app/developer/webhooks` | LST | N |
| 195 | Webhook Logs | `/app/developer/webhooks/logs` | LOG | N |
| 196 | API Documentation | `/app/developer/docs` | DOC | N |
| 197 | Developer Settings | `/app/developer/settings` | SET | N |

### 7.20 Notifications & communication

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 198 | Notification Center | `/app/notifications` | LST | N |
| 199 | Notification Settings | `/app/notifications/settings` | SET | N |
| 200 | Email Templates | `/app/notifications/email-templates` | LST | N |
| 201 | SMS Templates | `/app/notifications/sms-templates` | LST | E · `/dashboard/sms/templates` |
| 202 | Communication Logs | `/app/notifications/logs` | LOG | P · SMS/WhatsApp delivery logs |

### 7.21 System administration

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 203 | System Health Dashboard | `/app/system/health` | MON | N |
| 204 | Background Jobs | `/app/system/jobs` | LST | N |
| 205 | Job Details | `/app/system/jobs/[id]` | DTL | N |
| 206 | System Logs | `/app/system/logs` | LOG | N |
| 207 | Error Monitoring | `/app/system/errors` | LOG | N |
| 208 | Backup Management | `/app/system/backups` | LST | N |
| 209 | Storage Management | `/app/system/storage` | DSH | N |
| 210 | Security Settings | `/app/system/security` | SET | P · security-settings API |
| 211 | Data Retention Settings | `/app/system/retention` | SET | N |
| 212 | System Configuration | `/app/system/config` | SET | P · configuration/settings |

### 7.22 Personal settings

| # | Page | Route | Tpl | Reference (not reused) |
|---|---|---|---|---|
| 213 | My Profile | `/app/me` | SET | E · `/dashboard/profile` |
| 214 | Edit Profile | `/app/me/edit` | FRM | E |
| 215 | Change Password | `/app/me/password` | FRM | P · change-password API |
| 216 | Two-Factor Authentication | `/app/me/2fa` | SET | N |
| 217 | Personal Preferences | `/app/me/preferences` | SET | P · preferences store |
| 218 | Appearance Settings | `/app/me/appearance` | SET | P · theme presets |
| 219 | Language Settings | `/app/me/language` | SET | N |
| 220 | My Notifications | `/app/me/notifications` | SET | P |
| 221 | My Devices | `/app/me/devices` | LST | N |
| 222 | Active Sessions | `/app/me/sessions` | LST | N |

---

## 8. Phases

### Phase 0 — Foundation (must finish first)

**Front end**

- Convert repo to Next.js on port 4173, port `/` and `/landing/` with visuals and motion intact.
- App shell, clusters, command palette, page transitions inside the app.
- Verdant tokens + the shared component set from §4.
- API client generated from OpenAPI, TanStack Query, WebSocket provider, `EmptyState` / `NotConfigured` components.
- Personal basics: 213, 214, 215.

**Backend**

- NestJS scaffold, PostgreSQL schema baseline, Redis, BullMQ worker process, object storage client.
- Identity & Access: users, sessions, refresh rotation, Argon2id, roles/permissions seeded as real records, audit log.
- Organisation + tenancy middleware (`organisation_id` enforced), org settings.
- OpenAPI generation published to the front end; error envelope and filter/pagination grammar fixed.
- Deployment target confirmed (Node hosts, Postgres, Redis, storage, TLS) before schema work starts.

**Exit:** log in through our own API with a real account, land on Dashboard with real (empty) data, navigate every cluster, exercise a role that is denied a page, no fake data, no console errors, reduced-motion pass.

### Phase 1 — Telephony core (first release)

Pages 7–34, plus 20, 113, 117, 25.

**Backend first (critical path)**

- ARI Stasis app, event normalisation, CDR writer, bridge/call control, hangup causes.
- Extension/trunk provisioning service (DB → PJSIP + dialplan → reload), even though its UI is Phase 5. A minimal admin CLI is acceptable temporarily, but it writes real configuration.
- Recording + voicemail storage with signed playback URLs and permission checks.
- Realtime gateway topics for calls, agent status and queue state.
- Read endpoints for call history, detail, recordings, callbacks, queues and agent availability.
- Disposition and note write endpoints.

**Front end order**

1. **Read side:** Call History (10), Missed (13), Call Details (14), Recordings (15–16), Callback (19).
2. **Queues read:** 26–27, 30–31, 33.
3. **Live:** Active Calls (9), Queue Monitoring (32), Agent Availability (113).
4. **Workspace + softphone:** 7, 8, 23, 24, 25 — WebRTC registration, incoming/outgoing, hold, mute, transfer, disposition, wrap-up.
5. **Voicemail (17–18)** and **Transfer (21)**.
6. **Queue admin:** 28–29, 34.

**Exit:** an agent logs in, goes available, takes and places a real call through Asterisk, transfers it, saves a disposition + note, and the supervisor sees it live in Active Calls and Queue Monitoring. Recording plays back from object storage. Every call shown came from ARI events or the CDR table — no placeholder calls anywhere.

**Dependencies:** TLS/WSS and coturn reachable from browsers; ARI user and Stasis app registered; object storage bucket; Redis available to both API and worker.

### Phase 2 — CRM and work

Pages 46–67 (contacts, companies, leads) and 77–85 (activities, tasks, calendar). Backend: BE-3 — contact/company/lead CRUD, segments, activity timeline, tasks/meetings/notes/reminders, import/export jobs with real files. Lead conversion writes a real deal record once Phase 3 lands.

### Phase 3 — Revenue, support, campaigns

Pages 68–76 (sales/deals/pipeline), 86–97 (support), 98–107 (campaigns incl. DNC). Backend: BE-3 — pipelines and stage transitions, tickets/SLA timers/KB, campaign lists and scheduling; BullMQ workers for imports and progressive dialing.

### Phase 4 — People and quality

Pages 108–139: agents, teams, shifts/attendance, QA forms, evaluations, coaching, CSAT. Backend: BE-4 QA and workforce modules; BE-1 ships 2FA, devices and active sessions (216, 221, 222) alongside the settings template.

### Phase 5 — Insights and platform

Pages 140–168: all reports, report builder, scheduled reports, exports, then PBX/SIP/extensions/number routing/dialplan/status. Backend: BE-4 report definitions, snapshot jobs and export history; BE-2 exposes trunk/extension/number/route configuration and PBX status.

### Phase 6 — Administration and system

Pages 169–212: access control, organisation, billing, integrations, developer tools, notifications, health/jobs/logs/backups. Backend: BE-1 access administration and audit; BE-4 notifications, integrations/webhooks, system jobs/logs/backups/storage, billing and subscription.

---

## 9. Lane split for the team

### Backend lanes (critical path — every front-end lane waits on its endpoints)

| Lane | Owns | Phase |
|---|---|---|
| **BE-1 Core** | Nest scaffold, identity, sessions/2FA, RBAC, tenancy, organisation, audit, OpenAPI, error/filter/pagination contracts | 0 |
| **BE-2 Telephony** | ARI Stasis, event normalisation, CDR, recordings, voicemail, WebRTC credentials, PJSIP/dialplan provisioning, live gateway | 1 |
| **BE-3 Customer** | contacts, companies, leads, segments, pipelines, deals, activities/tasks, tickets/SLA/KB, campaigns/DNC | 2–3 |
| **BE-4 Operations** | queues, IVR/flows, QA, workforce, reporting/export jobs, notifications, integrations/webhooks, system administration | 1 (queues), 4–6 |

### Front-end lanes

| Lane | Pages | Count | Phase focus | Depends on |
|---|---|---|---|---|
| **A — Foundation & design system** | Shell + 213–215 | 3 + shell | 0 | BE-1 |
| **B — Calls & softphone** | 7–25 | 19 | 1 | A, BE-2, WSS/TURN |
| **C — Queues & routing** | 26–45 | 20 | 1 (queues), 5 (IVR) | A, BE-4 (queues), B (live data) |
| **D — CRM & work** | 46–85 | 40 | 2 (CRM), 3 (sales) | A, BE-3 |
| **E — Support & campaigns** | 86–107 | 22 | 3 | A, BE-3 |
| **F — People & QA** | 108–139 | 32 | 4 | A, BE-1/BE-2 (call data), BE-4 (QA) |
| **G — Insights** | 140–153 | 14 | 5 | B–F data, BE-4 |
| **H — Platform & admin** | 154–222 (minus 213–215) | 66 | 5–6 | A, BE-2 (PBX), BE-1/BE-4 |

Fairness check: first release (Phases 0–1) is BE-1 + BE-2 + A + B + queues from C and BE-4. Front-end B cannot start softphone work until BE-2 has registration and call control; everything else can start against a published OpenAPI stub once BE-1 lands. No front-end lane starts before A ships the shell and templates.

---

## 10. Risks and open decisions

1. **Scope:** 222 pages plus a greenfield backend is 3–5× the work of the old product. The template/config strategy keeps the UI finite; the backend still needs every domain. Bespoke screens must be refused unless they are BLD/MON.
2. **Backend is the critical path:** all 222 pages need endpoints, and the high-risk domains — telephony/CDR, recordings, QA, sales, companies, report builder, webhooks, billing, system admin, 2FA/sessions — have no implementation to borrow. Empty states are the interim, never fake rows.
3. **Telephony infrastructure:** ARI needs a Stasis user, event socket reachability and a reload path; WebRTC needs TLS, WSS and coturn. Prove a browser can register and place a call on this Asterisk before Phase 1 UI work starts.
4. **Permissions:** the RBAC matrix (role × page × action) must be agreed before Phase 1, or both the API guards and the nav will be rebuilt.
5. **Billing:** subscription/billing imply a payments provider and plan model — out of scope until Phase 6.
6. **Deployment:** the product now needs Node hosts (web, API, worker), PostgreSQL, Redis, object storage, coturn and Asterisk. Confirm this hosting before Phase 0 writes a schema; the old static `serve` is not sufficient.
7. **Contract drift:** if the API is written ahead of the UI without a published OpenAPI spec, the generated client and the screens will diverge. Contract-first per module, then build both sides against it.
8. **Design drift:** every new page must reuse the 12 templates; otherwise 222 pages become 222 designs.

---

## 11. Definition of done (every page)

- Its endpoints exist in our Nest API and are published in OpenAPI; the page uses the generated client, not hand-written fetch shapes.
- Schema/migration shipped, with tenant scoping and a guard test proving another organisation cannot read the rows.
- Real reads and writes; no mock rows, no seeded demo tenant, no browser fixtures.
- Permission-gated nav entry, API guard, and a read-only variant for roles that can view but not edit.
- Privileged mutations write an audit-log entry.
- Loading skeleton, empty state with next action, error state with retry, not-found where relevant.
- Keyboard reachable, visible focus, labelled inputs, table sorts/filters announced.
- Works at 360, 768, 1280, 1536 widths; no horizontal scroll.
- Motion matches the tokens; `prefers-reduced-motion` honored; page transition does not fire on same-module navigation.
- No console errors, no failed network requests, no layout shift on load.
- Reviewed in a visible browser against the live API before sign-off.
