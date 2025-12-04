import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSpeakingScenarios } from "@/lib/data/speaking";

// GET /api/speaking/scenarios
// Query params: ?level=A1&category=Daily Life
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get("level") || undefined;
    const category = searchParams.get("category") || undefined;

    const scenarios = await getSpeakingScenarios({ level, category });

    return NextResponse.json(scenarios);
  } catch (error) {
    console.error("Error fetching speaking scenarios:", error);
    return NextResponse.json(
      { error: "Failed to fetch speaking scenarios" },
      { status: 500 }
    );
  }
}

// POST /api/speaking/scenarios
// Body: { title, description, category, subcategory, level, goal, context, objectives, keyExpressions }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const scenario = await prisma.speakingScenario.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        subcategory: body.subcategory,
        level: body.level,
        goal: body.goal,
        context: body.context,
        thumbnail: body.thumbnail,
        objectives: JSON.stringify(body.objectives),
        keyExpressions: JSON.stringify(body.keyExpressions),
        totalSessions: body.totalSessions || 5,
        estimatedMinutes: body.estimatedMinutes || 15,
        isCustom: body.isCustom || false,
      },
    });

    return NextResponse.json(scenario, { status: 201 });
  } catch (error) {
    console.error("Error creating speaking scenario:", error);
    return NextResponse.json(
      { error: "Failed to create speaking scenario" },
      { status: 500 }
    );
  }
}
