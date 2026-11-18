import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const testimonials = [
  { name: "Rafiqul Islam",  role: "HSC Student, Dhaka",      rating: 5, initials: "RI",
    review: "MentorLagbe helped me find the best Physics tutor in just 2 days! My grades jumped from B to A+ in one semester." },
  { name: "Sumaiya Akter",  role: "SSC Student, Chittagong", rating: 5, initials: "SA",
    review: "Our biggest concern was finding a trusted tutor online. MentorLagbe's background-check system gave us peace of mind." },
  { name: "Tariq Mahmud",   role: "BBA Student, Sylhet",     rating: 5, initials: "TM",
    review: "Managing teaching slots was painful before this. Now students apply directly, I accept or decline — simple and clean." },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-label">Success Stories</span>
          <h2 className="section-heading">Trusted by Thousands Across the Country</h2>
          <p className="section-subtext mt-4">Real experiences from our active learners, parents, and dedicated tutors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(({ name, role, rating, review, initials }) => (
            <Card key={name} className="hover:shadow-md transition-all duration-200 relative">
              <CardContent className="p-6">
                <Quote className="absolute top-5 right-5 w-6 h-6 text-primary/10" />

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-foreground mb-5">&ldquo;{review}&rdquo;</p>

                <Separator className="mb-4" />

                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
