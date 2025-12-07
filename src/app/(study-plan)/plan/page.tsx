import { getTodayTasks, getStudyPlan, getStudyStats } from "@/actions/study";
import PlanPageClient from "@/components/page/PlanPageClient";
import type {
  TodayLesson,
  Reminder,
  StudyGoals,
  IELTSExam,
} from "@/components/page/PlanPageClient";

// Default/Fallback data
const defaultReminders: Reminder[] = [
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
    description: "You have words to review",
    action: "Review Now",
    href: "/notebook",
  },
];

const defaultIeltsExam: IELTSExam = {
  examDate: new Date("2026-03-28").toISOString(),
  daysRemaining: 120,
};

export default async function PlanPage() {
  const userId = "user-1"; // TODO: Real auth

  const [tasks, plan, stats] = await Promise.all([
    getTodayTasks(userId),
    getStudyPlan(userId),
    getStudyStats(userId)
  ]);

  // Transform Tasks to TodayLesson format
  const todayLessons: TodayLesson[] = tasks.map((t: any) => ({
    id: t.id,
    type: t.type as any, // "vocab" | "grammar" | "speaking"
    title: t.title || "Study Task",
    topic: "Daily Task", // Could come from relation if needed
    duration: t.startTime && t.endTime ? `${t.startTime} - ${t.endTime}` : "20 min",
    completed: t.completed,
    link: t.link || "/dashboard",
    startTime: t.startTime || undefined,
    endTime: t.endTime || undefined,
  }));

  const studyGoals: StudyGoals = {
    currentLevel: plan?.level || "3.0",
    targetLevel: plan?.goal === "exam" ? "6.5" : "Fluency",
    hoursPerWeek: Math.round((plan?.minutesPerDay || 60) * 7 / 60),
    durationMonths: 6,
  };

  const ieltsExam: IELTSExam = {
    examDate: plan?.examDate ? plan.examDate.toISOString() : new Date("2026-03-28").toISOString(),
    daysRemaining: plan?.examDate
      ? Math.ceil((new Date(plan.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 120,
  };

  return (
    <PlanPageClient
      todayLessons={todayLessons}
      reminders={defaultReminders}
      studyGoals={studyGoals}
      ieltsExam={ieltsExam}
      stats={stats}
    />
  );
}
