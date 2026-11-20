"use client";

import {
  ArrowUpRight,
  BookOpen,
  Users,
  CheckCircle2,
  Crown,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode, ElementType } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-body">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-body">{title}</p>

          <h2 className="mt-3 text-3xl font-extrabold text-heading">
            {value}
          </h2>

          <p className="mt-2 text-xs text-body">
            {description}
          </p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
    accepted: "bg-green-100 text-green-700",
    active: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  const normalized = status.toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[normalized] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={22} />
        </div>

        <div>
          <h3 className="font-bold text-heading">{title}</h3>
          <p className="mt-1 text-xs text-body">{description}</p>
        </div>
      </div>

      <ArrowUpRight className="text-body transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
    </Link>
  );
}

export function EmptyState({
  title,
  description,
  href,
  buttonText,
}: {
  title: string;
  description: string;
  href?: string;
  buttonText?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BookOpen size={26} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-heading">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-body">
        {description}
      </p>

      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-light"
        >
          {buttonText || "Get Started"}
        </Link>
      )}
    </div>
  );
}

export function PlanCard({
  plan,
  totalTuitions,
}: {
  plan: string;
  totalTuitions: number;
}) {
  const isPro = plan.toLowerCase() === "pro";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light p-6 text-white shadow-lg">
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />

      <div className="relative z-10 flex items-center gap-2">
        <Crown size={21} />
        <span className="text-sm font-semibold">Your Subscription</span>
      </div>

      <div className="relative z-10 mt-5 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold">
            {isPro ? "Pro Plan" : "Free Plan"}
          </h2>

          <p className="mt-2 text-sm text-white/80">
            {isPro
              ? "Unlimited tuition postings"
              : `${totalTuitions}/2 tuition posts used`}
          </p>
        </div>

        {isPro && <CheckCircle2 size={32} />}
      </div>
    </div>
  );
}