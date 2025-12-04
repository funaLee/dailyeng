import { http, HttpResponse } from "msw"
import { mockTopics, mockVocab, mockQuizzes, mockSpeakingScenarios } from "@/lib/mock-data"

export const handlers = [
  // Topics
  http.get("/api/topics", () => {
    return HttpResponse.json(mockTopics)
  }),

  http.get("/api/topics/:id", ({ params }) => {
    const topic = mockTopics.find((t) => t.id === params.id)
    return topic ? HttpResponse.json(topic) : HttpResponse.json(null, { status: 404 })
  }),

  http.post("/api/topics", async ({ request }) => {
    const data = await request.json()
    return HttpResponse.json({ ...data, id: Date.now().toString() }, { status: 201 })
  }),

  // Vocabulary
  http.get("/api/vocab", ({ request }) => {
    const url = new URL(request.url)
    const topicId = url.searchParams.get("topicId")
    const items = topicId ? mockVocab[topicId] || [] : []
    return HttpResponse.json(items)
  }),

  // Quizzes
  http.get("/api/quizzes", ({ request }) => {
    const url = new URL(request.url)
    const topicId = url.searchParams.get("topicId")
    const items = topicId ? mockQuizzes[topicId] || [] : []
    return HttpResponse.json(items)
  }),

  http.post("/api/quizzes/submit", async ({ request }) => {
    const { topicId, answers } = await request.json()
    const questions = mockQuizzes[topicId] || []
    let correct = 0

    const feedback: Record<string, boolean> = {}
    for (const q of questions) {
      const isCorrect = answers[q.id] === q.correctAnswer
      feedback[q.id] = isCorrect
      if (isCorrect) correct++
    }

    const score = Math.round((correct / questions.length) * 100)
    const xp = correct * 10

    return HttpResponse.json({ score, xp, feedback }, { status: 200 })
  }),

  // Speaking
  http.get("/api/speaking/library", () => {
    return HttpResponse.json(Object.values(mockSpeakingScenarios).flat())
  }),

  http.post("/api/ai/create-topic", async ({ request }) => {
    const { prompt } = await request.json()
    return HttpResponse.json(
      {
        id: Date.now().toString(),
        topicId: "custom",
        title: "Custom Scenario",
        description: prompt,
        goal: "Practice conversation",
        context: "Generated from your prompt",
      },
      { status: 201 },
    )
  }),

  http.post("/api/speaking/submit-turn", async ({ request }) => {
    const { sessionId, text } = await request.json()
    const responses = [
      "That's great! Can you tell me more about that?",
      "I understand. What else would you like to share?",
      "Excellent pronunciation! Let's continue.",
      "Good effort! Remember to speak more slowly.",
    ]
    return HttpResponse.json({
      response: responses[Math.floor(Math.random() * responses.length)],
      scores: {
        pronunciation: Math.floor(Math.random() * 40) + 60,
        fluency: Math.floor(Math.random() * 40) + 60,
        grammar: Math.floor(Math.random() * 40) + 60,
        content: Math.floor(Math.random() * 40) + 60,
      },
    })
  }),

  // Flashcards
  http.get("/api/flashcards", () => {
    return HttpResponse.json([])
  }),

  http.post("/api/flashcards", async ({ request }) => {
    const data = await request.json()
    return HttpResponse.json({ ...data, id: Date.now().toString(), createdAt: new Date() }, { status: 201 })
  }),

  // SRS
  http.get("/api/srs/queue", () => {
    return HttpResponse.json([])
  }),

  http.post("/api/srs/review", async ({ request }) => {
    const { cardId, quality } = await request.json()
    return HttpResponse.json({
      nextReviewDate: new Date(),
      interval: 1,
      easeFactor: 2.5,
    })
  }),

  // Plan
  http.post("/api/plan/setup", async ({ request }) => {
    const data = await request.json()
    return HttpResponse.json({ ...data, id: Date.now().toString(), createdAt: new Date() }, { status: 201 })
  }),

  // AI
  http.post("/api/ai/translate", async ({ request }) => {
    const { text, targetLang } = await request.json()
    return HttpResponse.json({
      translation: `Translated to ${targetLang}`,
      feedback: {
        meaning: "Accurate translation",
        grammar: "Correct grammar",
        style: "Natural phrasing",
      },
    })
  }),

  http.post("/api/ai/feedback", async ({ request }) => {
    const { text, type } = await request.json()
    return HttpResponse.json({
      pronunciation: type === "speaking" ? Math.floor(Math.random() * 40) + 60 : undefined,
      fluency: type === "speaking" ? Math.floor(Math.random() * 40) + 60 : undefined,
      grammar: Math.floor(Math.random() * 40) + 60,
      content: Math.floor(Math.random() * 40) + 60,
      suggestions: ["Try to speak more clearly", "Good vocabulary usage"],
    })
  }),
]
