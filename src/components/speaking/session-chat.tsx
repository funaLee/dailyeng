"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Turn {
  id: string;
  role: "user" | "tutor";
  text: string;
  timestamp: Date;
  scores?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    content?: number;
  };
}

interface SessionChatProps {
  turns: Turn[];
  isRecording: boolean;
  onToggleRecording: () => void;
  onSendMessage: (text: string) => void;
}

export function SessionChat({
  turns,
  isRecording,
  onToggleRecording,
  onSendMessage,
}: SessionChatProps) {
  const [userInput, setUserInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const handleSend = () => {
    if (!userInput.trim()) return;
    onSendMessage(userInput);
    setUserInput("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={`flex ${
              turn.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${
                turn.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-secondary text-secondary-foreground rounded-bl-none"
              }`}
            >
              <p className="text-sm">{turn.text}</p>

              {/* Scores */}
              {turn.scores && (
                <div className="mt-2 pt-2 border-t border-current/20 grid grid-cols-4 gap-1 text-xs">
                  {turn.scores.pronunciation && (
                    <div>
                      <p className="font-semibold">
                        {turn.scores.pronunciation}
                      </p>
                      <p className="opacity-75">Pron.</p>
                    </div>
                  )}
                  {turn.scores.fluency && (
                    <div>
                      <p className="font-semibold">{turn.scores.fluency}</p>
                      <p className="opacity-75">Flu.</p>
                    </div>
                  )}
                  {turn.scores.grammar && (
                    <div>
                      <p className="font-semibold">{turn.scores.grammar}</p>
                      <p className="opacity-75">Gram.</p>
                    </div>
                  )}
                  {turn.scores.content && (
                    <div>
                      <p className="font-semibold">{turn.scores.content}</p>
                      <p className="opacity-75">Cont.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 flex gap-1">
                <button
                  onClick={() => handleSpeak(turn.text)}
                  className="p-1 hover:bg-white/20 rounded"
                  aria-label="Speak"
                >
                  <Volume2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleCopy(turn.text, turn.id)}
                  className="p-1 hover:bg-white/20 rounded"
                  aria-label="Copy"
                >
                  {copiedId === turn.id ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your response..."
            className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isRecording}
          />
          <Button
            onClick={handleSend}
            disabled={!userInput.trim() || isRecording}
            size="sm"
          >
            Send
          </Button>
        </div>

        <Button
          onClick={onToggleRecording}
          variant={isRecording ? "destructive" : "outline"}
          className="w-full gap-2"
        >
          {isRecording ? (
            <>
              <MicOff className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Start Speaking
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
