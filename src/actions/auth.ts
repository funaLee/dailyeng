"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

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
