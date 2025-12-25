"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0.75s" }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* 404 Text */}
        <h1 className="text-[8rem] sm:text-[10rem] font-bold leading-none bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 bg-clip-text text-transparent drop-shadow-lg">
          404
        </h1>

        {/* Message */}
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist <br />
            or has been moved.
          </p>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/speaking"
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
            >
              Speaking Room
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/vocab"
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
            >
              Vocabulary Hub
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/grammar"
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
            >
              Grammar Hub
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/helps"
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
