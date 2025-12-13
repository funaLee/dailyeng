"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Level } from "@prisma/client";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  address: string | null;
  level: Level | null;
  image: string | null;
}

export interface UserProfileUpdateData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: Date | null;
  gender?: string;
  address?: string;
  level?: Level;
}

// Get current user's profile
export async function getUserProfile(): Promise<{
  user: UserProfile | null;
  isGoogleUser: boolean;
  error?: string;
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { user: null, isGoogleUser: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        level: true,
        image: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return { user: null, isGoogleUser: false, error: "User not found" };
    }

    // Check if user signed up via Google
    const isGoogleUser = user.accounts.some(
      (account) => account.provider === "google"
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        level: user.level,
        image: user.image,
      },
      isGoogleUser,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { user: null, isGoogleUser: false, error: "Failed to fetch profile" };
  }
}

// Update user profile
export async function updateUserProfile(
  data: UserProfileUpdateData
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get current user to check if Google user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: {
          select: { provider: true },
        },
      },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const isGoogleUser = currentUser.accounts.some(
      (account) => account.provider === "google"
    );

    // Prepare update data
    const updateData: UserProfileUpdateData = { ...data };

    // If Google user, don't allow email change
    if (isGoogleUser && data.email && data.email !== currentUser.email) {
      return {
        success: false,
        error: "Cannot change email for Google-linked accounts",
      };
    }

    // Validate email format if provided and not Google user
    if (!isGoogleUser && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, error: "Invalid email format" };
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return { success: false, error: "Email is already in use" };
      }
    }

    // Validate level if provided
    if (data.level && !Object.values(Level).includes(data.level)) {
      return { success: false, error: "Invalid level value" };
    }

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
