
"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { apiFetch } from "@/lib/api";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    name: "Student Free",
    price: "$0",
    period: "/forever",
    description: "Perfect for getting started",
    features: [
      "Browse all listings",
      "Apply to 3 tuitions/month",
      "Basic dashboard",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Student Pro",
    price: "$10",
    period: "/month",
    description: "For serious learners",
    features: [
      "Unlimited applications",
      "Priority booking",
      "Save/bookmark tuitions",
      "Review & rating",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/pricing",
    highlight: true,
  },
  {
    name: "Tutor Starter",
    price: "$0",
    period: "/forever",
    description: "Start teaching for free",
    features: [
      "Post up to 2 listings",
      "Basic dashboard",
      "Accept/reject apps",
      "Basic analytics",
    ],
    cta: "Register as Tutor",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Tutor Pro",
    price: "$15",
    period: "/month",
    description: "Scale your business",
    features: [
      "Unlimited listings",
      "Verified badge",
      "Advanced analytics",
      "Priority in search",
      "24/7 support",
    ],
    cta: "Go Pro Now",
    href: "/pricing",
    highlight: true,
  },
];

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

const handleCheckout = async (planName: string) => {

  try {
    setLoadingPlan(planName);
    setError("");

    const result = await apiFetch(
      "/api/payments/create-checkout-session",
      {
        method: "POST",
      }
    );

    if (!result.url) {
      throw new Error("Stripe checkout URL was not found");
    }

    window.location.href = result.url;

  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );

    setLoadingPlan(null);
  }
};



  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-label">
            Transparent Pricing
          </span>

          <h2 className="section-heading">
            Simple, Predictable Plans for Everyone
          </h2>

          <p className="section-subtext mt-4">
            Subscription prices in Dollar. Tuition fees settled monthly by
            families.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">

          {plans.map((plan) => {
            const {
              name,
              price,
              period,
              description,
              features,
              cta,
              href,
              highlight,
            } = plan;

            const isPro =
              name === "Student Pro" || name === "Tutor Pro";

            const isLoading = loadingPlan === name;

            return (
              <Card
                key={name}
                className={`relative flex flex-col h-full ${
                  highlight
                    ? "border-primary shadow-lg"
                    : "hover:shadow-md"
                } transition-all duration-200`}
              >

                {highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full text-[11px] font-bold px-3.5 whitespace-nowrap bg-primary text-primary-foreground border-0">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="pt-5 px-5 pb-0 min-h-0 gap-0">

                  <h3 className="text-sm font-bold text-foreground">
                    {name}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </p>

                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-foreground">
                      {price}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {period}
                    </span>
                  </div>

                </CardHeader>

                <Separator className="mx-5 w-auto my-3" />

                <CardContent className="px-5 pb-0 flex-1">

                  <ul className="space-y-2.5">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />

                        <span className="text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                </CardContent>

                <CardFooter className="p-5 pt-5">

                  {isPro ? (
                    <Button
                      type="button"
                      className="w-full rounded-xl text-sm font-semibold"
                      variant={highlight ? "default" : "outline"}
                      disabled={loadingPlan !== null}
                      onClick={() => handleCheckout(name)}
                    >
                      {isLoading
                        ? "Redirecting to Stripe..."
                        : cta}
                    </Button>
                  ) : (
                    <Button
                      nativeButton={false}
                      className="w-full rounded-xl text-sm font-semibold"
                      variant="outline"
                      render={<Link href={href} />}
                    >
                      {cta}
                    </Button>
                  )}

                </CardFooter>

              </Card>
            );
          })}

        </div>
      </div>
    </section>
  );
}
