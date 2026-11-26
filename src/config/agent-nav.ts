export type AgentNavItem = {
  href: string;
  label: string;
  icon: string;
  description: string;
  template: string;
};

export type AgentNavGroup = {
  id: string;
  label: string;
  items: AgentNavItem[];
};

export const agentNav: AgentNavGroup[] = [
  {
    id: "desk",
    label: "My desk",
    items: [
      {
        href: "/app/agent",
        label: "Today",
        icon: "grid",
        description: "Your shift, assigned leads and setup",
        template: "Agent home",
      },
      {
        href: "/app/agent/leads",
        label: "My leads",
        icon: "target",
        description: "Leads assigned to you by the owner",
        template: "Lead list",
      },
    ],
  },
  {
    id: "phone",
    label: "On the phone",
    items: [
      {
        href: "/app/agent/calls",
        label: "My calls",
        icon: "phone",
        description: "Your call activity and outcomes",
        template: "Call log",
      },
      {
        href: "/app/calls/workspace",
        label: "Call workspace",
        icon: "headset",
        description: "Dial, notes and live call panel",
        template: "Workspace",
      },
      {
        href: "/app/agent/availability",
        label: "Availability",
        icon: "pulse",
        description: "Presence and working hours",
        template: "Settings",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        href: "/app/me",
        label: "My profile",
        icon: "userCircle",
        description: "Your details and workspace identity",
        template: "Profile",
      },
    ],
  },
];

export const agentNavItems: AgentNavItem[] = agentNav.flatMap((group) => group.items);

export function agentItemForPath(pathname: string): AgentNavItem | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return agentNavItems
    .filter((item) => clean === item.href || clean.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

/** Routes an agent session may open; everything else returns to the agent desk. */
export function agentRouteAllowed(pathname: string): boolean {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return (
    clean === "/app/agent" ||
    clean.startsWith("/app/agent/") ||
    clean === "/app/me" ||
    clean === "/app/notifications" ||
    clean === "/app/calls" ||
    clean.startsWith("/app/calls/")
  );
}
