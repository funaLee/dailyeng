// Server Component - No "use client" directive
// Data fetching happens here on the server

import HomePageClient from "@/components/page/HomePageClient";
import type { FeatureTab, PartnerLogo } from "@/components/page/HomePageClient";

// Import reviews from seed_comments.ts (with Pexels images for avatars and success photos)
import { reviews } from "../../prisma/seed_comments";

// Mock data - In the future, this can be replaced with actual data fetching
const featureTabs: FeatureTab[] = [
  {
    id: "language-hub",
    label: "Language Hub",
    title: "Language Hub",
    description:
      "No more rote memorization. Every word and rule you learn is reinforced through exercises, conversations, and real applications.",
    image: "/languagehub.jpg",
  },
  {
    id: "speaking-room",
    label: "Speaking Room",
    title: "Virtual Speaking Room",
    description:
      "Practice speaking in real-life contexts with AI tutors. Get instant feedback and interactive speaking sessions. Build confidence step by step.",
    image: "/speakingroom.jpg",
  },
  {
    id: "study-plan",
    label: "Personal Study Plan",
    title: "Personal Study Plan",
    description:
      "DailyEng adapts to your goals. Whether you're practicing for school, work, or exams — we guide your progress with a personalized learning roadmap.",
    image: "/personal-study-plan.jpg",
  },
  {
    id: "learning-profile",
    label: "Your Learning Profile",
    title: "Your Learning Profile",
    description:
      "Track your achievements, streaks, strengths, and areas to improve. Grow with your own learning journey.",
    image: "/your-learning-profile.jpg",
  },
];

const partnerLogos: PartnerLogo[] = [
  { src: "/bc-logo.png", alt: "British Council" },
  { src: "/idp-logo.png", alt: "IDP" },
  { src: "/cambridge-logo.png", alt: "Cambridge" },
  { src: "/toefl-logo.png", alt: "TOEFL" },
  { src: "/ielts-logo.png", alt: "IELTS" },
];

export default async function HomePage() {
  // In the future, you can fetch data from DB, API, or File System here
  // const featureTabs = await fetchFeatureTabs()
  // const reviews = await fetchReviews()
  // const partnerLogos = await fetchPartnerLogos()

  return (
    <HomePageClient
      featureTabs={featureTabs}
      reviews={reviews}
      partnerLogos={partnerLogos}
    />
  );
}
