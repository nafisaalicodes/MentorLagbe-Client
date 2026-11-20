
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import ConditionalLayout from "../components/shared/ConditionalLayout";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MentorLagbe — Smart Tuition & Mentorship Platform",
  description:
    "Connect with verified academic mentors and expert tutors for personalized 1-on-1 sessions and in-person tuition batches across Bangladesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--clr-bg)" }}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
