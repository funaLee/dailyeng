"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, RotateCw, ChevronLeft, ChevronRight, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
// import type { VocabItem } from "@/types" // Ensure this type exists or is compatible
import { ShadowingPopup } from "./ShadowingPopup"

// Define VocabItem locally or ensure it matches the project's type
// Based on usage in component:
interface VocabItem {
    id: string
    word: string
    type?: string
    partOfSpeech?: string
    phon_br?: string
    phon_n_am?: string
    pronunciation?: string
    meaning?: string
    vietnameseMeaning?: string
    exampleSentence?: string
    exampleTranslation?: string
    definitions?: Array<{
        definition_en: string
        definition_vi: string
        examples?: Array<{ en: string, vi: string }>
    }>
    synonyms?: string[]
    antonyms?: string[]
    collocations?: string[]
}

interface VocabFlashcardStackProps {
    words: VocabItem[]
    currentIndex?: number
    onIndexChange?: (index: number) => void
    onRate?: (wordId: string, rating: string) => void
    onComplete: () => void
}

export function VocabFlashcardStack({
    words,
    currentIndex: controlledIndex,
    onIndexChange,
    onRate,
    onComplete
}: VocabFlashcardStackProps) {
    const [internalIndex, setInternalIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [showShadowing, setShowShadowing] = useState(false)
    const [shadowingContent, setShadowingContent] = useState<{ text: string, translation: string } | null>(null)
    const [masteredWords, setMasteredWords] = useState<string[]>([])

    const currentIndex = controlledIndex ?? internalIndex

    // Helper to change index (handles both controlled and uncontrolled)
    const changeIndex = (newIndex: number) => {
        if (onIndexChange) {
            onIndexChange(newIndex)
        } else {
            setInternalIndex(newIndex)
        }
    }

    const currentWord = words[currentIndex]
    const isLastCard = currentIndex === words.length - 1

    const handleNext = useCallback((rating?: string) => {
        if (rating && onRate && currentWord) {
            onRate(currentWord.id, rating)
        }

        setIsFlipped(false)
        if (isLastCard) {
            onComplete()
        } else {
            changeIndex(currentIndex + 1)
        }
    }, [currentIndex, isLastCard, onComplete, onRate, currentWord]) // Dependencies for handleNext

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsFlipped(false)
            changeIndex(currentIndex - 1)
        }
    }, [currentIndex])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showShadowing) return; // Disable shortcuts if modal is open

            // Spacebar to flip
            if (e.code === "Space") {
                e.preventDefault() // Prevent scrolling
                setIsFlipped(prev => !prev)
            }

            // Number keys 1-4 for rating
            if (!isFlipped && ["1", "2", "3", "4"].includes(e.key)) {
                // Optional: Only allow rating if flipped? 
                // Usually in Anki you rate after seeing the back. 
                // But user requirements didn't specify, so let's check if they want to rate immediately.
                // Assuming standard flow: Flip -> Rate. 
                // If not flipped, maybe ignore? Or maybe flip then rate?
                // Let's assume we can rate anytime for convenience, or strictly after flip.
                // Detailed request: "Can choose 1 2 3 4 on keyboard to choose status".
                // I'll allow it anytime for now, or maybe it auto-flips then next?
                // Standard behavior: Rate = Next card.

                const ratings = ["again", "hard", "good", "easy"];
                const rating = ratings[parseInt(e.key) - 1];
                handleNext(rating);
            } else if (isFlipped && ["1", "2", "3", "4"].includes(e.key)) {
                const ratings = ["again", "hard", "good", "easy"];
                const rating = ratings[parseInt(e.key) - 1];
                handleNext(rating);
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleNext, isFlipped, showShadowing])


    const handlePlayAudio = (e: React.MouseEvent, accent: 'uk' | 'us' = 'us') => {
        e.stopPropagation()
        const utterance = new SpeechSynthesisUtterance(currentWord.word)
        utterance.lang = accent === 'uk' ? "en-GB" : "en-US"
        window.speechSynthesis.speak(utterance)
    }

    const handleShadowingComplete = (score: number) => {
        // Logic to save score can go here
        if (score >= 80) {
            setMasteredWords(prev => [...prev, currentWord.id])
        }
    }

    if (!currentWord) return <div className="text-center p-8">No words found for this level.</div>

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
                            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900">{currentWord.word}</h2>
                            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-sm font-bold uppercase tracking-wider rounded-full">
                                {currentWord.type || currentWord.partOfSpeech}
                            </span>
                            <div className="flex items-center justify-center gap-4 text-slate-500">
                                {currentWord.phon_br && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-slate-400">UK</span>
                                        <span className="font-mono text-lg text-slate-700">/{currentWord.phon_br}/</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100 text-primary-600" onClick={(e) => handlePlayAudio(e, 'uk')}>
                                            <Volume2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                {currentWord.phon_n_am && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-slate-400">US</span>
                                        <span className="font-mono text-lg text-slate-700">/{currentWord.phon_n_am}/</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100 text-red-600" onClick={(e) => handlePlayAudio(e, 'us')}>
                                            <Volume2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                {!currentWord.phon_br && !currentWord.phon_n_am && currentWord.pronunciation && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-lg">{currentWord.pronunciation}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100" onClick={(e) => handlePlayAudio(e, 'us')}>
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm mt-8">Tap or Space to flip</p>
                        </div>
                    </Card>

                    {/* BACK */}
                    <Card
                        className="absolute inset-0 w-full h-full backface-hidden flex flex-col p-6 border-2 border-primary-100 shadow-sm bg-white rounded-3xl overflow-y-auto custom-scrollbar"
                        style={{ transform: "rotateY(180deg)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{currentWord.word}</h3>
                                    <p className="text-primary-600 font-medium text-sm">{currentWord.type || currentWord.partOfSpeech}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 text-blue-600" onClick={(e) => handlePlayAudio(e, 'uk')}>
                                        <Volume2 className="h-4 w-4" /> <span className="sr-only">UK</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-red-600" onClick={(e) => handlePlayAudio(e, 'us')}>
                                        <Volume2 className="h-4 w-4" /> <span className="sr-only">US</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {currentWord.definitions?.map((def, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-800 font-medium text-lg">{def.definition_en}</p>
                                                <p className="text-slate-500 italic text-sm">{def.definition_vi}</p>
                                            </div>
                                        </div>

                                        {def.examples && def.examples.length > 0 && (
                                            <div className="pl-8 space-y-2">
                                                {def.examples.map((ex, exIdx) => (
                                                    <div key={exIdx} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100 group/ex relative">
                                                        <p className="text-slate-700 mb-1">{ex.en}</p>
                                                        <p className="text-slate-500 text-xs">{ex.vi}</p>
                                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/ex:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 bg-white/50 hover:bg-white text-slate-500 hover:text-primary-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const utterance = new SpeechSynthesisUtterance(ex.en);
                                                                    utterance.lang = "en-US";
                                                                    window.speechSynthesis.speak(utterance);
                                                                }}
                                                            >
                                                                <Volume2 className="h-2.5 w-2.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 bg-white/50 hover:bg-white text-slate-500 hover:text-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowShadowing(true);
                                                                    setShadowingContent({ text: ex.en, translation: ex.vi });
                                                                }}
                                                            >
                                                                <Mic className="h-2.5 w-2.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Fallback for old data format */}
                                {!currentWord.definitions && (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Meaning</h4>
                                            <p className="text-slate-700 text-lg">{currentWord.meaning}</p>
                                            <p className="text-slate-500 italic mt-1 text-sm">{currentWord.vietnameseMeaning}</p>
                                        </div>
                                        {currentWord.exampleSentence && (
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group/fallback">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Example</span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 gap-1 text-xs text-slate-500 hover:text-primary-600 -mt-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const utterance = new SpeechSynthesisUtterance(currentWord.exampleSentence!);
                                                                utterance.lang = "en-US";
                                                                window.speechSynthesis.speak(utterance);
                                                            }}
                                                        >
                                                            <Volume2 className="h-3 w-3" /> Listen
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 gap-1 text-xs text-slate-500 hover:text-red-600 -mt-1 -mr-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowShadowing(true);
                                                                setShadowingContent({
                                                                    text: currentWord.exampleSentence || "",
                                                                    translation: currentWord.exampleTranslation || ""
                                                                });
                                                            }}
                                                        >
                                                            <Mic className="h-3 w-3" /> Shadow
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-slate-800 font-medium text-base">{currentWord.exampleSentence}</p>
                                                <p className="text-slate-500 text-sm mt-0.5">{currentWord.exampleTranslation}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Synonyms, Antonyms, Collocations */}
                            {(currentWord.synonyms?.length || currentWord.antonyms?.length || currentWord.collocations?.length) ? (
                                <div className="space-y-4 pt-4 border-t border-slate-100">

                                    {((currentWord.synonyms && currentWord.synonyms.length > 0) || (currentWord.antonyms && currentWord.antonyms.length > 0)) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Synonyms</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentWord.synonyms.map((s, i) => (
                                                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Antonyms</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentWord.antonyms.map((a, i) => (
                                                            <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs">{a}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {currentWord.collocations && currentWord.collocations.length > 0 && (
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Collocations</span>
                                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {currentWord.collocations.map((c, i) => (
                                                        <li key={i} className="text-slate-700 text-xs flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-primary-400" />
                                                            {c}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-3xl mx-auto mt-4 px-2">
                <div className="flex items-stretch gap-2 h-12">
                    <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="rounded-xl px-3 border-slate-300">
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

            <ShadowingPopup
                isOpen={showShadowing}
                onClose={() => setShowShadowing(false)}
                onComplete={handleShadowingComplete}
                text={shadowingContent?.text || currentWord.exampleSentence || ""}
                translation={shadowingContent?.translation || currentWord.exampleTranslation || ""}
            />
        </div >
    )
}
