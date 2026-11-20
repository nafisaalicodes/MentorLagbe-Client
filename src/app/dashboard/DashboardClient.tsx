
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardClient() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = (
      session.user as typeof session.user & {
        role?: string;
      }
    ).role;

    if (role === "student") {
      router.replace("/dashboard/student");
    } else if (role === "tutor") {
      router.replace("/dashboard/tutor");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Preparing your dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Redirecting you to your workspace...
        </p>
      </div>
    </div>
  );
}
