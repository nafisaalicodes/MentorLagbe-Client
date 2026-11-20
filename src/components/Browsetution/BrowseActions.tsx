"use client";

import { useSyncExternalStore, useState } from "react";
import { BellRing, Bookmark, CircleCheck } from "lucide-react";

const STORAGE_KEY = "saved-tuitions";
const CHANGE_EVENT = "saved-tuitions-changed";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseSaved(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* Bookmark toggle for a tuition listing (persisted in localStorage). */
export function SaveTuitionButton({ id }: { id: string }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const saved = parseSaved(stored).includes(id);

  const toggle = () => {
    const current = parseSaved(getSnapshot());
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — the state simply will not persist */
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved tuitions" : "Save this tuition"}
      title={saved ? "Remove from saved" : "Save for later"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted transition hover:border-primary hover:text-primary"
    >
      <Bookmark
        className={`h-4 w-4 ${saved ? "fill-current text-primary" : ""}`}
      />
    </button>
  );
}

/* "Get Real-Time Tuition Alerts" signup card on the Browse Tuitions page. */
export function TuitionAlerts() {
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = phone.trim();
    if (!value) return;

    setConfirmed(value);
    setPhone("");
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-primary">
          <BellRing className="h-5 w-5" />
        </span>

        <div>
          <h3 className="text-lg font-bold text-heading">
            Get Real-Time Tuition Alerts
          </h3>
          <p className="mt-1 text-sm text-muted">
            Instant WhatsApp &amp; SMS notifications matching your skills
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-body">
        Never miss an urgent job in your preferred neighborhood. Top tutors
        receive notifications within seconds of verified postings.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="alert-phone" className="sr-only">
          WhatsApp number
        </label>
        <input
          id="alert-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter WhatsApp Number (+880)"
          className="w-full flex-1 rounded-xl border border-border bg-base px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        <button type="submit" className="btn-primary shrink-0">
          Activate Alerts
        </button>
      </form>

      
    </article>
  );
}
