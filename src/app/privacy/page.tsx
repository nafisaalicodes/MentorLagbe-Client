import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — MentorLagbe",
  description:
    "How MentorLagbe collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect the details you provide when creating an account (name, email, role, phone, bio, profile image), tuition listings you publish, applications you submit, and payment records created when you purchase a Pro plan through Stripe.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to operate the platform: matching students with tutors, displaying approved tuition listings, managing applications, processing Pro subscriptions, and improving the MentorLagbe experience.",
  },
  {
    title: "3. What We Share",
    body: "When a student applies for a tuition, the tutor receives the student's name, email, phone, preferred schedule, and note. We never sell your personal data. Payment processing is handled securely by Stripe — we never store your card details.",
  },
  {
    title: "4. Images",
    body: "Profile pictures and tuition banner images are uploaded through the ImgBB image hosting service and served from their CDN. You may remove or replace your profile image at any time from your Update Profile page.",
  },
  {
    title: "5. Data Security",
    body: "Passwords are hashed by our authentication provider, API requests are protected with signed JWT tokens, and role-based access controls restrict who can view or modify your data.",
  },
  {
    title: "6. Your Rights",
    body: "You may update your name, phone, bio, and profile image from your dashboard, cancel pending applications, and contact our support team to request deletion of your account and associated records.",
  },
  {
    title: "7. Contact",
    body: "Questions about this Privacy Policy can be sent to support@mentorlagbe.com.",
  },
];

export default function PrivacyPage() {
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
            <span className="font-semibold text-heading">Privacy Policy</span>
          </nav>

          <span className="section-label mt-6 inline-block">Legal</span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-heading md:text-5xl">
            Privacy Policy
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
