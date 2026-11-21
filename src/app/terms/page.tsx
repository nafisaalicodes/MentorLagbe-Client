import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — MentorLagbe",
  description: "The terms and conditions that govern your use of MentorLagbe.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account on MentorLagbe — as a student, tutor, or admin — you agree to these Terms of Service. If you do not agree, please do not use the platform.",
  },
  {
    title: "2. Accounts & Roles",
    body: "You must provide accurate information when signing up and keep your password secure. You are responsible for all activity under your account. Tutors must provide truthful qualifications and tuition details; students must provide accurate contact information when applying.",
  },
  {
    title: "3. Tuition Listings & Applications",
    body: "Tutors may create tuition listings that require admin approval before appearing publicly. Free tutors may publish up to 2 listings, while Pro tutors may publish unlimited listings. Applications submitted by students are shared only with the tutor who owns the listing.",
  },
  {
    title: "4. Subscriptions & Payments",
    body: "Pro plans are billed in USD through Stripe. Subscriptions renew automatically until cancelled. Payments are non-refundable except where required by law. Your Pro benefits continue until the end of the paid billing period.",
  },
  {
    title: "5. Acceptable Use",
    body: "MentorLagbe may not be used for harassment, fraud, impersonation, or any activity that violates applicable laws of Bangladesh. Listings that mislead students or guardians may be rejected or removed by admins.",
  },
  {
    title: "6. Limitation of Liability",
    body: "MentorLagbe is a marketplace that connects students and tutors directly. We are not a party to any private tuition agreement and are not responsible for sessions, payments, or disputes settled outside the platform.",
  },
  {
    title: "7. Changes to These Terms",
    body: "We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-base pt-[68px]">
      {/* Header */}
      <section className="border-b border-border bg-card px-5 pt-8 pb-10 md:pt-10">
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition hover:text-primary">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-heading">Terms of Service</span>
          </nav>

          <span className="section-label mt-6 inline-block">Legal</span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-heading md:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted md:text-base">
            Last updated: November 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <div className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-extrabold text-heading">
                {section.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-body">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>

          <Link href="/contact" className="btn-outline">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
