// Server Component - No "use client" directive
// Data fetching happens here on the server

import HelpPageClient from "@/components/page/HelpPageClient";
import type { FAQ } from "@/components/page/HelpPageClient";

// Mock data - In the future, this can be replaced with actual data fetching
const faqs: FAQ[] = [
  {
    question: "How does the spaced repetition system work?",
    answer:
      "Our SRS uses the SM-2 algorithm to optimize your learning. Cards are reviewed at increasing intervals based on how well you remember them. Rate your recall from 'Again' to 'Perfect' to adjust the next review date.",
  },
  {
    question: "Can I create my own topics?",
    answer:
      "Yes! Click 'Create with AI' in the Vocabulary Hub to create custom topics. You can also create custom speaking scenarios in the Speaking Room.",
  },
  {
    question: "How are my speaking sessions scored?",
    answer:
      "Your speaking is evaluated on four criteria: Pronunciation (accent and sound clarity), Fluency (speed and smoothness), Grammar (correct sentence structure), and Content (relevance and completeness).",
  },
  {
    question: "What do the different learning levels mean?",
    answer:
      "A1-A2 are beginner levels, B1-B2 are intermediate. Choose your level during onboarding to get personalized content.",
  },
  {
    question: "How can I maintain my streak?",
    answer:
      "Complete at least one task per day to maintain your streak. Your daily tasks are customized based on your study plan.",
  },
  {
    question: "Is my data saved?",
    answer:
      "Yes, your progress is saved locally in your browser. Your flashcards, speaking sessions, and study plan are all preserved.",
  },
];

export default async function HelpPage() {
  // In the future, you can fetch data from DB, API, or File System here
  // const faqs = await fetchFAQs()

  return <HelpPageClient faqs={faqs} />;
}
