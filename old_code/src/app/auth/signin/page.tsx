// Server Component - No "use client" directive
// Data fetching happens here on the server

import SignInPageClient from "@/components/page/SignInPageClient";
import type { SignInStat } from "@/components/page/SignInPageClient";

// Mock data - In the future, this can be replaced with actual data fetching

const stats: SignInStat[] = [
  { value: "50K+", label: "Active Learners" },
  { value: "1000+", label: "Lessons" },
  { value: "4.9", label: "User Rating" },
];

const demoCredentials = {
  email: "demo@example.com",
  password: "password",
};

export default async function SignInPage() {
  // In the future, you can fetch data from DB, API, or File System here
  // const stats = await fetchStats()

  return <SignInPageClient stats={stats} demoCredentials={demoCredentials} />;
}
