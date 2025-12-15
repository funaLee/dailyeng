"use server";

import { auth } from "@/lib/auth";
import { generateDoraraResponse, DoraraMessage } from "@/lib/gemini";
import { buildSystemInstruction, DoraraUserInfo } from "@/lib/dorara-context";
import { prisma } from "@/lib/prisma";

export interface DoraraChatMessage {
  id: string;
  role: "user" | "tutor";
  content: string;
}

export interface DoraraChatResponse {
  response: string;
  error?: string;
}

/**
 * Send a message to Dorara and get a response
 * @param messages - Current conversation history (for context)
 * @param userMessage - The new message from the user
 * @param currentPage - The current page path for context
 */
export async function sendDoraraMessage(
  messages: DoraraChatMessage[],
  userMessage: string,
  currentPage: string
): Promise<DoraraChatResponse> {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        response: "",
        error: "Please sign in to use Dorara.",
      };
    }

    // Get user info from database for personalized context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        level: true,
      },
    });

    // Build user info for system instruction
    const userInfo: DoraraUserInfo = {
      name: user?.name || session.user.name || null,
      level: user?.level || null,
      currentPage: getPageDescription(currentPage),
    };

    // Build the complete system instruction
    const systemInstruction = buildSystemInstruction(userInfo);

    // Convert messages to the format expected by generateDoraraResponse
    const history: DoraraMessage[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Gemini API
    const result = await generateDoraraResponse(
      systemInstruction,
      history,
      userMessage
    );

    return { response: result.response };
  } catch (error) {
    console.error("[sendDoraraMessage] Error:", error);
    return {
      response: "",
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Convert page path to a human-readable description
 */
function getPageDescription(path: string): string {
  // Remove query params and trailing slashes
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";

  // Map common paths to descriptions
  const pathMap: Record<string, string> = {
    "/": "Home Page",
    "/speaking": "Speaking Practice Page - Practice English speaking",
    "/vocab": "Vocabulary Hub Page - Learn vocabulary",
    "/grammar": "Grammar Hub Page - Learn grammar",
    "/notebook": "Notebook Page - Personal notes",
    "/user/profile": "Profile Page - User information",
    "/user/settings": "Settings Page - Account settings",
    "/user/notifications": "Notifications Page",
    "/placement-test": "Placement Test Page - Level assessment",
    "/helps": "Help Page",
    "/auth/signin": "Sign In Page",
    "/auth/signup": "Sign Up Page",
  };

  // Check exact match first
  if (pathMap[cleanPath]) {
    return pathMap[cleanPath];
  }

  // Check for dynamic routes
  if (cleanPath.startsWith("/speaking/session/")) {
    return "Speaking Session - Practicing with AI";
  }
  if (cleanPath.startsWith("/vocab/")) {
    return "Viewing a vocabulary topic";
  }
  if (cleanPath.startsWith("/grammar/")) {
    return "Viewing a grammar lesson";
  }

  // Fallback
  return `Page: ${cleanPath}`;
}
