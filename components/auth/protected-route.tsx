"use client"

import type React from "react"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Lock, LogIn, UserPlus, BookOpen, Mic2, Brain, NotebookPen, LayoutDashboard, GraduationCap } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  pageName?: string
  pageDescription?: string
  pageIcon?: React.ReactNode
}

export function ProtectedRoute({
  children,
  pageName = "this page",
  pageDescription = "Sign in to access all features and track your learning progress.",
  pageIcon,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAppStore()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center shadow-xl border-blue-100 dark:border-slate-800">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            {pageIcon || <Lock className="w-10 h-10 text-blue-500" />}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access {pageName}</h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 mb-8">{pageDescription}</p>

          {/* Features list */}
          <div className="bg-blue-50 dark:bg-slate-800/50 rounded-xl p-4 mb-8">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">With an account, you can:</p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Track your learning progress
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Save vocabulary and notes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Get personalized recommendations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Earn XP and achievements
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold">
              <Link href="/auth/signin" className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-12 border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800 font-semibold bg-transparent"
            >
              <Link href="/auth/signup" className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </Button>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Just browsing?{" "}
            <Link href="/" className="text-blue-500 hover:underline font-medium">
              Return to Home
            </Link>
          </p>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Export common page icons for convenience
export const PageIcons = {
  speaking: <Mic2 className="w-10 h-10 text-blue-500" />,
  vocabulary: <BookOpen className="w-10 h-10 text-blue-500" />,
  grammar: <Brain className="w-10 h-10 text-blue-500" />,
  notebook: <NotebookPen className="w-10 h-10 text-blue-500" />,
  dashboard: <LayoutDashboard className="w-10 h-10 text-blue-500" />,
  studyPlan: <GraduationCap className="w-10 h-10 text-blue-500" />,
}
