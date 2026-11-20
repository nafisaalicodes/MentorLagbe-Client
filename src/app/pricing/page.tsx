"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  CircleCheck,
  GraduationCap,
  Headphones,
  Percent,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type Plan = {
  name: string;
  badge?: string;
  tag: string;
  price: string;
  period: string;
  note: string;
  intro: string;
  listLabel: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const studentPlans: Plan[] = [
  {
    name: "Basic Mentor",
    tag: "Standard Speed",
    price: "$0",
    period: "/month",
    note: "Free forever • No card required",
    intro:
      "Essential access to find, review, and initiate contact with vetted academic tutors.",
    listLabel: "What's included:",
    features: [
      "Browse verified tuition opportunities & tutor portfolios",
      "Apply to new listings (within application & shortlist limits)",
      "Standard messaging chat with interested tutors",
      "Basic community and ticketing support access",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Student Pro",
    badge: "Recommended for Active Learning",
    tag: "Instant Unlock",
    price: "$10",
    period: "/month",
    note: "Promoted listings • Cancel anytime in 1 click",
    intro:
      "Accelerated academic matching with priority placement, verified tutor unlock, and dedicated family support.",
    listLabel: "Everything in Free, plus:",
    features: [
      "Pro membership status badge on your profile & tuition listings",
      "Priority tutor matching & immediate SMS alerts for new tutor visibility",
      "Direct WhatsApp contact unlock with verified mentors (24-hr response)",
      "Free 1-on-1 demo consultation booking guarantee",
      "Dedicated academic concierge phone support (10am–10pm)",
      "Verified Student Identity shield & anti-fraud credential safeguard",
    ],
    cta: "Upgrade to Student Pro",
    highlight: true,
  },
];

const tutorPlans: Plan[] = [
  {
    name: "Starter Mentor",
    tag: "Zero Cost",
    price: "$0",
    period: "/month",
    note: "Free forever • Verified academic profile",
    intro:
      "Test the waters and connect with initial tuition booking opportunities around your university.",
    listLabel: "What's included:",
    features: [
      "Create a profile & post up to 2 active tuition posts",
      "Manage incoming application from students & guardians",
      "Basic tuition dashboard to monitor inquiries & profile visits",
      "Verified BUET / Medical / NDU academic NID identity check",
      "Standard subject & district directory search placement",
    ],
    cta: "Register as Tutor Free",
    highlight: false,
  },
  {
    name: "Tutor Pro",
    badge: "Most Popular for Tutors",
    tag: "High Demand",
    price: "$15",
    period: "/month",
    note: "Keep 100% of your tuition income • Zero commission cut",
    intro:
      "Maximize your tuition bookings, get featured prominently, and instantly unlock direct contact.",
    listLabel: "Everything in Starter, plus:",
    features: [
      "Unlimited tuition posts (auto yearly listing)",
      "Monthly income projection calculator with clientele & budget filters",
      "Golden Mentor Badge highlighting on searches & GPA subject rank",
      "Top featured placement: subject directories & site searches",
      "Instant WhatsApp & SMS alerts within seconds of guardian posts",
      "Direct phone contact unlock with guardians without daily delay",
      "Final-month tuition payment protection guarantee support",
    ],
    cta: "Join Tutor Pro",
    highlight: true,
  },
];

const tabs = [
  { id: "all", label: "All Plans (Side-by-Side)" },
  { id: "students", label: "Students & Guardians" },
  { id: "tutors", label: "Tutors & Mentors" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const valueProps = [
  {
    icon: Percent,
    title: "0% Commission on Tuition",
    text: "Unlike conventional agencies that take 25%–50% of their earned tuition income in Bangladesh (BDT).",
  },
  {
    icon: ShieldCheck,
    title: "Rigorous Identity Verification",
    text: "Every mentor and student guardian undergoes NID verification and educational address authenticity checks before active tuition matching.",
  },
  {
    icon: CalendarCheck,
    title: "Cancel Anytime Instantly",
    text: "No annual contracts or hidden lock-ins. Switch plans or cancel your subscription directly from your profile dashboard with instant confirmation.",
  },
];

const faqs = [
  {
    question: "Why are subscription plans priced in USD while tuition salaries are in BDT?",
    answer:
      "Membership covers platform features and global payment processing, so it is billed in USD. Tuition salary is a private agreement between the guardian and the tutor — it stays in BDT and is settled directly, with 0% platform commission.",
  },
  {
    question: "Do you deduct any commission from my monthly tuition fee?",
    answer:
      "Never. MentorLagbe takes 0% commission on tuition income. The guardian pays you in full every month, and the membership plan is the only thing you pay us for.",
  },
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes. Upgrades apply immediately with the new perks unlocked at once, while downgrades take effect at the end of your current billing cycle. Everything can be managed from your profile dashboard.",
  },
  {
    question: "What happens when my Tutor Pro subscription expires?",
    answer:
      "Your account reverts to the Starter Mentor plan automatically. Existing listings and applications stay intact, but Pro perks such as unlimited posts, featured placement, and instant alerts pause until you renew.",
  },
  {
    question: "What payment methods are supported for membership plans?",
    answer:
      "You can pay with any major debit or credit card, plus popular local payment methods in Bangladesh. Every payment is confirmed instantly and receipts are available in your dashboard.",
  },
  {
    question: "How does the Student Pro priority matching work?",
    answer:
      "Pro students appear at the top of tutor searches for their subject and class level, receive SMS and WhatsApp alerts for new listings first, and unlock direct contact with verified mentors.",
  },
];


function PlanCard({
  plan,
  role,
}: {
  plan: Plan;
  role: "tutor" | "student";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPro = plan.highlight;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiFetch(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
        }
      );

      if (!result.url) {
        throw new Error("Stripe checkout URL not found");
      }

      window.location.assign(result.url);
    } catch (err) {
      console.error("Stripe Checkout Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be started"
      );

      setLoading(false);
    }
  };

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-card p-6 transition duration-300 md:p-7 ${
        plan.highlight
          ? "border-primary/40 shadow-[0_12px_40px_rgba(39,52,105,0.12)]"
          : "border-border shadow-card hover:-translate-y-1"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-100 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700 shadow-sm">
          {plan.badge}
        </span>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-base px-3 py-1.5 text-xs font-semibold text-primary">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
          {plan.name}
        </span>

        <span className="text-xs text-muted">{plan.tag}</span>
      </div>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-5xl font-extrabold tracking-tight text-heading">
          {plan.price}
        </span>
        <span className="pb-2 text-sm text-muted">{plan.period}</span>
      </div>

      <p className="mt-2 text-xs font-medium text-muted">
        {plan.note}
      </p>

      <p className="mt-4 text-sm leading-6 text-body">
        {plan.intro}
      </p>

      <div className="my-5 h-px bg-border" />

      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-heading">
        {plan.listLabel}
      </p>

      <ul className="flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm leading-6 text-body"
          >
            <CircleCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {isPro ? (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Redirecting to Stripe..." : plan.cta}
          {!loading && (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      ) : (
        <Link
          href={`/sign-up?role=${role}&plan=${plan.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-heading transition hover:border-primary hover:text-primary"
        >
          {plan.cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}


function PlansSection({
  label,
  heading,
  subtext,
  guarantee,
  plans,
  role,
}: {
  label: string;
  heading: string;
  subtext: string;
  guarantee: string;
  plans: Plan[];
  role: "tutor" | "student";
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="section-label">{label}</span>
          <h2 className="section-heading">{heading}</h2>
          <p className="section-subtext mt-3 max-w-2xl text-sm">{subtext}</p>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-body shadow-sm">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          {guarantee}
        </span>
      </div>

      <div className="mt-9 grid grid-cols-1 items-stretch gap-7 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} role={role} />
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const showStudents = activeTab === "all" || activeTab === "students";
  const showTutors = activeTab === "all" || activeTab === "tutors";

  return (
    <main className="min-h-screen bg-base pt-[68px]">
      {/* Hero */}
      <section className="border-b border-border bg-card px-5 pt-8 pb-10 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="transition hover:text-primary">
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-heading">Pricing</span>
          </nav>

          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-blue bg-accent/10 px-4 py-2 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Transparent Membership + 0% Tuition Commission
            </span>

            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-heading md:text-5xl">
              Simple Plans.{" "}
              <span className="font-serif italic text-accent-dark">Better</span>{" "}
              Opportunities.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
              Choose the right plan for your learning or teaching journey.
              Connect directly with trusted institutions, toppers, and dedicated
              academic families across Bangladesh.
            </p>
          </div>

          {/* Plan type tabs */}
          <div className="mt-8 flex justify-center">
            <div
              aria-label="Plan type"
              className="flex flex-wrap justify-center gap-1.5 rounded-full border border-border bg-base p-1.5"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition sm:text-sm ${
                    activeTab === tab.id
                      ? "bg-card text-primary shadow-sm ring-1 ring-border"
                      : "text-body hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2 text-center text-xs leading-6 text-muted">
            <span aria-hidden="true">ℹ</span>
            Billed monthly in USD. Tuition contracts &amp; monthly tutor
            salaries remain to be settled directly in BDT with 0% platform
            commission.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-7xl space-y-16 px-5 py-14 md:py-20">
        {showStudents && (
          <PlansSection
            label="Academic Path"
            heading="For Students & Guardians"
            subtext="Connect with verified mentors from BUET, DU, Medical and leading educational institutions."
            guarantee="100% Academic Guarantee"
            plans={studentPlans}
            role="student"
          />
        )}

        {showTutors && (
          <PlansSection
            label="Education Path"
            heading="For Tutors & Academic Mentors"
            subtext="Keep 100% of your tuition income with direct student and guardian connections at 0% tuition fee cut."
            guarantee="Keep 100% of Tuition Earnings"
            plans={tutorPlans}
            role="tutor"
          />
        )}
      </section>

      {/* Value props */}
      <section className="border-y border-border bg-card px-5 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {valueProps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <div>
                <h3 className="text-sm font-bold text-heading">{title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial + stats */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:col-span-2">
            <span className="section-label">Stories · Medical Network</span>

            <blockquote className="mt-3 text-xl font-extrabold leading-snug text-heading md:text-2xl">
              <Quote className="mr-2 inline h-5 w-5 text-accent-dark" aria-hidden="true" />
              MentorLagbe Pro cut down my tutor search from 3 weeks to 4 hours.
            </blockquote>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-body">
              We found a brilliant 3rd-year Electrical Engineering student for
              our HSC son in Dhanmondi. The direct WhatsApp unlock was totally
              seamless.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                SR
              </span>

              <div>
                <p className="text-sm font-bold text-heading">
                  Syeda Rehana Begum
                </p>
                <p className="text-xs text-muted">
                  Guardian of HSC Student · Dhanmondi
                </p>
              </div>
            </div>
          </article>

          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-extrabold text-heading">14,200+</p>
                  <p className="mt-1 text-xs font-medium text-muted">
                    Verified Mentors
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-primary">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-extrabold text-heading">98.4%</p>
                  <p className="mt-1 text-xs font-medium text-muted">
                    Placement Success Rate
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Headphones className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 pb-14 md:pb-16">
        <div className="text-center">
          <span className="section-label">Clarity First</span>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subtext mx-auto mt-3 max-w-2xl text-sm">
            Everything you need to know about MentorLagbe plans, local BDT
            payments, and subscription policies.
          </p>
        </div>

        <div className="mt-9 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-heading transition hover:text-primary"
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <p className="border-t border-border px-5 py-4 text-sm leading-7 text-body">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:pb-20">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="section-label">Still Deciding?</span>
              <h3 className="text-2xl font-extrabold text-heading md:text-3xl">
                Still have questions about our plans?
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Our academic advisory team in Dhaka is on standby to help you
                find the optimal plan for your curriculum, whether English
                Medium, Bangla Medium, or Medical/Engineering admission
                preparation.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/contact" className="btn-outline">
                Talk to Our Advisory Team
              </Link>
              <Link href="/tuitions" className="btn-primary">
                Explore Tuitions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
