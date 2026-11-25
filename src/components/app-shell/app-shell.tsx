"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  clusterForModule,
  clusters,
  isConcreteRoute,
  moduleEntry,
  moduleMeta,
  modulePages,
  pageForPath,
} from "@/config/navigation";
import { Icon } from "@/components/icon";
import { DRAFT_EVENT, initialsFrom, readDraft } from "@/lib/onboarding";
import { CommandPalette } from "./command-palette";
import { Softphone } from "./softphone";

const COLLAPSE_KEY = "callflow:sidebar-collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/app/dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [initials, setInitials] = useState("");

  const page = pageForPath(pathname);
  const activeModuleName = page?.module;
  const activeCluster = activeModuleName ? clusterForModule(activeModuleName) : undefined;

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
            href="/app/dashboard"
            title={collapsed ? "callflow workspace" : undefined}
          >
            <img src="/callflow-mark.svg" alt="" width={30} height={30} />
            <span>
              callflow
              <em>workspace</em>
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
          {clusters.map((cluster) => (
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
                const subPages = isActive
                  ? modulePages(moduleName).filter(
                      (item) => isConcreteRoute(item.route) && item.route !== entry.route,
                    )
                  : [];
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
                    {subPages.length > 0 && (
                      <div className="module-subnav" aria-label={`${meta?.label ?? moduleName} pages`}>
                        {subPages.map((item) => (
                          <Link
                            key={item.number}
                            href={item.route}
                            className={item.number === page?.number ? "is-current" : undefined}
                            aria-current={item.number === page?.number ? "page" : undefined}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="connection-card">
            <span className="connection-dot" aria-hidden="true" />
            <div>
              <strong>API not connected</strong>
              <p>All screens are built. Data arrives with the Nest API.</p>
            </div>
          </div>
          <Link
            className="sidebar-plan"
            href="/landing"
            title={collapsed ? "Marketing site" : undefined}
            aria-label={collapsed ? "Marketing site" : undefined}
          >
            <Icon name="arrow" size={15} />
            <span>Marketing site</span>
          </Link>
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
            <Link href="/app/dashboard">Workspace</Link>
            {activeModuleName && (
              <>
                <Icon name="chevron" size={13} className="crumb-sep" />
                <span>{moduleMeta[activeModuleName]?.label ?? activeModuleName}</span>
              </>
            )}
            {page && (
              <>
                <Icon name="chevron" size={13} className="crumb-sep" />
                <strong>{page.title}</strong>
              </>
            )}
          </div>

          <button
            type="button"
            className="search-trigger"
            onClick={() => setPaletteOpen(true)}
          >
            <Icon name="search" size={17} />
            <span>Search pages</span>
            <kbd>⌘K</kbd>
          </button>

          <div className="top-actions">
            <span className="env-pill" title="The Nest API is not deployed yet">
              <span className="env-dot" aria-hidden="true" />
              API offline
            </span>
            <Link className="icon-button" href="/app/notifications" aria-label="Notifications">
              <Icon name="bell" size={19} />
            </Link>
            <Link className="avatar" href="/app/me" aria-label="Personal settings">
              {initials || <Icon name="user" size={17} />}
            </Link>
          </div>
        </header>

        <main className="page" key={pathname}>
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Softphone />
    </div>
  );
}
