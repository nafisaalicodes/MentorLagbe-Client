
import Link from "next/link";
import {
  MapPin,
  Star,
  Users,
  BookOpen,
  Wifi,
  Home,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tuitions = [
  {
    id: 1,
    title: "Higher Math & Physics",
    subject: "Mathematics + Physics",
    classLevel: "Class 11–12 (HSC)",
    mode: "Online",
    location: "Dhaka",
    monthlyFee: 5000,
    daysPerWeek: 3,
    rating: 4.9,
    students: 12,
    badge: "Verified",
  },
  {
    id: 2,
    title: "Chemistry & Biology",
    subject: "Chemistry + Biology",
    classLevel: "Class 9–10 (SSC)",
    mode: "Offline",
    location: "Chittagong",
    monthlyFee: 2000,
    daysPerWeek: 3,
    rating: 4.8,
    students: 8,
    badge: "In-Person",
  },
  {
    id: 3,
    title: "English & General Science",
    subject: "English + Science",
    classLevel: "Class 6–8 (Junior)",
    mode: "Online",
    location: "Sylhet",
    monthlyFee: 7000,
    daysPerWeek: 4,
    rating: 5.0,
    students: 15,
    badge: "Top Rated",
  },
  {
    id: 4,
    title: "Python & Basic Robotics",
    subject: "Programming + ICT",
    classLevel: "Class 9–12 & Univ.",
    mode: "Online",
    location: "Dhaka",
    monthlyFee: 4000,
    daysPerWeek: 2,
    rating: 4.7,
    students: 20,
    badge: "Popular",
  },
  {
    id: 5,
    title: "IELTS Academic Intensive",
    subject: "IELTS Preparation",
    classLevel: "All Ages",
    mode: "Online",
    location: "Dhaka",
    monthlyFee: 8000,
    daysPerWeek: 5,
    rating: 4.9,
    students: 30,
    badge: "Verified",
  },
  {
    id: 6,
    title: "Accounting & Economics",
    subject: "Accounting + Economics",
    classLevel: "Class 11–12 & BBA",
    mode: "Offline",
    location: "Dhaka",
    monthlyFee: 10000,
    daysPerWeek: 3,
    rating: 4.8,
    students: 10,
    badge: "Expert",
  },
];

export default function LatestTuitions() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="section-label">Latest Listings</span>

            <h2 className="section-heading">
              Explore Latest Tuition Opportunities
            </h2>

            <p className="section-subtext mt-3 max-w-xl">
              Browse approved tuition batches actively seeking students.
            </p>
          </div>

          <Button
            className="shrink-0 rounded-full gap-1.5"
            nativeButton={false}
            render={<Link href="/browse-tuitions" />}
          >
            Post a Tuition
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tuitions.map((t) => (
            <Card
              key={t.id}
              className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <CardContent className="p-5 flex-1">
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant="secondary"
                    className="text-[11px] rounded-full bg-primary/8 text-primary border-0"
                  >
                    {t.badge}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />

                    <span className="text-xs font-semibold text-foreground">
                      {t.rating}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[0.95rem] font-bold text-foreground mb-0.5">
                  {t.title}
                </h3>

                <p className="text-xs text-muted-foreground mb-4">
                  {t.subject}
                </p>

                {/* Meta */}
                <div className="space-y-2">
                  {[
                    { icon: BookOpen, text: t.classLevel },
                    {
                      icon: t.mode === "Online" ? Wifi : Home,
                      text: `${t.mode} · ${t.daysPerWeek} days/week`,
                    },
                    { icon: MapPin, text: t.location },
                    {
                      icon: Users,
                      text: `${t.students} students enrolled`,
                    },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 text-primary/50" />
                      {text}
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Footer */}
              <CardFooter className="px-5 py-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                    Monthly Fee
                  </p>

                  <p className="text-lg font-extrabold text-primary">
                    ৳{t.monthlyFee.toLocaleString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="rounded-xl text-xs gap-1"
                  nativeButton={false}
                  render={<Link href={`/browse-tuitions/${t.id}`} />}
                >
                  Details
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
