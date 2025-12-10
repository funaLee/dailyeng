import PlanPageClient from "@/components/page/PlanPageClient";
import type {
  TodayLesson,
  Reminder,
  StudyGoals,
  IELTSExam,
} from "@/components/page/PlanPageClient";

// Mock data - will be replaced with actual data fetching from DB/API later
const mockTodayLessons: TodayLesson[] = [
  {
    id: "task-1",
    type: "vocab",
    title: "Business Vocabulary",
    topic: "Professional English",
    duration: "09:00 - 09:30",
    completed: true,
    link: "/vocab/business",
    startTime: "09:00",
    endTime: "09:30",
  },
  {
    id: "task-2",
    type: "grammar",
    title: "Past Perfect Tense",
    topic: "Grammar Fundamentals",
    duration: "10:00 - 10:30",
    completed: true,
    link: "/grammar/past-perfect",
    startTime: "10:00",
    endTime: "10:30",
  },
  {
    id: "task-3",
    type: "speaking",
    title: "Job Interview Practice",
    topic: "Speaking Skills",
    duration: "14:00 - 14:30",
    completed: false,
    link: "/speaking/session/scenario-2",
    startTime: "14:00",
    endTime: "14:30",
  },
  {
    id: "task-4",
    type: "vocab",
    title: "Travel Vocabulary",
    topic: "Daily Life",
    duration: "16:00 - 16:20",
    completed: false,
    link: "/vocab/travel",
    startTime: "16:00",
    endTime: "16:20",
  },
];

const mockReminders: Reminder[] = [
  {
    id: "r1",
    type: "speaking",
    title: "Speaking Room",
    description: "You haven't practiced speaking today",
    action: "Practice Now",
    href: "/speaking",
  },
  {
    id: "r2",
    type: "notebook",
    title: "Notebook",
    description: "You have 15 words to review",
    action: "Review Now",
    href: "/notebook",
  },
];

const mockStudyGoals: StudyGoals = {
  currentLevel: "5.0",
  targetLevel: "6.5",
  hoursPerWeek: 10,
  durationMonths: 6,
};

const mockIeltsExam: IELTSExam = {
  examDate: new Date("2025-06-15").toISOString(),
  daysRemaining: 187,
};

const mockStats = {
  dailyHours: "2.5",
  weeklyHours: "15",
  totalHours: "120",
};

export default async function PlanPage() {
  const userId = "user-1"; // TODO: Real auth

  // Mock data - will be replaced with actual data fetching from DB/API later
  const todayLessons = mockTodayLessons;
  const reminders = mockReminders;
  const studyGoals = mockStudyGoals;
  const ieltsExam = mockIeltsExam;
  const stats = mockStats;

  return (
    <PlanPageClient
      todayLessons={todayLessons}
      reminders={reminders}
      studyGoals={studyGoals}
      ieltsExam={ieltsExam}
      stats={stats}
    />
  );
}
