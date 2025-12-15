"use client";

import type React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resetPassword } from "@/actions/auth";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Languages,
  Loader2,
  Lock,
} from "lucide-react";

interface ResetPasswordPageClientProps {
  token: string;
}

export default function ResetPasswordPageClient({
  token,
}: ResetPasswordPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(token, password);

      if (result.success) {
        setIsSuccess(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/auth/signin?status=password_reset");
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password");
      }
    });
  };

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-primary-50/30">
        <Card className="max-w-md w-full p-8 border-2 border-primary-100 rounded-3xl shadow-xl shadow-primary-100/20 bg-white text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-error-100 mb-4">
            <AlertCircle className="h-8 w-8 text-error-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-muted-foreground mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link href="/auth/forgot-password">
            <Button
              variant="default"
              className="w-full py-5 text-base font-semibold bg-primary-500 hover:bg-primary-600 rounded-xl"
            >
              Request New Link
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-primary-50/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg shadow-primary-200">
            <Languages className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isSuccess ? "Password Reset!" : "Reset Password"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSuccess
              ? "Your password has been updated successfully"
              : "Enter your new password below"}
          </p>
        </div>

        <Card className="p-8 border-2 border-primary-100 rounded-3xl shadow-xl shadow-primary-100/20 bg-white">
          {isSuccess ? (
            // Success state
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                Redirecting you to sign in...
              </p>
              <Link href="/auth/signin">
                <Button
                  variant="default"
                  className="w-full py-5 text-base font-semibold bg-primary-500 hover:bg-primary-600 rounded-xl"
                >
                  Sign In Now
                </Button>
              </Link>
            </div>
          ) : (
            // Form state
            <>
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-error-50 border border-error-200 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="text-sm font-semibold text-foreground">
                    New Password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                      required
                      disabled={isPending}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-semibold text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                      required
                      disabled={isPending}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full py-6 text-lg font-semibold bg-primary-500 hover:bg-primary-600 rounded-xl transition-all"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
