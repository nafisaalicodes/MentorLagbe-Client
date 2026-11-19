import Link from "next/link";
import Form from "next/form";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  House,
  MapPin,
  Search,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { SaveTuitionButton, TuitionAlerts } from "./BrowseActions";

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location?: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage?: string;
  description?: string;
  tutorName?: string;
  createdAt?: string;
};

type SearchParams = {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
  sort?: string;
  page?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PAGE_SIZE = 9;

const subjects = [
  "Mathematics",
  "Higher Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Bangla",
  "All Subjects",
  "Programming",
  "IELTS",
];

const classLevels = [
  "Class 3-5",
  "Class 5",
  "Class 6-8",
  "Class 9-10",
  "Class 11-12",
  "University",
  "Adult",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "fee-low", label: "Fee: Low to High" },
  { value: "fee-high", label: "Fee: High to Low" },
];

const paramKeys = [
  "search",
  "subject",
  "classLevel",
  "mode",
  "sort",
  "page",
] as const;

async function getTuitions(params: SearchParams): Promise<Tuition[]> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.subject) query.set("subject", params.subject);
  if (params.classLevel) query.set("classLevel", params.classLevel);
  if (params.mode) query.set("mode", params.mode);

  try {
    const response = await fetch(
      `${API_URL}/api/tuitions/browse?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tuition listings");
    }

    const result = await response.json();

    if (Array.isArray(result)) return result;

return result.data || result.tuitions || [];
  } catch (error) {
    console.error("Tuition Fetch Error:", error);
    return [];
  }
}

function buildHref(
  params: SearchParams,
  overrides: Partial<SearchParams> = {}
) {
  const merged = { ...params, ...overrides };
  const query = new URLSearchParams();

  for (const key of paramKeys) {
    const value = merged[key];
    if (value) query.set(key, value);
  }

  const search = query.toString();
  return search ? `/tuitions?${search}` : "/tuitions";
}

function timeAgo(iso?: string) {
  if (!iso) return "";

  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return "";

  const minutes = Math.floor((Date.now() - timestamp) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} wk${weeks > 1 ? "s" : ""} ago`;

  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function sortTuitions(tuitions: Tuition[], sort?: string) {
  const list = [...tuitions];

  switch (sort) {
    case "fee-low":
      return list.sort((a, b) => (a.monthlyFee || 0) - (b.monthlyFee || 0));
    case "fee-high":
      return list.sort((a, b) => (b.monthlyFee || 0) - (a.monthlyFee || 0));
    default:
      // The API already returns newest listings first.
      return list;
  }
}

function getPages(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);

  for (let page = current - 1; page <= current + 1; page += 1) {
    if (page >= 1 && page <= total) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const withGaps: (number | "gap")[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) withGaps.push("gap");
    withGaps.push(page);
  });

  return withGaps;
}

const activeFilterLabels: Record<string, (value: string) => string> = {
  search: (value) => `Search: ${value}`,
  subject: (value) => `Subject: ${value}`,
  classLevel: (value) => `Class: ${value}`,
  mode: (value) => `Mode: ${value === "Offline" ? "In-Person" : value}`,
};

export default async function BrowseTution({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const allTuitions = sortTuitions(await getTuitions(params), params.sort);

  const currentPage = Math.max(
    1,
    Math.min(Number(params.page) || 1, Math.max(1, Math.ceil(allTuitions.length / PAGE_SIZE)))
  );
  const total = allTuitions.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleTuitions = allTuitions.slice(startIndex, startIndex + PAGE_SIZE);

  const activeFilters = paramKeys
    .filter((key) => key !== "sort" && key !== "page" && params[key])
    .map((key) => ({ key, value: params[key] as string }));

  const rangeStart = total === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + PAGE_SIZE, total);
  const currentSortLabel =
    sortOptions.find((option) => option.value === params.sort)?.label ||
    sortOptions[0].label;

  return (
    <main className="min-h-screen bg-base pt-[68px]">
      {/* Header, Search & Filters */}
      <section className="border-b border-border bg-card px-5 pt-8 pb-8 md:pt-10">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="transition hover:text-primary">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-heading">Browse Tuitions</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border-blue bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <span aria-hidden="true">◈</span>
                Direct Bangladesh Tuition Exchange
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-heading md:text-5xl">
                Find Your Perfect Tuition
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
                Discover vetted tuition opportunities matching your curriculum,
                preferred schedule, and location across Bangladesh. Connect
                directly with verified guardians and students with zero agent
                commission.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-base px-3.5 py-2 text-xs font-medium text-body">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {total} Active Tuition{total !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-base px-3.5 py-2 text-xs font-medium text-body">
                <span className="h-2 w-2 rounded-full bg-accent-dark" aria-hidden="true" />
                Updated just now
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-base px-3.5 py-2 text-xs font-medium text-body">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Dhaka, Ctg &amp; Online
              </span>
            </div>
          </div>

          {/* Search */}
          <Form
            action="/tuitions"
            className="mt-8 rounded-2xl border border-border bg-base p-5 md:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <label htmlFor="search" className="sr-only">
                  Search tuitions
                </label>
                <input
                  id="search"
                  name="search"
                  type="search"
                  defaultValue={params.search || ""}
                  placeholder="Search by tuition title or subject..."
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                className="btn-primary shrink-0 gap-2 px-7 py-3.5 sm:rounded-xl"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Find Tuitions
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="subject" className="mb-2 block text-xs font-semibold text-heading">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue={params.subject || ""}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="classLevel" className="mb-2 block text-xs font-semibold text-heading">
                  Class Level
                </label>
                <select
                  id="classLevel"
                  name="classLevel"
                  defaultValue={params.classLevel || ""}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">Class 1–12 / HSC</option>
                  {classLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mode" className="mb-2 block text-xs font-semibold text-heading">
                  Tuition Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  defaultValue={params.mode || ""}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">All Modes</option>
                  <option value="Offline">In-Person Home Tuition</option>
                  <option value="Online">Live Online Tuition</option>
                </select>
              </div>

              <div>
                <label htmlFor="sort" className="mb-2 block text-xs font-semibold text-heading">
                  Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={params.sort || "newest"}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Form>

          {/* Active filters */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-muted">Active filters:</span>

              {activeFilters.length === 0 ? (
                <span className="text-muted">None</span>
              ) : (
                <>
                  {activeFilters.map((filter) => (
                    <Link
                      key={filter.key}
                      href={buildHref(params, { [filter.key]: "", page: "" })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-blue bg-base px-3 py-1.5 text-xs font-medium text-heading transition hover:border-primary hover:text-primary"
                    >
                      {activeFilterLabels[filter.key]?.(filter.value) || filter.value}
                      <X className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  ))}

                  <Link
                    href="/tuitions"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Clear all
                  </Link>
                </>
              )}
            </div>

            <p className="text-muted">
              Showing {rangeStart}–{rangeEnd} of {total} opportunit
              {total !== 1 ? "ies" : "y"}
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-heading">Available Tuitions</h2>
            <p className="mt-1 text-sm text-muted">
              {currentSortLabel} · Admin approved listings only
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-primary shadow-sm">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Verified &amp; Approved Listings
          </span>
        </div>

        {visibleTuitions.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleTuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="card flex h-full flex-col p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified Post
                  </span>

                  <span className="text-xs text-muted">
                    {timeAgo(tuition.createdAt)}
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-heading">
                  {tuition.title}
                </h3>

                <p className="mt-1.5 text-sm text-muted">
                  {tuition.subject} · {tuition.classLevel}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-base px-2.5 py-1.5 font-medium text-body">
                    {tuition.mode === "Online" ? (
                      <Wifi className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    ) : (
                      <House className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    )}
                    {tuition.mode === "Online" ? "Live Online" : "In-Person Home"}
                  </span>

                  {tuition.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-base px-2.5 py-1.5 font-medium text-body">
                      <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {tuition.location}
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm text-body">
                  <p className="flex items-start gap-2">
                    <CalendarCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary/70"
                      aria-hidden="true"
                    />
                    {tuition.daysPerWeek} days / week
                  </p>

                  <p className="flex items-start gap-2">
                    <Users
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary/70"
                      aria-hidden="true"
                    />
                    {tuition.tutorName
                      ? `Tutor: ${tuition.tutorName}`
                      : "Tutor revealed after application"}
                  </p>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      Salary Offer
                    </p>
                    <p className="text-xl font-extrabold text-heading">
                      ৳{tuition.monthlyFee?.toLocaleString("en-BD")}
                      <span className="text-xs font-medium text-muted"> /mo</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <SaveTuitionButton id={tuition._id} />

                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="btn-primary gap-1.5 px-4 py-2.5 text-xs"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mb-4 text-5xl" aria-hidden="true">
              🔎
            </div>
            <h3 className="text-xl font-bold text-heading">No Tuitions Found</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
              We couldn&apos;t find any tuition matching your search. Try
              changing your keywords or filters.
            </p>
            <Link href="/tuitions" className="btn-primary mt-6">
              View All Tuitions
            </Link>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 sm:flex-row">
            <p className="text-sm text-muted">
              Showing {rangeStart} to {rangeEnd} of {total} Results
            </p>

            <nav aria-label="Pagination" className="flex items-center gap-1.5">
              {currentPage > 1 ? (
                <Link
                  href={buildHref(params, { page: String(currentPage - 1) })}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-body transition hover:border-primary hover:text-primary"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-subtle">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </span>
              )}

              {getPages(currentPage, totalPages).map((page, index) =>
                page === "gap" ? (
                  <span
                    key={`gap-${index}`}
                    className="px-1 text-sm text-muted"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={buildHref(params, { page: page === 1 ? "" : String(page) })}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={
                      page === currentPage
                        ? "flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-white"
                        : "flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium text-body transition hover:border-primary hover:text-primary"
                    }
                  >
                    {page}
                  </Link>
                )
              )}

              {currentPage < totalPages ? (
                <Link
                  href={buildHref(params, { page: String(currentPage + 1) })}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-body transition hover:border-primary hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-subtle">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </nav>
          </div>
        )}
      </section>

      {/* Bottom CTA cards */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:pb-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TuitionAlerts />

          <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-lg font-bold text-heading">
                  Can&apos;t Find Your Ideal Match?
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Let prospective guardians discover your profile directly
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-body">
              Over 65% of verified guardians search our verified tutor database
              directly instead of posting public notices. Publish your profile
              to get contacted first.
            </p>

            <div className="mt-auto flex flex-wrap gap-3 pt-5">
              <Link href="/sign-up" className="btn-primary">
                Create Tutor Profile
              </Link>
              <Link href="/tuitions" className="btn-outline">
                Reset Filters
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
