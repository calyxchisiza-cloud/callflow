"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export function Softphone() {
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const press = (key: string) => {
    setMessage("");
    setNumber((current) => (current + key).slice(0, 18));
  };

  return (
    <>
      {open && (
        <section
          id="softphone-panel"
          className="softphone"
          role="dialog"
          aria-label="Softphone"
        >
          <header className="softphone-head">
            <span className="softphone-mark" aria-hidden="true">
              <Icon name="phone" size={17} />
            </span>
            <div>
              <strong>Softphone</strong>
              <em>WebRTC · not registered</em>
            </div>
            <button
              type="button"
              className="softphone-close"
              aria-label="Close softphone"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" size={15} />
            </button>
          </header>

          <div className={`softphone-display${number ? "" : " is-empty"}`}>
            {number || "Enter a number"}
          </div>

          <div className="softphone-keypad" role="group" aria-label="Dial pad">
            {keys.map((key) => (
              <button type="button" key={key} onClick={() => press(key)}>
                {key}
              </button>
            ))}
          </div>

          <div className="softphone-actions">
            <button
              type="button"
              className="softphone-clear"
              onClick={() => {
                setNumber("");
                setMessage("");
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="softphone-call"
              onClick={() =>
                setMessage(
                  "Calling needs the telephony service. Nothing was dialled and no call was logged.",
                )
              }
            >
              <Icon name="phone" size={16} />
              Call
            </button>
          </div>

          {message ? (
            <p className="softphone-note" role="status">
              <Icon name="lock" size={13} />
              {message}
            </p>
          ) : (
            <p className="softphone-hint">
              Calls register over SIP once the telephony service issues credentials.
            </p>
          )}

          <footer className="softphone-foot">
            <span>Dial pad stays open across pages</span>
            <Link href="/app/calls/workspace" onClick={() => setOpen(false)}>
              Full workspace
              <Icon name="arrow" size={12} />
            </Link>
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`softphone-fab${open ? " is-open" : ""}`}
        aria-label={open ? "Close softphone" : "Open softphone"}
        aria-expanded={open}
        aria-controls="softphone-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name={open ? "close" : "phone"} size={21} />
        <span className="softphone-fab-text">{open ? "Close" : "Softphone"}</span>
        {!open && <i className="softphone-fab-dot" aria-hidden="true" />}
      </button>
    </>
  );
}
