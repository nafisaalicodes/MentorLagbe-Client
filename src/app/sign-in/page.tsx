
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import BrandPanel from "@/components/auth/BrandPanel";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Sign in with Better Auth
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      // Step 2: Get JWT token from Better Auth
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Login successful, but token retrieval failed");
        return;
      }

      const token = tokenData.token;

      // Step 3: Test protected backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protected`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Could not access protected API");
        return;
      }

     // Step 4: Get logged-in user role
const { data: sessionData, error: sessionError } =
  await authClient.getSession();

if (sessionError || !sessionData?.user) {
  toast.error("Could not retrieve user information");
  return;
}

const role = sessionData.user.role;

// Redirect according to user role
toast.success("Login successful!");

if (role === "tutor") {
  router.replace("/dashboard/tutor");
} else if (role === "admin") {
  router.replace("/dashboard/admin");
} else {
  router.replace("/dashboard/student");
}

router.refresh();
    } catch (error: unknown) {
      console.error("Signin Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base pt-[68px]">
      <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-2">
        <BrandPanel />

        {/* Form */}
        <div className="flex items-center justify-center bg-card px-5 py-14 sm:px-8">
          <div className="w-full max-w-[420px]">
            {/* Compact logo (small screens) */}
            <Link
              href="/"
              className="mb-10 flex items-center gap-2.5 lg:hidden"
            >
              <Image
                src="/Logo.png"
                alt="MentorLagbe Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-lg font-extrabold tracking-tight text-heading">
                Mentor<span className="text-primary">Lagbe</span>
              </span>
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-light">
              Welcome back
            </p>

            <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-heading sm:text-3xl">
              Sign in to your account
            </h1>

            <p className="mt-2 text-[0.95rem] text-body">
              Enter your details to continue to MentorLagbe.
            </p>

            <form onSubmit={handleSignin} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-border bg-card px-4 text-[0.95rem] text-heading placeholder:text-subtle transition-all duration-200 outline-none focus:border-primary-light focus:ring-4 focus:ring-primary-light/15"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-heading"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-border bg-card pl-4 pr-12 text-[0.95rem] text-heading placeholder:text-subtle transition-all duration-200 outline-none focus:border-primary-light focus:ring-4 focus:ring-primary-light/15"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-body transition-colors hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-[var(--shadow-btn)] transition-all duration-200 outline-none hover:-translate-y-0.5 hover:bg-primary-light focus-visible:ring-4 focus-visible:ring-primary-light/40 disabled:pointer-events-none disabled:opacity-60"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-body">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-primary transition-colors hover:text-primary-light"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
