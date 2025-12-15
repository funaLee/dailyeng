"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, CheckCircle2, RefreshCw, PenTool, Mic, Sparkles, Trophy, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PracticeItem {
    id: string
    context: string // Vietnamese instruction or context
    target: string // Expected English answer
    type: "writing" | "speaking"
    difficulty?: "easy" | "medium" | "hard"
}

// Default fixed questions for Grammar
const FIXED_WRITING_QUESTIONS: PracticeItem[] = [
    { id: "gw1", context: "Dịch: 'Tôi đã sống ở đây được 5 năm' (Present Perfect)", target: "I have lived here for 5 years", type: "writing" },
    { id: "gw2", context: "Dịch: 'Nếu trời mưa, tôi sẽ ở nhà' (First Conditional)", target: "If it rains, I will stay at home", type: "writing" },
    { id: "gw3", context: "Dịch: 'Cuốn sách này được viết bởi cô ấy' (Passive Voice)", target: "This book was written by her", type: "writing" }
]

const FIXED_SPEAKING_QUESTIONS: PracticeItem[] = [
    { id: "gs1", context: "Nói: 'Bạn có thích pizza không?' (Present Simple)", target: "Do you like pizza?", type: "speaking" },
    { id: "gs2", context: "Nói: 'Họ đang chơi bóng đá' (Present Continuous)", target: "They are playing football", type: "speaking" },
    { id: "gs3", context: "Nói: 'Tôi sẽ đi học vào ngày mai' (Future Simple)", target: "I will go to school tomorrow", type: "speaking" }
]

// Mock generator for Grammar Practice
const generateMoreQuestions = (difficulty: "easy" | "medium" | "hard", type: "writing" | "speaking"): PracticeItem => {
    const templates = [
        { context: `[${difficulty}] Dịch: 'Tôi không biết bơi' (Can/Cannot)`, target: "I cannot swim", type },
        { context: `[${difficulty}] Dịch: 'Cô ấy đang ngủ' (Present Continuous)`, target: "She is sleeping", type }
    ]
    return {
        ...templates[Math.floor(Math.random() * templates.length)],
        type,
        id: Math.random().toString(),
        difficulty
    }
}

export function GrammarPracticeMode() {
    const [mode, setMode] = useState<"writing" | "speaking">("writing")

    // Separate state for each mode
    const [writingQuestions, setWritingQuestions] = useState<PracticeItem[]>(FIXED_WRITING_QUESTIONS)
    const [speakingQuestions, setSpeakingQuestions] = useState<PracticeItem[]>(FIXED_SPEAKING_QUESTIONS)

    const [currentIndexes, setCurrentIndexes] = useState({ writing: 0, speaking: 0 })

    const [userAnswer, setUserAnswer] = useState("")
    const [feedback, setFeedback] = useState<{ score: number; comment: string } | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [history, setHistory] = useState<Array<{ question: PracticeItem, score: number }>>([])
    const [isSummary, setIsSummary] = useState(false)

    // Derived state based on mode
    const currentQuestions = mode === "writing" ? writingQuestions : speakingQuestions
    const currentIndex = mode === "writing" ? currentIndexes.writing : currentIndexes.speaking
    const currentQuestion = currentQuestions[currentIndex]

    const handleModeSwitch = (newMode: "writing" | "speaking") => {
        setMode(newMode)
        setFeedback(null)
        setUserAnswer("")
    }

    const handleSubmit = () => {
        if (!userAnswer.trim()) return

        setIsProcessing(true)
        setTimeout(() => {
            // Mock Grading Logic
            const score = Math.random() > 0.5 ? 90 : 65
            setFeedback({
                score,
                comment: score > 80 ? "Perfect grammar usage!" : `Check your grammar. Expected: "${currentQuestion.target}"`
            })
            setHistory(prev => [...prev, { question: currentQuestion, score }])
            setIsProcessing(false)
        }, 1500)
    }

    const handleNext = () => {
        setFeedback(null)
        setUserAnswer("")

        if (currentIndex < currentQuestions.length - 1) {
            setCurrentIndexes(prev => ({
                ...prev,
                [mode]: prev[mode] + 1
            }))
        } else {
            setIsSummary(true)
        }
    }

    const handleGenerateMore = (difficulty: "easy" | "medium" | "hard") => {
        const newQ = generateMoreQuestions(difficulty, mode)
        if (mode === "writing") {
            setWritingQuestions(prev => [...prev, newQ])
            if (isSummary) {
                setIsSummary(false)
                setCurrentIndexes(prev => ({ ...prev, writing: prev.writing + 1 }))
            }
        } else {
            setSpeakingQuestions(prev => [...prev, newQ])
            if (isSummary) {
                setIsSummary(false)
                setCurrentIndexes(prev => ({ ...prev, speaking: prev.speaking + 1 }))
            }
        }
    }

    if (isSummary) {
        const avgScore = Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length || 0)

        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
                <Card className="p-8 border-2 border-primary-100 shadow-xl bg-white rounded-3xl text-center space-y-6">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-12 h-12 text-yellow-600" />
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Practice Complete!</h2>
                        <p className="text-slate-500 mt-2">You have completed {history.length} questions.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="block text-3xl font-bold text-primary-600">{avgScore}</span>
                            <span className="text-sm text-slate-500 font-medium">Avg. Score</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="block text-3xl font-bold text-green-600">
                                {history.filter(h => h.score >= 80).length}
                            </span>
                            <span className="text-sm text-slate-500 font-medium">High Scores</span>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-4">
                        <Button variant="outline" onClick={() => setIsSummary(false)} className="gap-2">
                            Review Answers
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="gap-2 bg-primary-600 hover:bg-primary-700">
                                    <Sparkles className="w-4 h-4" /> Practice More ({mode === "writing" ? "Writing" : "Speaking"})
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleGenerateMore("easy")}>Easy</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateMore("medium")}>Medium</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateMore("hard")}>Hard</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header / Progress */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <Button
                        variant={mode === "writing" ? "default" : "outline"}
                        onClick={() => handleModeSwitch("writing")}
                        className="gap-2 rounded-full"
                        size="sm"
                    >
                        <PenTool className="h-3 w-3" /> Writing
                    </Button>
                    <Button
                        variant={mode === "speaking" ? "default" : "outline"}
                        onClick={() => handleModeSwitch("speaking")}
                        className="gap-2 rounded-full"
                        size="sm"
                    >
                        <Mic className="h-3 w-3" /> Speaking
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500">Question {currentIndex + 1} / {currentQuestions.length}</span>
                </div>
            </div>

            <Card className="p-8 border-2 border-primary-100 shadow-xl bg-white rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                    <div
                        className="h-full bg-primary-500 transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
                    />
                </div>

                <div className="space-y-6">

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
                                {currentQuestion.type === "writing" ? "Translate & Apply Grammar" : "Speak Complete Sentence"}
                            </span>
                            {currentQuestion.difficulty && (
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold text-white",
                                    currentQuestion.difficulty === "easy" ? "bg-green-500" :
                                        currentQuestion.difficulty === "medium" ? "bg-yellow-500" : "bg-red-500"
                                )}>
                                    {currentQuestion.difficulty}
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{currentQuestion.context}</h3>
                    </div>

                    <div className="space-y-4">
                        {currentQuestion.type === "writing" ? (
                            <Textarea
                                placeholder="Type your answer here..."
                                className="text-lg p-4 min-h-[120px] rounded-xl border-slate-200 focus:border-primary-500 transition-colors"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={feedback !== null}
                            />
                        ) : (
                            <div className="h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center flex-col gap-4">
                                {userAnswer ? (
                                    <p className="text-lg font-medium text-slate-800">"{userAnswer}"</p>
                                ) : (
                                    <p className="text-slate-400">Tap microphone to record</p>
                                )}
                                <Button
                                    size="icon"
                                    variant={userAnswer ? "outline" : "default"}
                                    className={cn("h-16 w-16 rounded-full", userAnswer ? "border-slate-200" : "shadow-lg shadow-primary-200")}
                                    onClick={() => setUserAnswer("I have lived here for 5 years")} // Mock recording result
                                >
                                    <Mic className="h-6 w-6" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {feedback && (
                        <div className={cn(
                            "p-4 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2",
                            feedback.score >= 80 ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"
                        )}>
                            <div className={cn(
                                "p-2 rounded-full",
                                feedback.score >= 80 ? "bg-green-200" : "bg-orange-200"
                            )}>
                                {feedback.score >= 80 ? <CheckCircle2 className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-bold">Score: {feedback.score}/100</p>
                                <p className="text-sm">{feedback.comment}</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex items-center justify-between gap-4">
                        {/* AI Generation for more questions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 text-slate-500 hover:text-primary-600">
                                    <Sparkles className="w-4 h-4" /> Add More
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleGenerateMore("easy")}>Easy</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateMore("medium")}>Medium</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateMore("hard")}>Hard</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex gap-2">
                            {!feedback ? (
                                <Button onClick={handleSubmit} disabled={!userAnswer || isProcessing} size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-200">
                                    {isProcessing ? "Checking..." : "Check Answer"}
                                </Button>
                            ) : (
                                <Button onClick={handleNext} size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-slate-200">
                                    Next Question <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                </div>
            </Card>

            <div className="flex justify-end">
                <Button
                    variant="outline"
                    className="text-primary-500 border-primary-200 hover:bg-primary-50 hover:text-primary-600 gap-2"
                    onClick={() => setIsSummary(true)}
                >
                    <LogOut className="w-4 h-4" /> Finish Practice
                </Button>
            </div>
        </div>
    )
}
