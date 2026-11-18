import { ShieldCheck, Layers, BadgeCheck, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: ShieldCheck, title: "100% Verified",     description: "Every tutor is manually reviewed, ID-verified, and background-checked before listing." },
  { icon: Layers,      title: "Flexible Modes",    description: "Choose Online, Offline, or Hybrid sessions — tailored to your schedule and comfort." },
  { icon: BadgeCheck,  title: "Zero Student Fees",  description: "Browse, apply, and connect with tutors completely free. Pro unlocks priority features." },
  { icon: Lock,        title: "Secured Payouts",   description: "Tutors receive secure payments via Stripe. All transactions encrypted and guaranteed." },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-label">MentorLagbe Difference</span>
          <h2 className="section-heading">Engineered for Academic Trust</h2>
          <p className="section-subtext mt-4">We eliminate the hassle, guesswork, and distrust of traditional private tuition.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <CardContent className="p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
