"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "callflow-page-transition";

export function AuthTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.documentElement.classList.remove("transition-in");
      return;
    }

    if (!enteredRef.current && window.sessionStorage.getItem(STORAGE_KEY) === "1") {
      enteredRef.current = true;
      window.sessionStorage.removeItem(STORAGE_KEY);
    }

    const settle = () => overlay.classList.remove("is-leaving");
    const finishLeaving = () => {
      overlay.addEventListener("animationend", settle, { once: true });
      overlay.addEventListener("transitionend", settle, { once: true });
      window.setTimeout(settle, 900);
    };

    let timer: number | undefined;

    if (enteredRef.current) {
      overlay.classList.add("is-covering", "is-instant");
      document.documentElement.classList.remove("transition-in");
      void overlay.offsetWidth;
      overlay.classList.remove("is-instant");
      timer = window.setTimeout(() => {
        overlay.classList.remove("is-covering");
        overlay.classList.add("is-leaving");
        finishLeaving();
      }, 40);
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;

      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.getAttribute("href") ?? "", window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== "/landing") return;

      event.preventDefault();
      event.stopPropagation();
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      overlay.classList.remove("is-leaving");
      void overlay.offsetWidth;
      overlay.classList.add("is-covering");

      let navigated = false;
      const go = () => {
        if (navigated) return;
        navigated = true;
        window.location.href = url.href;
      };
      overlay.addEventListener("transitionend", go, { once: true });
      window.setTimeout(go, 620);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="page-transition" ref={overlayRef} aria-hidden="true">
      <div className="page-transition-inner">
        <img src="/callflow-mark.svg" alt="" width={32} height={32} />
        <span>callflow</span>
      </div>
    </div>
  );
}
