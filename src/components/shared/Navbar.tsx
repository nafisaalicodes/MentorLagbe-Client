
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
     <Link href="/" className="flex items-center gap-2.5">
  <Image
    src="/logo.png"
    alt="MentorLagbe Logo"
    width={36}
    height={36}
    className="w-9 h-9 object-contain"
    priority
  />

  <span className="text-lg font-extrabold tracking-tight text-foreground">
    Mentor<span className="text-primary">Lagbe</span>
  </span>
</Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.84rem] font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/sign-in" />}
            >
              Sign In
            </Button>

            <Button
              size="sm"
              className="rounded-full px-5"
              nativeButton={false}
              render={<Link href="/sign-up" />}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-5 pb-5 pt-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-full w-full"
              nativeButton={false}
              render={<Link href="/sign-in" />}
            >
              Sign In
            </Button>

            <Button
              className="rounded-full w-full"
              nativeButton={false}
              render={<Link href="/sign-up" />}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
