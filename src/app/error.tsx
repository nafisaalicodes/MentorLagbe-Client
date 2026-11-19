
"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCcw,
  GraduationCap,
} from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-background px-4 py-16">

      <div className="w-full max-w-lg text-center">

        {/* Brand */}
        <Link href="/" className="mb-12 inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Mentor<span className="text-primary">Lagbe</span>
          </span>
        </Link>

        {/* Error Icon */}
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Message */}
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-destructive">
          Something went wrong
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          We hit an unexpected error.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          Sorry for the inconvenience. Something unexpected happened
          while loading this page. Please try again.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          © 2026 MentorLagbe. All rights reserved.
        </p>
      </div>
    </main>
  );
}
