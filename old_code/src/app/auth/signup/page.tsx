// Server Component - No "use client" directive
// Data fetching happens here on the server

import SignUpPageClient from "@/components/page/SignUpPageClient";

// Mock data - In the future, this can be replaced with actual data fetching

const benefits = [
  "Access to 1000+ interactive lessons",
  "AI-powered speaking practice",
  "Personalized learning paths",
  "Progress tracking & analytics",
  "Vocabulary builder with spaced repetition",
];

export default async function SignUpPage() {
  // In the future, you can fetch data from DB, API, or File System here
  // const benefits = await fetchBenefits()

  return <SignUpPageClient benefits={benefits} />;
}
