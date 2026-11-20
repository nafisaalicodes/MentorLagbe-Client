"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Loader2, ShieldCheck } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

import {
  PageHeader,
  StatCard,
  EmptyState,
} from "../../TutorUI";

type Role = "student" | "tutor" | "admin";

type AdminUser = {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: Role;
  phone?: string;
  subscriptionPlan?: string;
  plan?: string;
  createdAt?: string;
};

const ROLE_OPTIONS: Role[] = ["student", "tutor", "admin"];

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

const isPro = (user: AdminUser) =>
  String(user.subscriptionPlan || user.plan || "free").toLowerCase() ===
  "pro";

export default function AdminUsersClient() {
  const { data: session } = authClient.useSession();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  useEffect(() => {
    let ignore = false;

    async function fetchUsers() {
      try {
        const result = await apiFetch("/api/admin/users");

        if (!ignore) {
          setUsers(result.data || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load users"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: users.length,
      student: users.filter((user) => user.role === "student").length,
      tutor: users.filter((user) => user.role === "tutor").length,
      admin: users.filter((user) => user.role === "admin").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesSearch =
        !term ||
        (user.name || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term);

      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  // Change a user's role through the protected admin endpoint
  async function updateRole(user: AdminUser, role: Role) {
    if (role === user.role) return;

    if (String(user._id) === String(session?.user?.id || "")) {
      toast.error("You cannot change your own role");
      // Re-render so the select snaps back to the stored role
      setUsers((previous) => [...previous]);
      return;
    }

    const confirmed = window.confirm(
      `Change role of ${
        user.name || user.email || "this user"
      } from ${user.role || "no role"} to ${role}?`
    );

    if (!confirmed) {
      // Re-render so the select snaps back to the stored role
      setUsers((previous) => [...previous]);
      return;
    }

    setUpdatingId(String(user._id));

    try {
      await apiFetch(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });

      setUsers((previous) =>
        previous.map((item) =>
          String(item._id) === String(user._id)
            ? { ...item, role }
            : item
        )
      );

      toast.success(
        `${user.name || user.email} is now ${role}`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Role update failed"
      );
    } finally {
      setUpdatingId("");
    }
  }

  const tabs: { key: "all" | Role; label: string }[] = [
    { key: "all", label: "All Users" },
    { key: "student", label: "Students" },
    { key: "tutor", label: "Tutors" },
    { key: "admin", label: "Admins" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border border-border bg-card" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
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
        title="User Management"
        description="Search every registered account and switch roles between student, tutor and admin."
        action={
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-heading hover:bg-base"
          >
            ← Back to overview
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={counts.all}
          description="All registered accounts"
          icon={ShieldCheck}
          color="bg-indigo-100 text-indigo-700"
        />
        <StatCard
          title="Students"
          value={counts.student}
          description="Accounts with student role"
          icon={ShieldCheck}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          title="Tutors"
          value={counts.tutor}
          description="Accounts with tutor role"
          icon={ShieldCheck}
          color="bg-violet-100 text-violet-700"
        />
        <StatCard
          title="Admins"
          value={counts.admin}
          description="Privileged accounts"
          icon={ShieldCheck}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = roleFilter === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setRoleFilter(tab.key)}
                className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-primary text-white"
                    : "bg-base text-body hover:text-heading"
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            );
          })}
        </div>

        <div className="relative mt-4">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-heading outline-none focus:border-primary"
          />
        </div>

        <p className="mt-3 text-xs text-muted">
          Showing {filteredUsers.length} of {users.length} accounts
        </p>
      </div>

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No accounts match your current search or role filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-base">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Membership</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Role</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const isSelf =
                  String(user._id) === String(session?.user?.id || "");

                const busy = updatingId === String(user._id);

                return (
                  <tr
                    key={String(user._id)}
                    className="align-middle transition hover:bg-base/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-sm font-black text-white">
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-heading">
                            {user.name || "Unnamed user"}
                            {isSelf && (
                              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700">
                                You
                              </span>
                            )}
                          </p>

                          <p className="truncate text-xs text-body">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          isPro(user)
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isPro(user) ? "Pro" : "Free"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-body">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role || "student"}
                          disabled={busy || isSelf}
                          onChange={(event) =>
                            updateRole(user, event.target.value as Role)
                          }
                          className="h-10 rounded-xl border border-border bg-card px-3 text-sm font-bold text-heading outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Role for ${user.email}`}
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        {busy && (
                          <Loader2
                            size={16}
                            className="animate-spin text-primary"
                          />
                        )}
                      </div>
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
