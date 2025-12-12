"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SessionChat } from "@/components/speaking/session-chat"
import { RadarChart } from "@/components/speaking/radar-chart"
import { LearningHistory } from "@/components/speaking/learning-history"
import { DetailedFeedback } from "@/components/speaking/detailed-feedback"
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Download,
  Menu,
  Play,
  RotateCcw,
  User,
  Bot,
  Volume2,
  Copy,
  Check,
  Mic,
  MoreVertical,
  RefreshCw,
  MicOff,
  Target,
  Mic2,
  AudioWaveform as Waveform,
  Zap,
  Languages,
  Sparkles,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import VocabHelperChatbot from "@/components/speaking/vocab-helper-chatbot";
import {
  createSession,
  startSessionWithGreeting,
  submitTurn,
  getSessionSummary,
  getDetailedFeedback,
} from "@/actions/speaking";

// Types
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

type ViewState = "preparation" | "active" | "complete" | "history" | "detail";

export interface LearningRecord {
  id: string;
  overallScore: number;
  completedTurns: number;
  totalTurns: number;
  date: Date;
}

export interface DetailedFeedbackScore {
  label: string;
  value: number;
  // Note: icon is rendered in client based on label
}

export interface ErrorCategory {
  name: string;
  count: number;
}

export interface ConversationItem {
  role: "tutor" | "user";
  text: string;
  userErrors?: Array<{
    word: string;
    correction: string;
    type: string;
  }>;
  correctedSentence?: string;
  audioUrl?: string;
}

export interface DetailedFeedbackData {
  scores: DetailedFeedbackScore[];
  errorCategories: ErrorCategory[];
  conversation: ConversationItem[];
  overallRating: string;
  tip: string;
}

export interface ScenarioData {
  id: string;
  title: string;
  description?: string;
  context?: string;
  goal?: string;
  objectives?: string[];
  // Role definitions
  userRole?: string;
  botRole?: string;
  openingLine?: string;
}

export interface InitialTurn {
  id: string;
  role: "user" | "tutor";
  text: string;
  timestamp: string; // ISO string for serialization
  scores?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    content?: number;
  };
}

export interface SpeakingSessionClientProps {
  scenarioId: string;
  scenario: ScenarioData | null;
  initialTurns: InitialTurn[];
  learningRecords: LearningRecord[];
  detailedFeedback: DetailedFeedbackData;
}

// Helper function to get icon based on label
function getScoreIcon(label: string): React.ReactNode {
  switch (label) {
    case "Relevance":
      return <Target className="h-4 w-4" />;
    case "Pronunciation":
      return <Mic2 className="h-4 w-4" />;
    case "Intonation & Stress":
      return <Waveform className="h-4 w-4" />;
    case "Fluency":
      return <Zap className="h-4 w-4" />;
    case "Grammar":
      return <Languages className="h-4 w-4" />;
    default:
      return <Target className="h-4 w-4" />;
  }
}

export default function SpeakingSessionClient({
  scenarioId,
  scenario,
  initialTurns,
  learningRecords,
  detailedFeedback,
}: SpeakingSessionClientProps) {
  const router = useRouter();
  const { addFlashcard, addXP } = useAppStore();

  // Convert serialized dates back to Date objects
  const [turns, setTurns] = useState<Turn[]>(
    initialTurns.map((t) => ({ ...t, timestamp: new Date(t.timestamp) }))
  );
  const [isRecording, setIsRecording] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("preparation");
  const [sessionStats, setSessionStats] = useState({
    avgPronunciation: 0,
    avgFluency: 0,
    avgGrammar: 0,
    avgContent: 0,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [dynamicFeedback, setDynamicFeedback] =
    useState<DetailedFeedbackData | null>(null);
  const [aiSummary, setAiSummary] = useState<any | null>(null);
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const conversationRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noSpeechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    calculateStats(turns);
  }, [turns]);

  // Fetch AI Summary when session is complete
  useEffect(() => {
    if (viewState === "complete" && sessionId && !aiSummary) {
      getSessionSummary(sessionId)
        .then((data) => {
          if (data) setAiSummary(data);
        })
        .catch((err) => console.error("Failed to get session summary:", err));
    }
  }, [viewState, sessionId, aiSummary]);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [turns]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          // Clear the no-speech timeout since we got some speech
          if (noSpeechTimeoutRef.current) {
            clearTimeout(noSpeechTimeoutRef.current);
            noSpeechTimeoutRef.current = null;
          }

          // Get the latest transcript
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          // Update stored transcript
          if (finalTranscript) {
            transcriptRef.current += finalTranscript;
          }

          // Reset silence timeout - user is still speaking
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }

          // Set 5s silence timeout to send message
          silenceTimeoutRef.current = setTimeout(() => {
            if (transcriptRef.current.trim()) {
              const message = transcriptRef.current.trim();
              transcriptRef.current = "";
              recognitionRef.current?.stop();
              setIsRecording(false);
              handleSendMessage(message);
            }
          }, 5000);
        };

        recognitionRef.current.onerror = (event: any) => {
          // Clear all timeouts
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
          if (noSpeechTimeoutRef.current) {
            clearTimeout(noSpeechTimeoutRef.current);
            noSpeechTimeoutRef.current = null;
          }

          setIsRecording(false);
          // Handle different error types gracefully
          switch (event.error) {
            case "no-speech":
              // User didn't say anything - just turn off mic quietly
              console.log("No speech detected, turning off mic");
              break;
            case "audio-capture":
              toast.error("No microphone found. Please connect a microphone.");
              break;
            case "not-allowed":
              toast.error(
                "Microphone permission denied. Please allow microphone access."
              );
              break;
            case "aborted":
              // User cancelled - no need to show error
              break;
            default:
              console.error("Speech recognition error:", event.error);
              toast.error("Microphone error. Please try typing instead.");
          }
        };

        recognitionRef.current.onend = () => {
          // Clear all timeouts
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
          if (noSpeechTimeoutRef.current) {
            clearTimeout(noSpeechTimeoutRef.current);
            noSpeechTimeoutRef.current = null;
          }

          // If there's remaining transcript, send it
          if (transcriptRef.current.trim()) {
            const message = transcriptRef.current.trim();
            transcriptRef.current = "";
            handleSendMessage(message);
          }

          setIsRecording(false);
        };
      }
    }

    // Cleanup on unmount
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (noSpeechTimeoutRef.current) {
        clearTimeout(noSpeechTimeoutRef.current);
      }
    };
  }, [sessionId]);

  const startSession = async () => {
    try {
      // TODO: Get real userId from auth
      const userId = "user-1";
      const result = await startSessionWithGreeting(userId, scenarioId);
      setSessionId(result.session.id);
      setViewState("active");

      // Display initial messages: context info + opening greeting
      const initialTurns: Turn[] = [];

      // Message 1: Context info (displayed as system message)
      if (result.contextMessage) {
        initialTurns.push({
          id: "context-info",
          role: "tutor",
          text: `📍 *Scenario:* ${result.contextMessage}`,
          timestamp: new Date(),
        });
      }

      // Message 2: Opening greeting from bot
      if (result.greetingMessage && result.greetingTurnId) {
        initialTurns.push({
          id: result.greetingTurnId,
          role: "tutor",
          text: result.greetingMessage,
          timestamp: new Date(),
        });

        // Speak the opening greeting
        speakText(result.greetingMessage);
      }

      setTurns(initialTurns);
    } catch (e) {
      console.error("Failed to start session", e);
      toast.error("Failed to start session");
    }
  };

  // Reset stats when recording starts
  useEffect(() => {
    if (isRecording) {
      setSessionStats({
        avgPronunciation: 0,
        avgFluency: 0,
        avgGrammar: 0,
        avgContent: 0,
      });
    }
  }, [isRecording]);

  const calculateStats = (allTurns: Turn[]) => {
    // Find the latest user turn with scores for "Live Analysis"
    // We reverse to find the last one added
    const latestTurn = [...allTurns]
      .reverse()
      .find((t) => t.role === "user" && t.scores);

    if (latestTurn && latestTurn.scores) {
      setSessionStats({
        avgPronunciation: latestTurn.scores.pronunciation || 0,
        avgFluency: latestTurn.scores.fluency || 0,
        avgGrammar: latestTurn.scores.grammar || 0,
        avgContent: latestTurn.scores.content || 0,
      });
    }
  };

  const handleToggleRecording = () => {
    if (!sessionId) {
      toast.error("Session not started");
      return;
    }

    if (isRecording) {
      // Clear timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      if (noSpeechTimeoutRef.current) {
        clearTimeout(noSpeechTimeoutRef.current);
        noSpeechTimeoutRef.current = null;
      }
      recognitionRef.current?.stop();
      // isRecording set to false in onend
    } else {
      try {
        transcriptRef.current = "";
        recognitionRef.current?.start();
        setIsRecording(true);

        // Set 10s no-speech timeout - if user doesn't speak at all, turn off mic
        noSpeechTimeoutRef.current = setTimeout(() => {
          if (isRecording && !transcriptRef.current.trim()) {
            console.log("No speech after 10s, turning off mic");
            recognitionRef.current?.stop();
          }
        }, 10000);
      } catch (e) {
        console.error("Failed to start recording", e);
        toast.error("Could not start microphone");
      }
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      // Try to select a better voice
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find((v) =>
        v.name.includes("Google US English")
      );
      if (googleVoice) utterance.voice = googleVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!sessionId || !text.trim()) return;

    setIsProcessing(true);

    // Optimistically add user turn
    const tempId = `temp-${Date.now()}`;
    const userTurn: Turn = {
      id: tempId,
      role: "user",
      text,
      timestamp: new Date(),
    };

    setTurns((prev) => [...prev, userTurn]);

    try {
      const result = await submitTurn(sessionId, text);

      // Update user turn with real ID and scores
      setTurns((prev) =>
        prev.map((t) =>
          t.id === tempId
            ? {
                ...t,
                id: `turn-${Date.now()}`, // In real app, we get this from DB, but action returns turnId?
                // Wait, action currently returns { aiResponse, scores, errors, turnId }.
                // Does it return USER turn ID? The action saves user turn, then AI turn.
                // I should update action to return both or just refetch.
                // For now, I'll update scores.
                scores: result.scores as any,
              }
            : t
        )
      );

      // Add AI turn
      const aiTurn: Turn = {
        id: result.turnId, // This is AI turn ID
        role: "tutor",
        text: result.aiResponse,
        timestamp: new Date(),
      };
      setTurns((prev) => [...prev, aiTurn]);

      speakText(result.aiResponse);
    } catch (e) {
      console.error("Submit turn error", e);
      toast.error("Failed to process message");
      // Remove temp turn?
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractWords = () => {
    // Use AI extracted words if available, otherwise use mock/fallback
    const wordsToSave =
      aiSummary?.newWords && aiSummary.newWords.length > 0
        ? aiSummary.newWords
        : [
            {
              word: "preference",
              definition: "a greater liking for one alternative over another",
              example: "I have a preference for tea over coffee.",
            },
            {
              word: "confirm",
              definition: "to establish the truth or correctness of something",
              example: "Can you confirm your reservation?",
            },
            {
              word: "booking",
              definition: "a reservation or arrangement",
              example: "I made a booking for dinner.",
            },
          ];

    wordsToSave.forEach((item: any) => {
      addFlashcard({
        id: `fc-${Date.now()}-${Math.random()}`,
        front: item.word,
        back: `${item.definition || item.meaning}\n\nExample: ${
          item.example || 'Used in speaking session "' + scenario?.title + '"'
        }`,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastReviewDate: new Date(),
      });
    });

    toast.success(`${wordsToSave.length} new words added to your flashcards!`);
  };

  const handleDownloadTranscript = () => {
    const transcript = turns
      .map((turn) => `${turn.role === "user" ? "You" : "Tutor"}: ${turn.text}`)
      .join("\n\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`
    );
    element.setAttribute("download", `${scenario?.title}-transcript.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setViewState("detail");
  };

  // Build detailed feedback from turns data
  const handleViewDetailedFeedback = async () => {
    if (!sessionId) {
      toast.error("No session ID found");
      return;
    }

    setIsLoadingFeedback(true);
    setViewState("detail");

    try {
      const data = await getDetailedFeedback(sessionId);

      // Transform server data to client format
      const clientData: DetailedFeedbackData = {
        ...data,
        scores: [
          { label: "Relevance", value: data.scores.relevance },
          { label: "Pronunciation", value: data.scores.pronunciation },
          { label: "Intonation & Stress", value: data.scores.intonation },
          { label: "Fluency", value: data.scores.fluency },
          { label: "Grammar", value: data.scores.grammar },
        ],
      };

      setDynamicFeedback(clientData);
    } catch (error) {
      console.error("Failed to fetch detailed feedback:", error);
      toast.error("Failed to generate detailed feedback. Please try again.");
      setViewState("complete"); // Go back if failed
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Transform scores with icons for DetailedFeedback component
  const scoresWithIcons = detailedFeedback.scores.map((s) => ({
    ...s,
    icon: getScoreIcon(s.label),
  }));

  if (!scenario) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (viewState === "history") {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <LearningHistory
          records={learningRecords}
          onSelectRecord={handleSelectRecord}
          onBack={() => setViewState("preparation")}
        />
      </div>
    );
  }

  if (viewState === "detail") {
    // Use dynamic feedback if available, otherwise fall back to prop
    const feedbackToUse = dynamicFeedback || detailedFeedback;

    // Build scores with icons
    const detailScoresWithIcons = feedbackToUse.scores.map((s) => ({
      ...s,
      icon: getScoreIcon(s.label),
    }));

    if (isLoadingFeedback) {
      return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-16 text-center border-0 shadow-2xl bg-white rounded-[3rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-50 via-transparent to-transparent opacity-70" />
            <div className="relative z-10">
              <div className="relative mx-auto mb-8 w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                <Bot className="absolute inset-0 m-auto h-8 w-8 text-primary-500 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-slate-800">
                Analyzing Your Session...
              </h2>
              <p className="text-lg text-slate-500 max-w-md mx-auto">
                AI is reviewing your conversation context, vocabulary, and
                grammar to provide detailed feedback.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <DetailedFeedback
          scores={detailScoresWithIcons}
          errorCategories={feedbackToUse.errorCategories}
          conversation={feedbackToUse.conversation}
          overallRating={feedbackToUse.overallRating}
          tip={feedbackToUse.tip}
          onBack={() => setViewState(selectedRecordId ? "history" : "complete")}
        />
      </div>
    );
  }

  if (viewState === "preparation") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/speaking">
          <Button variant="outline" className="gap-2 mb-6 bg-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        {/* Similar content as before but button calls startSession() */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-8 space-y-8 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Learning Goals</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-400 text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </span>
                  <p className="p-4 bg-primary-50 rounded-xl flex-1">
                    {scenario.goal || "Practice conversation skill"}
                  </p>
                </div>
                {scenario.objectives && scenario.objectives.length > 0 ? (
                  scenario.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-400 text-white flex items-center justify-center font-semibold text-sm">
                        {idx + 2}
                      </span>
                      <p className="p-4 bg-primary-50 rounded-xl flex-1">
                        {obj}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                        2
                      </span>
                      <p className="p-4 bg-primary-50 rounded-xl flex-1">
                        Improve vocabulary
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                        3
                      </span>
                      <p className="p-4 bg-primary-50 rounded-xl flex-1">
                        Enhance fluency
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold">Context</h2>
            <div className="p-4 bg-primary-50 rounded-xl text-sm italic">
              {scenario.context}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 bg-white">
              <div className="aspect-video bg-linear-to-br from-primary-200 to-primary-300 rounded-2xl mb-6 relative overflow-hidden">
                <Image
                  src="/learning.png"
                  alt={scenario.title}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              <h1 className="text-3xl font-bold mb-4">{scenario.title}</h1>
              <p className="text-muted-foreground mt-2">
                {scenario.description || scenario.context}
              </p>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={startSession}
                  className="flex-1 gap-2 text-lg py-6"
                  size="lg"
                >
                  <Play className="h-5 w-5" />
                  Start Speaking
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 bg-transparent"
                  onClick={() => setViewState("history")}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === "active") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 h-screen max-h-screen flex flex-col">
        {/* Quit Confirmation Dialog */}
        {showQuitDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-center mb-6">
                Are you sure you want to end this conversation?
              </h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowQuitDialog(false)}
                >
                  Continue
                </Button>
                <Button
                  className="w-full bg-[#4f46e5] hover:bg-[#4338ca]"
                  onClick={() => {
                    setShowQuitDialog(false);
                    setViewState("complete");
                  }}
                >
                  Finish
                </Button>
                <Link href="/speaking" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-center justify-center z-10 shrink-0 relative">
          {/* Menu Button */}
          <button
            onClick={() => setShowQuitDialog(true)}
            className="absolute left-0 w-10 h-10 rounded-full bg-[#e0e7ff] flex items-center justify-center hover:bg-[#c7d2fe] transition-colors"
          >
            <Menu className="h-5 w-5 text-[#4b3fd4]" />
          </button>
          <h1 className="text-2xl font-bold text-center">{scenario.title}</h1>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0 pb-4">
          <div className="lg:col-span-8 rounded-3xl border-2 border-border bg-primary-100 flex flex-col overflow-hidden relative shadow-2xl">
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none"
              ref={conversationRef}
            >
              {turns.map((turn) => (
                <div
                  key={turn.id}
                  className={`flex ${
                    turn.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex gap-3 max-w-2xl group">
                    {turn.role === "tutor" && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md border border-border">
                        <Bot className="h-4 w-4 text-[#4f46e5]" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div
                        className={`rounded-2xl px-3 py-2 shadow-md backdrop-blur-sm text-[15px] ${
                          turn.role === "user"
                            ? "bg-[#4f46e5] text-white rounded-tr-sm"
                            : "bg-white text-foreground border border-border rounded-tl-sm"
                        }`}
                      >
                        <p className="leading-relaxed">{turn.text}</p>
                      </div>
                      <div
                        className={`flex gap-2 mt-1 px-1 ${
                          turn.role === "user" ? "justify-end" : "justify-start"
                        } opacity-0 group-hover:opacity-100 transition-opacity`}
                      >
                        <button
                          onClick={() => speakText(turn.text)}
                          className="p-1.5 hover:bg-slate-700 rounded-full text-slate-500 hover:text-blue-400 transition-colors"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {turn.role === "user" && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-[#4f46e5] flex items-center justify-center text-white shadow-md">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 bg-white border border-border p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      Tutor is thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border bg-white/80 backdrop-blur-xl absolute bottom-0 w-full z-10">
              <div className="flex justify-center items-center">
                <button
                  onClick={handleToggleRecording}
                  className={`relative w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? "bg-[#818cf8] shadow-lg shadow-[#818cf8]/20 scale-110 ring-4 ring-[#818cf8]/30"
                      : "bg-[#4f46e5] shadow-lg shadow-[#4f46e5]/20 hover:scale-105 hover:bg-[#4338ca]"
                  } text-white group`}
                >
                  <Mic
                    className={`h-6 w-6 ${isRecording ? "animate-pulse" : ""}`}
                  />

                  {/* Ripple effect when recording */}
                  {isRecording && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#818cf8] opacity-20 animate-ping"></span>
                  )}
                </button>
              </div>
            </div>
            {/* Spacer for input area since it's absolute */}
            <div className="h-[100px] shrink-0" />
          </div>

          {/* Sidebar - 4 Columns (Full height stack) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
            {/* Live Analysis Card */}
            <div className="rounded-3xl border-2 border-border p-6 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Waveform className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-foreground">Live Analysis</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Pronunciation</span>
                    <span className="text-blue-400">
                      {sessionStats.avgPronunciation}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${sessionStats.avgPronunciation * 10}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Grammar</span>
                    <span className="text-green-400">
                      {sessionStats.avgGrammar}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${sessionStats.avgGrammar * 10}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Fluency</span>
                    <span className="text-orange-400">
                      {sessionStats.avgFluency}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${sessionStats.avgFluency * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vocab Helper - Fills remaining space */}
            <div className="flex-1 min-h-0 rounded-3xl overflow-hidden shadow-xl bg-white border-2 border-border backdrop-blur-md">
              <VocabHelperChatbot />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === "complete") {
    // Calculate averages from all turns for the summary
    const allScores = turns.filter((t) => t.scores);

    let finalStats = {
      avgPronunciation: 0,
      avgFluency: 0,
      avgGrammar: 0,
      avgContent: 0,
    };

    if (allScores.length > 0) {
      finalStats = {
        avgPronunciation:
          allScores.reduce(
            (sum, t) => sum + (t.scores?.pronunciation || 0),
            0
          ) / allScores.length,
        avgFluency:
          allScores.reduce((sum, t) => sum + (t.scores?.fluency || 0), 0) /
          allScores.length,
        avgGrammar:
          allScores.reduce((sum, t) => sum + (t.scores?.grammar || 0), 0) /
          allScores.length,
        avgContent:
          allScores.reduce((sum, t) => sum + (t.scores?.content || 0), 0) /
          allScores.length,
      };
    }

    const overallScore = Math.round(
      (finalStats.avgPronunciation +
        finalStats.avgFluency +
        finalStats.avgGrammar +
        finalStats.avgContent) /
        4
    );

    const radarData = [
      { label: "Relevance", value: Math.round(finalStats.avgContent) },
      {
        label: "Pronunciation",
        value: Math.round(finalStats.avgPronunciation),
      },
      {
        label: "Intonation & Stress",
        value: Math.round(finalStats.avgFluency * 0.8),
      }, // Intonation approximate
      { label: "Fluency", value: Math.round(finalStats.avgFluency) },
      { label: "Grammar", value: Math.round(finalStats.avgGrammar) },
    ];

    // Generate summary title and description based on score
    const getSummaryTitle = () => {
      if (aiSummary?.title) return aiSummary.title;

      if (overallScore >= 90) return "Outstanding Performance!";
      if (overallScore >= 80) return "Amazing Context Understanding";
      if (overallScore >= 70) return "Great Progress!";
      if (overallScore >= 60) return "Good Effort!";
      return "Keep Practicing!";
    };

    const getSummaryDescription = () => {
      if (aiSummary?.feedback) return aiSummary.feedback;

      if (overallScore >= 90)
        return "Your speaking skills are impressive! You demonstrated excellent control over grammar and vocabulary.";
      if (overallScore >= 80)
        return "You did a great job conveying your ideas. Your pronunciation is clear, and you used good vocabulary.";
      if (overallScore >= 70)
        return "You are making steady progress. Focus on improving your sentence structure and fluency.";
      return "Don't give up! Consistency is key. Try listening to native speakers and shadowing their pronunciation.";
    };

    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/speaking">
          <Button variant="outline" className="gap-2 mb-6 bg-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Speaking Room
          </Button>
        </Link>

        {/* Score and Radar Chart Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Overall Score Card */}
          <Card className="p-6 border-2 border-border bg-white  hover:border-primary transition-colors">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="flex items-center justify-center w-32 h-32 text-white rounded-full bg-primary mb-4">
                <span className="text-5xl font-bold">{overallScore}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                Overall Score
              </h2>
              <p className="text-sm text-muted-foreground">
                Based on 5 key criteria
              </p>
            </div>
          </Card>

          {/* Radar Chart Card */}
          <Card className="p-6 border-2 border-border bg-white flex items-center justify-center">
            <RadarChart data={radarData} size={280} />
          </Card>
        </div>

        {/* AI Summary Card */}
        <Card className="p-6 border-2 border-border bg-white mb-6 hover:border-primary transition-colors">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-3 rounded-xl bg-primary-50">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {getSummaryTitle()}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {getSummaryDescription()}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleViewDetailedFeedback}
            className="h-14 gap-2 bg-primary hover:bg-primary/90"
          >
            <BarChart3 className="h-5 w-5" />
            Detailed Feedback
          </Button>
          <Button
            variant="outline"
            onClick={handleExtractWords}
            className="h-14 gap-2 border-2 bg-white hover:border-primary"
          >
            <BookOpen className="h-5 w-5 text-primary" />
            New Words
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadTranscript}
            className="h-14 gap-2 border-2 bg-white hover:border-primary"
          >
            <FileText className="h-5 w-5 text-primary" />
            Transcript
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/speaking")}
            className="h-14 gap-2 border-2 bg-white hover:border-primary"
          >
            <RotateCcw className="h-5 w-5 text-primary" />
            New Session
          </Button>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}
