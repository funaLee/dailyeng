"use client";

import type React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requestPasswordReset } from "@/actions/auth";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Languages,
  Loader2,
  Mail,
} from "lucide-react";

export default function ForgotPasswordPageClient() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Failed to send reset email");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-primary-50/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg shadow-primary-200">
            <Languages className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isSuccess ? "Check Your Email" : "Forgot Password"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSuccess
              ? "We've sent you a password reset link"
              : "Enter your email to reset your password"}
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
                If an account exists with <strong>{email}</strong>, you will
                receive a password reset link shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-xl border-2 hover:bg-gray-50 transition-colors bg-transparent"
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                >
                  Try different email
                </Button>
                <Link href="/auth/signin" className="block">
                  <Button
                    variant="default"
                    className="w-full py-5 text-base font-semibold bg-primary-500 hover:bg-primary-600 rounded-xl"
                  >
                    Back to Sign In
                  </Button>
                </Link>
              </div>
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
                <div>
                  <label className="text-sm font-semibold text-foreground">
                    Email Address
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                      required
                      disabled={isPending}
                    />
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
