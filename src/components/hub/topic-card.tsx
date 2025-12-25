"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { Bookmark } from "lucide-react"

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  level: string;
  wordCount?: number;
  thumbnail?: string;
  progress?: number;
  href?: string;
  onNotYet?: () => void;
  type?: "vocabulary" | "grammar" | "speaking";
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  subcategory?: string;
}

export function TopicCard({
  id,
  title,
  description,
  level,
  wordCount = 25,
  thumbnail = "/learning.png",
  progress = 0,
  href,
  onNotYet,
  type = "vocabulary",
  isBookmarked = false,
  onBookmarkToggle,
  subcategory,
}: TopicCardProps) {
  const isCompleted = progress === 100;
  const isInProgress = progress > 0 && progress < 100;

  const getButtonLabel = () => {
    // Speaking cards always show "Start Learning"
    if (type === "speaking") return "Start Learning";
    if (isCompleted) return "Review";
    if (isInProgress) return "Continue";
    return "Start Learning";
  };

  const getCountLabel = () => {
    switch (type) {
      case "vocabulary":
        return `${wordCount} words`;
      case "grammar":
        return `${wordCount} lessons`;
      case "speaking":
        return `${wordCount} min`;
      default:
        return `${wordCount} words`;
    }
  };

  const getStatusVariant = () => {
    if (progress === 100) return "completed" as const;
    if (progress > 0) return "inProgress" as const;
    return "notYet" as const;
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id);
  };

  const cardContent = (
    <Card className="group relative overflow-hidden rounded-3xl border-2 border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 flex flex-col min-w-[280px] h-[420px]">
      <button
        onClick={handleBookmarkClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 cursor-pointer ${
          isBookmarked
            ? "bg-primary-500 text-white shadow-md"
            : "bg-white/80 text-primary-400 hover:bg-primary-100 hover:text-primary-600"
        }`}
      >
        <Bookmark
          className={`h-5 w-5 transition-all ${
            isBookmarked ? "fill-current" : ""
          }`}
        />
      </button>

      <div className="p-4 pt-0 pb-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="p-5 pt-0 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="text-xs px-2.5 py-1 bg-primary-100 text-primary-600 border border-primary-200 font-medium">
            {level}
          </Badge>
          {/* Show subcategory badge for speaking cards */}
          {type === "speaking" && subcategory && (
            <Badge className="text-xs px-2.5 py-1 bg-primary-100 text-primary-600 border border-primary-200 font-medium">
              {subcategory}
            </Badge>
          )}
          {/* Hide duration/count badge for speaking cards */}
          {type !== "speaking" && (
            <Badge className="text-xs px-2.5 py-1 bg-primary-100 text-primary-600 border border-primary-200 font-medium">
              {getCountLabel()}
            </Badge>
          )}

          {/* Hide status tag for speaking cards */}
          {type !== "speaking" && onNotYet && (
            <Tag
              variant={getStatusVariant()}
              size="md"
              className="ml-auto cursor-pointer transition-all hover:brightness-95"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNotYet();
              }}
            />
          )}
        </div>

        <h4
          className="mb-2 text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1"
          title={title}
        >
          {title}
        </h4>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed min-h-11">
          {description}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <Button
            className={`flex-1 h-10 rounded-full font-semibold text-sm cursor-pointer transition-all ${
              type === "speaking"
                ? "bg-primary-300 hover:bg-primary-400 text-primary-800"
                : isCompleted
                ? "bg-primary-100 hover:bg-primary-200 text-primary-700"
                : isInProgress
                ? "bg-primary-100 hover:bg-primary-200 text-primary-700"
                : "bg-primary-300 hover:bg-primary-400 text-primary-800"
            }`}
            variant={
              type === "speaking"
                ? "default"
                : isCompleted
                ? "outline"
                : isInProgress
                ? "outline"
                : "default"
            }
          >
            {getButtonLabel()}
          </Button>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
