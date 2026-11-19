
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Application = {
  _id: string;
  tuitionId?: string;
  tuitionTitle: string;
  subject?: string;
  tutorName?: string;
  tutorEmail?: string;
  monthlyFee?: number;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function MyApplicationsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch applications
  useEffect(() => {
    if (isPending || !session?.user) return;

    let cancelled = false;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        const response = await fetch(
          `${API_URL}/api/student/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load applications."
          );
        }

        if (!cancelled) {
          setApplications(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHasLoaded(true);
        }
      }
    };

    fetchApplications();

    return () => {
      cancelled = true;
    };
  }, [session?.user, isPending, refreshKey]);

  // Refresh
  const loadApplications = useCallback(() => {
    setLoading(true);
    setRefreshKey((previous) => previous + 1);
  }, []);

  // Cancel application
  const handleCancel = async (applicationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this pending application?"
    );

    if (!confirmed) return;

    try {
      setCancelId(applicationId);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/student/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to cancel application."
        );
      }

      setApplications((previous) =>
        previous.filter(
          (application) => application._id !== applicationId
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Cancellation failed."
      );
    } finally {
      setCancelId(null);
    }
  };

  // Date formatter
  const formatDate = (date: string) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Fee formatter
  const formatFee = (fee?: number) =>
    new Intl.NumberFormat("en-BD").format(fee || 0);

  // Initial session loading
  if (isPending) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    );
  }

  // No authenticated session
  if (!session?.user) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
        <h2 className="text-xl font-black text-slate-900">
          Please sign in
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to view your tuition applications.
        </p>
        <Link
          href="/sign-in"
          className="mt-5 inline-flex rounded-xl bg-indigo-700 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-800"
        >
          Sign in →
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-7 text-white shadow-xl sm:p-9">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
            Student workspace
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                My Applications
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100">
                Keep track of your tuition applications and stay updated
                on every opportunity.
              </p>
            </div>

            <Link
              href="/tuitions"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-950 transition hover:bg-indigo-50"
            >
              Find more tuitions →
            </Link>
          </div>
        </div>
      </section>

      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Application history
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {applications.length} application
            {applications.length === 1 ? "" : "s"} found
          </p>
        </div>

        <button
          onClick={loadApplications}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading || (!hasLoaded && !error) ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        /* Empty state */
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
            📚
          </div>

          <h3 className="mt-5 text-xl font-black text-slate-900">
            No applications yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
            Your application history will appear here once you apply for
            a tuition. Discover an opportunity that matches your goals.
          </p>

          <Link
            href="/tuitions"
            className="mt-6 inline-flex rounded-xl bg-indigo-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
          >
            Explore tuitions →
          </Link>
        </section>
      ) : (
        /* Application cards */
        <div className="grid gap-5 xl:grid-cols-2">
          {applications.map((application) => (
            <article
              key={application._id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-400" />

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                      {application.subject || "Tuition application"}
                    </p>

                    <h3 className="mt-2 break-words text-xl font-black leading-snug text-slate-900">
                      {application.tuitionTitle || "Untitled tuition"}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${
                      statusStyles[
                        application.status as keyof typeof statusStyles
                      ] || "bg-slate-100 text-slate-600 ring-slate-200"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Tutor name
                    </p>

                    <p className="mt-1 break-words text-sm font-bold text-slate-800">
                      {application.tutorName || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Monthly fee
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      ৳{formatFee(application.monthlyFee)}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-slate-400">
                      Tutor email
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                      {application.tutorEmail || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs text-slate-400">
                      Application submitted
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatDate(application.appliedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {application.tuitionId && (
                      <Link
                        href={`/tuitions/${application.tuitionId}`}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        View tuition
                      </Link>
                    )}

                    {application.status === "pending" && (
                      <button
                        onClick={() => handleCancel(application._id)}
                        disabled={cancelId === application._id}
                        className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancelId === application._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
