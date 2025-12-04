"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "tutor";
  content: string;
}

export function KittyTutor() {
  const { kittyOpen, setKittyOpen } = useAppStore();
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "tutor",
      content:
        "Hi! I'm Kitty, your English learning companion. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const isImmersivePage =
    pathname?.startsWith("/speaking/session/") ||
    (pathname?.startsWith("/vocab/") && pathname !== "/vocab") ||
    (pathname?.startsWith("/grammar/") && pathname !== "/grammar");

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isImmersivePage) {
    return null;
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock tutor response
    setTimeout(() => {
      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "tutor",
        content:
          "That's a great question! Let me help you with that. For now, this is a mock response. In production, this would be powered by AI.",
      };
      setMessages((prev) => [...prev, tutorMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const quickActions = [
    { icon: BookOpen, label: "Vocabulary help" },
    { icon: Lightbulb, label: "Grammar tips" },
    { icon: HelpCircle, label: "Practice ideas" },
  ];

  return (
    <>
      {/* Floating Button - Bigger and styled with primary colors */}
      <button
        onClick={() => setKittyOpen(!kittyOpen)}
        className={`
          fixed bottom-6 right-6 z-50 
          h-16 w-16 rounded-full 
          bg-primary-600 text-white 
          shadow-[4px_4px_0px_0px_rgba(var(--primary-700))] 
          hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(var(--primary-700))]
          active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(var(--primary-700))]
          transition-all duration-200
          flex items-center justify-center
          border-[1.4px] border-primary-600
          ${kittyOpen ? "rotate-0" : ""}
        `}
        aria-label="Open Kitty Tutor"
      >
        {/* Cat face icon */}
        <div className="relative">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
            {/* Cat ears */}
            <path d="M4 4 L7 10 L4 10 Z" />
            <path d="M20 4 L17 10 L20 10 Z" />
            {/* Cat face */}
            <circle cx="12" cy="14" r="8" />
            {/* Eyes */}
            <circle cx="9" cy="13" r="1.5" fill="white" />
            <circle cx="15" cy="13" r="1.5" fill="white" />
            <circle cx="9" cy="13" r="0.7" fill="currentColor" />
            <circle cx="15" cy="13" r="0.7" fill="currentColor" />
            {/* Nose */}
            <path d="M12 15.5 L11 17 L13 17 Z" fill="white" />
            {/* Mouth */}
            <path
              d="M10 18 Q12 19.5 14 18"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
          {/* Sparkle indicator */}
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent-300 animate-pulse" />
        </div>
      </button>

      {/* Chat Panel - Bigger and more decorated */}
      {kittyOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[420px] max-w-[calc(100vw-24px)] rounded-3xl bg-background border-[1.4px] border-primary-200 shadow-[6px_6px_0px_0px_rgba(var(--primary-200))] flex flex-col h-[520px] overflow-hidden">
          {/* Header - Decorated with gradient */}
          <div className="bg-gradient-to-l from-primary-500 to-primary-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Cat avatar */}
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-white"
                    fill="currentColor"
                  >
                    <path d="M4 4 L7 10 L4 10 Z" />
                    <path d="M20 4 L17 10 L20 10 Z" />
                    <circle cx="12" cy="14" r="8" />
                    <circle
                      cx="9"
                      cy="13"
                      r="1.5"
                      fill="currentColor"
                      className="text-primary-500"
                    />
                    <circle
                      cx="15"
                      cy="13"
                      r="1.5"
                      fill="currentColor"
                      className="text-primary-500"
                    />
                    <circle cx="9" cy="13" r="0.5" fill="white" />
                    <circle cx="15" cy="13" r="0.5" fill="white" />
                    <path
                      d="M12 15.5 L11 17 L13 17 Z"
                      className="text-primary-500"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-lg flex items-center gap-2">
                    Kitty Tutor
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                      Online
                    </span>
                  </p>
                  <p className="text-sm text-white/80">
                    Your AI English learning companion
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setKittyOpen(false)}
                aria-label="Close chat"
                className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2 mt-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-primary-50/50 to-background">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "tutor" && (
                  <div className="h-8 w-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-primary-500"
                      fill="currentColor"
                    >
                      <path d="M4 4 L7 10 L4 10 Z" />
                      <path d="M20 4 L17 10 L20 10 Z" />
                      <circle cx="12" cy="14" r="8" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary-500 text-white rounded-br-md shadow-[2px_2px_0px_0px_rgba(var(--primary-700))]"
                      : "bg-white text-foreground rounded-bl-md border border-primary-100 shadow-[2px_2px_0px_0px_rgba(var(--primary-100))]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="h-8 w-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center mr-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-primary-500"
                    fill="currentColor"
                  >
                    <path d="M4 4 L7 10 L4 10 Z" />
                    <path d="M20 4 L17 10 L20 10 Z" />
                    <circle cx="12" cy="14" r="8" />
                  </svg>
                </div>
                <div className="bg-white border border-primary-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full bg-primary-300 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-primary-300 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-primary-300 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Styled to match */}
          <div className="border-t border-primary-100 bg-white p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Kitty anything..."
                className="flex-1 rounded-xl border-[1.4px] border-primary-200 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
                aria-label="Message input"
              />
              <Button
                size="icon"
                onClick={handleSend}
                aria-label="Send message"
                className="h-12 w-12 rounded-xl bg-primary-500 hover:bg-primary-600 shadow-[3px_3px_0px_0px_rgba(var(--primary-700))] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(var(--primary-700))] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(var(--primary-700))] transition-all"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by AI - Your learning companion
            </p>
          </div>
        </div>
      )}
    </>
  );
}
