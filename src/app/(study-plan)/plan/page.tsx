// Server Component - No "use client" directive
// Data fetching happens here on the server

import PlanPageClient from "@/components/page/PlanPageClient";
import type {
  TodayLesson,
  Reminder,
  StudyGoals,
  IELTSExam,
} from "@/components/page/PlanPageClient";

// Mock data - In the future, this can be replaced with actual data fetching

const todayLessons: TodayLesson[] = [
  {
    id: "l1",
    type: "vocab",
    title: "Vocabulary Topic: Animals",
    topic: "Từ mới: 13 • Khóa học: IELTS Preparation",
    duration: "Thời gian học: 20 phút",
    completed: false,
    link: "/vocab/animals",
  },
  {
    id: "l2",
    type: "grammar",
    title: "Grammar Topic: Present Simple",
    topic: "Ngữ pháp mới: 4 • Khóa học: IELTS Preparation",
    duration: "Thời gian học: 10 phút",
    completed: false,
    link: "/grammar/present-simple",
  },
  {
    id: "l3",
    type: "grammar",
    title: "Grammar Topic: Could/Should",
    topic: "Ngữ pháp mới: 4 • Khóa học: IELTS Preparation",
    duration: "Thời gian học: 10 phút",
    completed: false,
    link: "/grammar/modals",
  },
];

const reminders: Reminder[] = [
  {
    id: "r1",
    type: "speaking",
    title: "Speaking Room",
    description: "Bạn chưa luyện nói lần nào",
    action: "Luyện ngay",
    href: "/speaking",
  },
  {
    id: "r2",
    type: "notebook",
    title: "Notebook",
    description: "Bạn còn 34 từ cần học hôm nay",
    action: "Ôn tập ngay",
    href: "/notebook",
  },
  {
    id: "r3",
    type: "missed",
    title: "Missed Tasks",
    description: "Bạn còn nhiệm vụ hôm qua chưa hoàn thành",
    action: "Quay lại",
    href: "/plan",
  },
];

const studyGoals: StudyGoals = {
  currentLevel: "3.0",
  targetLevel: "6.0",
  hoursPerWeek: 10,
  durationMonths: 4,
};

const ieltsExam: IELTSExam = {
  examDate: new Date("2026-03-28").toISOString(), // Serialized as ISO string
  daysRemaining: 120,
};

export default async function PlanPage() {
  // In the future, you can fetch data from DB, API, or File System here
  // const todayLessons = await fetchTodayLessons()
  // const reminders = await fetchReminders()

  return (
    <PlanPageClient
      todayLessons={todayLessons}
      reminders={reminders}
      studyGoals={studyGoals}
      ieltsExam={ieltsExam}
    />
  );
}
