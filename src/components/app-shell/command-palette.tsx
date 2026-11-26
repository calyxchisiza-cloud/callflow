"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { concretePages, moduleMeta, pages } from "@/config/navigation";
import { Icon } from "@/components/icon";

export type PaletteItem = {
  id: string;
  title: string;
  route: string;
  group: string;
  template: string;
  icon: string;
};

const registryItems: PaletteItem[] = concretePages.map((page) => ({
  id: String(page.number),
  title: page.title,
  route: page.route,
  group: moduleMeta[page.module]?.label ?? page.module,
  template: page.template,
  icon: moduleMeta[page.module]?.icon ?? "spark",
}));

const domId = (id: string) => `palette-result-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  items?: PaletteItem[];
};

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const source = items ?? registryItems;

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return source.slice(0, 9);
    return source
      .filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.route.toLowerCase().includes(term) ||
          item.group.toLowerCase().includes(term),
      )
      .slice(0, 40);
  }, [query, source]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "Enter") {
        const target = results[activeIndex];
        if (!target) return;
        event.preventDefault();
        onClose();
        router.push(target.route);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClose, open, results, router]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="palette" role="presentation" onMouseDown={onClose}>
      <div
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a page"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="palette-search">
          <Icon name="search" size={19} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              items ? "Jump to an agent page…" : "Jump to a page, module, or route…"
            }
            aria-label="Search pages"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={
              results[activeIndex] ? domId(results[activeIndex].id) : undefined
            }
          />
          <kbd>esc</kbd>
        </div>

        <ul className="palette-results" id="palette-results" role="listbox">
          {results.length === 0 && (
            <li className="palette-empty">No page matches “{query}”.</li>
          )}
          {results.map((item, index) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                id={domId(item.id)}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "is-active" : undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => {
                  onClose();
                  router.push(item.route);
                }}
              >
                <span className="palette-icon">
                  <Icon name={item.icon} size={17} />
                </span>
                <span className="palette-copy">
                  <strong>{item.title}</strong>
                  <span>
                    {item.group} · {item.template}
                  </span>
                </span>
                <span className="palette-route">{item.route.replace("/app", "")}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>{items ? `${source.length} agent pages` : `${concretePages.length} of ${pages.length} screens`}</span>
        </div>
      </div>
    </div>
  );
}
