
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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
  bannerUrl?: string;
  description?: string;
  tutorName?: string;
  tutorEmail?: string;
  tutorPlan?: string;
  createdAt?: string;
};

type Props = {
  tuition: Tuition;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TuitionDetailsClient({ tuition }: Props) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;

  const isStudent = user?.role === "student";

  // Older records store the banner in `bannerImage`, newer posts in `bannerUrl`.
  const bannerImage = tuition.bannerImage || tuition.bannerUrl;

  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const formatFee = (amount: number) =>
    new Intl.NumberFormat("en-BD").format(amount || 0);

  const formattedDate = tuition.createdAt
    ? new Date(tuition.createdAt).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently posted";

  const handleApply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!isStudent) {
      const notice = "Only logged-in students can apply for this tuition.";
      setMessage(notice);
      toast.error(notice);
      return;
    }

    if (!phone.trim() || !schedule.trim()) {
      const notice = "Please complete all required fields.";
      setMessage(notice);
      toast.error(notice);
      return;
    }

    try {
      setSubmitting(true);

      // Get a signed JWT from Better Auth
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        const notice = "Your login session is not valid. Please sign in again.";
        setMessage(notice);
        toast.error(notice);
        return;
      }

      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tuitionId: tuition._id,
          studentPhone: phone.trim(),
          preferredSchedule: schedule.trim(),
          studentNote: note.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const notice = result.message || "Unable to submit your application.";
        setMessage(notice);
        toast.error(notice);
        return;
      }

      setSuccess(true);
      setMessage(
        result.message || "Your application has been submitted successfully!"
      );
      toast.success(
        result.message || "Your application has been submitted successfully!"
      );

      setPhone("");
      setSchedule("");
      setNote("");
    } catch (error) {
      console.error("Application Error:", error);
      setMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <span aria-hidden="true">←</span>
            Back to Browse Tuitions
          </Link>

          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            VERIFIED LISTING
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl shadow-indigo-950/10">
          {bannerImage ? (
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center"
              style={{ backgroundImage: `url("${bannerImage}")` }}
            />
          ) : null}

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-indigo-950/65" />
          <div className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="grid gap-10 px-7 py-12 sm:px-10 lg:grid-cols-[1fr_280px] lg:items-end lg:px-14 lg:py-16">
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {tuition.subject}
                </span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  ● Approved Tuition
                </span>
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Find your learning match
              </p>

              <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {tuition.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Explore the tuition details, understand the schedule, and
                connect with the tutor through MentorLagbe.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
                <span>📚 {tuition.classLevel}</span>
                <span>📍 {tuition.mode}</span>
                <span>🗓 Posted {formattedDate}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm font-medium text-slate-300">
                Monthly tuition fee
              </p>
              <p className="mt-2 text-3xl font-black text-white">
                ৳{formatFee(tuition.monthlyFee)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Per month · Negotiable with tutor
              </p>
              <a
                href="#apply"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-indigo-950 transition hover:bg-indigo-50"
              >
                Apply for this tuition <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_370px]">
          <div className="space-y-8">
            {/* Overview */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Tuition overview
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  Everything you need to know
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon="📖"
                  label="Subject"
                  value={tuition.subject}
                />
                <InfoCard
                  icon="🎓"
                  label="Class / Level"
                  value={tuition.classLevel}
                />
                <InfoCard
                  icon="💻"
                  label="Learning mode"
                  value={tuition.mode}
                />
                <InfoCard
                  icon="📅"
                  label="Days per week"
                  value={`${tuition.daysPerWeek} days`}
                />
                <InfoCard
                  icon="📍"
                  label="Location"
                  value={tuition.location || "Not specified"}
                />
                <InfoCard
                  icon="💰"
                  label="Monthly fee"
                  value={`৳${formatFee(tuition.monthlyFee)}`}
                  highlight
                />
              </div>
            </section>

            {/* Description */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                About this opportunity
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                Tuition description
              </h2>

              <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-slate-600">
                {tuition.description?.trim() ||
                  "The tutor has not added a detailed description yet. You can apply to express your interest and discuss the learning requirements with the tutor."}
              </p>
            </section>

            {/* Tutor */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Your potential educator
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                Tutor information
              </h2>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-black text-white shadow-lg shadow-indigo-200">
                  {(tuition.tutorName || "T").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {tuition.tutorName || "MentorLagbe Tutor"}
                    </h3>

                    {tuition.tutorPlan === "pro" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <span aria-hidden="true">✓</span>
                        Verified Pro Tutor
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Tuition provider · {tuition.subject}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span>✓</span> Listing approved
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Application sidebar */}
          <aside id="apply" className="h-fit lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              <div className="bg-gradient-to-br from-indigo-700 via-indigo-700 to-violet-800 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
                  Take the next step
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Apply for tuition
                </h2>
                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  Share your details and let the tutor know about your
                  learning preferences.
                </p>
              </div>

              <div className="p-6">
                {isPending ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Checking your account...
                  </div>
                ) : !user ? (
                  <div className="rounded-2xl bg-amber-50 p-5">
                    <p className="font-bold text-amber-900">
                      Login required
                    </p>
                    <p className="mt-2 text-sm leading-6 text-amber-800">
                      Please sign in with your student account to apply for
                      this tuition.
                    </p>
                    <Link
                      href="/sign-in"
                      className="mt-4 flex w-full justify-center rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-800"
                    >
                      Sign in to continue
                    </Link>
                  </div>
                ) : !isStudent ? (
                  <div className="rounded-2xl bg-amber-50 p-5">
                    <p className="font-bold text-amber-900">
                      Student access only
                    </p>
                    <p className="mt-2 text-sm leading-6 text-amber-800">
                      You are signed in as a {user.role || "non-student"}.
                      Only student accounts can apply for tuition.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Your name
                      </label>
                      <input
                        value={user.name || ""}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email address
                      </label>
                      <input
                        value={user.email || ""}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Phone number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={20}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Preferred schedule{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        maxLength={200}
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        placeholder="e.g. Sun–Thu, 5 PM – 7 PM"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Learning note{" "}
                        <span className="font-normal text-slate-400">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        maxLength={1000}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Tell the tutor about your learning goals..."
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <p className="mt-1 text-right text-xs text-slate-400">
                        {note.length}/1000
                      </p>
                    </div>

                    {message && (
                      <div
                        role="status"
                        className={`rounded-xl p-3 text-sm leading-6 ${
                          success
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit application"}
                      {!submitting && <span>→</span>}
                    </button>

                    <p className="text-center text-xs leading-5 text-slate-400">
                      Your application will be sent to the tutor for review.
                    </p>
                  </form>
                )}
              </div>
            </section>

            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
              <p className="text-sm font-bold text-indigo-950">
                💡 Application tip
              </p>
              <p className="mt-1 text-xs leading-5 text-indigo-800">
                Add a clear schedule and a short learning note to help the
                tutor understand your requirements.
              </p>
            </div>
          </aside>
        </div>

        {/* Bottom CTA */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Your learning journey starts here
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            The right mentor can make all the difference.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Explore more opportunities and find a tuition that matches your
            academic goals.
          </p>
          <Link
            href="/tuitions"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Explore more tuitions →
          </Link>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-indigo-100 bg-indigo-50/70"
          : "border-slate-100 bg-slate-50/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 break-words text-sm font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
