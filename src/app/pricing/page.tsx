
import Link from "next/link";

const tutorPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started and explore tuition opportunities.",
    features: [
      "Create a tutor profile",
      "Post up to 2 tuition listings",
      "Manage tuition posts",
      "Receive student applications",
    ],
    button: "Start for Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "per month",
    description: "Grow your tutoring opportunities without limits.",
    features: [
      "Everything in Free",
      "Unlimited tuition listings",
      "Reach more students",
      "Manage all your tuition posts",
      "Premium membership access",
    ],
    button: "Upgrade to Pro",
    popular: true,
  },
];

const studentPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Find tuition opportunities and connect with tutors.",
    features: [
      "Create a student profile",
      "Browse approved tuition listings",
      "Apply for tuition opportunities",
      "Track your applications",
    ],
    button: "Join for Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "per month",
    description: "Enjoy a premium student membership experience.",
    features: [
      "Everything in Free",
      "Pro student membership",
      "Enhanced learning experience",
      "Premium membership access",
      "Priority support",
    ],
    button: "Upgrade to Pro",
    popular: true,
  },
];

function PricingCard({
  plan,
  role,
}: {
  plan: (typeof tutorPlans)[number];
  role: "tutor" | "student";
}) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-3xl border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover md:p-8 ${
        plan.popular
          ? "border-primary shadow-card-hover"
          : "border-border shadow-card"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-bold text-white shadow-md">
          MOST POPULAR
        </span>
      )}

      <div>
        <p className="text-sm font-semibold text-primary">{plan.name} Plan</p>

        <div className="mt-4 flex items-end gap-2">
          <h3 className="text-4xl font-extrabold tracking-tight text-heading md:text-5xl">
            {plan.price}
          </h3>
          <span className="pb-1 text-sm text-muted">{plan.period}</span>
        </div>

        <p className="mt-4 min-h-12 text-sm leading-6 text-muted">
          {plan.description}
        </p>
      </div>

      <div className="my-7 h-px bg-border" />

      <p className="mb-5 text-sm font-bold text-heading">
        What&apos;s included:
      </p>

      <ul className="flex-1 space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm leading-6 text-body"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-primary">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/sign-up?role=${role}&plan=${plan.name.toLowerCase()}`}
        className={`mt-8 w-full ${
          plan.popular ? "btn-primary" : "btn-outline"
        }`}
      >
        {plan.button}
      </Link>
    </article>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-base">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary px-5 py-16 text-white md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
            Simple & Transparent Pricing
          </span>

          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            Choose the Right Plan for Your Journey
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            Whether you&apos;re looking for a tutor or sharing your knowledge,
            MentorLagbe has a plan to help you get started and grow.
          </p>

          <Link
            href="#plans"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-primary transition hover:-translate-y-1 hover:bg-base-alt"
          >
            Explore Plans
          </Link>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        {/* Tutor Plans */}
        <div className="mb-20">
          <div className="mb-10 text-center">
            <span className="section-label">For Tutors</span>
            <h2 className="section-heading">Grow Your Teaching Career</h2>
            <p className="section-subtext mx-auto mt-3 max-w-2xl">
              Start teaching with a free account or unlock unlimited
              tuition posting with MentorLagbe Pro.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-7 md:grid-cols-2">
            {tutorPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} role="tutor" />
            ))}
          </div>
        </div>

        {/* Student Plans */}
        <div>
          <div className="mb-10 text-center">
            <span className="section-label">For Students</span>
            <h2 className="section-heading">Find the Support You Need</h2>
            <p className="section-subtext mx-auto mt-3 max-w-2xl">
              Discover tuition opportunities and choose the membership
              that fits your learning needs.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-7 md:grid-cols-2">
            {studentPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} role="student" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-white md:px-12 md:py-16">
          <h2 className="text-2xl font-extrabold md:text-4xl">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
            Join MentorLagbe today and take the next step toward
            better teaching and learning opportunities.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-primary transition hover:-translate-y-1 hover:bg-base-alt"
            >
              Create an Account
            </Link>

            <Link
              href="/tuitions"
              className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse Tuitions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
