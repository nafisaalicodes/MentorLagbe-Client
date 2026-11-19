import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ShieldCheck, Users, type LucideIcon } from "lucide-react";

const benefits: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "Verified & background-checked tutors" },
  { icon: Users, text: "1-on-1 sessions and in-person tuition batches" },
  { icon: CalendarDays, text: "Flexible scheduling that fits your routine" },
];

const stats = [
  { value: "500+", label: "Expert Tutors" },
  { value: "800+", label: "Active Students" },
  { value: "1,200+", label: "Subjects" },
];

/**
 * Branded side panel shared by the sign-in and sign-up pages.
 * Hidden on small screens, where the form shows a compact logo instead.
 */
export default function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
      {/* Decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] rounded-full bg-primary-light/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
      />

      {/* Logo */}
      <Link href="/" className="relative flex items-center gap-2.5 self-start">
        <Image
          src="/Logo.png"
          alt="MentorLagbe Logo"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
        />
        <span className="text-lg font-extrabold tracking-tight">
          Mentor<span className="text-accent">Lagbe</span>
        </span>
      </Link>

      {/* Copy */}
      <div className="relative max-w-md py-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
          Mentorship that matters
        </p>

        <h2 className="mt-4 text-[2.35rem] font-extrabold leading-[1.12] tracking-tight">
          The right mentor changes everything.
        </h2>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-white/70">
          Join verified tutors and motivated students across Bangladesh — for
          1-on-1 sessions and in-person tuition.
        </p>

        <ul className="mt-8 space-y-3.5">
          {benefits.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <Icon className="h-4.5 w-4.5 shrink-0 text-accent" />
              <span className="text-sm text-white/85">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="relative grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <p className="text-2xl font-extrabold tracking-tight">{value}</p>
            <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/60">
              {label}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
