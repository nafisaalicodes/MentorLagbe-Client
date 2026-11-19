
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Wifi,
  Home,
  ArrowRight,
  MapPin,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location?: string;
  monthlyFee: number;
  daysPerWeek?: number;
  tutorName: string;
};

export default function LatestTuitions() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/api/tuitions`);

        if (!response.ok) {
          throw new Error("Failed to fetch tuition listings");
        }

        const result = await response.json();

        const tuitionData = Array.isArray(result)
          ? result
          : result.data || result.tuitions || [];

        setTuitions(tuitionData.slice(0, 6));
      } catch (err) {
        console.error("Latest tuitions fetch error:", err);
        setError("Unable to load latest tuition listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="section-label">
              Latest Listings
            </span>

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
            render={<Link href="/tuitions" />}
          >
            Browse All
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 rounded-xl border bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-destructive py-10">
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && tuitions.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No approved tuition listings available right now.
          </p>
        )}

        {/* Tuition Cards */}
        {!loading && !error && tuitions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {tuitions.map((t) => (
              <Card
                key={t._id}
                className="h-full min-w-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <CardContent className="p-5 flex-1 flex flex-col">

                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className="text-[11px] rounded-full bg-primary/8 text-primary border-0"
                    >
                      Approved
                    </Badge>

                    <Badge variant="outline" className="text-[11px]">
                      {t.mode}
                    </Badge>
                  </div>

                  {/* Title and Subject */}
                  <div className="min-h-[76px]">
                    <h3 className="text-[0.95rem] font-bold text-foreground line-clamp-2">
                      {t.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {t.subject}
                    </p>
                  </div>

                  {/* Tuition Information */}
                  <div className="space-y-3 mt-5 flex-1">

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                      <span>{t.classLevel}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {t.mode === "Online" ? (
                        <Wifi className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                      ) : (
                        <Home className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                      )}
                      <span>{t.mode}</span>
                    </div>

                    {t.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                        <span className="truncate">{t.location}</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Tutor: <span className="font-semibold text-foreground">
                        {t.tutorName || "Not specified"}
                      </span>
                    </div>

                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="px-5 py-4 border-t border-border flex items-center justify-between gap-2 mt-auto">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                      Monthly Fee
                    </p>

                    <p className="text-lg font-extrabold text-primary">
                      ৳{Number(t.monthlyFee).toLocaleString("en-BD")}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="rounded-xl text-xs gap-1"
                    nativeButton={false}
                    render={<Link href={`/tuitions/${t._id}`} />}
                  >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
