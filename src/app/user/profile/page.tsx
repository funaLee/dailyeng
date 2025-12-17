import ProfilePageClient from "@/components/page/ProfilePageClient";
import { getUserProfile } from "@/actions/user";

// Force dynamic rendering because this page uses auth headers
export const dynamic = "force-dynamic";

// Generate realistic activity data based on completed lessons 
function generateActivityData(): Record<string, number> {
  const today = new Date();
  const data: Record<string, number> = {};
  let totalLessons = 0;
  const targetLessons = 400; // Target around 400 lessons total

  // Generate last year of data (365 days) - matches LeetCode style
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Limit activity to reach around 100 total lessons
    if (totalLessons >= targetLessons) {
      data[dateStr] = 0;
      continue;
    }

    // Realistic activity pattern: higher on weekdays, lower on weekends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Much sparser activity to reach ~100 lessons over the year
    const rand = Math.random();
    if (isWeekend) {
      // 10% chance on weekends, max 2 lessons
      data[dateStr] = rand > 0.9 ? Math.floor(rand * 3) + 1 : 0;
    } else {
      // 20% chance on weekdays, max 3 lessons
      data[dateStr] = rand > 0.8 ? Math.floor(rand * 4) + 1 : 0;
    }
    totalLessons += data[dateStr];
  }

  return data;
}

// Calculate current streak (consecutive days from today with activity)
function calculateCurrentStreak(data: Record<string, number>): number {
  const today = new Date();
  let streak = 0;
  
  // Check from today backwards
  for (let i = 0; i <= 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    if (data[dateStr] && data[dateStr] > 0) {
      streak++;
    } else {
      // If today has no activity, streak is 0
      // If a previous day has no activity, stop counting
      break;
    }
  }
  
  return streak;
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
  const userLevel = user?.level || "A1";

  const activityData = generateActivityData();
  const currentStreak = calculateCurrentStreak(activityData);
  const quote = await fetchQuote();

  return (
    <ProfilePageClient
      activityData={activityData}
      userName={userName}
      userLevel={userLevel}
      currentStreak={currentStreak}
      quote={quote}
    />
  );
}

