"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuizSection } from "@/components/vocab/quiz-section"
import { TranslateSpeakLab } from "@/components/vocab/translate-speak-lab"
import { ListeningSection } from "@/components/vocab/listening-section"
import { ReadingSection } from "@/components/vocab/reading-section"
import { mockTopics, mockVocab, mockQuizzes, mockListeningTasks, mockReadingPassages } from "@/lib/mock-data"
import type { VocabItem } from "@/types"
import {
  ArrowLeft,
  BookOpen,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  PlayCircle,
} from "lucide-react"

type TabType = "learn" | "translate" | "listening" | "reading" | "writing" | "quiz"

const STEPS: { id: TabType; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "translate", label: "Translate" },
  { id: "listening", label: "Listening" },
  { id: "reading", label: "Reading" },
  { id: "writing", label: "Writing" },
  { id: "quiz", label: "Quiz" },
]

export default function TopicDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const topicId = params.topicId as string
  const selectedWordId = searchParams.get("w")

  const [activeTab, setActiveTab] = useState<TabType>("learn")
  const [completedSteps, setCompletedSteps] = useState<TabType[]>([])
  const [topic, setTopic] = useState<any>(null)
  const [vocab, setVocab] = useState<VocabItem[]>([])
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null)
  const [savedFlashcards, setSavedFlashcards] = useState<VocabItem[]>([])
  const [shadowingOpen, setShadowingOpen] = useState(false)
  const [currentSentence, setCurrentSentence] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [masterySelected, setMasterySelected] = useState(false)
  const wordListRef = useRef<HTMLDivElement>(null)

  const shadowingSentences = selectedWord
    ? [selectedWord.exampleSentence, "Animals in zoos often display disturbed behaviour."]
    : []

  useEffect(() => {
    const foundTopic = mockTopics.find((t) => t.id === topicId)
    setTopic(foundTopic)
    const topicVocab = mockVocab[topicId] || []
    setVocab(topicVocab)

    if (selectedWordId) {
      const word = topicVocab.find((w) => w.id === selectedWordId)
      if (word) {
        setSelectedWord(word)
        const index = topicVocab.findIndex((w) => w.id === word.id)
        if (index !== -1) {
          setCurrentWordIndex(index)
        }
      } else if (topicVocab.length > 0) {
        setSelectedWord(topicVocab[0])
        setCurrentWordIndex(0)
      }
    } else if (topicVocab.length > 0) {
      setSelectedWord(topicVocab[0])
      setCurrentWordIndex(0)
    }
  }, [topicId, selectedWordId])

  const handleSelectWord = (word: VocabItem) => {
    setSelectedWord(word)
    const index = vocab.findIndex((w) => w.id === word.id)
    if (index !== -1) {
      setCurrentWordIndex(index)
    }
    setMasterySelected(false)
    router.push(`/vocab/${topicId}?w=${word.id}`, { scroll: false })
  }

  const handleMasterySelect = (level: string) => {
    setMasterySelected(true)
    console.log(`[v0] Selected mastery level: ${level} for word: ${selectedWord?.word}`)
  }

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      const prevWord = vocab[currentWordIndex - 1]
      handleSelectWord(prevWord)
    }
  }

  const handleNext = () => {
    if (currentWordIndex < vocab.length - 1) {
      const nextWord = vocab[currentWordIndex + 1]
      handleSelectWord(nextWord)
    }
  }

  const isStepUnlocked = (stepId: TabType) => {
    const stepIndex = STEPS.findIndex((s) => s.id === stepId)
    if (stepIndex === 0) return true // First step always unlocked

    // Previous step must be completed
    const prevStep = STEPS[stepIndex - 1]
    return completedSteps.includes(prevStep.id)
  }

  const handleCompleteStep = () => {
    if (!completedSteps.includes(activeTab)) {
      setCompletedSteps([...completedSteps, activeTab])
    }

    const currentIndex = STEPS.findIndex((s) => s.id === activeTab)
    if (currentIndex < STEPS.length - 1) {
      setActiveTab(STEPS[currentIndex + 1].id)
      window.scrollTo(0, 0)
    }
  }

  const progressPercentage = Math.round((completedSteps.length / STEPS.length) * 100)

  if (!topic) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="gap-2 mb-4 bg-primary-50 hover:bg-primary-100 text-primary-900"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Topic
        </Button>

        <Card className="p-6 border-primary-100 bg-gradient-to-r from-white to-primary-50/30">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-primary-900">{topic.title}</h1>
              <p className="text-muted-foreground">{topic.description}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-2xl font-bold text-primary-600">{progressPercentage}%</span>
                <span className="text-sm text-muted-foreground ml-1">Complete</span>
              </div>
              <div className="w-32 h-2 bg-gray-100 rounded-full ml-auto overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8 overflow-x-auto pb-4">
        <div className="min-w-[768px] flex items-center justify-between relative px-4">
          {/* Connection Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-200 -z-10 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isActive = activeTab === step.id
            const isUnlocked = isStepUnlocked(step.id)

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 pt-5">
                <button
                  onClick={() => isUnlocked && setActiveTab(step.id)}
                  disabled={!isUnlocked}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${
                      isCompleted
                        ? "bg-success-500 border-success-500 text-white"
                        : isActive
                          ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 scale-110"
                          : isUnlocked
                            ? "bg-white border-primary-200 text-primary-600 hover:border-primary-400"
                            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isActive ? (
                    <PlayCircle className="h-5 w-5 fill-current" />
                  ) : !isUnlocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="font-semibold text-sm">{index + 1}</span>
                  )}
                </button>
                <span
                  className={`
                    text-xs font-medium transition-colors duration-300
                    ${isActive ? "text-primary-700 font-bold" : isUnlocked ? "text-muted-foreground" : "text-gray-400"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "learn" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Learn Vocabulary</h2>
              <span className="text-sm text-muted-foreground">Step 1 of 6</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Word List */}
              <div
                ref={wordListRef}
                className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto border border-border rounded-lg p-3 bg-muted/30"
              >
                {vocab.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No words available</p>
                  </div>
                ) : (
                  vocab.map((word) => (
                    <button
                      key={word.id}
                      onClick={() => handleSelectWord(word)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        selectedWord?.id === word.id ? "bg-primary-600 text-white" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {word.word}
                    </button>
                  ))
                )}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View more
                </Button>
              </div>

              {/* Right Column: Word Details */}
              <div className="lg:col-span-2 space-y-6">
                {selectedWord ? (
                  <Card className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-4xl font-bold mb-2">{selectedWord.word}</h3>
                        <p className="text-sm text-muted-foreground font-mono mb-1">{selectedWord.pronunciation}</p>
                        <span className="inline-block px-2 py-1 rounded bg-primary-100 text-primary-900 text-xs font-medium">
                          {selectedWord.partOfSpeech}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary-200 text-primary-900 text-sm">
                          {topic.level}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-primary-300 text-primary-900 text-sm">
                          Chưa nhớ lắm
                        </span>
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-3">MEANING</p>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 w-6 rounded-full bg-gray-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                              1
                            </div>
                            <p className="text-sm">{selectedWord.meaning}</p>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                              2
                            </div>
                            <p className="text-sm">
                              the way a person, an animal, a plant, a chemical, etc. behaves or functions in a
                              particular situation
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-3">VIETNAMESE</p>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 w-6 rounded-full bg-gray-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                              1
                            </div>
                            <p className="text-sm">Hành vi / cách cư xử (đối với người khác)</p>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                              2
                            </div>
                            <p className="text-sm">Cách hoạt động / phản ứng (trong một tình huống cụ thể)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">EXAMPLE</p>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-start">
                          <div className="h-6 w-6 rounded-full bg-gray-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="text-sm italic mb-1">"{selectedWord.exampleSentence}"</p>
                            <p className="text-sm text-muted-foreground">"{selectedWord.exampleTranslation}"</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="h-6 w-6 rounded-full bg-primary-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                            2
                          </div>
                          <div className="flex-1">
                            <p className="text-sm italic mb-1">"Animals in zoos often display disturbed behaviour."</p>
                            <p className="text-sm text-muted-foreground">
                              "Động vật trong sở thú thường biểu hiện hành vi bị rối loạn."
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-3 bg-transparent"
                        size="sm"
                        onClick={() => setShadowingOpen(true)}
                      >
                        shadowing these sentences
                      </Button>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">SEE ALSO</p>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {["conduct", "manners", "attitude", "customs"].map((term, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-success-100 text-success-800 text-xs font-medium hover:bg-success-200 cursor-pointer border border-success-300"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["misbehavior", "misconduct", "rudeness"].map((term, idx) => (
                            <span
                              key={`neg-${idx}`}
                              className="px-3 py-1 rounded-full bg-warning-100 text-warning-800 text-xs font-medium hover:bg-warning-200 cursor-pointer border border-warning-300"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["good behaviour", "bad behaviour", "strange behaviour", "behaviour towards others"].map(
                            (term, idx) => (
                              <span
                                key={`phrase-${idx}`}
                                className="px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-medium hover:bg-primary-200 cursor-pointer border border-primary-300"
                              >
                                {term}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {[
                          {
                            label: "Brand New",
                            color: "bg-error-100 text-error-800 border-error-300 hover:bg-error-200",
                          },
                          {
                            label: "Not Remembered",
                            color: "bg-warning-100 text-warning-800 border-warning-300 hover:bg-warning-200",
                          },
                          {
                            label: "Normal",
                            color: "bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100",
                          },
                          {
                            label: "Remembered",
                            color: "bg-primary-100 text-primary-800 border-primary-300 hover:bg-primary-200",
                          },
                          {
                            label: "Mastered",
                            color: "bg-success-100 text-success-800 border-success-300 hover:bg-success-200",
                          },
                        ].map((level, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleMasterySelect(level.label)}
                            className={`px-4 py-2 rounded-full ${level.color} text-sm font-medium transition-colors border`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="border-t border-border pt-6 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentWordIndex === 0}
                        className="gap-2 bg-transparent"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        {masterySelected ? "Ready to continue" : "Select a mastery level to continue"}
                      </span>

                      <Button
                        onClick={handleNext}
                        disabled={!masterySelected || currentWordIndex === vocab.length - 1}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Select a word to view details</p>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-success-600 hover:bg-success-700 text-white gap-2 shadow-sm"
              >
                Finish Learning & Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "translate" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Translate Lab</h2>
              <span className="text-sm text-muted-foreground">Step 2 of 6</span>
            </div>
            <TranslateSpeakLab topicTitle={topic.title} />

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Complete Translation
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "listening" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Listening Practice</h2>
              <span className="text-sm text-muted-foreground">Step 3 of 6</span>
            </div>
            <ListeningSection topicTitle={topic.title} tasks={mockListeningTasks[topicId] || []} />

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Complete Listening
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "reading" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Reading Practice</h2>
              <span className="text-sm text-muted-foreground">Step 4 of 6</span>
            </div>
            {mockReadingPassages[topicId] ? (
              <ReadingSection passage={mockReadingPassages[topicId]} />
            ) : (
              <Card className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reading passage available</p>
              </Card>
            )}

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Complete Reading
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "writing" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Writing</h2>
              <span className="text-sm text-muted-foreground">Step 5 of 6</span>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <h3 className="font-semibold mb-4">Task</h3>
                <p className="text-sm mb-6">
                  Write a paragraph of 8–10 sentences describing the behaviour of one animal you know well.
                </p>
                <h3 className="font-semibold mb-4">Your writing</h3>
                <textarea
                  className="w-full min-h-[300px] p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Start typing your response here..."
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">0 character</span>
                  <div className="flex gap-2">
                    <Button variant="outline">Get feedback</Button>
                    <Button>Save</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">You must use at least 8 words from the list:</h3>
                <div className="space-y-2 mb-6">
                  {[
                    "behaviour",
                    "graze",
                    "prey",
                    "predator",
                    "bark",
                    "growl",
                    "roar",
                    "purr",
                    "gallop",
                    "slither",
                    "hibernate",
                    "camouflage",
                  ].map((word, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      <span className="text-sm">{word}</span>
                    </label>
                  ))}
                </div>
                <h3 className="font-semibold mb-4">Suggestions to include:</h3>
                <div className="space-y-2">
                  {[
                    "where the animal lives",
                    "what it eats",
                    "how it moves",
                    "what sound it makes",
                    "how it survives (camouflage, predator vs prey, hibernation, etc.)",
                  ].map((suggestion, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      <span className="text-sm">{suggestion}</span>
                    </label>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Submit Writing
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Quiz</h2>
              <span className="text-sm text-muted-foreground">Final Step</span>
            </div>
            <QuizSection items={mockQuizzes[topicId] || []} />

            <div className="flex justify-end pt-8 border-t mt-8">
              <Button
                onClick={handleCompleteStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
              >
                Finish Lesson
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
