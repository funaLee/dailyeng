"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export type AuthResult = {
  success: boolean;
  error?: string;
};

/**
 * Register a new user with email and password
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Validate input
    if (!name || !email || !password) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    if (password.length < 8) {
      return { success: false, error: "Mật khẩu phải có ít nhất 8 ký tự" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email đã được sử dụng" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Đã có lỗi xảy ra. Vui lòng thử lại." };
  }
}

/**
 * Sign in with credentials (email/password)
 */
export async function signInWithCredentials(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Email hoặc mật khẩu không chính xác",
          };
        default:
          return { success: false, error: "Đã có lỗi xảy ra khi đăng nhập" };
      }
    }
    throw error;
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

/**
 * Sign out the current user
 */
export async function signOutUser() {
  await signOut({ redirectTo: "/auth/signin" });
}

/**
 * Request password reset - sends email with reset link
 * Works only for users with password (not Google-only users)
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  try {
    if (!email) {
      return { success: false, error: "Email is required" };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    // For security, always return success even if user not found
    // This prevents user enumeration attacks
    if (!user || !user.password) {
      // User doesn't exist or is Google-only user
      // Still return success to not reveal account existence
      return { success: true };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send reset email
    const emailResult = await sendPasswordResetEmail(email, token);
    if (!emailResult.success) {
      console.error("Failed to send reset email:", emailResult.error);
      // Still return success to not reveal if email was sent
    }

    return { success: true };
  } catch (error) {
    console.error("Request password reset error:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

/**
 * Reset password using token from email
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    if (!token || !newPassword) {
      return { success: false, error: "Token and password are required" };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    // Find valid token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: { gt: new Date() }, // Token not expired
      },
    });

    if (!verificationToken) {
      return { success: false, error: "Invalid or expired reset link" };
    }

    // Find user by email (identifier)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}

/**
 * Change password for logged-in user (non-Google users only)
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    // Get current session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    if (!currentPassword || !newPassword) {
      return { success: false, error: "All fields are required" };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters",
      };
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "Password change is not available for Google accounts",
      };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}
