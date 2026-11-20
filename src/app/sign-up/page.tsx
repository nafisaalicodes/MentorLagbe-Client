
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type UserRole = "student" | "tutor";

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "student",
    label: "Student",
    description:
      "Find verified tutors and book sessions that fit your schedule.",
    icon: GraduationCap,
  },
  {
    value: "tutor",
    label: "Tutor",
    description:
      "Share your expertise and grow your own teaching presence.",
    icon: Users,
  },
];

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setStep(2);
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Create account with Better Auth
      const { error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      if (error) {
        toast.error(error.message || "Signup failed!");
        return;
      }

      toast.success("Account created successfully!");

      router.push("/sign-in");
    } catch (error: unknown) {
      console.error("Signup Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-5 py-12">
      {/* Background Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-primary-light/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
      />

      {/* Signup Card */}
      <div className="relative w-full max-w-[460px] rounded-3xl border border-border bg-card p-7 shadow-[0_1px_2px_rgba(32,38,58,0.04),0_24px_56px_-20px_rgba(39,52,105,0.28)] sm:p-9">
        {/* Logo */}
        <Link
          href="/"
          className="mb-7 flex items-center justify-center gap-2.5"
        >
          <Image
            src="/Logo.png"
            alt="MentorLagbe Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />

          <span className="text-xl font-extrabold tracking-tight text-heading">
            Mentor<span className="text-primary">Lagbe</span>
          </span>
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-3.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-all duration-500 ease-out",
                step === 1 ? "w-1/2" : "w-full"
              )}
            />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-light">
            Step {step} of 2
          </span>
        </div>

        <form
          onSubmit={step === 1 ? handleContinue : handleSignup}
        >
          <div key={step}>
            {step === 1 ? (
              <>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary-light">
                  Get started
                </p>

                <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-heading sm:text-3xl">
                  Create your account
                </h1>

                <p className="mt-2 text-[0.95rem] text-body">
                  Join as a student or tutor — it only takes a minute.
                </p>

                <div className="mt-7 space-y-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-heading"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="e.g.Nafisa"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-xl border border-border bg-card px-4 text-[0.95rem] text-heading placeholder:text-subtle outline-none transition-all focus:border-primary-light focus:ring-4 focus:ring-primary-light/15"
                    />
                  </div>

                  {/* Email */}
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
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-xl border border-border bg-card px-4 text-[0.95rem] text-heading placeholder:text-subtle outline-none transition-all focus:border-primary-light focus:ring-4 focus:ring-primary-light/15"
                    />
                  </div>

                  {/* Password */}
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
                        autoComplete="new-password"
                        placeholder="Create a password"
                        minLength={8}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-12 w-full rounded-xl border border-border bg-card pl-4 pr-12 text-[0.95rem] text-heading placeholder:text-subtle outline-none transition-all focus:border-primary-light focus:ring-4 focus:ring-primary-light/15"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((v) => !v)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-body hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <p className="mt-1.5 text-xs text-body">
                      Must be at least 8 characters.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary-light">
                  Almost there
                </p>

                <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-heading sm:text-3xl">
                  Choose your role
                </h1>

                <p className="mt-2 text-[0.95rem] text-body">
                  Pick how you&apos;ll start on MentorLagbe.
                </p>

                {/* Role Selection */}
                <fieldset className="mt-7 space-y-3">
                  <legend className="sr-only">
                    Select your role
                  </legend>

                  {roles.map(
                    ({ value, label, description, icon: Icon }) => {
                      const selected = formData.role === value;

                      return (
                        <label
                          key={value}
                          className={cn(
                            "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 transition-all duration-200",
                            selected
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border bg-card hover:border-primary-light/50 hover:bg-base"
                          )}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={value}
                            checked={selected}
                            onChange={handleChange}
                            className="sr-only"
                          />

                          <span className="flex items-center justify-between">
                            <span
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-xl",
                                selected
                                  ? "bg-primary text-white"
                                  : "bg-base text-primary-light"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </span>

                            <span
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-full",
                                selected
                                  ? "bg-primary text-white"
                                  : "bg-border text-transparent"
                              )}
                            >
                              <Check
                                className="h-3 w-3"
                                strokeWidth={3.5}
                              />
                            </span>
                          </span>

                          <span>
                            <span className="block text-sm font-bold text-heading">
                              {label}
                            </span>

                            <span className="mt-1 block text-xs leading-relaxed text-body">
                              {description}
                            </span>
                          </span>
                        </label>
                      );
                    }
                  )}
                </fieldset>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-7 space-y-3">
            {step === 1 ? (
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-light focus-visible:ring-4 focus-visible:ring-primary-light/40"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:pointer-events-none disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-semibold text-body transition-all hover:border-primary-light/60 hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to details
                </button>
              </>
            )}
          </div>
        </form>

        {/* Sign In */}
        <p className="mt-6 text-center text-sm text-body">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary transition-colors hover:text-primary-light"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
