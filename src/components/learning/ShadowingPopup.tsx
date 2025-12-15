"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Play, Square, Loader2, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShadowingPopupProps {
    text: string
    translation?: string
    isOpen: boolean
    onClose: () => void
    onComplete: (score: number) => void
}

export function ShadowingPopup({ text, translation, isOpen, onClose, onComplete }: ShadowingPopupProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<{ score: number; feedback: string } | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    // Simulate Text-to-Speech
    const handlePlayAudio = () => {
        // In a real app, this would use the Web Speech API or an audio file
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"
        window.speechSynthesis.speak(utterance)
    }

    const handleToggleRecording = () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false)
            setIsAnalyzing(true)

            // Simulate analysis delay
            setTimeout(() => {
                setIsAnalyzing(false)
                // Mock scoring logic (random high score for positive reinforcement)
                const mockScore = Math.floor(Math.random() * 20) + 80 // 80-100
                setResult({
                    score: mockScore,
                    feedback: mockScore > 90 ? "Excellent pronunciation!" : "Good effort, keep practicing!",
                })
            }, 2000)
        } else {
            // Start recording
            setResult(null)
            setIsRecording(true)
        }
    }

    const handleFinish = () => {
        if (result) {
            onComplete(result.score)
        }
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-75">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Shadowing Practice</h3>
                        <p className="text-sm text-slate-500">Listen and repeat the sentence</p>
                    </div>

                    <div className="p-6 bg-primary-50 rounded-2xl border-2 border-primary-100">
                        <p className="text-lg font-medium text-slate-900 mb-2">{text}</p>
                        {translation && <p className="text-sm text-slate-500 italic">{translation}</p>}
                    </div>

                    {result ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-5">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-500 text-green-700 text-3xl font-bold">
                                    {result.score}
                                </div>
                                <p className="font-medium text-green-700">{result.feedback}</p>
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" onClick={() => setResult(null)}>Try Again</Button>
                                <Button onClick={handleFinish}>Continue</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full w-16 h-16 p-0 border-2"
                                onClick={handlePlayAudio}
                                disabled={isRecording || isAnalyzing}
                            >
                                <Play className="h-6 w-6 fill-current" />
                            </Button>

                            <Button
                                variant={isRecording ? "destructive" : "default"}
                                size="lg"
                                className={cn(
                                    "rounded-full w-16 h-16 p-0 shadow-lg transition-all duration-300",
                                    isRecording && "scale-110 ring-4 ring-red-200"
                                )}
                                onClick={handleToggleRecording}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : isRecording ? (
                                    <Square className="h-6 w-6 fill-current" />
                                ) : (
                                    <Mic className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    )}

                    {isRecording && (
                        <p className="text-red-500 font-medium animate-pulse">Recording...</p>
                    )}
                    {isAnalyzing && (
                        <p className="text-primary-500 font-medium">Analyzing your pronunciation...</p>
                    )}
                </div>
            </div>
        </div>
    )
}
