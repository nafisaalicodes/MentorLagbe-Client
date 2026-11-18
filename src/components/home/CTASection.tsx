
import Link from "next/link";
import { Rocket, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #fff 0%, transparent 100%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/15 text-white mb-7">
          <Rocket className="w-3.5 h-3.5" />
          Start Learning Today
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
          Ready to Start Your
          <br />
          <span className="text-accent">Learning Journey?</span>
        </h2>

        <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto text-white/70">
          Join over 1,270 students already finding their ideal mentors and
          500+ passionate tutors making a difference across Bangladesh.
        </p>

        <div className="flex flex-wrap gap-3.5 justify-center">
          <Button
            nativeButton={false}
            size="lg"
            className="rounded-full gap-2 font-bold px-7 h-12 bg-white text-primary hover:bg-white/90 shadow-lg"
            render={<Link href="/sign-up" />}
          >
            <Rocket className="w-4.5 h-4.5" />
            Find a Tutor
          </Button>

          <Button
            nativeButton={false}
            size="lg"
            variant="outline"
            className="rounded-full gap-2 font-bold px-7 h-12 border-2 border-white text-white bg-white/10 hover:bg-white/20"
            render={<Link href="/sign-up" />}
          >
            <GraduationCap className="w-4.5 h-4.5" />
            Join as a Tutor
          </Button>
        </div>
      </div>
    </section>
  );
}
