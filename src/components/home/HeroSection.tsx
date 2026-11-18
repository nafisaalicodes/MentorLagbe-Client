
import Link from "next/link";
import Image from "next/image";
import { Search, Star, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden bg-background">

      {/* Subtle Glow */}
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

          {/* Left Section */}
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

            <p className="block w-full max-w-md text-base leading-7 mb-9 text-slate-600">
              Connect with verified academic mentors for personalized 1 on 1
              sessions and in person tuition batches. Elevate grades and build
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

            {/* Search Bar */}
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

            {/* Social Proof */}
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

          
{/* Right Section */}
<div className="hidden lg:flex items-center justify-center">
  <div className="relative w-full max-w-md overflow-visible">

    {/* Main Image Box */}
    <div className="relative rounded-[28px] bg-[#273469] p-3 sm:p-4 shadow-2xl">
      <Image
        src="/hero.jpg"
        alt="A student learning with a tutor"
        width={600}
        height={450}
        priority
        className="w-full aspect-[4/3] object-cover rounded-[20px]"
      />
    </div>

    {/* Expert Tutors Card */}
    <div className="absolute z-20 -top-5 -right-5 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-lg">
      <p className="text-xs font-medium text-slate-500">
        Expert Tutors
      </p>
      <p className="text-2xl font-extrabold text-[#273469]">
        500+
      </p>
    </div>

    {/* Rating Card */}
    <div className="absolute z-20 -bottom-5 -left-5 bg-[#7563E8] rounded-2xl px-5 py-3 shadow-lg">
      <p className="text-xs font-medium text-white/80">
        Average Rating
      </p>

      <div className="flex items-center gap-1.5">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="text-2xl font-extrabold text-white">
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
