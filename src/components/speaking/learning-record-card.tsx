"use client"

import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Target,
  Mic2,
  AudioWaveform as Waveform,
  Zap,
  Languages,
} from "lucide-react";

interface LearningRecordCardProps {
  overallScore: number;
  grammarScore: number;
  relevanceScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  intonationScore: number;
  date: Date;
}

export function LearningRecordCard({
  overallScore,
  grammarScore,
  relevanceScore,
  fluencyScore,
  pronunciationScore,
  intonationScore,
  date,
}: LearningRecordCardProps) {
  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const scores = [
    { icon: Target, value: relevanceScore, label: "Relevance" },
    { icon: Mic2, value: pronunciationScore, label: "Pronunciation" },
    { icon: Waveform, value: intonationScore, label: "Intonation & Stress" },
    { icon: Zap, value: fluencyScore, label: "Fluency" },
    { icon: Languages, value: grammarScore, label: "Grammar" },
  ];

  return (
    <div className="w-full">
      <Card className="p-4 border-[1.4px] border-primary-200 bg-card transition-colors duration-200 hover:border-primary-400">
        <div className="flex items-center gap-4">
          {/* Score Circle - Similar to completed page but smaller */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="text-xl font-bold">{overallScore}</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              Overall Score
            </span>
          </div>

          {/* 5 Scores in the middle - evenly spaced */}
          <div className="flex-1 flex justify-evenly items-center">
            <TooltipProvider>
              {scores.map((score, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-1 cursor-default">
                      <score.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {score.value}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{score.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          {/* Date and Time - on the right */}
          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-foreground">
              {formatDate(date)}
            </p>
            <p className="text-xs text-muted-foreground">{formatTime(date)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
