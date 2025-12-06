// Server Component - No "use client" directive
// Data fetching happens here on the server

import HomePageClient from "@/components/page/HomePageClient";
import type {
  FeatureTab,
  Review,
  PartnerLogo,
} from "@/components/page/HomePageClient";

// Mock data - In the future, this can be replaced with actual data fetching
const featureTabs: FeatureTab[] = [
  {
    id: "language-hub",
    label: "Language Hub",
    title: "Language Hub",
    description:
      "No more rote memorization. Every word and rule you learn is reinforced through exercises, conversations, and real applications.",
    image: "/learning.png",
  },
  {
    id: "speaking-room",
    label: "Speaking Room",
    title: "Virtual Speaking Room",
    description:
      "Practice speaking in real-life contexts with AI tutors. Get instant feedback and interactive speaking sessions. Build confidence step by step.",
    image: "/learning.png",
  },
  {
    id: "study-plan",
    label: "Personal Study Plan",
    title: "Personal Study Plan",
    description:
      "DailyEng adapts to your goals. Whether you're practicing for school, work, or exams — we guide your progress with a personalized learning roadmap.",
    image: "/learning.png",
  },
  {
    id: "learning-profile",
    label: "Your Learning Profile",
    title: "Your Learning Profile",
    description:
      "Track your achievements, streaks, strengths, and areas to improve. Grow with your own learning journey.",
    image: "/learning.png",
  },
];

const reviews: Review[] = [
  {
    name: "Nguyen Van A",
    avatar: "/asian-male-student-portrait.png",
    ielts: "7.5",
    content:
      "DailyEng helped me improve my speaking skills dramatically. The AI tutor is amazing!",
    direction: "up",
    fullFeedback:
      "DailyEng completely transformed my English learning journey. Before using this platform, I struggled with speaking confidence and couldn't hold a conversation for more than a few minutes. The AI tutor feature is incredibly patient and provides instant feedback on pronunciation and grammar. After 6 months of consistent practice, I achieved my dream IELTS score. The gamification elements kept me motivated throughout, and the speaking room sessions with other learners gave me real-world practice opportunities.",
    courses: [
      "IELTS Speaking Mastery",
      "Academic Writing",
      "Pronunciation Pro",
    ],
    result: { type: "IELTS", score: "7.5", previousScore: "5.5" },
    duration: "6 months",
    photo: "/learning.png",
  },
  {
    name: "Tran Thi B",
    avatar: "/asian-female-student-portrait.png",
    ielts: "8.0",
    content:
      "I love the gamification features. Learning English has never been this fun!",
    direction: "up",
    fullFeedback:
      "As someone who always found traditional English classes boring, DailyEng was a breath of fresh air. The gamification features made me actually look forward to my daily lessons. I earned badges, competed on leaderboards, and the streak system ensured I never missed a day. The vocabulary hub is particularly impressive - I learned over 3000 new words in just 4 months. The platform's ability to adapt to my learning pace and style made all the difference in my IELTS preparation.",
    courses: [
      "Vocabulary Builder",
      "IELTS Complete Preparation",
      "Grammar Fundamentals",
    ],
    result: { type: "IELTS", score: "8.0", previousScore: "6.0" },
    duration: "4 months",
    photo: "/learning.png",
  },
  {
    name: "Le Van C",
    avatar: "/asian-male-professional-portrait.jpg",
    ielts: "7.0",
    content:
      "The personalized study plan keeps me motivated every day. Highly recommended!",
    direction: "up",
    fullFeedback:
      "Working full-time made it challenging to find time for English study, but DailyEng's personalized study plan fit perfectly into my busy schedule. The platform analyzed my strengths and weaknesses and created a custom curriculum just for me. The mobile app allowed me to study during commutes, and the short, focused lessons were perfect for my attention span. I went from intermediate to advanced level while maintaining my job, something I thought was impossible before.",
    courses: ["Business English", "Daily Conversation", "Listening Skills"],
    result: { type: "IELTS", score: "7.0", previousScore: "5.0" },
    duration: "8 months",
    photo: "/learning.png",
  },
  {
    name: "Pham Thi D",
    avatar: "/asian-female-graduate-portrait.jpg",
    ielts: "8.5",
    content:
      "Best English learning platform I've ever used. The speaking room is a game-changer!",
    direction: "down",
    fullFeedback:
      "I've tried numerous English learning platforms before DailyEng, but none came close to this experience. The speaking room feature connected me with learners from around the world, giving me invaluable practice in real conversations. The AI feedback on my speaking was spot-on and helped me identify issues I never knew I had. The comprehensive IELTS preparation materials, especially for the writing section, were exceptional. I achieved a band 8.5, exceeding my target of 7.5!",
    courses: [
      "IELTS Writing Excellence",
      "Speaking Room Premium",
      "Reading Strategies",
    ],
    result: { type: "IELTS", score: "8.5", previousScore: "6.5" },
    duration: "5 months",
    photo: "/learning.png",
  },
  {
    name: "Hoang Van E",
    avatar: "/asian-male-university-student-portrait.jpg",
    ielts: "7.5",
    content:
      "Great for exam preparation. I improved my IELTS score significantly!",
    direction: "down",
    fullFeedback:
      "DailyEng's exam preparation materials are comprehensive and well-structured. The practice tests closely mimic the actual IELTS format, which helped me feel confident on test day. The detailed explanations for each answer taught me valuable strategies and techniques. The progress tracking feature allowed me to see my improvement over time, which was incredibly motivating. I particularly loved the writing feedback system that provided specific suggestions for improvement.",
    courses: [
      "IELTS Full Preparation",
      "Test Strategies",
      "Time Management Skills",
    ],
    result: { type: "IELTS", score: "7.5", previousScore: "6.0" },
    duration: "3 months",
    photo: "/learning.png",
  },
  {
    name: "Nguyen Thi F",
    avatar: "/asian-female-business-professional-portrait.jpg",
    ielts: "N/A",
    content: "TOEIC preparation on DailyEng helped me get promoted at work!",
    direction: "up",
    fullFeedback:
      "My company required a minimum TOEIC score for promotion, and DailyEng helped me exceed that requirement by a huge margin. The business English focus was exactly what I needed for my career. The listening practice with various accents prepared me well for the real test. The vocabulary specific to corporate settings has been useful in my daily work communications. Within 2 months, I went from 650 to 890, opening new doors in my career.",
    courses: ["TOEIC Complete", "Business Communication", "Email Writing"],
    result: { type: "TOEIC", score: "890", previousScore: "650" },
    duration: "2 months",
    photo: "/learning.png",
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
