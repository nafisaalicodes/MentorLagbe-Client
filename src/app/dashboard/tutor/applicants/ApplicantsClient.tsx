"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  X,
  Users,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";

import {
  PageHeader,
  StatusBadge,
  EmptyState,
} from "../../TutorUI";

type Applicant = {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  preferredSchedule?: string;
  studentNote?: string;
  tuitionTitle: string;
  status: string;
  appliedAt?: string;
};

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  // Load applicants
  const loadApplicants = useCallback(async () => {
    try {
      const result = await apiFetch("/api/tutor/applicants");

      setApplicants(result.data || result.applicants || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial loading
  useEffect(() => {
    let ignore = false;

    async function fetchApplicants() {
      try {
        const result = await apiFetch("/api/tutor/applicants");

        if (!ignore) {
          setApplicants(result.data || result.applicants || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load applicants"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchApplicants();

    return () => {
      ignore = true;
    };
  }, []);

  // Update applicant status
  async function updateStatus(
    id: string,
    status: "accepted" | "rejected"
  ) {
    setUpdating(id);

    try {
      await apiFetch(
        `/api/tutor/applicants/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      toast.success(
        status === "accepted"
          ? "Applicant accepted successfully"
          : "Applicant rejected"
      );

      await loadApplicants();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Status update failed"
      );
    } finally {
      setUpdating("");
    }
  }

  return (
    <div>
      <PageHeader
        title="Manage Applicants"
        description="Review student applications and select the right students for your tuition."
      />

      {/* Total Applicants */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={23} />
          </div>

          <div>
            <p className="text-sm text-body">
              Total Applicants
            </p>

            <h2 className="text-2xl font-extrabold text-heading">
              {applicants.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-body">
          <Loader2 size={20} className="animate-spin" />
          Loading applicants...
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          description="When students apply to your tuition posts, their applications will appear here."
        />
      ) : (
        <div className="space-y-5">
          {applicants.map((applicant) => (
            <div
              key={applicant._id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-extrabold text-heading">
                      {applicant.studentName}
                    </h2>

                    <StatusBadge status={applicant.status} />
                  </div>

                  <p className="mt-2 text-sm text-primary">
                    Applied for: {applicant.tuitionTitle}
                  </p>
                </div>

                {applicant.appliedAt && (
                  <p className="text-xs text-body">
                    Applied:{" "}
                    {new Date(
                      applicant.appliedAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Applicant Information */}
              <div className="mt-5 grid gap-3 rounded-xl bg-base p-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-body">
                  <Mail size={16} className="text-primary" />

                  <span className="break-all">
                    {applicant.studentEmail}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-body">
                  <Phone size={16} className="text-primary" />

                  {applicant.studentPhone || "Not provided"}
                </div>

                <div className="flex items-center gap-2 text-sm text-body sm:col-span-2">
                  <CalendarDays size={16} className="text-primary" />

                  {applicant.preferredSchedule ||
                    "No preferred schedule"}
                </div>
              </div>

              {/* Student Note */}
              {applicant.studentNote && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-body">
                    Student Note
                  </p>

                  <p className="mt-2 rounded-xl border border-border p-4 text-sm leading-6 text-heading">
                    {applicant.studentNote}
                  </p>
                </div>
              )}

              {/* Accept / Reject */}
              {applicant.status === "pending" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(applicant._id, "accepted")
                    }
                    disabled={updating === applicant._id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating === applicant._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Check size={17} />
                    )}

                    Accept Applicant
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(applicant._id, "rejected")
                    }
                    disabled={updating === applicant._id}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <X size={17} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}