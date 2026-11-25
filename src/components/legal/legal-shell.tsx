import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalShellProps = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalShell({ title, description, updated, sections }: LegalShellProps) {
  return (
    <div className="legal">
      <header className="legal-top">
        <Link className="legal-brand" href="/" aria-label="Callflow home">
          <img src="/callflow-mark.svg" alt="" width={26} height={26} />
          <span>callflow</span>
        </Link>
        <nav className="legal-nav" aria-label="Site">
          <Link href="/landing">Product</Link>
          <Link href="/">Create account</Link>
          <Link className="legal-cta" href="/login">
            Log in
            <Icon name="arrow" size={13} />
          </Link>
        </nav>
      </header>

      <main className="legal-main">
        <div className="legal-hero">
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-lede">{description}</p>
          <p className="legal-meta">
            <span>Last updated {updated}</span>
            <span className="legal-dot" aria-hidden="true" />
            <span className="legal-badge">Pre-launch draft</span>
          </p>
        </div>

        <div className="legal-layout">
          <aside className="legal-toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            <div className="legal-actions">
              <Link className="legal-start" href="/">
                Get started
                <Icon name="arrow" size={13} />
              </Link>
              <Link className="legal-login" href="/login">
                Log in
                <Icon name="arrow" size={13} />
              </Link>
            </div>
          </aside>

          <article className="legal-doc">
            {sections.map((section, index) => (
              <section className="legal-section" id={section.id} key={section.id}>
                <h2>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="legal-foot">
        <span>© 2026 Callflow</span>
        <div>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/landing">Marketing site</Link>
        </div>
      </footer>
    </div>
  );
}
