import ProfilePageClient from "@/components/page/ProfilePageClient";
import { getUserProfile } from "@/actions/user";

interface Mission {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

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

export default async function ProfilePage() {
  // Fetch user data
  const { user } = await getUserProfile();
  const userName = user?.name || "User";

  // Mock data - will be replaced with actual data fetching from DB/API later
  const missions: Mission[] = [
    { id: "m1", title: "Đăng nhập hôm nay", points: 5, completed: true },
    { id: "m2", title: "Học 30 phút", points: 10, completed: false },
    { id: "m3", title: "Học 10 từ vựng mới", points: 10, completed: false },
    {
      id: "m4",
      title: "Hoàn thành bài học hôm nay",
      points: 40,
      completed: false,
    },
    { id: "m5", title: "Luyện nói 1 lần", points: 30, completed: false },
  ];

  const activityData = generateActivityData();

  return (
    <ProfilePageClient
      missions={missions}
      activityData={activityData}
      userName={userName}
    />
  );
}

