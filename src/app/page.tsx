import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import PopularSubjects from "@/components/home/PopularSubjects";
import LatestTuitions from "@/components/home/LatestTuitions";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSection from "@/components/home/TrustSection";
import Testimonials from "@/components/home/Testimonials";
import PricingSection from "@/components/home/PricingSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <PopularSubjects />
      <LatestTuitions />
      <HowItWorks />
      <TrustSection />
      <Testimonials />
      <PricingSection />
      <CTASection />
    </main>
  );
}
