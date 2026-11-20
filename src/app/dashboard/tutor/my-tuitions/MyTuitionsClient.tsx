"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  approvalStatus: string;
  isActive: boolean;
  bannerUrl?: string;
  applicantsCount?: number;
};

const emptyForm = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "3",
  description: "",
};

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tuition | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Load tuitions
  const loadTuitions = useCallback(async () => {
    try {
      const result = await apiFetch("/api/tutor/tuitions");

      setTuitions(result.data || result.tuitions || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load tuitions"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    let ignore = false;

    async function fetchTuitions() {
      try {
        const result = await apiFetch("/api/tutor/tuitions");

        if (!ignore) {
          setTuitions(result.data || result.tuitions || []);
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
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchTuitions();

    return () => {
      ignore = true;
    };
  }, []);

  // Open edit modal
  function openEdit(item: Tuition) {
    setEditing(item);

    setForm({
      title: item.title || "",
      subject: item.subject || "",
      classLevel: item.classLevel || "",
      mode: item.mode || "Online",
      location: item.location || "",
      monthlyFee: String(item.monthlyFee || ""),
      daysPerWeek: String(item.daysPerWeek || 3),
      description: item.description || "",
    });
  }

  // Save edited tuition
  async function saveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editing) return;

    if (
      form.title.trim().length < 5 ||
      form.description.trim().length < 20
    ) {
      toast.error("Please enter valid tuition information");
      return;
    }

    setSaving(true);

    try {
      await apiFetch(
        `/api/tutor/tuitions/${editing._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...form,
            monthlyFee: Number(form.monthlyFee),
            daysPerWeek: Number(form.daysPerWeek),
          }),
        }
      );

      toast.success("Tuition updated successfully");
      setEditing(null);

      await loadTuitions();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Update failed"
      );
    } finally {
      setSaving(false);
    }
  }

  // Toggle tuition status
  async function toggleStatus(item: Tuition) {
    try {
      await apiFetch(
        `/api/tutor/tuitions/${item._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !item.isActive,
          }),
        }
      );

      toast.success(
        item.isActive
          ? "Tuition closed"
          : "Tuition activated"
      );

      await loadTuitions();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Status update failed"
      );
    }
  }

  // Delete tuition
  async function deleteTuition(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tuition? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/api/tutor/tuitions/${id}`, {
        method: "DELETE",
      });

      toast.success("Tuition deleted successfully");

      await loadTuitions();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  }

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-heading outline-none focus:border-primary";

  return (
    <div>
      <PageHeader
        title="My Tuitions"
        description="Manage your tuition posts, monitor approval and control availability."
        action={
          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-light"
          >
            <Plus size={17} />
            Post Tuition
          </Link>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-body">
          Loading your tuitions...
        </div>
      ) : tuitions.length === 0 ? (
        <EmptyState
          title="No tuition posts yet"
          description="Create your first tuition post to start receiving student applications."
          href="/dashboard/tutor/post-tuition"
          buttonText="Create Tuition"
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {tuitions.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              {item.bannerUrl && (
                <Image
                  src={item.bannerUrl}
                  alt={item.title}
                  width={800}
                  height={400}
                  unoptimized
                  className="h-44 w-full object-cover"
                />
              )}

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.approvalStatus} />

                  <StatusBadge
                    status={item.isActive ? "active" : "closed"}
                  />
                </div>

                <h2 className="mt-4 text-lg font-extrabold text-heading">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm text-body">
                  {item.subject} · {item.classLevel} · {item.mode}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-base p-4">
                  <div>
                    <p className="text-xs text-body">Monthly Fee</p>
                    <p className="mt-1 font-extrabold text-heading">
                      ৳{item.monthlyFee}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-body">Applicants</p>
                    <p className="mt-1 font-extrabold text-heading">
                      {item.applicantsCount ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-body">Location</p>
                    <p className="mt-1 text-sm font-semibold text-heading">
                      {item.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-body">Days / Week</p>
                    <p className="mt-1 text-sm font-semibold text-heading">
                      {item.daysPerWeek} Days
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-bold text-heading hover:bg-base"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => toggleStatus(item)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/20"
                  >
                    {item.isActive ? (
                      <>
                        <EyeOff size={15} />
                        Close
                      </>
                    ) : (
                      <>
                        <Eye size={15} />
                        Activate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteTuition(item._id)}
                    className="inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2.5 text-red-600 hover:bg-red-100"
                    aria-label="Delete tuition"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Tuition Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <form
            onSubmit={saveEdit}
            className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-heading">
                Edit Tuition
              </h2>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full p-2 hover:bg-base"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["title", "Title"],
                ["subject", "Subject"],
                ["classLevel", "Class Level"],
                ["location", "Location"],
                ["monthlyFee", "Monthly Fee"],
                ["daysPerWeek", "Days Per Week"],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="text-sm font-bold text-heading"
                >
                  {label}

                  <input
                    required
                    name={name}
                    type={
                      name === "monthlyFee" ||
                      name === "daysPerWeek"
                        ? "number"
                        : "text"
                    }
                    min={
                      name === "monthlyFee" ||
                      name === "daysPerWeek"
                        ? 1
                        : undefined
                    }
                    value={form[name as keyof typeof form]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [name]: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </label>
              ))}

              <label className="text-sm font-bold text-heading">
                Mode

                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option>Online</option>
                  <option>Offline</option>
                </select>
              </label>

              <label className="text-sm font-bold text-heading sm:col-span-2">
                Description

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-border px-5 py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}

                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}