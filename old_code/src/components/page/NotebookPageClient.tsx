"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  BookOpen, FileText, Zap, Volume2, Plus, ChevronLeft, ChevronRight, Star,
  Mic, Square, X, Check, RotateCcw, Play, Shuffle, Undo2, GraduationCap,
  TrendingUp, Target, Clock, Flame, Award, BarChart3, Brain,
  Filter, Maximize2, Trash2, Edit, Search, ArrowLeft, CheckCircle2, XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute, PageIcons } from "@/components/auth/protected-route"
import { HubHero } from "@/components/hub"

// Types
export type MasteryLevel = "new" | "learning" | "familiar" | "confident" | "mastered"
export type CollectionType = "vocabulary" | "grammar"

export const MASTERY_LEVELS = [
  { value: "new", label: "New", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-50" },
  { value: "learning", label: "Learning", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-50" },
  { value: "familiar", label: "Familiar", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-50" },
  { value: "confident", label: "Confident", color: "bg-lime-500", textColor: "text-lime-700", bgLight: "bg-lime-50" },
  { value: "mastered", label: "Mastered", color: "bg-green-500", textColor: "text-green-700", bgLight: "bg-green-50" },
] as const

export interface NotebookItem {
  id: string; word: string; pronunciation: string; meaning: string[]; vietnamese: string[]
  examples: { en: string; vi: string }[]; partOfSpeech: string; level: string
  note?: string; tags: string[]; collectionId: string; masteryLevel: number
  lastReviewed?: string; nextReview?: string
}

export interface GrammarItem {
  id: string; title: string; rule: string; explanation: string
  examples: { en: string; vi: string }[]; level: string; category: string
  collectionId: string; masteryLevel: number; lastReviewed?: string
}

export interface CollectionData {
  id: string; name: string; count: number; mastered: number; color: string; type: CollectionType
}

export interface NotebookPageClientProps {
  collections: CollectionData[]; vocabularyItems: NotebookItem[]
  grammarItems: GrammarItem[]; dueCount: number
}

// Helper functions
function getCollectionIcon(type: CollectionType): React.ReactNode {
  return type === "vocabulary" ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />
}

function getMasteryCategory(masteryLevel: number): MasteryLevel {
  if (masteryLevel < 20) return "new"
  if (masteryLevel < 40) return "learning"
  if (masteryLevel < 60) return "familiar"
  if (masteryLevel < 80) return "confident"
  return "mastered"
}

function getMasteryConfig(masteryLevel: number) {
  return MASTERY_LEVELS.find(m => m.value === getMasteryCategory(masteryLevel)) || MASTERY_LEVELS[0]
}

function speakText(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }
}

export default function NotebookPageClient({
  collections: collectionsData,
  vocabularyItems: initialVocab,
  grammarItems: initialGrammar,
}: NotebookPageClientProps) {
  const router = useRouter()

  // Data state
  const [vocabularyItems, setVocabularyItems] = useState<NotebookItem[]>(initialVocab)
  const [grammarItems, setGrammarItems] = useState<GrammarItem[]>(initialGrammar)
  const [collections, setCollections] = useState<(CollectionData & { icon: React.ReactNode })[]>(
    collectionsData.map(c => ({ ...c, icon: getCollectionIcon(c.type) }))
  )

  // UI state
  const [selectedCollection, setSelectedCollection] = useState<string>("vocabulary")
  const [viewMode, setViewMode] = useState<"list" | "flashcards" | "statistics">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [starredItems, setStarredItems] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [collectionTypeFilter, setCollectionTypeFilter] = useState<CollectionType | "all">("all")

  // Filter state
  const [masteryFilter, setMasteryFilter] = useState<string[]>([])
  const [starredFilter, setStarredFilter] = useState<boolean | null>(null)
  const [levelFilter, setLevelFilter] = useState<string[]>([])

  // Flashcard/Quiz state
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardAnimation, setCardAnimation] = useState<"" | "swipe-left" | "swipe-right">("")
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set())
  const [notLearnedCards, setNotLearnedCards] = useState<Set<string>>(new Set())

  // Grammar Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)

  // Dialog state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [sessionCompleteOpen, setSessionCompleteOpen] = useState(false)
  const [shadowingOpen, setShadowingOpen] = useState(false)
  const [newCollectionOpen, setNewCollectionOpen] = useState(false)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [addGrammarOpen, setAddGrammarOpen] = useState(false)
  const [editItemOpen, setEditItemOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Form state
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionType, setNewCollectionType] = useState<CollectionType>("vocabulary")
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [editingItem, setEditingItem] = useState<NotebookItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // New vocab form
  const [newItem, setNewItem] = useState({
    word: "", pronunciation: "", meaning: "", vietnamese: "",
    example: "", exampleVi: "", partOfSpeech: "noun", level: "A2", note: "", tags: ""
  })

  // New grammar form
  const [newGrammar, setNewGrammar] = useState({
    title: "", rule: "", explanation: "", category: "Tenses", level: "A2",
    exampleEn: "", exampleVi: ""
  })

  // Get current collection type
  const currentCollectionType = useMemo(() => {
    const col = collections.find(c => c.id === selectedCollection)
    return col?.type || "vocabulary"
  }, [collections, selectedCollection])

  // Filtered collections
  const filteredCollections = useMemo(() => {
    if (collectionTypeFilter === "all") return collections
    return collections.filter(c => c.type === collectionTypeFilter)
  }, [collections, collectionTypeFilter])

  // Filtered vocabulary items
  const filteredVocabItems = useMemo(() => {
    return vocabularyItems.filter((item) => {
      if (item.collectionId !== selectedCollection) return false
      const matchesSearch = searchQuery === "" ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.vietnamese.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
      if (!matchesSearch) return false
      if (masteryFilter.length > 0 && !masteryFilter.includes(getMasteryCategory(item.masteryLevel))) return false
      if (starredFilter !== null && starredItems.has(item.id) !== starredFilter) return false
      if (levelFilter.length > 0 && !levelFilter.includes(item.level)) return false
      return true
    })
  }, [vocabularyItems, selectedCollection, searchQuery, masteryFilter, starredFilter, levelFilter, starredItems])

  // Filtered grammar items
  const filteredGrammarItems = useMemo(() => {
    return grammarItems.filter((item) => {
      if (item.collectionId !== selectedCollection) return false
      const matchesSearch = searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
      if (masteryFilter.length > 0 && !masteryFilter.includes(getMasteryCategory(item.masteryLevel))) return false
      if (levelFilter.length > 0 && !levelFilter.includes(item.level)) return false
      return true
    })
  }, [grammarItems, selectedCollection, searchQuery, masteryFilter, levelFilter])

  // Flashcard items for practice
  const flashcardItems = useMemo(() => {
    if (currentCollectionType === "grammar") return []
    return selectedItems.size > 0
      ? filteredVocabItems.filter(item => selectedItems.has(item.id))
      : filteredVocabItems
  }, [currentCollectionType, selectedItems, filteredVocabItems])

  const currentItem = flashcardItems[currentCardIndex]
  const currentGrammarItem = filteredGrammarItems[currentQuizIndex]

  // Due count
  const dueCount = useMemo(() => {
    const now = new Date()
    return vocabularyItems.filter(item => item.nextReview && new Date(item.nextReview) <= now).length
  }, [vocabularyItems])

  // Stats
  const stats = useMemo(() => {
    const items = currentCollectionType === "vocabulary"
      ? vocabularyItems.filter(i => i.collectionId === selectedCollection)
      : grammarItems.filter(i => i.collectionId === selectedCollection)
    const total = items.length
    const mastered = items.filter(i => i.masteryLevel >= 80).length
    const learning = items.filter(i => i.masteryLevel >= 20 && i.masteryLevel < 80).length
    const newItems = items.filter(i => i.masteryLevel < 20).length
    const avgMastery = total > 0 ? Math.round(items.reduce((sum, i) => sum + i.masteryLevel, 0) / total) : 0
    return { total, mastered, learning, newItems, avgMastery }
  }, [currentCollectionType, selectedCollection, vocabularyItems, grammarItems])

  // Update collections count
  useEffect(() => {
    setCollections(prev => prev.map(c => {
      if (c.type === "vocabulary") {
        const items = vocabularyItems.filter(i => i.collectionId === c.id)
        return { ...c, count: items.length, mastered: items.filter(i => i.masteryLevel >= 80).length }
      }
      const items = grammarItems.filter(i => i.collectionId === c.id)
      return { ...c, count: items.length, mastered: items.filter(i => i.masteryLevel >= 80).length }
    }))
  }, [vocabularyItems, grammarItems])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode !== "flashcards" || sessionCompleteOpen || currentCollectionType === "grammar") return
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") {
        e.preventDefault()
        setIsFlipped(!isFlipped)
      }
      if (e.code === "ArrowLeft" && currentItem) { e.preventDefault(); handleSwipe("left") }
      if (e.code === "ArrowRight" && currentItem) { e.preventDefault(); handleSwipe("right") }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isFlipped, viewMode, currentCardIndex, flashcardItems.length, sessionCompleteOpen, currentCollectionType])

  useEffect(() => { setIsFlipped(false) }, [currentCardIndex])

  // Handlers
  const handleSwipe = (direction: "left" | "right") => {
    if (!currentItem) return
    if (direction === "left") {
      setNotLearnedCards(prev => new Set(prev).add(currentItem.id))
      setLearnedCards(prev => { const s = new Set(prev); s.delete(currentItem.id); return s })
    } else {
      setLearnedCards(prev => new Set(prev).add(currentItem.id))
      setNotLearnedCards(prev => { const s = new Set(prev); s.delete(currentItem.id); return s })
      setVocabularyItems(prev => prev.map(item =>
        item.id === currentItem.id ? { ...item, masteryLevel: Math.min(100, item.masteryLevel + 10) } : item
      ))
    }
    setCardAnimation(direction === "left" ? "swipe-left" : "swipe-right")
    setTimeout(() => {
      if (currentCardIndex < flashcardItems.length - 1) setCurrentCardIndex(currentCardIndex + 1)
      else setSessionCompleteOpen(true)
      setCardAnimation("")
    }, 400)
  }

  const handleReviewAnswer = (quality: number) => {
    if (!currentItem) return
    const masteryChange = quality === 0 ? -20 : quality === 1 ? -10 : quality === 2 ? 5 : quality === 3 ? 15 : 25
    setVocabularyItems(prev => prev.map(item =>
      item.id === currentItem.id
        ? { ...item, masteryLevel: Math.max(0, Math.min(100, item.masteryLevel + masteryChange)), lastReviewed: "Just now" }
        : item
    ))
    if (currentCardIndex < flashcardItems.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    } else {
      setIsReviewModalOpen(false)
      setSessionCompleteOpen(true)
    }
  }

  const handleAddCollection = () => {
    if (!newCollectionName.trim()) return
    const newId = `${newCollectionType}-${Date.now()}`
    setCollections(prev => [...prev, {
      id: newId, name: newCollectionName, count: 0, mastered: 0, color: "primary",
      type: newCollectionType, icon: getCollectionIcon(newCollectionType)
    }])
    setNewCollectionName("")
    setNewCollectionType("vocabulary")
    setNewCollectionOpen(false)
  }

  const handleAddItem = () => {
    if (!newItem.word.trim()) return
    const item: NotebookItem = {
      id: `v${Date.now()}`, word: newItem.word, pronunciation: newItem.pronunciation || "/.../",
      meaning: newItem.meaning.split("\n").filter(Boolean), vietnamese: newItem.vietnamese.split("\n").filter(Boolean),
      examples: newItem.example ? [{ en: newItem.example, vi: newItem.exampleVi }] : [],
      partOfSpeech: newItem.partOfSpeech, level: newItem.level, note: newItem.note,
      tags: newItem.tags.split(",").map(t => t.trim()).filter(Boolean),
      collectionId: selectedCollection, masteryLevel: 0, nextReview: new Date().toISOString()
    }
    setVocabularyItems(prev => [...prev, item])
    setNewItem({ word: "", pronunciation: "", meaning: "", vietnamese: "", example: "", exampleVi: "", partOfSpeech: "noun", level: "A2", note: "", tags: "" })
    setAddItemOpen(false)
  }

  const handleAddGrammar = () => {
    if (!newGrammar.title.trim()) return
    const item: GrammarItem = {
      id: `g${Date.now()}`, title: newGrammar.title, rule: newGrammar.rule,
      explanation: newGrammar.explanation, category: newGrammar.category, level: newGrammar.level,
      examples: newGrammar.exampleEn ? [{ en: newGrammar.exampleEn, vi: newGrammar.exampleVi }] : [],
      collectionId: selectedCollection, masteryLevel: 0
    }
    setGrammarItems(prev => [...prev, item])
    setNewGrammar({ title: "", rule: "", explanation: "", category: "Tenses", level: "A2", exampleEn: "", exampleVi: "" })
    setAddGrammarOpen(false)
  }

  const handleEditItem = () => {
    if (!editingItem) return
    setVocabularyItems(prev => prev.map(item => item.id === editingItem.id ? editingItem : item))
    setEditingItem(null)
    setEditItemOpen(false)
  }

  const handleDeleteItem = () => {
    if (!itemToDelete) return
    setVocabularyItems(prev => prev.filter(item => item.id !== itemToDelete))
    setGrammarItems(prev => prev.filter(item => item.id !== itemToDelete))
    setSelectedItems(prev => { const s = new Set(prev); s.delete(itemToDelete); return s })
    setItemToDelete(null)
    setDeleteConfirmOpen(false)
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setLearnedCards(new Set())
    setNotLearnedCards(new Set())
    setIsFlipped(false)
    setSessionCompleteOpen(false)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setCurrentQuizIndex(0)
  }

  const startPractice = () => { resetSession(); setViewMode("flashcards") }

  const startReview = () => {
    const dueItems = vocabularyItems.filter(item => item.nextReview && new Date(item.nextReview) <= new Date())
    if (dueItems.length > 0) setSelectedItems(new Set(dueItems.map(i => i.id)))
    resetSession()
    setIsReviewModalOpen(true)
  }

  const handleQuizAnswer = (itemId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [itemId]: answer }))
  }

  const submitQuiz = () => {
    setQuizSubmitted(true)
    // Update mastery based on answers
    filteredGrammarItems.forEach(item => {
      const userAnswer = quizAnswers[item.id]
      const isCorrect = userAnswer === item.examples[0]?.en
      setGrammarItems(prev => prev.map(g =>
        g.id === item.id
          ? { ...g, masteryLevel: Math.max(0, Math.min(100, g.masteryLevel + (isCorrect ? 15 : -10))) }
          : g
      ))
    })
  }

  // Render
  return (
    <ProtectedRoute pageName="Notebook" pageDescription="Save and organize your vocabulary and grammar." pageIcon={PageIcons.notebook}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <HubHero
          title="MY NOTEBOOK"
          description="Save and organize your vocabulary and grammar rules. Practice with spaced repetition to master them efficiently."
          imageSrc="/learning.png"
          primaryAction={{ label: "Start Practice", onClick: startPractice }}
          secondaryAction={{ label: "View Statistics", onClick: () => setViewMode("statistics") }}
          notification={dueCount > 0 ? { text: `You have ${dueCount} words ready for review today.`, actionLabel: "Review Now", onClick: startReview } : undefined}
        />

        <div className="flex gap-6 min-h-[calc(100vh-350px)]">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0">
            <Card className="p-5 sticky top-20 border-2 border-border bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Collections</h2>
                <Badge variant="secondary" className="text-xs">{collections.length}</Badge>
              </div>

              {/* Collection Type Filter */}
              <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                {(["all", "vocabulary", "grammar"] as const).map(type => (
                  <button key={type} onClick={() => setCollectionTypeFilter(type)}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${collectionTypeFilter === type ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                      }`}>
                    {type === "all" ? "All" : type === "vocabulary" ? "Vocab" : "Grammar"}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredCollections.map((collection) => (
                  <button key={collection.id} onClick={() => { setSelectedCollection(collection.id); setCurrentCardIndex(0); setSelectedItems(new Set()); setViewMode("list") }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${selectedCollection === collection.id ? "bg-primary-100 border-2 border-primary-300 shadow-sm" : "hover:bg-gray-50 border-2 border-transparent"
                      }`}>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${selectedCollection === collection.id ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {collection.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${selectedCollection === collection.id ? "text-primary-700" : "text-gray-900"}`}>{collection.name}</p>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{collection.type === "vocabulary" ? "V" : "G"}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{collection.count} items</span>
                        <span className="text-xs text-success-300">{collection.mastered} mastered</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <Button variant="outline" onClick={() => setNewCollectionOpen(true)}
                  className="w-full gap-2 justify-center h-11 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 bg-transparent">
                  <Plus className="h-4 w-4" /> New Collection
                </Button>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">Due today</span></div>
                    <span className="text-sm font-medium text-primary-600">{dueCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Target className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">Mastery</span></div>
                    <span className="text-sm font-medium text-success-300">{stats.avgMastery}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">Total items</span></div>
                    <span className="text-sm font-medium text-gray-900">{stats.total}</span>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="flex-1 max-w-md">
                <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-white rounded-xl">
                  <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2">
                    {currentCollectionType === "vocabulary" ? "List View" : "All Rules"}
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2">
                    {currentCollectionType === "vocabulary" ? "Flashcards" : "Quizzes"}
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-border data-[state=active]:border-2">
                    Statistics
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                {viewMode === "list" && selectedItems.size > 0 && currentCollectionType === "vocabulary" && (
                  <Button onClick={startPractice} className="gap-2 rounded-xl h-11"><GraduationCap className="h-4 w-4" /> Practice ({selectedItems.size})</Button>
                )}
                {viewMode === "list" && currentCollectionType === "vocabulary" && (
                  <Button onClick={() => setAddItemOpen(true)} variant="outline" className="gap-2 rounded-xl h-11 bg-transparent"><Plus className="h-4 w-4" /> Add Word</Button>
                )}
                {viewMode === "list" && currentCollectionType === "grammar" && (
                  <Button onClick={() => setAddGrammarOpen(true)} variant="outline" className="gap-2 rounded-xl h-11 bg-transparent"><Plus className="h-4 w-4" /> Add Rule</Button>
                )}
              </div>
            </div>

            <div className="flex-1">
              {/* VOCABULARY LIST */}
              {viewMode === "list" && currentCollectionType === "vocabulary" && (
                <Card className="p-6 border-2 border-border bg-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search words..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-10 rounded-xl border-2" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="select-all" checked={selectedItems.size === filteredVocabItems.length && filteredVocabItems.length > 0}
                        onCheckedChange={(checked) => setSelectedItems(checked ? new Set(filteredVocabItems.map(i => i.id)) : new Set())} className="h-5 w-5 border-2" />
                      <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">Select All</label>
                      {selectedItems.size > 0 && <Badge className="bg-primary-100 text-primary-700">{selectedItems.size}</Badge>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                          <Filter className="h-4 w-4" />
                          {(masteryFilter.length > 0 || starredFilter !== null || levelFilter.length > 0) && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">!</span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-xs text-gray-500">Progress</DropdownMenuLabel>
                        {MASTERY_LEVELS.map((level) => (
                          <DropdownMenuCheckboxItem key={level.value} checked={masteryFilter.includes(level.value)}
                            onCheckedChange={(c) => setMasteryFilter(c ? [...masteryFilter, level.value] : masteryFilter.filter(m => m !== level.value))}>
                            <div className={`h-3 w-3 rounded-full ${level.color} mr-2`} />{level.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-gray-500">Level</DropdownMenuLabel>
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                          <DropdownMenuCheckboxItem key={level} checked={levelFilter.includes(level)}
                            onCheckedChange={(c) => setLevelFilter(c ? [...levelFilter, level] : levelFilter.filter(l => l !== level))}>{level}</DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={starredFilter === true} onCheckedChange={(c) => setStarredFilter(c ? true : null)}>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-2" /> Starred
                        </DropdownMenuCheckboxItem>
                        {(masteryFilter.length > 0 || starredFilter !== null || levelFilter.length > 0) && (
                          <><DropdownMenuSeparator /><Button variant="ghost" size="sm" onClick={() => { setMasteryFilter([]); setStarredFilter(null); setLevelFilter([]) }} className="w-full text-gray-500"><X className="h-4 w-4 mr-2" /> Clear</Button></>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-gray-100">
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Word</TableHead>
                        <TableHead>Meaning</TableHead>
                        <TableHead className="w-16 text-center">Level</TableHead>
                        <TableHead className="w-24 text-center">Progress</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVocabItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50 group">
                          <TableCell><Checkbox checked={selectedItems.has(item.id)} onCheckedChange={(c) => { const s = new Set(selectedItems); c ? s.add(item.id) : s.delete(item.id); setSelectedItems(s) }} /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div><p className="font-semibold">{item.word}</p><p className="text-xs text-gray-500">{item.pronunciation}</p></div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => speakText(item.word)}><Volume2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </TableCell>
                          <TableCell><div className="space-y-0.5">{item.vietnamese.slice(0, 2).map((v, i) => <p key={i} className="text-sm text-gray-700 line-clamp-1">{i + 1}. {v}</p>)}</div></TableCell>
                          <TableCell className="text-center"><Badge className="bg-gray-100 text-gray-600 border-0">{item.level}</Badge></TableCell>
                          <TableCell className="text-center"><div className={`inline-block px-3 py-1 rounded text-xs font-medium ${getMasteryConfig(item.masteryLevel).bgLight} ${getMasteryConfig(item.masteryLevel).textColor}`}>{item.masteryLevel}%</div></TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-yellow-50" onClick={() => setStarredItems(p => { const s = new Set(p); s.has(item.id) ? s.delete(item.id) : s.add(item.id); return s })}>
                                <Star className={`h-4 w-4 ${starredItems.has(item.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100" onClick={() => { setEditingItem(item); setEditItemOpen(true) }}><Edit className="h-4 w-4 text-gray-400" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50" onClick={() => { setItemToDelete(item.id); setDeleteConfirmOpen(true) }}><Trash2 className="h-4 w-4 text-gray-400" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredVocabItems.length === 0 && <div className="text-center py-12"><BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No words found. Add some words to get started!</p></div>}
                </Card>
              )}

              {/* GRAMMAR LIST */}
              {viewMode === "list" && currentCollectionType === "grammar" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search grammar rules..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-10 rounded-xl border-2" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9"><Filter className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-xs text-gray-500">Level</DropdownMenuLabel>
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                          <DropdownMenuCheckboxItem key={level} checked={levelFilter.includes(level)}
                            onCheckedChange={(c) => setLevelFilter(c ? [...levelFilter, level] : levelFilter.filter(l => l !== level))}>{level}</DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {filteredGrammarItems.map((item) => (
                    <Card key={item.id} className="p-6 border-2 border-border bg-white hover:border-primary-200 transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary-100 text-primary-700">{item.category}</Badge>
                            <Badge className="bg-gray-100 text-gray-600">{item.level}</Badge>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded text-xs font-medium ${getMasteryConfig(item.masteryLevel).bgLight} ${getMasteryConfig(item.masteryLevel).textColor}`}>{item.masteryLevel}%</div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-red-50" onClick={() => { setItemToDelete(item.id); setDeleteConfirmOpen(true) }}><Trash2 className="h-4 w-4 text-gray-400" /></Button>
                        </div>
                      </div>

                      <div className="bg-primary-50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-mono font-semibold text-primary-700">{item.rule}</p>
                      </div>

                      <p className="text-gray-600 mb-4">{item.explanation}</p>

                      {item.examples.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700">Examples:</h4>
                          {item.examples.map((ex, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 space-y-1">
                              <p className="text-sm text-gray-800 flex items-center gap-2">
                                <span className="text-primary-600">→</span> {ex.en}
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => speakText(ex.en)}><Volume2 className="h-3 w-3" /></Button>
                              </p>
                              <p className="text-sm text-gray-500 pl-5">{ex.vi}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                  {filteredGrammarItems.length === 0 && (
                    <Card className="p-12 text-center border-2 border-border bg-white">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No grammar rules found. Add some rules to get started!</p>
                    </Card>
                  )}
                </div>
              )}

              {/* VOCABULARY FLASHCARDS */}
              {viewMode === "flashcards" && currentCollectionType === "vocabulary" && currentItem && (
                <div className="max-w-2xl mx-auto">
                  {/* Score badges */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-100">
                      <Check className="h-4 w-4 text-success-300" />
                      <span className="font-semibold text-success-300">{learnedCards.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-100">
                      <Target className="h-4 w-4 text-warning-300" />
                      <span className="font-semibold text-warning-300">{notLearnedCards.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-500">{flashcardItems.length - learnedCards.size - notLearnedCards.size}</span>
                    </div>
                  </div>

                  {/* Card container with navigation arrows */}
                  <div className="relative mb-6">
                    {/* Navigation arrows */}
                    <button
                      onClick={() => { if (currentCardIndex > 0) { setCurrentCardIndex(currentCardIndex - 1); setIsFlipped(false) } }}
                      disabled={currentCardIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      onClick={() => { if (currentCardIndex < flashcardItems.length - 1) { setCurrentCardIndex(currentCardIndex + 1); setIsFlipped(false) } else { setSessionCompleteOpen(true) } }}
                      disabled={currentCardIndex === flashcardItems.length - 1 && learnedCards.size + notLearnedCards.size < flashcardItems.length}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 h-12 w-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Flashcard */}
                    <div
                      className={`flashcard-container relative cursor-pointer transition-all duration-300 ${cardAnimation}`}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div className={`flashcard-inner h-[480px] ${isFlipped ? "flipped" : ""}`}>
                        {/* Front */}
                        <Card className="flashcard-face p-8 bg-white rounded-3xl shadow-2xl border-0 flex flex-col h-[480px]">
                          {/* Swipe overlays */}
                          {cardAnimation === "swipe-left" && (
                            <div className="absolute inset-0 bg-warning-100/80 rounded-3xl flex items-center justify-center z-10 animate-in fade-in duration-200">
                              <div className="text-center">
                                <X className="h-20 w-20 text-warning-300 mx-auto mb-2" strokeWidth={3} />
                                <p className="text-lg font-bold text-warning-300">Still Learning</p>
                              </div>
                            </div>
                          )}
                          {cardAnimation === "swipe-right" && (
                            <div className="absolute inset-0 bg-success-100/80 rounded-3xl flex items-center justify-center z-10 animate-in fade-in duration-200">
                              <div className="text-center">
                                <Check className="h-20 w-20 text-success-300 mx-auto mb-2" strokeWidth={3} />
                                <p className="text-lg font-bold text-success-300">Got it!</p>
                              </div>
                            </div>
                          )}

                          {/* Top bar */}
                          <div className="flex items-center justify-between mb-auto">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary-100 text-primary-700 border-0">{currentItem.level}</Badge>
                              <Badge className="bg-gray-100 text-gray-600 border-0">{currentItem.partOfSpeech}</Badge>
                              {learnedCards.has(currentItem.id) && <Badge className="bg-success-100 text-success-300 border-0">Known</Badge>}
                              {notLearnedCards.has(currentItem.id) && <Badge className="bg-warning-100 text-warning-300 border-0">Learning</Badge>}
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={(e) => { e.stopPropagation(); setStarredItems(p => { const s = new Set(p); s.has(currentItem.id) ? s.delete(currentItem.id) : s.add(currentItem.id); return s }) }}>
                              <Star className={`h-6 w-6 transition-colors ${starredItems.has(currentItem.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`} />
                            </Button>
                          </div>

                          {/* Main content */}
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <h1 className="text-5xl font-bold text-gray-900 mb-3 text-center">{currentItem.word}</h1>
                            <p className="text-lg text-gray-500 mb-6">{currentItem.pronunciation}</p>
                            <Button variant="outline" size="lg" className="gap-2 rounded-full px-6 bg-transparent" onClick={(e) => { e.stopPropagation(); speakText(currentItem.word) }}>
                              <Volume2 className="h-5 w-5" /> Listen
                            </Button>
                          </div>

                          {/* Bottom hint */}
                          <div className="text-center">
                            <p className="text-sm text-gray-400">Click or press Space to flip</p>
                          </div>
                        </Card>

                        {/* Back */}
                        <Card className="flashcard-face flashcard-back p-6 bg-gradient-to-br from-primary-50 to-white rounded-3xl shadow-2xl border-0 flex flex-col h-[480px] overflow-y-auto scrollbar-hide">
                          {/* Top bar */}
                          <div className="flex items-center justify-between mb-3">
                            <Badge className="bg-primary-100 text-primary-700 border-0">{currentItem.level}</Badge>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={(e) => { e.stopPropagation(); setStarredItems(p => { const s = new Set(p); s.has(currentItem.id) ? s.delete(currentItem.id) : s.add(currentItem.id); return s }) }}>
                              <Star className={`h-5 w-5 ${starredItems.has(currentItem.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            </Button>
                          </div>

                          {/* Answer content */}
                          <div className="flex-1">
                            <div className="text-center mb-4">
                              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentItem.vietnamese.join("; ")}</h2>
                              <p className="text-base text-gray-500">{currentItem.meaning[0] || ""}</p>
                            </div>

                            {/* Word info */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                              <Button variant="outline" size="sm" className="gap-2 rounded-full bg-white" onClick={(e) => { e.stopPropagation(); speakText(currentItem.word) }}>
                                <Volume2 className="h-4 w-4" /> {currentItem.pronunciation}
                              </Button>
                            </div>

                            {/* Examples */}
                            {currentItem.examples.length > 0 && (
                              <div className="bg-white rounded-2xl p-4 shadow-sm">
                                <h3 className="text-xs font-bold uppercase text-primary-700 mb-2 flex items-center gap-2">
                                  <Zap className="h-3.5 w-3.5" /> Examples
                                </h3>
                                <div className="space-y-2">
                                  {currentItem.examples.slice(0, 2).map((ex, idx) => (
                                    <div key={idx} className="group">
                                      <p className="text-gray-800 text-sm flex items-center gap-2">
                                        <span className="text-primary-500">→</span>
                                        <span className="italic">"{ex.en}"</span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); speakText(ex.en) }}>
                                          <Volume2 className="h-3 w-3" />
                                        </Button>
                                      </p>
                                      <p className="text-gray-500 text-xs ml-5">"{ex.vi}"</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Shadowing button */}
                          <div className="mt-3">
                            <Button variant="outline" className="w-full gap-2 rounded-xl h-10 bg-white text-sm" onClick={(e) => { e.stopPropagation(); setShadowingOpen(true); setCurrentSentence(0) }}>
                              <Mic className="h-4 w-4" /> Practice Speaking
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSwipe("left")}
                      className="gap-2 h-12 px-6 rounded-xl border-2 border-warning-200 bg-warning-50 hover:bg-warning-100 text-warning-700 font-semibold"
                    >
                      <X className="h-5 w-5" /> Still Learning
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setVocabularyItems(p => [...p].sort(() => Math.random() - 0.5)); setCurrentCardIndex(0); setIsFlipped(false) }}
                      className="h-12 w-12 rounded-xl bg-gray-100 hover:bg-gray-200"
                    >
                      <Shuffle className="h-5 w-5 text-gray-500" />
                    </Button>

                    <Button
                      onClick={() => handleSwipe("right")}
                      className="gap-2 h-12 px-6 rounded-xl bg-success-200 hover:bg-success-300 text-white font-semibold"
                    >
                      <Check className="h-5 w-5" /> Got it!
                    </Button>
                  </div>

                  {/* Progress and controls */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <p className="text-sm text-gray-500">{currentCardIndex + 1} of {flashcardItems.length}</p>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/notebook/flashcards")} className="gap-2 text-gray-500 hover:text-gray-700">
                      <Maximize2 className="h-4 w-4" /> Fullscreen
                    </Button>
                  </div>

                  {/* Keyboard hints */}
                  <div className="text-center text-sm text-gray-400">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Space</kbd> flip ·
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">←</kbd> prev ·
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono ml-2">→</kbd> next
                  </div>
                </div>
              )}

              {viewMode === "flashcards" && currentCollectionType === "vocabulary" && !currentItem && (
                <Card className="p-12 text-center border-2 border-border bg-white">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No cards to practice</h3>
                  <p className="text-gray-500 mb-6">Add some words or select items from the list view.</p>
                  <Button onClick={() => setViewMode("list")} className="gap-2"><ArrowLeft className="h-4 w-4" /> Go to List</Button>
                </Card>
              )}

              {/* GRAMMAR QUIZZES */}
              {viewMode === "flashcards" && currentCollectionType === "grammar" && (
                <div className="max-w-3xl mx-auto">
                  {filteredGrammarItems.length > 0 ? (
                    <Card className="p-6 border-2 border-border bg-white">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Grammar Quiz</h2>
                        <Badge variant="secondary">{filteredGrammarItems.length} questions</Badge>
                      </div>

                      {!quizSubmitted ? (
                        <div className="space-y-6">
                          {filteredGrammarItems.map((item, idx) => (
                            <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="h-6 w-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                <Badge className="bg-gray-100 text-gray-600 border-0 ml-auto">{item.level}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{item.explanation}</p>
                              <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                                <p className="text-sm font-mono text-primary-700">{item.rule}</p>
                              </div>
                              {item.examples.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-700">Fill in the blank:</p>
                                  <p className="text-sm text-gray-600 italic">Vietnamese: {item.examples[0].vi}</p>
                                  <Input
                                    placeholder="Type your answer in English..."
                                    value={quizAnswers[item.id] || ""}
                                    onChange={(e) => handleQuizAnswer(item.id, e.target.value)}
                                    className="h-10 rounded-xl border-2"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          <Button onClick={submitQuiz} className="w-full h-12 rounded-xl gap-2" disabled={Object.keys(quizAnswers).length === 0}>
                            <CheckCircle2 className="h-5 w-5" /> Submit Quiz
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center p-6 bg-primary-50 rounded-xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                            <p className="text-gray-600">Review your answers below</p>
                          </div>
                          {filteredGrammarItems.map((item, idx) => {
                            const userAnswer = quizAnswers[item.id] || ""
                            const correctAnswer = item.examples[0]?.en || ""
                            const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
                            return (
                              <div key={item.id} className={`p-4 rounded-xl border-2 ${isCorrect ? "bg-success-100 border-success-200" : "bg-red-50 border-red-200"}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  {isCorrect ? <CheckCircle2 className="h-5 w-5 text-success-300" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Your answer: <span className={isCorrect ? "text-success-300 font-medium" : "text-red-500 font-medium"}>{userAnswer || "(empty)"}</span></p>
                                {!isCorrect && <p className="text-sm text-gray-600">Correct answer: <span className="text-success-300 font-medium">{correctAnswer}</span></p>}
                              </div>
                            )
                          })}
                          <div className="flex gap-3">
                            <Button onClick={resetSession} variant="outline" className="flex-1 h-12 rounded-xl gap-2 bg-transparent"><RotateCcw className="h-5 w-5" /> Try Again</Button>
                            <Button onClick={() => setViewMode("list")} className="flex-1 h-12 rounded-xl gap-2"><ArrowLeft className="h-5 w-5" /> Back to Rules</Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ) : (
                    <Card className="p-12 text-center border-2 border-border bg-white">
                      <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Grammar Rules</h3>
                      <p className="text-gray-500 mb-6">Add some grammar rules to start quizzing.</p>
                      <Button onClick={() => setViewMode("list")} variant="outline" className="gap-2 bg-transparent"><ArrowLeft className="h-4 w-4" /> Back to Rules</Button>
                    </Card>
                  )}
                </div>
              )}

              {/* STATISTICS VIEW */}
              {viewMode === "statistics" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Due for review */}
                  {dueCount > 0 && currentCollectionType === "vocabulary" && (
                    <Card className="p-6 border-2 border-border bg-white">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
                            <Zap className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Ready to Practice!</h2>
                            <p className="text-gray-600 text-sm">You have <span className="font-bold text-primary-600">{dueCount} words</span> ready for review.</p>
                          </div>
                        </div>
                        <Button size="lg" onClick={startReview} className="gap-2 h-11 px-6 rounded-xl"><Zap className="h-5 w-5" /> Start Review</Button>
                      </div>
                    </Card>
                  )}

                  {/* Stats cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-5 text-center border-2 border-gray-100 bg-white">
                      <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-2"><BookOpen className="h-6 w-6 text-primary-600" /></div>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-sm text-gray-500">Total {currentCollectionType === "vocabulary" ? "Words" : "Rules"}</p>
                    </Card>
                    <Card className="p-5 text-center border-2 border-gray-100 bg-white">
                      <div className="h-12 w-12 rounded-xl bg-success-100 flex items-center justify-center mx-auto mb-2"><Award className="h-6 w-6 text-success-300" /></div>
                      <p className="text-3xl font-bold text-gray-900">{stats.mastered}</p>
                      <p className="text-sm text-gray-500">Mastered</p>
                    </Card>
                    <Card className="p-5 text-center border-2 border-gray-100 bg-white">
                      <div className="h-12 w-12 rounded-xl bg-warning-100 flex items-center justify-center mx-auto mb-2"><Flame className="h-6 w-6 text-warning-300" /></div>
                      <p className="text-3xl font-bold text-gray-900">{stats.learning}</p>
                      <p className="text-sm text-gray-500">Learning</p>
                    </Card>
                    <Card className="p-5 text-center border-2 border-gray-100 bg-white">
                      <div className="h-12 w-12 rounded-xl bg-secondary-100 flex items-center justify-center mx-auto mb-2"><BarChart3 className="h-6 w-6 text-secondary-600" /></div>
                      <p className="text-3xl font-bold text-gray-900">{stats.avgMastery}%</p>
                      <p className="text-sm text-gray-500">Avg. Mastery</p>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut Chart */}
                    <Card className="p-6 border-2 border-border bg-white">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Status</h3>
                      <div className="flex items-center justify-center gap-8">
                        <div className="relative">
                          <svg width="160" height="160" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="24" />
                            <circle cx="80" cy="80" r="60" fill="none" stroke="#22c55e" strokeWidth="24"
                              strokeDasharray={`${(stats.mastered / Math.max(stats.total, 1)) * 377} 377`} strokeDashoffset="94.25" strokeLinecap="round" />
                            <circle cx="80" cy="80" r="60" fill="none" stroke="#f59e0b" strokeWidth="24"
                              strokeDasharray={`${(stats.learning / Math.max(stats.total, 1)) * 377} 377`}
                              strokeDashoffset={`${94.25 - (stats.mastered / Math.max(stats.total, 1)) * 377}`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900">{stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}%</span>
                            <span className="text-xs text-gray-500">Mastered</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-success-200" /><span className="text-sm text-gray-700">{stats.mastered} Mastered</span></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-warning-200" /><span className="text-sm text-gray-700">{stats.learning} Learning</span></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-gray-300" /><span className="text-sm text-gray-700">{stats.newItems} New</span></div>
                        </div>
                      </div>
                    </Card>

                    {/* Level Distribution */}
                    <Card className="p-6 border-2 border-border bg-white">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Distribution by Level</h3>
                      <div className="space-y-4">
                        {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => {
                          const items = currentCollectionType === "vocabulary"
                            ? vocabularyItems.filter(i => i.collectionId === selectedCollection && i.level === level)
                            : grammarItems.filter(i => i.collectionId === selectedCollection && i.level === level)
                          const count = items.length
                          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                          return (
                            <div key={level} className="flex items-center gap-4">
                              <span className="w-8 text-sm font-semibold text-gray-700">{level}</span>
                              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-lg flex items-center justify-end pr-3" style={{ width: `${Math.max(percentage, 5)}%` }}>
                                  {percentage > 15 && <span className="text-xs font-semibold text-white">{count}</span>}
                                </div>
                              </div>
                              {percentage <= 15 && <span className="text-xs font-semibold text-gray-500 w-8">{count}</span>}
                            </div>
                          )
                        })}
                      </div>
                    </Card>
                  </div>

                  {/* Mastery breakdown */}
                  <Card className="p-6 border-2 border-border bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Mastery Breakdown</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {MASTERY_LEVELS.map((level) => {
                        const items = currentCollectionType === "vocabulary"
                          ? vocabularyItems.filter(i => i.collectionId === selectedCollection)
                          : grammarItems.filter(i => i.collectionId === selectedCollection)
                        const count = items.filter(i => getMasteryCategory(i.masteryLevel) === level.value).length
                        return (
                          <div key={level.value} className={`p-4 rounded-xl ${level.bgLight} text-center`}>
                            <div className={`h-3 w-3 rounded-full ${level.color} mx-auto mb-2`} />
                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                            <p className={`text-xs font-medium ${level.textColor}`}>{level.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DIALOGS */}

        {/* Review Modal */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Spaced Repetition Review</DialogTitle></DialogHeader>
            {currentItem && (
              <div className="space-y-6">
                <div className="text-center text-sm text-gray-500">Card {currentCardIndex + 1} of {flashcardItems.length}</div>
                <Card className="p-6 bg-gray-50 border-2 border-gray-100">
                  <h3 className="text-3xl font-bold mb-2 text-center">{currentItem.word}</h3>
                  <p className="text-gray-500 text-center mb-4">{currentItem.pronunciation}</p>
                  {showAnswer ? (
                    <div className="space-y-4 mt-6">
                      <div className="bg-white p-4 rounded-lg"><p className="text-sm font-semibold mb-2">Meaning:</p>{currentItem.meaning.map((m, i) => <p key={i} className="text-sm">• {m}</p>)}</div>
                      <div className="bg-white p-4 rounded-lg"><p className="text-sm font-semibold mb-2">Vietnamese:</p>{currentItem.vietnamese.map((v, i) => <p key={i} className="text-sm">• {v}</p>)}</div>
                    </div>
                  ) : (
                    <Button onClick={() => setShowAnswer(true)} variant="outline" className="w-full mt-4 bg-transparent">Show Answer</Button>
                  )}
                </Card>
                {showAnswer && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-center">How well did you remember?</p>
                    <div className="grid grid-cols-5 gap-2">
                      <Button variant="outline" onClick={() => handleReviewAnswer(0)} className="bg-red-50 hover:bg-red-100 border-red-200 text-xs">Again</Button>
                      <Button variant="outline" onClick={() => handleReviewAnswer(1)} className="bg-orange-50 hover:bg-orange-100 border-orange-200 text-xs">Hard</Button>
                      <Button variant="outline" onClick={() => handleReviewAnswer(2)} className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-xs">Good</Button>
                      <Button variant="outline" onClick={() => handleReviewAnswer(3)} className="bg-lime-50 hover:bg-lime-100 border-lime-200 text-xs">Easy</Button>
                      <Button variant="outline" onClick={() => handleReviewAnswer(4)} className="bg-green-50 hover:bg-green-100 border-green-200 text-xs">Perfect</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Session Complete */}
        <Dialog open={sessionCompleteOpen} onOpenChange={setSessionCompleteOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader><DialogTitle className="text-2xl font-bold text-center">Session Complete! 🎉</DialogTitle></DialogHeader>
            <div className="space-y-6 py-6">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="#fde68a" strokeWidth="32" fill="none" />
                    <circle cx="96" cy="96" r="80" stroke="#86efac" strokeWidth="32" fill="none" strokeDasharray={`${(learnedCards.size / Math.max(learnedCards.size + notLearnedCards.size, 1)) * 502.4} 502.4`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-900">{learnedCards.size + notLearnedCards.size > 0 ? Math.round((learnedCards.size / (learnedCards.size + notLearnedCards.size)) * 100) : 0}%</p>
                    <p className="text-sm text-gray-500">Mastered</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-300" /><div><p className="text-sm font-medium">Learning</p><p className="text-xs text-gray-500">{notLearnedCards.size} cards</p></div></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-300" /><div><p className="text-sm font-medium">Mastered</p><p className="text-xs text-gray-500">{learnedCards.size} cards</p></div></div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full gap-2 h-12 rounded-xl" disabled={notLearnedCards.size === 0} onClick={() => { setCurrentCardIndex(0); setSessionCompleteOpen(false); setIsFlipped(false) }}><Play className="h-5 w-5" /> Review Unmastered ({notLearnedCards.size})</Button>
                <Button className="w-full gap-2 h-12 rounded-xl bg-transparent" variant="outline" onClick={resetSession}><RotateCcw className="h-5 w-5" /> Start Over</Button>
                <Button className="w-full gap-2 h-12 rounded-xl bg-transparent" variant="outline" onClick={() => { setSessionCompleteOpen(false); setViewMode("list") }}><ArrowLeft className="h-5 w-5" /> Back to List</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Shadowing */}
        <Dialog open={shadowingOpen} onOpenChange={setShadowingOpen}>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader><DialogTitle className="text-2xl font-bold text-center mb-6">Shadowing Practice</DialogTitle></DialogHeader>
            {currentItem && currentItem.examples.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button size="icon" variant="outline" onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))} disabled={currentSentence === 0} className="rounded-full h-10 w-10"><ChevronLeft className="h-5 w-5" /></Button>
                  <span className="text-sm font-medium">Sentence {currentSentence + 1} / {currentItem.examples.length}</span>
                  <Button size="icon" variant="outline" onClick={() => setCurrentSentence(Math.min(currentItem.examples.length - 1, currentSentence + 1))} disabled={currentSentence === currentItem.examples.length - 1} className="rounded-full h-10 w-10"><ChevronRight className="h-5 w-5" /></Button>
                </div>
                <Card className="p-6 bg-primary-50 border-2 border-border">
                  <p className="text-xl mb-4 text-gray-900">{currentItem.examples[currentSentence]?.en}</p>
                  <p className="text-base text-gray-500">{currentItem.examples[currentSentence]?.vi}</p>
                </Card>
                <div className="flex flex-col items-center gap-4">
                  <Button size="lg" variant={isRecording ? "destructive" : "default"} onClick={() => setIsRecording(!isRecording)} className="h-24 w-24 rounded-full">
                    {isRecording ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                  </Button>
                  <p className="text-sm text-gray-500">{isRecording ? "Recording... Click to stop" : "Click to start recording"}</p>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" className="gap-2 bg-transparent" onClick={() => speakText(currentItem.examples[currentSentence]?.en || "")}><Volume2 className="h-4 w-4" /> Play Original</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Collection */}
        <Dialog open={newCollectionOpen} onOpenChange={setNewCollectionOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create New Collection</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Collection Type</Label>
                <RadioGroup value={newCollectionType} onValueChange={(v) => setNewCollectionType(v as CollectionType)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vocabulary" id="vocab" />
                    <Label htmlFor="vocab" className="flex items-center gap-2 cursor-pointer"><BookOpen className="h-4 w-4" /> Vocabulary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grammar" id="grammar" />
                    <Label htmlFor="grammar" className="flex items-center gap-2 cursor-pointer"><FileText className="h-4 w-4" /> Grammar</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input id="collection-name" placeholder={newCollectionType === "vocabulary" ? "e.g., IELTS Vocabulary" : "e.g., Advanced Tenses"} value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} className="h-11 rounded-xl border-2" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCollectionOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAddCollection} disabled={!newCollectionName.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Word */}
        <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Word</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Word *</Label><Input placeholder="e.g., Accomplish" value={newItem.word} onChange={(e) => setNewItem({ ...newItem, word: e.target.value })} className="h-11 rounded-xl border-2" /></div>
                <div className="space-y-2"><Label>Pronunciation</Label><Input placeholder="e.g., /əˈkʌmplɪʃ/" value={newItem.pronunciation} onChange={(e) => setNewItem({ ...newItem, pronunciation: e.target.value })} className="h-11 rounded-xl border-2" /></div>
              </div>
              <div className="space-y-2"><Label>Meaning (English) - one per line</Label><Textarea placeholder="To complete something successfully" value={newItem.meaning} onChange={(e) => setNewItem({ ...newItem, meaning: e.target.value })} className="min-h-[80px] rounded-xl border-2" /></div>
              <div className="space-y-2"><Label>Vietnamese - one per line</Label><Textarea placeholder="Hoàn thành, đạt được" value={newItem.vietnamese} onChange={(e) => setNewItem({ ...newItem, vietnamese: e.target.value })} className="min-h-[80px] rounded-xl border-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Example (English)</Label><Input placeholder="She accomplished her goals." value={newItem.example} onChange={(e) => setNewItem({ ...newItem, example: e.target.value })} className="h-11 rounded-xl border-2" /></div>
                <div className="space-y-2"><Label>Example (Vietnamese)</Label><Input placeholder="Cô ấy đã hoàn thành mục tiêu." value={newItem.exampleVi} onChange={(e) => setNewItem({ ...newItem, exampleVi: e.target.value })} className="h-11 rounded-xl border-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Part of Speech</Label>
                  <Select value={newItem.partOfSpeech} onValueChange={(v) => setNewItem({ ...newItem, partOfSpeech: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="noun">Noun</SelectItem><SelectItem value="verb">Verb</SelectItem><SelectItem value="adjective">Adjective</SelectItem><SelectItem value="adverb">Adverb</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Level</Label>
                  <Select value={newItem.level} onValueChange={(v) => setNewItem({ ...newItem, level: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="A1">A1</SelectItem><SelectItem value="A2">A2</SelectItem><SelectItem value="B1">B1</SelectItem><SelectItem value="B2">B2</SelectItem><SelectItem value="C1">C1</SelectItem><SelectItem value="C2">C2</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Tags (comma separated)</Label><Input placeholder="business, formal" value={newItem.tags} onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })} className="h-11 rounded-xl border-2" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddItemOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAddItem} disabled={!newItem.word.trim()}>Add Word</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Grammar */}
        <Dialog open={addGrammarOpen} onOpenChange={setAddGrammarOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add Grammar Rule</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title *</Label><Input placeholder="e.g., Present Perfect Tense" value={newGrammar.title} onChange={(e) => setNewGrammar({ ...newGrammar, title: e.target.value })} className="h-11 rounded-xl border-2" /></div>
                <div className="space-y-2"><Label>Category</Label>
                  <Select value={newGrammar.category} onValueChange={(v) => setNewGrammar({ ...newGrammar, category: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Tenses">Tenses</SelectItem><SelectItem value="Conditionals">Conditionals</SelectItem><SelectItem value="Voice">Voice</SelectItem><SelectItem value="Clauses">Clauses</SelectItem><SelectItem value="Speech">Speech</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Rule Formula *</Label><Input placeholder="e.g., Subject + have/has + past participle" value={newGrammar.rule} onChange={(e) => setNewGrammar({ ...newGrammar, rule: e.target.value })} className="h-11 rounded-xl border-2" /></div>
              <div className="space-y-2"><Label>Explanation</Label><Textarea placeholder="Explain when and how to use this grammar rule..." value={newGrammar.explanation} onChange={(e) => setNewGrammar({ ...newGrammar, explanation: e.target.value })} className="min-h-[100px] rounded-xl border-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Example (English)</Label><Input placeholder="I have visited Paris." value={newGrammar.exampleEn} onChange={(e) => setNewGrammar({ ...newGrammar, exampleEn: e.target.value })} className="h-11 rounded-xl border-2" /></div>
                <div className="space-y-2"><Label>Example (Vietnamese)</Label><Input placeholder="Tôi đã đến Paris." value={newGrammar.exampleVi} onChange={(e) => setNewGrammar({ ...newGrammar, exampleVi: e.target.value })} className="h-11 rounded-xl border-2" /></div>
              </div>
              <div className="space-y-2"><Label>Level</Label>
                <Select value={newGrammar.level} onValueChange={(v) => setNewGrammar({ ...newGrammar, level: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="A1">A1</SelectItem><SelectItem value="A2">A2</SelectItem><SelectItem value="B1">B1</SelectItem><SelectItem value="B2">B2</SelectItem><SelectItem value="C1">C1</SelectItem><SelectItem value="C2">C2</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddGrammarOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAddGrammar} disabled={!newGrammar.title.trim() || !newGrammar.rule.trim()}>Add Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Word */}
        <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Word</DialogTitle></DialogHeader>
            {editingItem && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Word</Label><Input value={editingItem.word} onChange={(e) => setEditingItem({ ...editingItem, word: e.target.value })} className="h-11 rounded-xl border-2" /></div>
                  <div className="space-y-2"><Label>Pronunciation</Label><Input value={editingItem.pronunciation} onChange={(e) => setEditingItem({ ...editingItem, pronunciation: e.target.value })} className="h-11 rounded-xl border-2" /></div>
                </div>
                <div className="space-y-2"><Label>Meaning</Label><Textarea value={editingItem.meaning.join("\n")} onChange={(e) => setEditingItem({ ...editingItem, meaning: e.target.value.split("\n").filter(Boolean) })} className="min-h-[80px] rounded-xl border-2" /></div>
                <div className="space-y-2"><Label>Vietnamese</Label><Textarea value={editingItem.vietnamese.join("\n")} onChange={(e) => setEditingItem({ ...editingItem, vietnamese: e.target.value.split("\n").filter(Boolean) })} className="min-h-[80px] rounded-xl border-2" /></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItemOpen(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleEditItem}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Delete Item</DialogTitle></DialogHeader>
            <p className="text-gray-600 py-4">Are you sure you want to delete this item? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="bg-transparent">Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
