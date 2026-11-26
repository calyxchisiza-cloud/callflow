"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clusterForModule,
  clusters,
  isConcreteRoute,
  moduleEntry,
  moduleMeta,
  modulePages,
  pageForPath,
} from "@/config/navigation";
import {
  agentItemForPath,
  agentNav,
  agentNavItems,
  agentRouteAllowed,
} from "@/config/agent-nav";
import { Icon } from "@/components/icon";
import { AgentAvatar, PresenceDot } from "@/components/roles/role-ui";
import { DRAFT_EVENT, initialsFrom, readDraft } from "@/lib/onboarding";
import { clearSession, useSession, useWorkspace } from "@/lib/workspace";
import { CommandPalette, type PaletteItem } from "./command-palette";
import { Softphone } from "./softphone";

const COLLAPSE_KEY = "callflow:sidebar-collapsed";

const titleOverrides: Record<string, string> = {
  "/app/agents": "Agents",
  "/app/agents/new": "Invite agent",
  "/app/crm/leads": "Lead inbox",
  "/app/crm/leads/all": "Lead inbox",
  "/app/crm/leads/new": "Add lead",
  "/app/crm/leads/import": "Import leads",
  "/app/campaigns": "Campaigns",
  "/app/campaigns/all": "All campaigns",
  "/app/campaigns/new": "New campaign",
  "/app/campaigns/do-not-call": "Do not call",
};

function titleForPath(pathname: string, fallback?: string): string | undefined {
  const clean = pathname.replace(/\/+$/, "");
  if (titleOverrides[clean]) return titleOverrides[clean];
  if (/^\/app\/campaigns\/[^/]+\/edit$/.test(clean)) return "Edit campaign";
  if (/^\/app\/campaigns\/[^/]+$/.test(clean)) return "Campaign";
  return fallback;
}

const moduleTabOverrides: Record<string, { label: string; href: string }[]> = {
  Campaigns: [
    { label: "Campaigns", href: "/app/campaigns" },
    { label: "Do not call", href: "/app/campaigns/do-not-call" },
  ],
  "CRM — leads": [
    { label: "Lead inbox", href: "/app/crm/leads" },
    { label: "Add lead", href: "/app/crm/leads/new" },
    { label: "Import CSV", href: "/app/crm/leads/import" },
    { label: "Lead sources", href: "/app/crm/leads/sources" },
    { label: "Assignment", href: "/app/crm/leads/assignment" },
  ],
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/app/dashboard";
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [initials, setInitials] = useState("");

  const { session, ready: sessionReady } = useSession();
  const { workspace } = useWorkspace();
  const isAgent = session?.role === "agent";
  const agentEmail = session?.role === "agent" ? session.email : "";
  const agentRecord = agentEmail
    ? workspace.agents.find(
        (agent) => agent.email.toLowerCase() === agentEmail.toLowerCase(),
      )
    : undefined;
  const agentPresence = agentRecord
    ? workspace.presence[agentRecord.id] ?? "offline"
    : "offline";
  const activeAgentItem = agentItemForPath(pathname);

  const page = pageForPath(pathname);
  const pageTitle = titleForPath(pathname, page?.title);
  const activeModuleName = page?.module;
  const activeModuleLabel = activeModuleName
    ? moduleMeta[activeModuleName]?.label ?? activeModuleName
    : undefined;
  const activeCluster = activeModuleName ? clusterForModule(activeModuleName) : undefined;

  const moduleTabs = useMemo(() => {
    if (isAgent || !activeModuleName) return [];
    const override = moduleTabOverrides[activeModuleName];
    if (override) return override;
    const concrete = modulePages(activeModuleName)
      .filter((item) => isConcreteRoute(item.route))
      .sort((a, b) => a.number - b.number);
    if (concrete.length < 2) return [];
    return concrete.map((item) => ({
      label: titleOverrides[item.route] ?? item.title,
      href: item.route,
    }));
  }, [activeModuleName, isAgent]);

  const agentPaletteItems = useMemo<PaletteItem[]>(() => {
    const groupOf = new Map<string, string>();
    agentNav.forEach((group) =>
      group.items.forEach((item) => groupOf.set(item.href, group.label)),
    );
    return agentNavItems.map((item) => ({
      id: item.href,
      title: item.label,
      route: item.href,
      group: groupOf.get(item.href) ?? "Agent desk",
      template: item.template,
      icon: item.icon,
    }));
  }, []);

  useEffect(() => {
    if (!sessionReady || !isAgent) return;
    if (!agentRouteAllowed(pathname)) router.replace("/app/agent");
  }, [isAgent, pathname, router, sessionReady]);

  const signOut = () => {
    clearSession();
    router.push("/login");
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    } catch {}
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
    } catch {}
  };

  useEffect(() => {
    const sync = () => setInitials(initialsFrom(readDraft().fullName));
    sync();
    window.addEventListener(DRAFT_EVENT, sync);
    return () => window.removeEventListener(DRAFT_EVENT, sync);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`app-shell${collapsed ? " is-collapsed" : ""}${settled ? " is-settled" : ""}`}>
      <aside
        id="workspace-sidebar"
        className={`sidebar${sidebarOpen ? " is-open" : ""}`}
        aria-label="Workspace navigation"
      >
        <div className="sidebar-glow" aria-hidden="true" />

        <div className="sidebar-head">
          <Link
            className="sidebar-brand"
            href={isAgent ? "/app/agent" : "/app/dashboard"}
            title={collapsed ? (isAgent ? "callflow agent desk" : "callflow workspace") : undefined}
          >
            <img src="/callflow-mark.svg" alt="" width={30} height={30} />
            <span>
              callflow
              <em>{isAgent ? "agent desk" : "workspace"}</em>
            </span>
          </Link>
          <button
            type="button"
            className="sidebar-collapse"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-controls="workspace-sidebar"
            aria-expanded={!collapsed}
            onClick={toggleCollapsed}
          >
            <Icon name="panel" size={16} />
          </button>
          <button
            type="button"
            className="sidebar-close"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {isAgent &&
            agentNav.map((group) => (
              <div className="cluster" key={group.id}>
                <p className="cluster-label">{group.label}</p>
                {group.items.map((item) => {
                  const isActive = activeAgentItem?.href === item.href;
                  const isCurrent = pathname === item.href;
                  return (
                    <div className="module-group" key={item.href}>
                      <Link
                        href={item.href}
                        className={`module-link${isActive ? " is-active" : ""}`}
                        aria-current={isCurrent ? "page" : undefined}
                        aria-label={collapsed ? item.label : undefined}
                        title={collapsed ? item.label : undefined}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon name={item.icon} size={18} />
                        <span>{item.label}</span>
                        {isCurrent && <i aria-hidden="true" />}
                      </Link>
                    </div>
                  );
                })}
              </div>
            ))}
          {!isAgent &&
            clusters.map((cluster) => (
            <div
              className={`cluster${cluster.id === activeCluster?.id ? " is-current" : ""}`}
              key={cluster.id}
            >
              <p className="cluster-label">{cluster.label}</p>
              {cluster.modules.map((moduleName) => {
                const entry = moduleEntry(moduleName);
                if (!entry || !isConcreteRoute(entry.route)) return null;
                const meta = moduleMeta[moduleName];
                const isActive = moduleName === activeModuleName;
                const isCurrent = page?.number === entry.number;
                return (
                  <div className="module-group" key={moduleName}>
                    <Link
                      href={entry.route}
                      className={`module-link${isActive ? " is-active" : ""}`}
                      aria-current={isCurrent ? "page" : undefined}
                      aria-label={collapsed ? (meta?.label ?? moduleName) : undefined}
                      title={collapsed ? (meta?.label ?? moduleName) : undefined}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon name={meta?.icon ?? cluster.icon} size={18} />
                      <span>{meta?.label ?? moduleName}</span>
                      {isCurrent && <i aria-hidden="true" />}
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          {isAgent ? (
            <div className="sidebar-agent">
              <AgentAvatar name={agentRecord?.name ?? "Agent"} size={30} />
              <div>
                <strong>{agentRecord?.name ?? "Agent seat"}</strong>
                <p>
                  {agentRecord
                    ? `${agentRecord.team} · Ext. ${agentRecord.extension}`
                    : agentEmail}
                </p>
              </div>
              {agentRecord && <PresenceDot presence={agentPresence} />}
            </div>
          ) : (
            <div className="connection-card">
              <span className="connection-dot" aria-hidden="true" />
              <div>
                <strong>API not connected</strong>
                <p>All screens are built. Data arrives with the Nest API.</p>
              </div>
            </div>
          )}
          <div className="sidebar-foot-links">
            {isAgent ? (
              <Link
                className="sidebar-plan"
                href="/app/agent/availability"
                title={collapsed ? "Availability" : undefined}
                aria-label={collapsed ? "Availability" : undefined}
              >
                <Icon name="pulse" size={15} />
                <span>Availability</span>
              </Link>
            ) : (
              <Link
                className="sidebar-plan"
                href="/landing"
                title={collapsed ? "Marketing site" : undefined}
                aria-label={collapsed ? "Marketing site" : undefined}
              >
                <Icon name="arrow" size={15} />
                <span>Marketing site</span>
              </Link>
            )}
            <button
              type="button"
              className="sidebar-plan sidebar-signout"
              onClick={signOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <Icon name="lock" size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="app-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-button menu-button"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <Icon name="menu" size={20} />
          </button>

          <div className="crumbs">
            <Link href={isAgent ? "/app/agent" : "/app/dashboard"}>
              {isAgent ? "Agent desk" : "Workspace"}
            </Link>
            {isAgent ? (
              activeAgentItem && (
                <>
                  <Icon name="chevron" size={13} className="crumb-sep" />
                  <strong>{activeAgentItem.label}</strong>
                </>
              )
            ) : (
              <>
                {activeModuleLabel && (
                  <>
                    <Icon name="chevron" size={13} className="crumb-sep" />
                    <span>{activeModuleLabel}</span>
                  </>
                )}
                {pageTitle && pageTitle !== activeModuleLabel && (
                  <>
                    <Icon name="chevron" size={13} className="crumb-sep" />
                    <strong>{pageTitle}</strong>
                  </>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            className="search-trigger"
            onClick={() => setPaletteOpen(true)}
          >
            <Icon name="search" size={17} />
            <span>{isAgent ? "Search agent desk" : "Search pages"}</span>
            <kbd>⌘K</kbd>
          </button>

          <div className="top-actions">
            {isAgent ? (
              <span className="env-pill is-agent" title="You are signed in with agent access">
                <span className="env-dot" aria-hidden="true" />
                Agent access
              </span>
            ) : (
              <span className="env-pill" title="The Nest API is not deployed yet">
                <span className="env-dot" aria-hidden="true" />
                API offline
              </span>
            )}
            <Link className="icon-button" href="/app/notifications" aria-label="Notifications">
              <Icon name="bell" size={19} />
            </Link>
            <Link className="avatar" href="/app/me" aria-label="Personal settings">
              {(agentRecord ? initialsFrom(agentRecord.name) : initials) || (
                <Icon name="user" size={17} />
              )}
            </Link>
          </div>
        </header>

        <main className="page" key={pathname}>
          {moduleTabs.length > 1 && (
            <nav className="module-tabs" aria-label={`${activeModuleLabel} pages`}>
              {moduleTabs.map((tab) => {
                const current = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={current ? "is-current" : undefined}
                    aria-current={current ? "page" : undefined}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          )}
          {children}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={isAgent ? agentPaletteItems : undefined}
      />
      <Softphone />
    </div>
  );
}
