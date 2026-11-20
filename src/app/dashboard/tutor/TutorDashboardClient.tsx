"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Users,
  PlusCircle,
  ClipboardList,
  UserCheck,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import {
  PageHeader,
  StatCard,
  QuickAction,
  PlanCard,
} from "../TutorUI";

type Stats = {
  totalTuitions: number;
  activeTuitions: number;
  totalApplicants: number;
  plan: string;
  postLimit: number | null;
};

export default function TutorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await apiFetch(
          "/api/tutor/dashboard/stats"
        );

        setStats(result.data || result.stats || result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-body">
        Dashboard information is currently unavailable.
      </p>
    </div>
  );
}

  return (
    <div>
      <PageHeader
        title="Tutor Dashboard"
        description="Manage your tuition posts, track applicants and grow your teaching journey."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tuitions"
          value={stats.totalTuitions ?? 0}
          description="All your tuition posts"
          icon={BookOpen}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Active Tuitions"
          value={stats.activeTuitions ?? 0}
          description="Approved and active posts"
          icon={CheckCircle2}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants ?? 0}
          description="Students interested in your posts"
          icon={Users}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Current Plan"
          value={stats.plan || "Free"}
          description={
            stats.plan?.toLowerCase() === "pro"
              ? "Unlimited tuition posts"
              : "Up to 2 tuition posts"
          }
          icon={UserCheck}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PlanCard
          plan={stats.plan || "Free"}
          totalTuitions={stats.totalTuitions || 0}
        />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-extrabold text-heading">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-body">
            Manage your teaching activities.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="Post Tuition"
              description="Create a new tuition"
              href="/dashboard/tutor/post-tuition"
              icon={PlusCircle}
            />

            <QuickAction
              title="My Tuitions"
              description="Manage your posts"
              href="/dashboard/tutor/my-tuitions"
              icon={ClipboardList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}