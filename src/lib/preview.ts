"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "callflow:preview-data";
const EVENT = "callflow:preview-updated";

export const previewAvailable = process.env.NODE_ENV !== "production";

export function readPreview(): boolean {
  if (!previewAvailable || typeof window === "undefined") return false;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "on";
  } catch {
    return false;
  }
}

export function writePreview(on: boolean) {
  if (!previewAvailable || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* session storage may be unavailable */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function usePreview(): [boolean, (on: boolean) => void] {
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setPreview(readPreview());
    const sync = () => setPreview(readPreview());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return [
    preview,
    (on: boolean) => {
      writePreview(on);
      setPreview(on);
    },
  ];
}
