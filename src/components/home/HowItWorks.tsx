import { Search, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { step: "01", icon: Search,      title: "Find Your Tutor",          description: "Search and filter tuition listings by subject, class level, mode, location, and budget — in just 2 minutes." },
  { step: "02", icon: Calendar,    title: "Connect & Schedule Trial", description: "Connect directly on the platform, choose your preferred schedule, and book a session. No third-party apps or hidden fees." },
  { step: "03", icon: TrendingUp,  title: "Start & Track Progress",   description: "Begin personalized learning. Track session history, application status, and growth directly from your dashboard." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="section-label">Simple Process</span>
          <h2 className="section-heading">How MentorLagbe Works</h2>
          <p className="section-subtext mt-4">Connect with the right tutor and start learning in three effortless steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {/* Connector (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px bg-border" />

          {steps.map(({ step, icon: Icon, title, description }) => (
            <Card key={step} className="relative text-center hover:shadow-md transition-all duration-200">
              {/* Step pill */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                {step}
              </div>
              <CardContent className="pt-10 pb-8 px-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
                </div>
                <h3 className="text-[0.95rem] font-bold text-foreground mb-2.5">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
