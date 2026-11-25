import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Callflow CRM",
    template: "%s · Callflow CRM",
  },
  description:
    "Callflow CRM brings calls, customer histories, and follow-ups together for support teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
