"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { sendDoraraMessage, DoraraChatMessage } from "@/actions/dorara";

const STORAGE_KEY = "dorara-chat-history";
const MAX_MESSAGES = 100;
const INITIAL_MESSAGE: DoraraChatMessage = {
  id: "initial",
  role: "tutor",
  content:
    "Hi there! I'm Dorara, your English learning assistant. How can I help you today?",
};

export function Dorara() {
  const { data: session, status } = useSession();
  const { doraraOpen, setDoraraOpen } = useAppStore();
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<DoraraChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = status === "authenticated" && !!session?.user;

  const isImmersivePage =
    pathname?.startsWith("/speaking/session/") ||
    (pathname?.startsWith("/vocab/") && pathname !== "/vocab") ||
    (pathname?.startsWith("/grammar/") && pathname !== "/grammar");

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages, isInitialized]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Don't render for non-authenticated users or immersive pages
  if (!isAuthenticated || isImmersivePage) {
    return null;
  }

  const isAtLimit = messages.length >= MAX_MESSAGES;

  const handleSend = async () => {
    if (!input.trim()) return;

    // Check message limit
    if (isAtLimit) {
      setShowLimitWarning(true);
      return;
    }

    const userMessage: DoraraChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const currentInput = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Call API with transition for loading state
    startTransition(async () => {
      const result = await sendDoraraMessage(
        messages,
        currentInput,
        pathname || "/"
      );

      if (result.error) {
        // Add error message from tutor
        const errorMessage: DoraraChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "tutor",
          content: result.error,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        // Add tutor response
        const tutorMessage: DoraraChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "tutor",
          content: result.response,
        };
        setMessages((prev) => [...prev, tutorMessage]);
      }
    });
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    setShowLimitWarning(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "Vocabulary help":
        message = "Can you help me learn vocabulary?";
        break;
      case "Grammar tips":
        message = "Give me some tips for learning English grammar!";
        break;
      case "Practice ideas":
        message = "Suggest some effective ways to practice English!";
        break;
    }
    if (message) {
      setInput(message);
    }
  };

  // Handle opening the chat with animation
  const handleOpenChat = () => {
    setIsAnimating(true);
    setDoraraOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Handle closing the chat with animation
  const handleCloseChat = () => {
    setIsAnimating(true);
    setDoraraOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const quickActions = [
    { icon: BookOpen, label: "Vocabulary help" },
    { icon: Lightbulb, label: "Grammar tips" },
    { icon: HelpCircle, label: "Practice ideas" },
  ];

  return (
    <>
      {/* Floating Button - Only visible when chat is closed */}
      {!doraraOpen && (
        <button
          onClick={handleOpenChat}
          className={`
            fixed bottom-6 right-6 z-50 
            h-16 w-16 rounded-full 
            bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 
            shadow-[4px_4px_0px_0px_rgba(161,98,7,0.6)] 
            hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(161,98,7,0.6)]
            active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(161,98,7,0.6)]
            flex items-center justify-center
            border-2 border-yellow-600
            animate-in fade-in zoom-in-95 duration-300
          `}
          aria-label="Open Dorara"
        >
          {/* Doraemon Bell Icon */}
          <div className="relative">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none">
              {/* Bell ring/hook at top */}
              <circle
                cx="12"
                cy="4"
                r="2"
                fill="#92400e"
                stroke="#78350f"
                strokeWidth="0.5"
              />
              {/* Main bell body */}
              <ellipse
                cx="12"
                cy="13"
                rx="8"
                ry="9"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1"
              />
              {/* Horizontal line across bell */}
              <line
                x1="4"
                y1="16"
                x2="20"
                y2="16"
                stroke="#92400e"
                strokeWidth="1.5"
              />
              {/* Bell clapper/bottom circle */}
              <circle
                cx="12"
                cy="20"
                r="2"
                fill="#92400e"
                stroke="#78350f"
                strokeWidth="0.5"
              />
              {/* Shine effect */}
              <ellipse
                cx="8"
                cy="10"
                rx="1.5"
                ry="2"
                fill="white"
                opacity="0.4"
              />
            </svg>
            {/* Sparkle indicator */}
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-white animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {doraraOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-24px)] rounded-3xl bg-white border-[1.4px] border-primary-200 shadow-[6px_6px_0px_0px_rgba(var(--primary-200))] flex flex-col h-[520px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-l from-primary-500 to-primary-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Bell avatar */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-600 flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                    <circle cx="12" cy="4" r="2" fill="#92400e" />
                    <ellipse
                      cx="12"
                      cy="13"
                      rx="8"
                      ry="9"
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <line
                      x1="4"
                      y1="16"
                      x2="20"
                      y2="16"
                      stroke="#92400e"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="20" r="2" fill="#92400e" />
                    <ellipse
                      cx="8"
                      cy="10"
                      rx="1.5"
                      ry="2"
                      fill="white"
                      opacity="0.4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-lg flex items-center gap-2">
                    Dorara
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                      Online
                    </span>
                  </p>
                  <p className="text-sm text-white/80">
                    Your AI English Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* New chat button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearHistory}
                  aria-label="New chat"
                  className="text-white/70 hover:text-white hover:bg-white/20 rounded-full h-9 w-9"
                  title="New Chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseChat}
                  aria-label="Close chat"
                  className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2 mt-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message limit warning */}
          {showLimitWarning && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-700 text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>
                Message limit of {MAX_MESSAGES} reached. Please start a new chat
                to continue.
              </span>
              <button
                onClick={handleClearHistory}
                className="ml-auto text-amber-600 hover:text-amber-800 font-medium underline"
              >
                New Chat
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "tutor" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border border-yellow-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <circle cx="12" cy="4" r="2" fill="#92400e" />
                      <ellipse
                        cx="12"
                        cy="13"
                        rx="8"
                        ry="9"
                        fill="#fbbf24"
                        stroke="#d97706"
                        strokeWidth="0.8"
                      />
                      <line
                        x1="4"
                        y1="16"
                        x2="20"
                        y2="16"
                        stroke="#92400e"
                        strokeWidth="1.2"
                      />
                      <circle cx="12" cy="20" r="2" fill="#92400e" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary-500 text-white rounded-br-md shadow-[2px_2px_0px_0px_rgba(var(--primary-700))]"
                      : "bg-background text-foreground rounded-bl-md border border-primary-100 shadow-[2px_2px_0px_0px_rgba(var(--primary-100))]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border border-yellow-600 flex items-center justify-center mr-2 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <circle cx="12" cy="4" r="2" fill="#92400e" />
                    <ellipse
                      cx="12"
                      cy="13"
                      rx="8"
                      ry="9"
                      fill="#fbbf24"
                      stroke="#d97706"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="4"
                      y1="16"
                      x2="20"
                      y2="16"
                      stroke="#92400e"
                      strokeWidth="1.2"
                    />
                    <circle cx="12" cy="20" r="2" fill="#92400e" />
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

          {/* Input */}
          <div className="border-t border-primary-100 bg-white p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isPending && handleSend()
                }
                placeholder="Ask Dorara anything..."
                disabled={isPending}
                className="flex-1 rounded-xl border-[1.4px] border-primary-200 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all disabled:opacity-50"
                aria-label="Message input"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isPending || !input.trim()}
                aria-label="Send message"
                className="h-12 w-12 rounded-xl bg-primary-500 hover:bg-primary-600 shadow-[3px_3px_0px_0px_rgba(var(--primary-700))] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(var(--primary-700))] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(var(--primary-700))] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {messages.length}/{MAX_MESSAGES} messages
            </p>
          </div>
        </div>
      )}
    </>
  );
}
