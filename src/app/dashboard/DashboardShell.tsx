"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Role = "student" | "tutor" | "admin";

type DashboardUser = {
  name?: string;
  email?: string;
  image?: string;
  role?: Role;
};

const roleLinks: Record<
  Role,
  { label: string; href: string; icon: string }[]
> = {
  student: [
    {
      label: "Overview",
      href: "/dashboard/student",
      icon: "◫",
    },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: "▤",
    },
  ],

  tutor: [
    {
      label: "Overview",
      href: "/dashboard/tutor",
      icon: "◫",
    },
    {
      label: "Post Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: "+",
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: "▤",
    },
    {
      label: "Applicants",
      href: "/dashboard/tutor/applicants",
      icon: "♙",
    },
  ],

  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: "◫",
    },
    {
      label: "User Management",
      href: "/dashboard/admin/users",
      icon: "◉",
    },
    {
      label: "Tuition Approvals",
      href: "/dashboard/admin/tuitions",
      icon: "▤",
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: "৳",
    },
  ],
};

function isValidRole(role: unknown): role is Role {
  return (
    role === "student" ||
    role === "tutor" ||
    role === "admin"
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user as DashboardUser | undefined;
  const role = user?.role;

  const validRole = isValidRole(role);

  const isAuthorized =
    !isPending && !!user && validRole;

  const links = validRole ? roleLinks[role] : [];

  // Authentication and role validation
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isValidRole(role)) {
      router.replace("/");
      return;
    }

    const allowedPrefix = `/dashboard/${role}`;

    if (
      pathname !== allowedPrefix &&
      !pathname.startsWith(`${allowedPrefix}/`)
    ) {
      router.replace(allowedPrefix);
    }
  }, [isPending, user, role, pathname, router]);

  // Logout
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // User initials
  const initials = (
    user?.name ||
    user?.email ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  // Sidebar
  const sidebar = (
    <aside
      className={`flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? "w-[84px]" : "w-[270px]"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
        {!collapsed && (
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-slate-900"
          >
            Mentor<span className="text-indigo-600">Lagbe.</span>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "→" : "←"}
        </button>

        {collapsed && (
          <span className="mx-auto text-xl font-black text-indigo-700">
            M.
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 py-6">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
        )}

        <nav className="space-y-2">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== `/dashboard/${role}` &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? link.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span className="w-6 text-center text-lg">
                  {link.icon}
                </span>

                {!collapsed && (
                  <span>{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto p-4">
        <div
          className={`rounded-2xl bg-slate-50 p-3 ${
            collapsed ? "text-center" : ""
          }`}
        >
          {!collapsed && (
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Account
            </p>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? "Sign out" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <span className="w-6 text-center text-lg">
              ↪
            </span>

            {!collapsed && "Sign out"}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          {sidebar}
        </div>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/50"
            />

            <div className="relative h-full w-[285px] max-w-[85vw]">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${
            collapsed
              ? "lg:ml-[84px]"
              : "lg:ml-[270px]"
          }`}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl text-slate-700 lg:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div>
                <p className="text-sm font-bold capitalize text-slate-900">
                  {role ?? "Account"} workspace
                </p>

                <p className="hidden text-xs text-slate-400 sm:block">
                  Manage your learning journey with MentorLagbe
                </p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900">
                  {user?.name || "User"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {role ?? ""}
                </p>
              </div>

              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded-full border-2 border-indigo-100 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="relative mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-7 lg:p-9">

            {/* Children always remain in the render tree */}
            <div
              className={
                isAuthorized
                  ? ""
                  : "invisible pointer-events-none"
              }
              aria-hidden={!isAuthorized}
            >
              {children}
            </div>

            {/* Authentication Loading */}
            {!isAuthorized && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Preparing your dashboard...
                  </p>
                </div>
              </div>
            )}

          </main>

          {/* Copyright Footer */}
          <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-5 text-center">
            <p className="text-xs font-medium text-slate-500">
              © 2026 MentorLagbe. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}