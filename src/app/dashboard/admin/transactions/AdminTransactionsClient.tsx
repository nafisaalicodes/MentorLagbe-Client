"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  CreditCard,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import {
  PageHeader,
  StatCard,
  StatusBadge,
  EmptyState,
} from "../../TutorUI";

type Payment = {
  _id: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  paidAt?: string;
  createdAt?: string;
};

const money = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);
  } catch {
    return `$${(Number(value) || 0).toFixed(2)}`;
  }
};

const formatDate = (value?: string) => {
  if (!value) return "Date unavailable";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const roleStyles: Record<string, string> = {
  tutor: "bg-violet-100 text-violet-700",
  student: "bg-indigo-100 text-indigo-700",
  admin: "bg-amber-100 text-amber-700",
};

export default function AdminTransactionsClient() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchPayments() {
      try {
        const result = await apiFetch("/api/admin/payments");

        if (!ignore) {
          setPayments(result.data || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load transactions"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchPayments();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return payments;

    return payments.filter(
      (payment) =>
        (payment.userName || "").toLowerCase().includes(term) ||
        (payment.userEmail || "").toLowerCase().includes(term) ||
        (payment.transactionId || "").toLowerCase().includes(term) ||
        (payment.planName || "").toLowerCase().includes(term)
    );
  }, [payments, search]);

  const summary = useMemo(() => {
    const total = payments.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0),
      0
    );

    return {
      total,
      count: payments.length,
      average: payments.length ? total / payments.length : 0,
    };
  }, [payments]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border border-border bg-card" />

        <div className="grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Transaction Management"
        description="Every Stripe subscription payment from the payments collection in one place."
        action={
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-heading hover:bg-base"
          >
            ← Back to overview
          </Link>
        }
      />

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          title="Total Stripe Revenue"
          value={money(summary.total)}
          description="Settled subscription payments"
          icon={CreditCard}
          color="bg-cyan-100 text-cyan-700"
        />
        <StatCard
          title="Total Transactions"
          value={summary.count}
          description="Payment records found"
          icon={ReceiptText}
          color="bg-indigo-100 text-indigo-700"
        />
        <StatCard
          title="Average Payment"
          value={money(summary.average)}
          description="Per subscription checkout"
          icon={TrendingUp}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by user name, email, plan or transaction ID..."
            className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-heading outline-none focus:border-primary"
          />
        </div>

        <p className="mt-3 text-xs text-muted">
          Showing {filteredPayments.length} of {payments.length} transactions
        </p>
      </div>

      {/* Transactions table */}
      {payments.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Stripe subscription payments will appear here as soon as students or tutors upgrade to the Pro plan."
        />
      ) : filteredPayments.length === 0 ? (
        <EmptyState
          title="No matching transactions"
          description="No payment records match your search."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[940px] text-left">
            <thead className="bg-base">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="px-5 py-4">User Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Plan Name</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Transaction ID</th>
                <th className="px-5 py-4">Payment Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredPayments.map((payment) => {
                const role = String(payment.userRole || "student");

                return (
                  <tr
                    key={String(payment._id)}
                    className="align-middle transition hover:bg-base/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-xs font-black text-white">
                          {(payment.userName ||
                            payment.userEmail ||
                            "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="truncate text-sm font-bold text-heading">
                          {payment.userName || "Unknown user"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-body">
                      <span className="block max-w-[210px] truncate">
                        {payment.userEmail || "Not available"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          roleStyles[role] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-heading">
                      {payment.planName || "Pro"}
                    </td>

                    <td className="px-5 py-4 text-sm font-extrabold text-heading">
                      {money(payment.amount || 0, payment.currency)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs font-semibold text-heading">
                          {payment.transactionId ||
                            payment.stripeSessionId ||
                            "—"}
                        </span>

                        <StatusBadge
                          status={payment.paymentStatus || "paid"}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-body">
                      {formatDate(payment.paidAt || payment.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
