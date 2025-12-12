"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Volume2 } from 'lucide-react'

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function VocabHelperChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your vocabulary helper. Ask me anything about words, meanings, or how to say something in English!",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    const query = inputValue; // Capture value before clearing
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateResponse(query),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }


  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("happy") || lowerQuery.includes("joy")) {
      return `Here are some alternatives for "Happy":
1. Glad (Easy) - "I am glad to see you."
2. Cheerful (Medium) - "She has a cheerful personality."
3. Ecstatic (Hard) - "He was ecstatic about the news."`
    }

    if (lowerQuery.includes("sad") || lowerQuery.includes("unhappy")) {
      return `Here are some alternatives for "Sad":
1. Upset (Easy) - "Don't be upset about it."
2. Gloomy (Medium) - "The weather is gloomy today."
3. Melancholy (Hard) - "A feeling of deep melancholy pervaded the scene."`
    }

    if (lowerQuery.includes("big") || lowerQuery.includes("large")) {
      return `Here are some alternatives for "Big":
1. Huge (Easy) - "That is a huge building."
2. Massive (Medium) - "The asteroid was massive."
3. Colossal (Hard) - "A colossal failure of judgment."`
    }

    return "I can help you expand your vocabulary! Try asking me for synonyms of common words like 'happy', 'sad', 'big', or 'smart' to see examples ordered by difficulty."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-full bg-transparent border-none sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Vocabulary Helper
            </h3>
            <p className="text-xs text-muted-foreground">Ask me anything!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center border border-border">
                <Bot className="h-3.5 w-3.5 text-green-400" />
              </div>
            )}

            <div className="flex-1 max-w-[240px]">
              <div
                className={`rounded-2xl px-3 py-2 text-[15px] shadow-sm ${
                  message.role === "user"
                    ? "bg-[#4f46e5] text-white"
                    : "bg-white text-foreground border border-border"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {message.role === "assistant" && (
                <button
                  onClick={() => {
                    if ("speechSynthesis" in window) {
                      const utterance = new SpeechSynthesisUtterance(
                        message.content
                      );
                      utterance.lang = "en-US";
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="mt-1 ml-1 w-6 h-6 rounded-full hover:bg-gray-100 text-muted-foreground hover:text-green-600 flex items-center justify-center transition-colors"
                  aria-label="Speak"
                >
                  <Volume2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-border">
              <Bot className="h-3.5 w-3.5 text-green-400" />
            </div>
            <div className="bg-white border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about vocabulary..."
            className="flex-1 text-sm bg-white border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-green-500/50"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim()}
            className="flex-shrink-0 bg-green-600 hover:bg-green-500 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Try: "What does mansion mean?"
        </p>
      </div>
    </Card>
  );
}
