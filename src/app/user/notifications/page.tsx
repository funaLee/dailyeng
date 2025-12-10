import NotificationsPageClient from "@/components/page/NotificationsPageClient";

interface Notification {
  id: number;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  date: string;
  read: boolean;
}

export default async function NotificationsPage() {
  // Mock data - will be replaced with actual data fetching from DB/API later
  const notifications: Notification[] = [
    {
      id: 1,
      title: "Latest Update",
      description:
        "Your speaking session has been reviewed. Check your feedback now!",
      category: "Speaking",
      timestamp: "Just now",
      date: "23-11-2025",
      read: false,
    },
    {
      id: 2,
      title: "Latest Update",
      description:
        "New vocabulary lesson available in AI and Technology topic.",
      category: "Vocabulary",
      timestamp: "13:45",
      date: "23-11-2025",
      read: false,
    },
    {
      id: 3,
      title: "Latest Update",
      description:
        "You've earned a new badge: Week Warrior! Keep up the streak.",
      category: "Achievement",
      timestamp: "13:45",
      date: "23-11-2025",
      read: true,
    },
    {
      id: 4,
      title: "Latest Update",
      description: "Your grammar quiz results are ready. You scored 85%!",
      category: "Grammar",
      timestamp: "13:45",
      date: "23-11-2025",
      read: true,
    },
  ];

  return <NotificationsPageClient notifications={notifications} />;
}
