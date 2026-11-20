"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Upload,
  ImagePlus,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "../../TutorUI";

const initialForm = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "3",
  description: "",
};

export default function PostTuitionPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [banner, setBanner] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBanner = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadBanner = async () => {
    if (!banner) return "";

    const formData = new FormData();
    formData.append("banner", banner);

    setUploading(true);

    try {
      const result = await apiFetch(
        "/api/tuitions/upload-banner",
        {
          method: "POST",
          body: formData,
        }
      );

      const bannerUrl =
        result.bannerUrl || result.data?.bannerUrl;

      if (!bannerUrl) {
        throw new Error("Image upload failed");
      }

      return bannerUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (form.title.trim().length < 5) {
      toast.error("Title must contain at least 5 characters");
      return;
    }

    if (form.description.trim().length < 20) {
      toast.error("Description must contain at least 20 characters");
      return;
    }

    if (
      Number(form.monthlyFee) <= 0 ||
      !Number.isFinite(Number(form.monthlyFee))
    ) {
      toast.error("Enter a valid monthly fee");
      return;
    }

    if (!Number.isInteger(Number(form.daysPerWeek)) ||
        Number(form.daysPerWeek) < 1 ||
        Number(form.daysPerWeek) > 7) {
      toast.error("Days per week must be between 1 and 7");
      return;
    }

    setLoading(true);

    try {
      const bannerUrl = await uploadBanner();

      await apiFetch("/api/tutor/tuitions", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          monthlyFee: Number(form.monthlyFee),
          daysPerWeek: Number(form.daysPerWeek),
          bannerUrl,
        }),
      });

      toast.success("Tuition posted successfully! Awaiting admin approval.");

      setForm(initialForm);
      setBanner(null);
      setPreview("");

      router.push("/dashboard/tutor/my-tuitions");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to post tuition"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-heading outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <div>
      <PageHeader
        title="Post a New Tuition"
        description="Create a tuition opportunity and connect with students."
        action={
          <Link
            href="/dashboard/tutor/my-tuitions"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-heading hover:bg-base"
          >
            <ArrowLeft size={16} />
            My Tuitions
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
      >
        <div className="mb-7">
          <h2 className="text-lg font-extrabold text-heading">
            Tuition Information
          </h2>

          <p className="mt-1 text-sm text-body">
            Provide accurate information to attract the right students.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-heading">
              Tuition Title *
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={120}
              placeholder="e.g. Experienced Math Tutor Needed for Class 9"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-heading">
              Subject *
            </label>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="e.g. Mathematics"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-heading">
              Class Level *
            </label>

            <select
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select class</option>
              {[
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
                "HSC",
                "University",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-heading">
              Tuition Mode *
            </label>

            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-heading">
              Location *
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g. Dhanmondi, Dhaka"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-heading">
              Monthly Fee (৳) *
            </label>

            <input
              type="number"
              name="monthlyFee"
              value={form.monthlyFee}
              onChange={handleChange}
              required
              min="1"
              placeholder="5000"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-heading">
              Days Per Week *
            </label>

            <select
              name="daysPerWeek"
              value={form.daysPerWeek}
              onChange={handleChange}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} Days
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-bold text-heading">
              Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={3000}
              rows={6}
              placeholder="Describe the tuition requirements, student expectations and teaching preferences..."
              className="mt-2 w-full rounded-xl border border-border bg-card p-4 text-sm text-heading outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <p className="mt-1 text-right text-xs text-body">
              {form.description.length}/3000
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-bold text-heading">
              Tuition Banner Image
            </label>

            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-base p-7 text-center transition hover:border-primary">
              {preview ? (
                <Image
  src={preview}
  alt="Banner preview"
  width={800}
  height={450}
  unoptimized
  className="max-h-56 w-full rounded-xl object-cover"
/>
              ) : (
                <>
                  <ImagePlus size={34} className="text-primary" />

                  <span className="mt-3 text-sm font-bold text-heading">
                    Upload tuition banner
                  </span>

                  <span className="mt-1 text-xs text-body">
                    PNG, JPG or WEBP — Maximum 5MB
                  </span>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">
                    <Upload size={16} />
                    Choose Image
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleBanner(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-border pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-border px-7 py-3 text-sm font-bold text-heading hover:bg-base"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-light disabled:opacity-60"
          >
            {(loading || uploading) && (
              <Loader2 size={17} className="animate-spin" />
            )}

            {uploading
              ? "Uploading Image..."
              : loading
                ? "Publishing..."
                : "Publish Tuition"}
          </button>
        </div>
      </form>
    </div>
  );
}