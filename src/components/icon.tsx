import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="2.8" y="13" width="4.2" height="6" rx="2" />
      <rect x="17" y="13" width="4.2" height="6" rx="2" />
      <path d="M19 19v.6a2.4 2.4 0 0 1-2.4 2.4H13" />
    </>
  ),
  phone: (
    <path d="M6.6 3.8 9 4.4a1.4 1.4 0 0 1 1 1.6l-.5 2.6a1.4 1.4 0 0 1-.9 1.1l-1.3.4a12.6 12.6 0 0 0 5.6 5.6l.4-1.3a1.4 1.4 0 0 1 1.1-.9l2.6-.5a1.4 1.4 0 0 1 1.6 1l.6 2.4a1.6 1.6 0 0 1-1.6 2 16.6 16.6 0 0 1-14.6-14.6 1.6 1.6 0 0 1 2-1.6Z" />
  ),
  queue: (
    <>
      <path d="M4 7h16M4 12h10M4 17h7" />
      <circle cx="18.5" cy="14.5" r="3.5" />
      <path d="M18.5 13v1.7l1.2.8" />
    </>
  ),
  flow: (
    <>
      <rect x="3.5" y="3.5" width="6" height="5" rx="1.6" />
      <rect x="14.5" y="15.5" width="6" height="5" rx="1.6" />
      <rect x="3.5" y="15.5" width="6" height="5" rx="1.6" />
      <path d="M6.5 8.5v3.2a2 2 0 0 0 2 2h4.8a2 2 0 0 1 2 2v-.2M6.5 15.5v-1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20a7.4 7.4 0 0 1 14.4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19a5.6 5.6 0 0 1 11 0" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.2M17.5 14.2A5.6 5.6 0 0 1 21 19" />
    </>
  ),
  building: (
    <>
      <path d="M4.5 20V5.2a1.7 1.7 0 0 1 1.7-1.7h7.6a1.7 1.7 0 0 1 1.7 1.7V20" />
      <path d="M15.5 9h2.6a1.4 1.4 0 0 1 1.4 1.4V20M3 20h18" />
      <path d="M8 8h1.5M8 11.5h1.5M8 15h1.5M12 8h1.5M12 11.5h1.5M12 15h1.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  trend: (
    <>
      <path d="M3.5 16.5 8 12l3.2 3L20 7" />
      <path d="M14.8 7H20v5.2" />
    </>
  ),
  check: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path d="m8 12 2.6 2.6L16.5 9" />
    </>
  ),
  ticket: (
    <>
      <path d="M3.5 9V7.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2V9a3 3 0 0 0 0 6v1.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V15a3 3 0 0 0 0-6Z" />
      <path d="M12 6.5v11" strokeDasharray="2 2.4" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10.5v3a1.8 1.8 0 0 0 1.8 1.8h1.5l6.2 3.4V5.3L7.3 8.7H5.8A1.8 1.8 0 0 0 4 10.5Z" />
      <path d="M17.5 9a4.6 4.6 0 0 1 0 6M8 15.3V20" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="5.3" />
      <path d="m8.5 13.6-1 7 4.5-2.4 4.5 2.4-1-7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 19 6v5.4c0 4.2-2.8 7.4-7 9.4-4.2-2-7-5.2-7-9.4V6l7-2.8Z" />
      <path d="m8.8 11.8 2.3 2.3 4.1-4.3" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V7M17 20v-9" />
    </>
  ),
  server: (
    <>
      <rect x="3.5" y="4" width="17" height="6" rx="2" />
      <rect x="3.5" y="14" width="17" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01" />
    </>
  ),
  key: (
    <>
      <circle cx="8.2" cy="8.2" r="4.2" />
      <path d="m11.4 11.4 8 8M16 16l-2 2M18.5 18.5l-2 2" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3.5v5M15 3.5v5" />
      <path d="M6.5 8.5h11v2.2a5.5 5.5 0 0 1-11 0V8.5Z" />
      <path d="M12 16.2V21" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9.5a6 6 0 1 0-12 0c0 4.4-1.8 5.6-1.8 5.6h15.6S18 13.9 18 9.5Z" />
      <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  cpu: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.2" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9 3v3.5M15 3v3.5M9 17.5V21M15 17.5V21M3 9h3.5M3 15h3.5M17.5 9H21M17.5 15H21" />
    </>
  ),
  userCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="10" r="2.8" />
      <path d="M6.8 18.2a6 6 0 0 1 10.4 0" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
      <path d="m5 7 7 5.5L19 7" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.2-5.2 9.5-5.2 9.5 5.2 9.5 5.2-3.2 5.2-9.5 5.2S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m4 4 16 16" />
      <path d="M9.9 5.2A10 10 0 0 1 12 5c6.3 0 9.5 5.2 9.5 5.2a17 17 0 0 1-2.9 3.4M6.2 6.7A17.6 17.6 0 0 0 2.5 12S5.7 17.2 12 17.2c1 0 1.9-.1 2.7-.4" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.5 15.5 4.4 4.4" />
    </>
  ),
  panel: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  arrow: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  spark: <path d="M12 3.5c.7 4.6 2.9 6.8 7.5 7.5-4.6.7-6.8 2.9-7.5 7.5-.7-4.6-2.9-6.8-7.5-7.5 4.6-.7 6.8-2.9 7.5-7.5Z" />,
  pulse: (
    <>
      <path d="M3 12h4l2.4-6 4.2 12 2.4-6h5" />
    </>
  ),
};

type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 18, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
