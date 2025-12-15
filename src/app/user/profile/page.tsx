import ProfilePageClient from "@/components/page/ProfilePageClient";
import { getUserProfile } from "@/actions/user";

// Generate realistic activity data based on completed lessons
function generateActivityData(): Record<string, number> {
  const today = new Date();
  const data: Record<string, number> = {};

  // Generate last year of data (365 days) - matches LeetCode style
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Realistic activity pattern: higher on weekdays, lower on weekends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Random activity with weighted probability
    const rand = Math.random();
    if (isWeekend) {
      data[dateStr] = rand > 0.6 ? Math.floor(rand * 3) : 0;
    } else {
      data[dateStr] = rand > 0.3 ? Math.floor(rand * 5) : 0;
    }
  }

  return data;
}

// Fallback quotes when API fails
const fallbackQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
];

// Fetch random quote from zenquotes.io
async function fetchQuote(): Promise<{ text: string; author: string }> {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      cache: "no-store", // Fresh on each page load
    });
    if (!res.ok) throw new Error("API failed");
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        text: data[0].q,
        author: data[0].a,
      };
    }
    throw new Error("No data");
  } catch {
    // Return random fallback quote if API fails
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }
}

export default async function ProfilePage() {
  // Fetch user data
  const { user } = await getUserProfile();
  const userName = user?.name || "User";

  const activityData = generateActivityData();
  const quote = await fetchQuote();

  return (
    <ProfilePageClient
      activityData={activityData}
      userName={userName}
      quote={quote}
    />
  );
}

