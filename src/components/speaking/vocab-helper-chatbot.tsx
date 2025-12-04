"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Volume2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function VocabHelperChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your vocabulary helper. Ask me anything about words, meanings, or how to say something in English!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("how to say") ||
      lowerQuery.includes("how do i say")
    ) {
      return "To express that concept, you could say: 'I prefer a cozy cottage over a large mansion.' Or you might use: 'I'd rather have a comfortable home than a spacious one.'";
    }

    if (
      lowerQuery.includes("meaning") ||
      lowerQuery.includes("what does") ||
      lowerQuery.includes("define")
    ) {
      return "'Mansion' means a very large and impressive house. Example: 'They live in a beautiful mansion with a swimming pool.' In Vietnamese: 'dinh thự' or 'biệt thự lớn'.";
    }

    if (lowerQuery.includes("synonym") || lowerQuery.includes("another word")) {
      return "Here are some alternatives: 'cottage' → small house, bungalow, cabin. 'Mansion' → estate, manor, villa, palace.";
    }

    if (lowerQuery.includes("example") || lowerQuery.includes("sentence")) {
      return "Here's an example sentence: 'My dream house would be a cozy cottage surrounded by a beautiful garden.' You could also say: 'I've always wanted to live in a mansion with many rooms.'";
    }

    // Default response
    return "I can help you with vocabulary! Try asking me: 'What does [word] mean?', 'How do I say [phrase] in English?', 'Give me an example with [word]', or 'What's another word for [word]?'";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[800px]">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Bot className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Vocabulary Helper</h3>
            <p className="text-xs text-muted-foreground">Ask me anything!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
            )}

            <div className="flex-1 max-w-[220px]">
              <div
                className={`rounded-2xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
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
                  className="mt-1 ml-2 w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                  aria-label="Speak"
                >
                  <Volume2 className="h-3 w-3 text-green-600" />
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-green-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-3 py-2">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about vocabulary..."
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!inputValue.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Try: "What does mansion mean?" or "How do I say..."
        </p>
      </div>
    </Card>
  );
}
