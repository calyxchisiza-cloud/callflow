"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { concretePages, moduleMeta, pages } from "@/config/navigation";
import { Icon } from "@/components/icon";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return concretePages.slice(0, 9);
    return concretePages
      .filter((page) => {
        const meta = moduleMeta[page.module];
        return (
          page.title.toLowerCase().includes(term) ||
          page.route.toLowerCase().includes(term) ||
          page.module.toLowerCase().includes(term) ||
          meta?.label.toLowerCase().includes(term)
        );
      })
      .slice(0, 40);
  }, [query]);

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
            placeholder="Jump to a page, module, or route…"
            aria-label="Search pages"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={
              results[activeIndex] ? `palette-result-${results[activeIndex].number}` : undefined
            }
          />
          <kbd>esc</kbd>
        </div>

        <ul className="palette-results" id="palette-results" role="listbox">
          {results.length === 0 && (
            <li className="palette-empty">No page matches “{query}”.</li>
          )}
          {results.map((page, index) => (
            <li key={page.number} role="presentation">
              <button
                type="button"
                id={`palette-result-${page.number}`}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "is-active" : undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => {
                  onClose();
                  router.push(page.route);
                }}
              >
                <span className="palette-icon">
                  <Icon name={moduleMeta[page.module]?.icon ?? "spark"} size={17} />
                </span>
                <span className="palette-copy">
                  <strong>{page.title}</strong>
                  <span>
                    {moduleMeta[page.module]?.label ?? page.module} · {page.template}
                  </span>
                </span>
                <span className="palette-route">{page.route.replace("/app", "")}</span>
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
          <span>
            {concretePages.length} of {pages.length} screens
          </span>
        </div>
      </div>
    </div>
  );
}
