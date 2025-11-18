"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { QuizSection } from "@/components/vocab/quiz-section"
import { TranslateSpeakLab } from "@/components/vocab/translate-speak-lab"
import { ListeningSection } from "@/components/vocab/listening-section"
import { ReadingSection } from "@/components/vocab/reading-section"
import { mockTopics, mockVocab, mockQuizzes, mockListeningTasks, mockReadingPassages } from "@/lib/mock-data"
import type { VocabItem } from "@/types"
import { ArrowLeft, BookOpen, BookMarked, ChevronLeft, ChevronRight, Mic } from 'lucide-react'

type TabType = "learn" | "translate" | "listening" | "reading" | "writing" | "quiz"

export default function TopicDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const topicId = params.topicId as string
  const selectedWordId = searchParams.get("w")

  const [activeTab, setActiveTab] = useState<TabType>("learn")
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
    ? [
        selectedWord.exampleSentence,
        "Animals in zoos often display disturbed behaviour.",
      ]
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

  if (!topic) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
      </div>
    )
  }

  const tabs: Array<{ id: TabType; label: string; checked?: boolean }> = [
    { id: "learn", label: "Learn", checked: true },
    { id: "translate", label: "Translate lab" },
    { id: "listening", label: "Listening" },
    { id: "reading", label: "Reading" },
    { id: "writing", label: "Writing" },
    { id: "quiz", label: "Quiz" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" className="gap-2 mb-4 bg-blue-200 hover:bg-blue-300 text-blue-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Topic
        </Button>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
              <p className="text-muted-foreground">{topic.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {vocab.length} words - {topic.estimatedTime} mins
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-secondary text-xs">{topic.level}</span>
                <span className="px-2 py-1 rounded bg-secondary text-xs">{topic.level}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <label key={tab.id} className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={activeTab === tab.id}
              onChange={() => setActiveTab(tab.id)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">{tab.label}</span>
          </label>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "learn" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learn Vocabulary</h2>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Left Column: Word List */}
              <div
                ref={wordListRef}
                className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto border border-border rounded-lg p-3 bg-secondary/30"
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
                        selectedWord?.id === word.id ? "bg-blue-600 text-white" : "hover:bg-secondary text-foreground"
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
              <div className="lg:col-span-3 space-y-6">
                {selectedWord ? (
                  <Card className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-4xl font-bold mb-2">{selectedWord.word}</h3>
                        <p className="text-sm text-muted-foreground font-mono mb-1">{selectedWord.pronunciation}</p>
                        <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-900 text-xs font-medium">
                          {selectedWord.partOfSpeech}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-900 text-sm">{topic.level}</span>
                        <span className="px-3 py-1 rounded-full bg-blue-300 text-blue-900 text-sm">Chưa nhớ lắm</span>
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
                            <div className="h-6 w-6 rounded-full bg-blue-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                              2
                            </div>
                            <p className="text-sm">
                              the way a person, an animal, a plant, a chemical, etc. behaves or functions in a particular
                              situation
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
                            <div className="h-6 w-6 rounded-full bg-blue-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
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
                          <div className="h-6 w-6 rounded-full bg-blue-400 text-white flex-shrink-0 flex items-center justify-center text-xs font-semibold">
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
                        {/* Green row - positive/neutral terms */}
                        <div className="flex flex-wrap gap-2">
                          {["conduct", "manners", "attitude", "customs"].map((term, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium hover:bg-green-200 cursor-pointer border border-green-300"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                        {/* Orange row - negative terms */}
                        <div className="flex flex-wrap gap-2">
                          {["misbehavior", "misconduct", "rudeness"].map((term, idx) => (
                            <span
                              key={`neg-${idx}`}
                              className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium hover:bg-orange-200 cursor-pointer border border-orange-300"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                        {/* Blue row - phrases */}
                        <div className="flex flex-wrap gap-2">
                          {["good behaviour", "bad behaviour", "strange behaviour", "behaviour towards others"].map(
                            (term, idx) => (
                              <span
                                key={`phrase-${idx}`}
                                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium hover:bg-blue-200 cursor-pointer border border-blue-300"
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
                          { label: "Brand New", color: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200" },
                          {
                            label: "Not Remembered",
                            color: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
                          },
                          {
                            label: "Normal",
                            color: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
                          },
                          { label: "Remembered", color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200" },
                          {
                            label: "Mastered",
                            color: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
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
                        className="gap-2"
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

            <div className="mt-8">
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${vocab.length > 0 ? ((currentWordIndex + 1) / vocab.length) * 100 : 0}%` }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium">
                  {currentWordIndex + 1} / {vocab.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "translate" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Translate Lab</h2>
            <TranslateSpeakLab topicTitle={topic.title} />
          </div>
        )}

        {activeTab === "listening" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Listening Practice</h2>
            <ListeningSection topicTitle={topic.title} tasks={mockListeningTasks[topicId] || []} />
          </div>
        )}

        {activeTab === "reading" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reading Practice</h2>
            {mockReadingPassages[topicId] ? (
              <ReadingSection passage={mockReadingPassages[topicId]} />
            ) : (
              <Card className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reading passage available</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "writing" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Writing</h2>
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
          </div>
        )}

        {activeTab === "quiz" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Quiz</h2>
            <QuizSection items={mockQuizzes[topicId] || []} />
          </div>
        )}
      </div>

      <Dialog open={shadowingOpen} onOpenChange={setShadowingOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="text-2xl font-bold text-center mb-6">Shadowing this sentence</DialogTitle>

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                disabled={currentSentence === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 rounded-full bg-blue-200 text-blue-900 text-sm font-medium">
                Câu {currentSentence + 1} / {shadowingSentences.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSentence(Math.min(shadowingSentences.length - 1, currentSentence + 1))}
                disabled={currentSentence === shadowingSentences.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Card className="p-8 text-center bg-secondary/30">
              <p className="text-xl mb-6">{shadowingSentences[currentSentence]}</p>
              <Button className="gap-2" size="lg">
                <Mic className="h-5 w-5" />
                Tap to speak
              </Button>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
