"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Clock3,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  FileText,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

import {
  StatCard,
  StatusBadge,
  QuickAction,
  EmptyState,
} from "../TutorUI";

type AdminStats = {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  totalAdmins: number;
  totalTuitions: number;
  pendingTuitions: number;
  approvedTuitions: number;
  rejectedTuitions: number;
  totalApplications: number;
  totalPayments: number;
  totalRevenue: number;
};

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel?: string;
  tutorName?: string;
  monthlyFee?: number;
  approvalStatus: string;
  createdAt?: string;
};

type Payment = {
  _id: string;
  userName?: string;
  userEmail?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
};

const emptyStats: AdminStats = {
  totalUsers: 0,
  totalTutors: 0,
  totalStudents: 0,
  totalAdmins: 0,
  totalTuitions: 0,
  pendingTuitions: 0,
  approvedTuitions: 0,
  rejectedTuitions: 0,
  totalApplications: 0,
  totalPayments: 0,
  totalRevenue: 0,
};

const money = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(Number(value) || 0);
  } catch {
    return `$${(Number(value) || 0).toFixed(2)}`;
  }
};

const formatDate = (value?: string) => {
  if (!value) return "Date unavailable";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminOverviewClient() {
  const { data: session } = authClient.useSession();

  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [pendingTuitions, setPendingTuitions] = useState<Tuition[]>([]);
  const [latestPayments, setLatestPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    // Platform statistics drive the whole page, so a failure here is fatal.
    async function loadStats() {
      try {
        const result = await apiFetch("/api/admin/stats");

        if (!ignore) {
          setStats({ ...emptyStats, ...(result.data || {}) });
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load platform statistics."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }

      // Supporting panels degrade quietly if they cannot be loaded.
      try {
        const result = await apiFetch("/api/admin/tuitions?status=pending");

        if (!ignore) setPendingTuitions(result.data || []);
      } catch {
        if (!ignore) setPendingTuitions([]);
      }

      try {
        const result = await apiFetch("/api/admin/payments");

        if (!ignore) setLatestPayments((result.data || []).slice(0, 5));
      } catch {
        if (!ignore) setLatestPayments([]);
      }
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: `${stats.totalStudents} students · ${stats.totalAdmins} admins`,
      icon: Users,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Total Tutors",
      value: stats.totalTutors,
      description: `${stats.totalTuitions} tuition posts published`,
      icon: GraduationCap,
      color: "bg-violet-100 text-violet-700",
    },
    {
      title: "Pending Tuitions",
      value: stats.pendingTuitions,
      description: "Waiting for your approval",
      icon: Clock3,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Approved Tuitions",
      value: stats.approvedTuitions,
      description: "Live on the marketplace",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Total Stripe Revenue",
      value: money(stats.totalRevenue),
      description: `${stats.totalPayments} settled payments`,
      icon: CreditCard,
      color: "bg-cyan-100 text-cyan-700",
    },
  ];

  const actions = [
    {
      title: "User Management",
      description: "Change roles across students, tutors and admins",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Tuition Approvals",
      description: "Approve or reject listings submitted by tutors",
      href: "/dashboard/admin/tuitions",
      icon: FileText,
    },
    {
      title: "Transactions",
      description: "Review Stripe subscription payment records",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light p-7 text-white shadow-xl sm:p-10">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
              Admin workspace
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back,{" "}
              {session?.user?.name?.split(" ")[0] || "Admin"}!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
              Moderate tuition listings, manage user roles and keep an eye
              on every Stripe payment across MentorLagbe.
            </p>
          </div>

          <Link
            href="/dashboard/admin/tuitions"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary-dark transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Review pending tuitions →
          </Link>
        </div>
      </section>

      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
            Platform health
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-heading">
            Dashboard Overview
          </h2>

          <p className="mt-1 text-sm text-body">
            Live statistics from users, tuitions and Stripe payments.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-heading transition hover:bg-base disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <span>{error}</span>

          <button
            onClick={handleRefresh}
            className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats cards */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">
            Shortcuts
          </p>

          <h3 className="mt-2 text-xl font-black tracking-tight text-heading">
            Manage your platform
          </h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {actions.map((action) => (
            <QuickAction key={action.href} {...action} />
          ))}
        </div>
      </section>

      {/* Bottom panels */}
      <section className="grid gap-5 xl:grid-cols-2">
        {/* Pending approvals */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-heading">
                Needs your approval
              </h3>

              <p className="mt-1 text-xs text-body">
                Tuition posts waiting for moderation
              </p>
            </div>

            <Link
              href="/dashboard/admin/tuitions"
              className="text-sm font-bold text-primary transition hover:text-primary-light"
            >
              Manage all →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {pendingTuitions.length === 0 ? (
              <EmptyState
                title="Approval queue is clear"
                description="No tuition posts are waiting for review right now."
              />
            ) : (
              pendingTuitions.slice(0, 5).map((tuition) => (
                <div
                  key={tuition._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-heading">
                      {tuition.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-body">
                      {tuition.tutorName || "Tutor"} ·{" "}
                      {tuition.subject}
                      {tuition.monthlyFee
                        ? ` · ৳${tuition.monthlyFee}`
                        : ""}
                    </p>
                  </div>

                  <StatusBadge status={tuition.approvalStatus} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest transactions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-heading">
                Latest transactions
              </h3>

              <p className="mt-1 text-xs text-body">
                Recent Stripe subscription payments
              </p>
            </div>

            <Link
              href="/dashboard/admin/transactions"
              className="text-sm font-bold text-primary transition hover:text-primary-light"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {latestPayments.length === 0 ? (
              <EmptyState
                title="No payments yet"
                description="Stripe subscription payments will appear here once users upgrade to Pro."
              />
            ) : (
              latestPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-heading">
                      {payment.userName || payment.userEmail || "Customer"}
                    </p>

                    <p className="mt-1 truncate text-xs text-body">
                      {payment.planName || "Plan"} ·{" "}
                      {formatDate(payment.paidAt || payment.createdAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    {money(payment.amount || 0, payment.currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
