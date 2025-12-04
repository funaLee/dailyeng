import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { StudyPlanSection } from "@/components/home/study-plan-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary-200 selection:text-primary-900">
      <HeroSection />
      <FeaturesSection />
      <ReviewsSection />
      <StudyPlanSection />
      <CTASection />
    </div>
  );
}
