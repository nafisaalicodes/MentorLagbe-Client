
import Link from "next/link";
import { Search, Star, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-background">

      {/* Subtle glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          transform: "translate(25%, -25%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-7rem)]">

          {/* Left */}
          <div className="flex flex-col justify-center">
            <Badge
              variant="secondary"
              className="w-fit mb-7 rounded-full px-4 py-1.5 text-xs font-semibold gap-2 bg-primary/8 text-primary border-primary/15"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Smart Tuition & Mentorship Platform
            </Badge>

            <h1 className="text-[3.2rem] sm:text-[3.75rem] font-extrabold leading-[1.08] tracking-tight mb-6 text-foreground">
              Find the Right{" "}
              <span className="text-primary">Tutor.</span>
              <br />
              Unlock Your{" "}
              <span className="border-b-[3px] border-accent pb-0.5">
                Potential.
              </span>
            </h1>

            <p className="text-base leading-relaxed mb-9 max-w-md text-muted-foreground">
              Connect with verified academic mentors for personalized 1-on-1
              sessions and in-person tuition batches. Elevate grades and build
              lasting learning confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                size="lg"
                className="rounded-full gap-2 px-6 shadow-sm"
                nativeButton={false}
                render={<Link href="/browse-tuitions" />}
              >
                <Search className="w-4 h-4" />
                Explore Tuitions
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full gap-2 px-6"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                <GraduationCap className="w-4 h-4" />
                Become a Tutor
              </Button>
            </div>

            {/* Search */}
            <div className="bg-card border border-border rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 max-w-md mb-9 shadow-sm">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-4 h-4 shrink-0 text-muted-foreground" />

                <Input
                  placeholder="Search — Physics, Math, IELTS…"
                  className="border-0 shadow-none bg-transparent focus-visible:ring-0 text-sm h-auto py-1.5 px-0"
                />
              </div>

              <Button className="rounded-xl text-sm px-5" size="sm">
                Search
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3.5">
              <div className="flex -space-x-2">
                {["#7891B5", "#A9B8CC", "#5C76A0", "#C4D0DF"].map(
                  (color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-background"
                      style={{ background: color }}
                    />
                  )
                )}
              </div>

              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-current text-amber-400"
                    />
                  ))}

                  <span className="text-sm font-bold ml-1 text-foreground">
                    4.9
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  from 1,200+ satisfied students & mentors
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-6">
            <div className="relative w-full max-w-sm">
              <div className="rounded-3xl p-10 text-center relative overflow-hidden bg-primary">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 80%, #fff 0%, transparent 50%)",
                  }}
                />

                <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-1.5">
                  MentorLagbe
                </h3>

                <p className="text-sm text-white/70">
                  Your Academic Growth Partner
                </p>

                <Badge className="mt-5 rounded-full gap-1.5 text-xs font-medium bg-white/15 text-white border-0 hover:bg-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                  Live Tutor Matching
                </Badge>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-md">
                <p className="text-[11px] text-muted-foreground">
                  Expert Tutors
                </p>
                <p className="text-xl font-extrabold text-foreground">
                  500+
                </p>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-accent border border-border rounded-2xl px-4 py-3 shadow-md">
                <p className="text-[11px] font-medium text-foreground/60">
                  Avg. Rating
                </p>

                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span className="text-xl font-extrabold text-foreground">
                    4.9
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
