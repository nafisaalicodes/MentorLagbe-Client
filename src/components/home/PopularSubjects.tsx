
import Link from "next/link";
import {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  Code2,
  Languages,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjects = [
  {
    icon: Calculator,
    name: "Mathematics",
    filter: "Mathematics",
    classes: "Class 1–12 & University",
    tutors: 120,
  },
  {
    icon: Atom,
    name: "Physics",
    filter: "Physics",
    classes: "Class 6–12 & HSC",
    tutors: 95,
  },
  {
    icon: FlaskConical,
    name: "Chemistry",
    filter: "Chemistry",
    classes: "Class 9–12 & University",
    tutors: 80,
  },
  {
    icon: Languages,
    name: "English & Literature",
    filter: "English",
    classes: "All Levels",
    tutors: 110,
  },
  {
    icon: Code2,
    name: "Programming & ICT",
    filter: "Programming",
    classes: "Class 9–12 & CSE",
    tutors: 70,
  },
  {
    icon: BookOpen,
    name: "IELTS Preparation",
    filter: "IELTS",
    classes: "All Ages",
    tutors: 55,
  },
];

export default function PopularSubjects() {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="section-label">Find Your Focus Area</span>

            <h2 className="section-heading">Popular Subjects</h2>

            <p className="section-subtext mt-3 max-w-lg">
              Trending subjects taught by highly ranked academic specialists.
            </p>
          </div>

          <Button
            variant="outline"
            className="shrink-0 rounded-full gap-1.5"
            nativeButton={false}
            render={<Link href="/tuitions" />}
          >
            View all categories
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(({ icon: Icon, name, filter, classes, tutors }) => (
            <Link
              key={name}
              href={`/tuitions?subject=${encodeURIComponent(filter)}`}
              className="no-underline group"
            >
              <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                    <Icon
                      className="w-5 h-5 text-primary"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.9rem] font-bold text-foreground mb-0.5">
                      {name}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-2.5">
                      {classes}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {tutors} tutors
                      </span>

                      <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Browse →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
