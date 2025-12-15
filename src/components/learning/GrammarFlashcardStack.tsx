"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, ChevronLeft, ChevronRight } from "lucide-react"

// Define helper interfaces locally based on mock data structure
interface GrammarExample {
    en: string
    vi: string
}

interface GrammarNote {
    id: string
    title: string
    explanation: string
    examples: GrammarExample[]
}

interface GrammarFlashcardStackProps {
    items: GrammarNote[]
    currentIndex?: number
    onIndexChange?: (index: number) => void
    onRate?: (itemId: string, rating: string) => void
    onComplete: () => void
}

export function GrammarFlashcardStack({
    items,
    currentIndex: controlledIndex,
    onIndexChange,
    onRate,
    onComplete
}: GrammarFlashcardStackProps) {
    const [internalIndex, setInternalIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    const currentIndex = controlledIndex ?? internalIndex

    const changeIndex = (newIndex: number) => {
        if (onIndexChange) {
            onIndexChange(newIndex)
        } else {
            setInternalIndex(newIndex)
        }
    }

    const currentItem = items[currentIndex]
    const isLastCard = currentIndex === items.length - 1

    const handleNext = useCallback((rating?: string) => {
        if (rating && onRate && currentItem) {
            onRate(currentItem.id, rating)
        }

        setIsFlipped(false)
        if (isLastCard) {
            onComplete()
        } else {
            changeIndex(currentIndex + 1)
        }
    }, [currentIndex, isLastCard, onComplete, onRate, currentItem])

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false)
            changeIndex(currentIndex - 1)
        }
    }, [currentIndex])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Spacebar to flip
            if (e.code === "Space") {
                e.preventDefault() // Prevent scrolling
                setIsFlipped(prev => !prev)
            }

            // Number keys 1-4 for rating
            if (["1", "2", "3", "4"].includes(e.key)) {
                const ratings = ["again", "hard", "good", "easy"];
                const rating = ratings[parseInt(e.key) - 1];
                handleNext(rating);
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleNext, isFlipped])

    const handlePlayAudio = (e: React.MouseEvent, text: string) => {
        e.stopPropagation()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"
        window.speechSynthesis.speak(utterance)
    }

    if (!currentItem) return <div className="text-center p-8">No grammar notes found.</div>

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 w-full max-w-3xl mx-auto perspective-1000 group cursor-pointer relative min-h-0" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="relative w-full h-full transform-style-3d"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* FRONT */}
                    <Card style={{ opacity: 1 }} className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-8 border-2 border-slate-200 shadow-sm bg-white rounded-3xl overflow-y-auto">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{currentItem.title}</h2>
                            <p className="text-slate-400 text-sm mt-8">Tap or Space to see explanation</p>
                        </div>
                    </Card>

                    {/* BACK */}
                    <Card
                        className="absolute inset-0 w-full h-full backface-hidden flex flex-col p-6 border-2 border-primary-100 shadow-sm bg-white rounded-3xl overflow-y-auto custom-scrollbar"
                        style={{ transform: "rotateY(180deg)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-2xl font-bold text-slate-900">{currentItem.title}</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Format & Usage</h4>
                                    <p className="text-slate-700 text-lg">{currentItem.explanation}</p>
                                </div>

                                {currentItem.examples && currentItem.examples.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-slate-900 text-lg">Examples</h4>
                                        {currentItem.examples.map((ex, idx) => (
                                            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group/ex">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8 bg-white/50 hover:bg-white text-slate-500 hover:text-primary-600"
                                                    onClick={(e) => handlePlayAudio(e, ex.en)}
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </Button>
                                                <p className="text-slate-800 font-medium text-base pr-8">{ex.en}</p>
                                                <p className="text-slate-500 text-sm mt-1">{ex.vi}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-3xl mx-auto mt-4 px-2">
                <div className="flex items-stretch gap-2 h-12">
                    <Button variant="outline" onClick={() => handlePrev()} disabled={currentIndex === 0} className="rounded-xl px-3 border-slate-300">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 grid grid-cols-4 gap-2">
                        {[
                            { label: "Again", short: "1", color: "hover:bg-red-100 hover:text-red-600 hover:border-red-300", value: "again" },
                            { label: "Hard", short: "2", color: "hover:bg-orange-100 hover:text-orange-600 hover:border-orange-300", value: "hard" },
                            { label: "Good", short: "3", color: "hover:bg-yellow-100 hover:text-yellow-600 hover:border-yellow-300", value: "good" },
                            { label: "Easy", short: "4", color: "hover:bg-green-100 hover:text-green-600 hover:border-green-300", value: "easy" }
                        ].map((level, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                onClick={() => handleNext(level.value)}
                                className={`h-full flex flex-col items-center justify-center p-1 rounded-xl border-slate-300 transition-all ${level.color}`}
                            >
                                <span className="text-sm font-bold">{i + 1}</span>
                                <span className="text-xs font-medium opacity-80 hidden sm:inline">{level.label}</span>
                            </Button>
                        ))}
                    </div>

                    <Button variant="outline" onClick={() => handleNext()} disabled={isLastCard} className="rounded-xl px-3 border-slate-300">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div >
    )
}
