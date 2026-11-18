
import Link from "next/link";

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
};

type SearchParams = {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

    return result.data || [];
  } catch (error) {
    console.error("Tuition Fetch Error:", error);
    return [];
  }
}

const subjects = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "Bangla",
];

const classLevels = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Admission",
];
export default async function BrowseTution({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {

  const params = await searchParams;
  const tuitions = await getTuitions(params);

  return (
    <main className="min-h-screen bg-base">
      {/* Hero Section */}
      <section className="bg-primary px-5 py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            Find Your Perfect Tutor
          </p>

          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
            Explore Tuition Opportunities
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 md:text-base">
            Discover trusted tuition opportunities, connect with tutors,
            and find the right learning support for your academic journey.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2">
              Verified Listings
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              Online & Offline
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              Multiple Subjects
            </span>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="mb-8">
          <span className="section-label">Browse Opportunities</span>
          <h2 className="section-heading">Find the Right Tuition</h2>
          <p className="section-subtext mt-3 max-w-2xl">
            Search and filter available tuition listings based on your
            preferred subject, class level, and learning mode.
          </p>
        </div>

        {/* Search and Filters */}
        <form
          action="/tuitions"
          method="GET"
          className="mb-10 rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Search
              </label>
              <input
                id="search"
                name="search"
                type="search"
                defaultValue={params.search || ""}
                placeholder="Search title or subject..."
                className="w-full rounded-xl border border-border bg-base px-4 py-3 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                defaultValue={params.subject || ""}
                className="w-full rounded-xl border border-border bg-base px-4 py-3 text-sm text-body outline-none focus:border-primary"
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
              <label
                htmlFor="classLevel"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Class Level
              </label>
              <select
                id="classLevel"
                name="classLevel"
                defaultValue={params.classLevel || ""}
                className="w-full rounded-xl border border-border bg-base px-4 py-3 text-sm text-body outline-none focus:border-primary"
              >
                <option value="">All Classes</option>
                {classLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mode"
                className="mb-2 block text-sm font-semibold text-heading"
              >
                Tuition Mode
              </label>
              <select
                id="mode"
                name="mode"
                defaultValue={params.mode || ""}
                className="w-full rounded-xl border border-border bg-base px-4 py-3 text-sm text-body outline-none focus:border-primary"
              >
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              Search Tuitions
            </button>

            <Link href="/tuitions" className="btn-outline">
              Clear Filters
            </Link>
          </div>
        </form>

        {/* Results Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-heading">
              Available Tuitions
            </h3>
            <p className="mt-1 text-sm text-muted">
              {tuitions.length} tuition{tuitions.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm">
            Admin Approved Listings
          </span>
        </div>

        {/* Tuition Grid */}
        {tuitions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="card flex h-full flex-col overflow-hidden"
              >
                <div className="relative h-48 w-full bg-base-alt">
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/5 text-5xl font-bold text-primary/30">
                      {tuition.subject?.charAt(0) || "T"}
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                    {tuition.mode}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-primary">
                      {tuition.subject}
                    </span>
                    <span className="rounded-full bg-base-alt px-3 py-1 text-xs font-medium text-body">
                      {tuition.classLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-heading">
                    {tuition.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                    {tuition.description || "Explore this tuition opportunity and apply to get started."}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-body">
                    {tuition.location && (
                      <p>
                        <span className="font-semibold text-heading">Location:</span>{" "}
                        {tuition.location}
                      </p>
                    )}

                    <p>
                      <span className="font-semibold text-heading">Days:</span>{" "}
                      {tuition.daysPerWeek} days/week
                    </p>

                    <p>
                      <span className="font-semibold text-heading">Tutor:</span>{" "}
                      {tuition.tutorName || "Available after application"}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
                    <div>
                      <p className="text-xs text-muted">Monthly Fee</p>
                      <p className="text-xl font-extrabold text-primary">
                        ৳{tuition.monthlyFee?.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="btn-primary px-5 py-2.5"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mb-4 text-5xl">🔎</div>
            <h3 className="text-xl font-bold text-heading">
              No Tuitions Found
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
              We couldn&apos;t find any tuition matching your search. Try
              changing your keywords or filters.
            </p>
            <Link href="/tuitions" className="btn-primary mt-6">
              View All Tuitions
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
