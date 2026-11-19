
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, UserRound, LayoutDashboard, LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const role = user?.role || "student";
  const userName = user?.name || "User";
  const userImage = user?.image;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const roleLabel =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

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

          {/* Desktop Navigation */}
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

          {/* Desktop Authentication */}
          <div className="hidden md:flex items-center gap-2.5">
            {isPending ? (
              <div className="h-9 w-28 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">

                {/* User Profile */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      width={38}
                      height={38}
                      unoptimized
                      className="w-[38px] h-[38px] rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-[38px] h-[38px] rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground max-w-[110px] truncate">
                      {userName}
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {roleLabel}
                    </span>
                  </div>
                </Link>

                {/* Dashboard */}
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/dashboard" />}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>

                {/* Update Profile */}
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/Profile" />}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Profile
                </Button>

                {/* Sign Out */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-full"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
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

          <div className="border-t border-border mt-3 pt-4">
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading account...</p>
            ) : user ? (
              <div className="space-y-3">

                <div className="flex items-center gap-3 pb-2">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      width={42}
                      height={42}
                      unoptimized
                      className="w-[42px] h-[42px] rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-[42px] h-[42px] rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {userName}
                    </p>
                    <span className="text-xs text-primary font-semibold">
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/Profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium"
                >
                  <UserRound className="w-4 h-4" />
                  Update Profile
                </Link>

                <Button
                  variant="outline"
                  className="rounded-full w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="rounded-full w-full"
                  nativeButton={false}
                  render={<Link href="/sign-in" />}
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Button>

                <Button
                  className="rounded-full w-full"
                  nativeButton={false}
                  render={<Link href="/sign-up" />}
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
