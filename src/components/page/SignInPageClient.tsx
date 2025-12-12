"use client"

import type React from "react"
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signInWithCredentials, signInWithGoogle } from "@/actions/auth";
import {
  AlertCircle,
  BookOpen,
  GraduationCap,
  Languages,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

export interface SignInStat {
  value: string;
  label: string;
}

export interface SignInPageClientProps {
  stats: SignInStat[];
}

export default function SignInPageClient({ stats }: SignInPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInWithCredentials(email, password);

      if (result.success) {
        // Use window.location for full page reload to ensure session is properly loaded
        window.location.href = "/";
      } else {
        setError(result.error || "Đăng nhập thất bại");
      }
    });
  };

  const handleGoogleSignIn = () => {
    startGoogleTransition(async () => {
      await signInWithGoogle();
    });
  };

  const isLoading = isPending || isGooglePending;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl" />
        </div>

        {/* Floating icons */}
        <div className="absolute top-32 left-16 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute top-48 right-24 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Languages className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute bottom-40 left-24 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute bottom-32 right-32 p-4 bg-white/20 backdrop-blur-sm rounded-2xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Master English
            <br />
            <span className="text-accent-200">Your Way</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Join thousands of learners improving their English skills with our
            AI-powered platform.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-primary-50/30">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg shadow-primary-200">
              <Languages className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue your learning journey
            </p>
          </div>

          <Card className="p-8 border-2 border-primary-100 rounded-3xl shadow-xl shadow-primary-100/20 bg-white">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-error-50 border border-error-200 flex gap-3">
                <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-5">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-background focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
                  required
                  disabled={isLoading}
                />
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
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
                  or continue with
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="py-5 rounded-xl border-2 hover:bg-gray-50 transition-colors bg-transparent"
                onClick={handleGoogleSignIn}
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
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary-500 hover:text-primary-600 font-semibold"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
