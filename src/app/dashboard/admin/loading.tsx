export default function AdminDashboardLoading() {
  return (
    <div className="space-y-7" aria-busy="true">
      {/* Header skeleton */}
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />

      {/* Heading skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
        <div className="h-7 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

        <p className="text-sm font-medium text-muted">
          Loading admin workspace...
        </p>
      </div>
    </div>
  );
}
