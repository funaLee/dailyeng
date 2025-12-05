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
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center shadow-xl border-primary-200 bg-white">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
            {pageIcon || <Lock className="w-10 h-10 text-primary-500" />}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">Access {pageName}</h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8">{pageDescription}</p>

          {/* Features list */}
          <div className="bg-primary-50 rounded-xl p-4 mb-8">
            <p className="text-sm font-medium text-foreground mb-3">With an account, you can:</p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Track your learning progress
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Save vocabulary and notes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Get personalized recommendations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Earn XP and achievements
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 h-12 bg-primary-500 hover:bg-primary-600 text-white font-semibold">
              <Link href="/auth/signin" className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-12 border-primary-200 hover:bg-primary-50 font-semibold bg-transparent"
            >
              <Link href="/auth/signup" className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </Button>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-sm text-muted-foreground">
            Just browsing?{" "}
            <Link href="/" className="text-primary-500 hover:underline font-medium">
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
  speaking: <Mic2 className="w-10 h-10 text-primary-500" />,
  vocabulary: <BookOpen className="w-10 h-10 text-primary-500" />,
  grammar: <Brain className="w-10 h-10 text-primary-500" />,
  notebook: <NotebookPen className="w-10 h-10 text-primary-500" />,
  dashboard: <LayoutDashboard className="w-10 h-10 text-primary-500" />,
  studyPlan: <GraduationCap className="w-10 h-10 text-primary-500" />,
}
