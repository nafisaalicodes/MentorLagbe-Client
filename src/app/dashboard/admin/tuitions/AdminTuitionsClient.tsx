"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import {
  PageHeader,
  StatusBadge,
  EmptyState,
} from "../../TutorUI";

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel?: string;
  mode?: string;
  location?: string;
  monthlyFee?: number;
  daysPerWeek?: number;
  description?: string;
  tutorName?: string;
  tutorEmail?: string;
  bannerUrl?: string;
  approvalStatus: string;
  isActive?: boolean;
  createdAt?: string;
};

type StatusFilter = "all" | "pending" | "approved" | "rejected";

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

export default function AdminTuitionsClient() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    let ignore = false;

    async function fetchTuitions() {
      try {
        const result = await apiFetch("/api/admin/tuitions");

        if (!ignore) {
          setTuitions(result.data || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load tuitions"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchTuitions();

    return () => {
      ignore = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: tuitions.length,
      pending: tuitions.filter((item) => item.approvalStatus === "pending")
        .length,
      approved: tuitions.filter(
        (item) => item.approvalStatus === "approved"
      ).length,
      rejected: tuitions.filter(
        (item) => item.approvalStatus === "rejected"
      ).length,
    }),
    [tuitions]
  );

  const filteredTuitions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tuitions.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.approvalStatus === statusFilter;

      const matchesSearch =
        !term ||
        (item.title || "").toLowerCase().includes(term) ||
        (item.subject || "").toLowerCase().includes(term) ||
        (item.tutorName || "").toLowerCase().includes(term) ||
        (item.tutorEmail || "").toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [tuitions, search, statusFilter]);

  // Approve or reject a tuition post
  async function setApprovalStatus(
    tuition: Tuition,
    approvalStatus: "approved" | "rejected"
  ) {
    if (tuition.approvalStatus === approvalStatus) return;

    if (approvalStatus === "rejected") {
      const confirmed = window.confirm(
        `Reject "${tuition.title}"? It will be hidden from students.`
      );

      if (!confirmed) return;
    }

    setUpdatingId(String(tuition._id));

    try {
      await apiFetch(
        `/api/admin/tuitions/${tuition._id}/approval`,
        {
          method: "PATCH",
          body: JSON.stringify({ approvalStatus }),
        }
      );

      setTuitions((previous) =>
        previous.map((item) =>
          String(item._id) === String(tuition._id)
            ? { ...item, approvalStatus }
            : item
        )
      );

      toast.success(
        approvalStatus === "approved"
          ? "Tuition approved and is now live"
          : "Tuition rejected"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Approval update failed"
      );
    } finally {
      setUpdatingId("");
    }
  }

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All Listings" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border border-border bg-card" />

        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Tuition Approval Flow"
        description="Review every tuition post submitted by tutors and approve or reject it."
        action={
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-heading hover:bg-base"
          >
            ← Back to overview
          </Link>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = statusFilter === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-primary text-white"
                    : "bg-base text-body hover:text-heading"
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            );
          })}
        </div>

        <div className="relative mt-4">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, subject or tutor..."
            className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-heading outline-none focus:border-primary"
          />
        </div>

        <p className="mt-3 text-xs text-muted">
          Showing {filteredTuitions.length} of {tuitions.length} listings
        </p>
      </div>

      {/* Listings */}
      {filteredTuitions.length === 0 ? (
        <EmptyState
          title="No tuition posts found"
          description="No listings match your current search or approval filter."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredTuitions.map((tuition) => {
            const busy = updatingId === String(tuition._id);

            const isApproved =
              tuition.approvalStatus === "approved" &&
              tuition.isActive !== false;

            return (
              <article
                key={String(tuition._id)}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                {tuition.bannerUrl && (
                  <Image
                    src={tuition.bannerUrl}
                    alt={tuition.title}
                    width={800}
                    height={400}
                    unoptimized
                    className="h-44 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={tuition.approvalStatus} />

                    <StatusBadge
                      status={
                        tuition.isActive !== false ? "active" : "closed"
                      }
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-extrabold text-heading">
                    {tuition.title}
                  </h2>

                  <p className="mt-2 text-sm text-body">
                    {tuition.subject}
                    {tuition.classLevel ? ` · ${tuition.classLevel}` : ""}
                    {tuition.mode ? ` · ${tuition.mode}` : ""}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-base p-4">
                    <div>
                      <p className="text-xs text-body">Tutor</p>

                      <p className="mt-1 truncate text-sm font-bold text-heading">
                        {tuition.tutorName || "Tutor"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-body">Monthly Fee</p>

                      <p className="mt-1 font-extrabold text-heading">
                        ৳{tuition.monthlyFee ?? 0}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs text-body">Tutor email</p>

                      <p className="mt-1 break-all text-sm font-semibold text-heading">
                        {tuition.tutorEmail || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-body">Location</p>

                      <p className="mt-1 text-sm font-semibold text-heading">
                        {tuition.location || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-body">Posted on</p>

                      <p className="mt-1 text-sm font-semibold text-heading">
                        {formatDate(tuition.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setApprovalStatus(tuition, "approved")
                      }
                      disabled={
                        busy ||
                        tuition.approvalStatus === "approved"
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={15} />
                      )}
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        setApprovalStatus(tuition, "rejected")
                      }
                      disabled={
                        busy ||
                        tuition.approvalStatus === "rejected"
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Reject
                    </button>

                    {isApproved && (
                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-bold text-heading transition hover:bg-base"
                      >
                        <Eye size={15} />
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
