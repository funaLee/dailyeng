"use client"

import type React from "react"
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  registerUser,
  signInWithCredentials,
  signInWithGoogle,
} from "@/actions/auth";
import {
  AlertCircle,
  BookOpen,
  GraduationCap,
  Languages,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";

export interface SignUpPageClientProps {
  benefits: string[];
}

export default function SignUpPageClient({ benefits }: SignUpPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      // First, register the user
      const registerResult = await registerUser(name, email, password);

      if (!registerResult.success) {
        setError(registerResult.error || "Đăng ký thất bại");
        return;
      }

      // Then, sign them in automatically
      const signInResult = await signInWithCredentials(email, password);

      if (signInResult.success) {
        // Use window.location for full page reload to ensure session is properly loaded
        window.location.href = "/";
      } else {
        // Registration succeeded but sign-in failed - redirect to sign-in page
        window.location.href = "/auth/signin";
      }
    });
  };

  const handleGoogleSignUp = () => {
    startGoogleTransition(async () => {
      await signInWithGoogle();
    });
  };

  const isLoading = isPending || isGooglePending;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-primary-50/30">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg shadow-primary-200">
              <Languages className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-muted-foreground mt-2">
              Start your English learning journey today
            </p>
          </div>

          <Card className="p-8 border-2 border-primary-100 rounded-3xl shadow-xl shadow-primary-100/20">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-error-50 border border-error-200 flex gap-3">
                <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Must be at least 8 characters
                </p>
              </div>

              <Button
                type="submit"
                variant={"default"}
                className="w-full py-6 text-lg font-semibold bg-primary-500 hover:bg-primary-600 rounded-xl transition-all group"
                disabled={isLoading}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">
                  or sign up with
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="py-5 rounded-xl border-2 hover:bg-gray-50 transition-colors bg-transparent"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                {isGooglePending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary-500 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl" />
        </div>

        {/* Floating icons */}
        <div className="absolute top-32 right-16 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute top-48 left-24 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Languages className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute bottom-40 right-24 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute bottom-32 left-32 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Learn English
            <br />
            <span className="text-accent-300">The Smart Way</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Join our community and unlock your full potential with personalized
            learning.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-400 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="text-white/90">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
