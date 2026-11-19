
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Stats = {
  totalApplied: number;
  accepted: number;
  pending: number;
  rejected: number;
  currentPlan: string;
};

const initialStats: Stats = {
  totalApplied: 0,
  accepted: 0,
  pending: 0,
  rejected: 0,
  currentPlan: "Free",
};

export default function StudentDashboard() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session } = authClient.useSession();

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(
          `${API_URL}/api/student/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load statistics.");
        }

        if (active) {
          setStats(result.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (session?.user) {
      loadStats();
    }

    return () => {
      active = false;
    };
  }, [session]);

  const cards = [
    {
      label: "Total Applied",
      value: stats.totalApplied,
      icon: "▤",
      color: "from-indigo-600 to-blue-600",
      description: "All your applications",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      icon: "✓",
      color: "from-emerald-500 to-teal-600",
      description: "Successfully accepted",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: "◷",
      color: "from-amber-500 to-orange-500",
      description: "Waiting for review",
    },
    {
      label: "Current Plan",
      value: stats.currentPlan,
      icon: "✦",
      color: "from-violet-600 to-fuchsia-600",
      description: "Your membership plan",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-800 p-7 text-white shadow-xl shadow-indigo-200 sm:p-10">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">
              Student workspace
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}!
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100">
              Track your applications, follow your progress, and find the
              right mentor for your learning journey.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-950 transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Explore Tuitions →
          </Link>
        </div>
      </section>

      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Your performance
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A snapshot of your tuition application activity.
          </p>
        </div>

        <Link
          href="/dashboard/student/my-applications"
          className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
        >
          View all applications →
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {card.label}
                </p>
                <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                  {loading ? "—" : card.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-xl font-black text-white shadow-lg`}
              >
                {card.icon}
              </div>
            </div>

            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Application status */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Application insights
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-900">
              Your application progress
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Live account data
          </span>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          {[
            {
              label: "Accepted",
              value: stats.accepted,
              color: "bg-emerald-500",
              percent:
                stats.totalApplied > 0
                  ? (stats.accepted / stats.totalApplied) * 100
                  : 0,
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "bg-amber-500",
              percent:
                stats.totalApplied > 0
                  ? (stats.pending / stats.totalApplied) * 100
                  : 0,
            },
            {
              label: "Rejected",
              value: stats.rejected,
              color: "bg-rose-500",
              percent:
                stats.totalApplied > 0
                  ? (stats.rejected / stats.totalApplied) * 100
                  : 0,
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">
                  {item.label}
                </span>
                <span className="font-bold text-slate-900">
                  {loading ? "—" : item.value}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${loading ? 0 : item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col justify-between gap-5 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Ready for your next learning opportunity?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Discover new tuition listings that match your goals.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
        >
          Browse opportunities →
        </Link>
      </section>
    </div>
  );
}
