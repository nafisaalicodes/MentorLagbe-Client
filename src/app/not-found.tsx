
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  SearchX,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-background px-4 py-16">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-xl text-center">

        {/* Logo */}
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Mentor<span className="text-primary">Lagbe</span>
          </span>
        </Link>

        {/* Error Illustration */}
        <div className="relative mx-auto mb-8 flex h-44 w-44 items-center justify-center rounded-full border border-border bg-card shadow-sm">
          <div className="absolute inset-3 rounded-full border border-dashed border-primary/30" />
          <SearchX className="h-16 w-16 text-primary" />

          <span className="absolute -right-2 top-5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-bold shadow-sm">
            404
          </span>
        </div>

        {/* Message */}
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Page Not Found
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Lost your way?
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
          Looks like this page has gone on a little adventure.
          The page you are looking for does not exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/tuitions"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
          >
            Explore Tuitions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          © 2026 MentorLagbe. Learn, Teach & Grow.
        </p>
      </div>
    </main>
  );
}
