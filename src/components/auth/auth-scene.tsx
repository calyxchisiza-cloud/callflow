"use client";

import { useEffect, useRef } from "react";

export function AuthScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;

    const onMove = (event: PointerEvent) => {
      const bounds = node.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      node.style.setProperty("--auth-scene-x", `${(-x * 7).toFixed(1)}px`);
      node.style.setProperty("--auth-scene-y", `${(-y * 5).toFixed(1)}px`);
    };
    const onLeave = () => {
      node.style.setProperty("--auth-scene-x", "0px");
      node.style.setProperty("--auth-scene-y", "0px");
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="auth-scene" ref={sceneRef}>
      <img
        className="auth-scene-art"
        src="/assets/images/image-2.webp?v=2"
        alt="Call center agents collaborating around a shared CRM workspace"
      />
      <div className="auth-scene-shade" aria-hidden="true" />
      <div className="auth-caption">
        <span className="auth-kicker">
          <span className="auth-kicker-dot" aria-hidden="true" /> Customer conversations, connected
        </span>
        <p>
          Every call, in
          <br />
          <em>one clear view.</em>
        </p>
      </div>
      <div className="auth-footnote">
        <span aria-hidden="true">✳</span> Every call. One clear customer view.
      </div>
    </div>
  );
}
