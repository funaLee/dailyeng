import ShopPageClient from "@/components/page/ShopPageClient";

interface ShopItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  icon: string;
  image: string;
  status: string;
  details?: string;
}

export default async function ShopPage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Streak Freeze",
      category: "Power-up",
      description:
        "Protect your streak! One free missed day won't break your progress.",
      price: 500,
      icon: "🧊",
      image: "/learning.jpg",
      status: "available",
      details: "Valid for 7 days after purchase. Can be stacked up to 3 times.",
    },
    {
      id: 2,
      name: "Double XP",
      category: "Boost",
      description: "Earn 2x experience points for 24 hours on all activities.",
      price: 800,
      icon: "⚡",
      image: "/learning.jpg",
      status: "active",
      details:
        "Activates immediately upon purchase. Cannot be paused once started.",
    },
    {
      id: 3,
      name: "Premium Avatar",
      category: "Cosmetic",
      description:
        "Unlock exclusive avatar frames and badges for your profile.",
      price: 1200,
      icon: "👑",
      image: "/learning.jpg",
      status: "available",
    },
    {
      id: 4,
      name: "Skip Challenge",
      category: "Power-up",
      description: "Skip one difficult challenge or test without penalty.",
      price: 600,
      icon: "🎯",
      image: "/learning.jpg",
      status: "available",
    },
    {
      id: 5,
      name: "Unlimited Hearts",
      category: "Boost",
      description:
        "No more heart limits for 7 days. Practice as much as you want!",
      price: 1500,
      icon: "❤️",
      image: "/learning.jpg",
      status: "used",
    },
    {
      id: 6,
      name: "Lesson Unlock",
      category: "Access",
      description: "Unlock any locked lesson or topic immediately.",
      price: 400,
      icon: "🔓",
      image: "/learning.jpg",
      status: "available",
    },
    {
      id: 7,
      name: "AI Tutor Session",
      category: "Learning",
      description: "Get 30 minutes of personalized 1-on-1 AI tutoring.",
      price: 2000,
      icon: "🤖",
      image: "/learning.jpg",
      status: "available",
    },
    {
      id: 8,
      name: "Progress Report",
      category: "Analytics",
      description: "Detailed analytics of your learning progress and insights.",
      price: 300,
      icon: "📊",
      image: "/learning.jpg",
      status: "available",
    },
  ];

  const userPoints = 4300;

  return <ShopPageClient shopItems={shopItems} userPoints={userPoints} />;
}
