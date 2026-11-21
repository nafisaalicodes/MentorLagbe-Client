import Link from "next/link";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Contact Us — MentorLagbe",
  description:
    "Get in touch with the MentorLagbe team for support, feedback, or partnership inquiries.",
};

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: "support@mentorlagbe.com",
    href: "mailto:support@mentorlagbe.com",
    note: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1700-000000",
    href: "tel:+8801700000000",
    note: "Sat – Thu, 10am – 8pm",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhanmondi, Dhaka, Bangladesh",
    href: undefined,
    note: "Serving students nationwide",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-base pt-[68px]">
      {/* Header */}
      <section className="border-b border-border bg-card px-5 pt-8 pb-10 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-muted"
          >
            <Link href="/" className="transition hover:text-primary">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-heading">Contact Us</span>
          </nav>

          <span className="section-label mt-6 inline-block">We&apos;re Here to Help</span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-heading md:text-5xl">
            Talk to the MentorLagbe Team
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Questions about tuitions, your subscription plan, or your account?
            Reach out through any channel below and our academic support team
            will get back to you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactCards.map(({ icon: Icon, label, value, href, note }) => {
            const body = (
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  {label}
                </p>

                <p className="mt-2 break-words text-lg font-extrabold text-heading">
                  {value}
                </p>

                <p className="mt-2 text-xs leading-5 text-muted">{note}</p>
              </div>
            );

            return href ? (
              <a key={label} href={href} className="block no-underline">
                {body}
              </a>
            ) : (
              <div key={label}>{body}</div>
            );
          })}
        </div>

        {/* Support note */}
        <div className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
          <span className="section-label">Support Center</span>

          <h2 className="mt-3 text-2xl font-extrabold text-heading md:text-3xl">
            Need a faster answer?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Most questions about applying to tuitions, posting a listing, or
            upgrading to a Pro plan are answered instantly in your dashboard.
            Sign in and our team will assist you from there.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tuitions" className="btn-primary">
              Browse Tuitions
            </Link>

            <Link href="/" className="btn-outline inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
