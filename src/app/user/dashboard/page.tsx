import DashboardPageClient from "@/components/page/DashboardPageClient";

interface Mission {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: string;
  avatar: string;
  streak: number;
  isCurrentUser?: boolean;
}

interface BadgeItem {
  id: number;
  name: string;
  description: string;
  image: string;
  earned: boolean;
}

interface ShopItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  image: string;
  description: string;
  category: string;
  status: string;
}

// Generate realistic activity data based on completed lessons
function generateActivityData(): Record<string, number> {
  const today = new Date();
  const data: Record<string, number> = {};

  // Generate last 10 weeks of data (70 days)
  for (let i = 69; i >= 0; i--) {
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

export default async function DashboardPage() {
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

  const leaderboardData: LeaderboardUser[] = [
    {
      rank: 1,
      name: "Hoàng Nam",
      xp: "3,100",
      avatar: "bg-yellow-200",
      streak: 45,
    },
    {
      rank: 2,
      name: "Minh Tú",
      xp: "2,850",
      avatar: "bg-gray-200",
      streak: 38,
    },
    {
      rank: 3,
      name: "Lan Anh",
      xp: "2,720",
      avatar: "bg-orange-200",
      streak: 32,
    },
    {
      rank: 4,
      name: "Quang Đạt",
      xp: "2,500",
      avatar: "bg-green-200",
      streak: 28,
    },
    {
      rank: 5,
      name: "Hương Giang",
      xp: "2,380",
      avatar: "bg-blue-200",
      streak: 25,
    },
    {
      rank: 6,
      name: "Tuấn Anh",
      xp: "2,210",
      avatar: "bg-pink-200",
      streak: 22,
    },
    {
      rank: 7,
      name: "Mai Linh",
      xp: "2,050",
      avatar: "bg-purple-200",
      streak: 18,
    },
    {
      rank: 56,
      name: "Thanh Truc",
      xp: "1,240",
      avatar: "bg-blue-200",
      isCurrentUser: true,
      streak: 3,
    },
  ];

  const badges: BadgeItem[] = [
    {
      id: 1,
      name: "Excellent Learner",
      description: "Complete 30 lessons in a row",
      image: "/learning.png",
      earned: true,
    },
    {
      id: 2,
      name: "Vocabulary Master",
      description: "Learn 500 new words",
      image: "/learning.png",
      earned: true,
    },
    {
      id: 3,
      name: "Speaking Champion",
      description: "Complete 50 speaking sessions",
      image: "/learning.png",
      earned: false,
    },
    {
      id: 4,
      name: "Grammar Expert",
      description: "Master 20 grammar topics",
      image: "/learning.png",
      earned: false,
    },
  ];

  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Streak Freeze",
      price: 300,
      icon: "❄️",
      image: "/learning.png",
      description:
        "Protect your streak for one day if you miss your daily goal",
      category: "Power-up",
      status: "unused",
    },
    {
      id: 2,
      name: "Double XP Boost",
      price: 500,
      icon: "⚡",
      image: "/learning.png",
      description: "Earn 2x XP on all activities for 24 hours",
      category: "Boost",
      status: "active",
    },
    {
      id: 3,
      name: "Premium Avatar Frame",
      price: 1000,
      icon: "🖼️",
      image: "/learning.png",
      description: "Unlock an exclusive golden avatar frame",
      category: "Cosmetic",
      status: "used",
    },
    {
      id: 4,
      name: "Lesson Skip",
      price: 200,
      icon: "⏭️",
      image: "/learning.png",
      description: "Skip one difficult lesson without losing progress",
      category: "Power-up",
      status: "unused",
    },
    {
      id: 5,
      name: "Hint Pack",
      price: 150,
      icon: "💡",
      image: "/learning.png",
      description: "Get 10 hints to use during quizzes",
      category: "Helper",
      status: "unused",
    },
    {
      id: 6,
      name: "Time Extender",
      price: 250,
      icon: "⏰",
      image: "/learning.png",
      description: "Add 50% more time to timed exercises",
      category: "Power-up",
      status: "unused",
    },
  ];

  const activityData = generateActivityData();

  return (
    <DashboardPageClient
      missions={missions}
      leaderboardData={leaderboardData}
      badges={badges}
      shopItems={shopItems}
      activityData={activityData}
    />
  );
}
