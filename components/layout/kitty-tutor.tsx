"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface Message {
  id: string
  role: "user" | "tutor"
  content: string
}

export function KittyTutor() {
  const { kittyOpen, setKittyOpen } = useAppStore()
  const pathname = usePathname()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "tutor",
      content: "Hi! I'm Kitty, your English learning companion. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")

  const isImmersivePage =
    pathname?.startsWith("/speaking/session/") ||
    (pathname?.startsWith("/vocab/") && pathname !== "/vocab") ||
    (pathname?.startsWith("/grammar/") && pathname !== "/grammar")

  if (isImmersivePage) {
    return null
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Mock tutor response
    setTimeout(() => {
      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "tutor",
        content:
          "That's a great question! Let me help you with that. For now, this is a mock response. In production, this would be powered by AI.",
      }
      setMessages((prev) => [...prev, tutorMessage])
    }, 500)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setKittyOpen(!kittyOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        aria-label="Open Kitty Tutor"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Panel */}
      {kittyOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-24px)] rounded-2xl bg-background border border-border shadow-xl flex flex-col h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              <div>
                <p className="font-semibold text-sm">Kitty Tutor</p>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setKittyOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Kitty..."
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Message input"
            />
            <Button size="icon" onClick={handleSend} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
