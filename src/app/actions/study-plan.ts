"use server";

import { z } from "zod";

const StudyPlanDataSchema = z.object({
  goal: z.enum(["conversation", "travel", "work", "exam"]),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  interests: z.array(z.string()).min(1),
  minutesPerDay: z.number().min(10).max(60),
  wordsPerDay: z.number().int().positive(),
});

export type StudyPlanData = z.infer<typeof StudyPlanDataSchema>;

export async function createStudyPlanAction(data: StudyPlanData) {
  try {
    // Validate input data
    const validatedData = StudyPlanDataSchema.parse(data);

    // In a real app, this would save to Prisma database:
    // const plan = await prisma.studyPlan.create({
    //   data: {
    //     userId: session.user.id,
    //     goal: validatedData.goal,
    //     level: validatedData.level,
    //     interests: validatedData.interests,
    //     minutesPerDay: validatedData.minutesPerDay,
    //     wordsPerDay: validatedData.wordsPerDay,
    //     createdAt: new Date(),
    //   },
    // })

    // For now, return mock data
    const plan = {
      id: `plan-${Date.now()}`,
      ...validatedData,
      createdAt: new Date(),
      tasks: [],
    };

    // Simulate database delayyy
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      plan,
    };
  } catch (error) {
    console.error("Error creating study plan:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid data provided",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: "Failed to create study plan",
    };
  }
}
