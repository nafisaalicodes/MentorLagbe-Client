
import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Loading Header */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-28 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
        </div>

        {/* Search Skeleton */}
        <div className="mb-8 h-14 animate-pulse rounded-2xl border border-border bg-card" />

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-48 animate-pulse bg-muted" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />

                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-3 w-5/6 animate-pulse rounded-md bg-muted" />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Preparing your learning experience...
          </p>
        </div>
      </div>
    </main>
  );
}
