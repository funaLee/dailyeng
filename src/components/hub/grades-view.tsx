"use client"

import { Card } from "@/components/ui/card"
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Languages,
  Headphones,
  BookOpenCheck,
  PenTool,
  HelpCircle,
} from "lucide-react"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface LessonGrade {
  id: string
  title: string
  type: string
  score: number | null
  status: "completed" | "in_progress" | "not_started"
}

interface SkillScore {
  skill: string
  score: number
  fullMark: number
}

interface GradesViewProps {
  lessonGrades: LessonGrade[]
  skillScores: SkillScore[]
  overallProgress: number
  averageScore: number
}

export function GradesView({ lessonGrades, skillScores, overallProgress, averageScore }: GradesViewProps) {
  const getSkillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case "vocabulary":
        return <BookOpen className="h-4 w-4" />
      case "translate":
        return <Languages className="h-4 w-4" />
      case "listening":
        return <Headphones className="h-4 w-4" />
      case "reading":
        return <BookOpenCheck className="h-4 w-4" />
      case "writing":
        return <PenTool className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground"
    if (score >= 80) return "text-success-600"
    if (score >= 60) return "text-warning-600"
    return "text-error-600"
  }

  const getScoreBg = (score: number | null) => {
    if (score === null) return "bg-muted"
    return "bg-secondary-100"
  }

  return (
    <Card className="rounded-3xl border-[1.4px] border-secondary-200 bg-card overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-secondary-500 to-secondary-600">
        <div className="flex items-center gap-3 text-white">
          <Award className="h-6 w-6" />
          <h2 className="text-xl font-bold">Your Grades</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 border-[1.4px] border-secondary-200">
            <div className="flex items-center gap-2 text-secondary-600 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <p className="text-3xl font-bold text-secondary-700">{overallProgress}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 border-[1.4px] border-secondary-200">
            <div className="flex items-center gap-2 text-secondary-600 mb-2">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Average Score</span>
            </div>
            <p className="text-3xl font-bold text-secondary-700">{averageScore}%</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary-500" />
            Skill Performance
          </h3>
          <ChartContainer
            config={{
              score: {
                label: "Score",
                color: "hsl(var(--secondary-500))",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillScores}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--secondary-500))"
                  fill="hsl(var(--secondary-400))"
                  fillOpacity={0.5}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary-500" />
            Lesson Grades
          </h3>
          <div className="space-y-2">
            {lessonGrades.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getScoreBg(lesson.score)}`}>{getSkillIcon(lesson.type)}</div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{lesson.type}</p>
                  </div>
                </div>
                <div className={`font-bold text-lg ${getScoreColor(lesson.score)}`}>
                  {lesson.score !== null ? `${lesson.score}%` : "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
