"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CurrentTopic {
  id: string;
  title: string;
  subtitle: string;
  progress?: number;
  href?: string;
}

interface CourseDetailProps {
  title: string;
  description: string;
  estimatedCompletion?: string;
  progress?: number;
  currentTopic?: CurrentTopic;
}

export function CourseDetail({
  title,
  description,
  estimatedCompletion,
  progress = 0,
  currentTopic,
}: CourseDetailProps) {
  return (
    <Card className="p-6 rounded-3xl border-[1.4px] border-primary-200 bg-white">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="space-y-1 text-sm">
            {estimatedCompletion && (
              <p>
                <span className="text-muted-foreground">
                  Estimated Completion:
                </span>{" "}
                <span className="font-medium">{estimatedCompletion}</span>
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Current Progress:</span>{" "}
              <span className="font-medium">{progress}%</span>
            </p>
          </div>
        </div>

        {currentTopic && (
          <Card className="p-4 rounded-2xl border-[1.4px] border-primary-200 bg-slate-50">
            <h4 className="font-bold text-base mb-1">{currentTopic.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {currentTopic.subtitle}
            </p>
            {currentTopic.href ? (
              <Link href={currentTopic.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-transparent"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer bg-transparent"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </Card>
        )}
      </div>
    </Card>
  );
}
