"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to ensure user exists
async function ensureUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        await prisma.user.create({
            data: {
                id: userId,
                name: "Learner",
                email: `learner-${userId}@example.com`,
                level: "3.0",
            }
        });
    }
}

export async function getStudyPlan(userId: string) {
    await ensureUser(userId);

    // Fetch or create a default plan
    let plan = await prisma.studyPlan.findUnique({
        where: { userId },
        include: {
            tasks: {
                orderBy: { date: 'asc' }
            }
        }
    });

    if (!plan) {
        // Create a default plan
        plan = await prisma.studyPlan.create({
            data: {
                userId,
                goal: "exam",
                level: "B1",
                minutesPerDay: 90,
                wordsPerDay: 15,
                interests: ["General"],
            },
            include: { tasks: true }
        });

        // Generate some sample tasks for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.studyTask.createMany({
            data: [
                {
                    planId: plan.id,
                    date: today,
                    type: "speaking",
                    title: "Speaking Room Session",
                    startTime: "06:00",
                    endTime: "06:30",
                    link: "/speaking",
                    completed: false
                },
                {
                    planId: plan.id,
                    date: today,
                    type: "vocab",
                    title: "Learn 15 New Words",
                    startTime: "12:00",
                    endTime: "12:20",
                    link: "/notebook",
                    completed: false
                },
                {
                    planId: plan.id,
                    date: today,
                    type: "grammar",
                    title: "Grammar Quiz: Past Tense",
                    startTime: "20:00",
                    endTime: "20:30",
                    link: "/quizzes",
                    completed: false
                }
            ]
        });

        // Refetch with new tasks
        plan = await prisma.studyPlan.findUnique({
            where: { userId },
            include: {
                tasks: { orderBy: { date: 'asc' } }
            }
        });
    }

    return plan;
}

export async function getTodayTasks(userId: string) {
    await ensureUser(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const plan = await prisma.studyPlan.findUnique({
        where: { userId },
        select: { id: true }
    });

    if (!plan) {
        return [];
    }

    const tasks = await prisma.studyTask.findMany({
        where: {
            planId: plan.id,
            date: {
                gte: today,
                lt: tomorrow
            }
        },
        orderBy: { date: 'asc' }
    });

    if (tasks.length === 0) {
        // If no tasks exists for today, perhaps generate them?
        // (For now, we leave it empty or handled by getStudyPlan initial creation)
    }

    return tasks;
}

export async function toggleTaskCompletion(taskId: string, completed: boolean) {
    await prisma.studyTask.update({
        where: { id: taskId },
        data: { completed }
    });

    revalidatePath("/plan");
}

export async function updateTaskTime(taskId: string, startTime: string, endTime: string) {
    await prisma.studyTask.update({
        where: { id: taskId },
        data: { startTime, endTime }
    });
    revalidatePath("/plan");
}

export async function updateStudyGoal(userId: string, goal: string, level: string, hoursPerWeek: number) {
    const minutesPerDay = Math.round((hoursPerWeek * 60) / 7);

    await prisma.studyPlan.update({
        where: { userId },
        data: {
            goal: goal as "exam" | "communication",
            level: level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
            minutesPerDay
        }
    });
    revalidatePath("/plan");
}

export async function updateExamDate(userId: string, date: Date) {
    await prisma.studyPlan.update({
        where: { userId },
        data: { examDate: date }
    });
    revalidatePath("/plan");
}

export async function getStudyStats(userId: string) {
    await ensureUser(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get start of week (Monday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    // Get stats
    const [dailyTasks, weeklyTasks, profileStats] = await Promise.all([
        prisma.studyTask.findMany({
            where: {
                plan: { userId },
                date: { gte: today, lt: tomorrow },
                completed: true
            }
        }),
        prisma.studyTask.findMany({
            where: {
                plan: { userId },
                date: { gte: startOfWeek },
                completed: true
            }
        }),
        prisma.profileStats.findUnique({ where: { userId } })
    ]);

    // Helper to calculate minutes from "HH:MM" - "HH:MM"
    const calculateMinutes = (tasks: any[]) => {
        return tasks.reduce((acc, task) => {
            if (!task.startTime || !task.endTime) return acc + 20; // Default 20 mins if no time

            const [startH, startM] = task.startTime.split(':').map(Number);
            const [endH, endM] = task.endTime.split(':').map(Number);
            const start = startH * 60 + startM;
            const end = endH * 60 + endM;
            return acc + (end - start);
        }, 0);
    };

    const dailyMinutes = calculateMinutes(dailyTasks);
    const weeklyMinutes = calculateMinutes(weeklyTasks);
    const totalMinutes = (profileStats?.totalLearningMinutes || 0) + calculateMinutes(weeklyTasks); // Approx total

    return {
        dailyHours: (dailyMinutes / 60).toFixed(1),
        weeklyHours: (weeklyMinutes / 60).toFixed(1),
        totalHours: (totalMinutes / 60).toFixed(1)
    };
}

export async function createNewPlan(userId: string, data: {
    goal: string,
    level: string,
    hoursPerWeek: number,
    interests: string[]
}) {
    const minutesPerDay = Math.round((data.hoursPerWeek * 60) / 7);

    // Delete existing plan if any (simplification for "New Plan")
    await prisma.studyPlan.deleteMany({ where: { userId } });

    const plan = await prisma.studyPlan.create({
        data: {
            userId,
            goal: data.goal as "exam" | "communication",
            level: data.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
            minutesPerDay,
            interests: data.interests,
            examDate: new Date("2025-12-28") // Default exam date
        }
    });

    // Generate tasks for the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasksData = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        // Add 3 tasks per day
        tasksData.push({
            planId: plan.id,
            date: date,
            type: "vocab",
            title: `Vocabulary Day ${i + 1}`,
            startTime: "07:00",
            endTime: "07:30",
            link: "/notebook",
            completed: false
        });
        tasksData.push({
            planId: plan.id,
            date: date,
            type: "speaking",
            title: `Speaking Practice Day ${i + 1}`,
            startTime: "13:00",
            endTime: "13:45",
            link: "/speaking",
            completed: false
        });
        tasksData.push({
            planId: plan.id,
            date: date,
            type: "grammar",
            title: `Grammar Focus Day ${i + 1}`,
            startTime: "20:00",
            endTime: "20:30",
            link: "/quizzes",
            completed: false
        });
    }

    await prisma.studyTask.createMany({ data: tasksData });
    revalidatePath("/plan");
}

export async function generateStudySchedule(userId: string, courseIds: string[], daysOfWeek: number[]) {
    // 1. Validate inputs
    if (!courseIds.length || !daysOfWeek.length) {
        throw new Error("Please select courses and study days.");
    }

    // 2. Clear existing tasks (optional: decided to clear for fresh start)
    await prisma.studyTask.deleteMany({
        where: {
            plan: { userId },
            date: { gte: new Date() } // Only clear future tasks
        }
    });

    // 3. Ensure Plan Exists
    let plan = await prisma.studyPlan.findUnique({ where: { userId } });
    if (!plan) {
        plan = await prisma.studyPlan.create({
            data: {
                userId,
                goal: "exam",
                level: "B1",
                minutesPerDay: 45,
                interests: ["General"],
            }
        });
    }

    // 4. Fetch Course Content (Topics)
    // We assume courses have topics, and we schedule topics as tasks.
    const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        include: {
            topics: { orderBy: { order: 'asc' } }
        }
    });

    // Flatten all topics to schedule
    let allTopics: any[] = [];
    courses.forEach((course: any) => {
        allTopics = [...allTopics, ...course.topics.map((t: any) => ({ ...t, courseName: course.name }))];
    });

    // 5. Schedule Logic
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start tomorrow
    startDate.setHours(0, 0, 0, 0);

    const tasksToCreate = [];
    let currentTopicIndex = 0;
    let currentDate = new Date(startDate);

    // Safety break after 365 days or when topics run out
    while (currentTopicIndex < allTopics.length && tasksToCreate.length < 365) {

        // Check if current day is in selected days (0=Sun, 1=Mon, ...)
        if (daysOfWeek.includes(currentDate.getDay())) {
            const topic = allTopics[currentTopicIndex];

            // Create a task for this topic
            tasksToCreate.push({
                planId: plan.id,
                date: new Date(currentDate),
                type: "vocab", // Default type, logic could be smarter based on topic category
                title: topic.title,
                startTime: "19:00", // Default evening slot
                endTime: "19:45",
                link: `/topics/${topic.id}`,
                completed: false
            });

            currentTopicIndex++;
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 6. Batch Create Tasks
    if (tasksToCreate.length > 0) {
        await prisma.studyTask.createMany({
            data: tasksToCreate
        });
    }

    // 7. Register User for Courses if not already
    // (Optional: Depends if logic requires tracking registration)

    revalidatePath("/plan");
    return { success: true, count: tasksToCreate.length };
}
