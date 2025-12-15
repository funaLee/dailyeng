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
  FastForward,
  Menu,
  MessageSquare,
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
  startSessionWithGreeting,
  submitTurn,
  analyzeAndScoreSession,
  getSessionDetailsById,
  getLearningRecordsForScenario,
} from "@/actions/speaking";
import { useSession } from "next-auth/react";
import { PitchAnalyzer, PitchMetrics } from "@/lib/pitch-analyzer";

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
    relevance?: number;
    intonation?: number;
  };
}

type ViewState =
  | "preparation"
  | "active"
  | "analyzing"
  | "complete"
  | "history"
  | "detail";

export interface LearningRecord {
  id: string;
  overallScore: number;
  grammarScore: number;
  relevanceScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  intonationScore: number;
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
  image?: string;
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
    relevance?: number;
    intonation?: number;
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
  const { data: session } = useSession();
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
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [dynamicRecords, setDynamicRecords] = useState<LearningRecord[]>([]);
  const [dynamicFeedback, setDynamicFeedback] =
    useState<DetailedFeedbackData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    scores: {
      grammar: number;
      relevance: number;
      fluency: number;
      pronunciation: number;
      intonation: number;
      overall: number;
    };
    sessionAnalysis: {
      feedbackTitle: string;
      feedbackSummary: string;
      feedbackRating: string;
      feedbackTip: string;
    };
    errorCategories: { name: string; count: number }[];
    conversation: {
      role: "user" | "tutor";
      text: string;
      turnId: string;
      userErrors?: {
        word: string;
        correction: string;
        type: string;
        startIndex: number;
        endIndex: number;
      }[];
    }[];
  } | null>(null);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const conversationRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noSpeechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<string>("");

  // [NEW] Speech metrics refs for fluency & pronunciation scoring
  const confidenceScoresRef = useRef<number[]>([]); // Stores confidence from each final result
  const speechStartTimeRef = useRef<number | null>(null); // When user started speaking
  const pauseCountRef = useRef<number>(0); // Count of pauses > 500ms
  const lastSpeechTimeRef = useRef<number | null>(null); // Last speech timestamp for pause detection

  // [NEW] Ref for pitch analyzer (intonation scoring)
  const pitchAnalyzerRef = useRef<PitchAnalyzer | null>(null);

  useEffect(() => {
    calculateStats(turns);
  }, [turns]);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [turns]);

  // DEBUG: Expose sendMessage to console for testing without microphone
  // Usage in browser console: send("Hello, I want to order a coffee")
  useEffect(() => {
    if (typeof window !== "undefined" && sessionId) {
      (window as any).send = async (text: string) => {
        if (!text) {
          console.log("Usage: send('Your message here')");
          return;
        }
        console.log("[Debug] Sending:", text);
        // We need to call handleSendMessage, but it's defined later
        // So we create a simplified version here
        const { submitTurn } = await import("@/actions/speaking");

        const tempId = `temp-${Date.now()}`;
        setTurns((prev) => [
          ...prev,
          { id: tempId, role: "user", text, timestamp: new Date() },
        ]);

        try {
          const result = await submitTurn(sessionId, text);
          setTurns((prev) =>
            prev.map((t) =>
              t.id === tempId ? { ...t, id: result.userTurnId } : t
            )
          );
          setTurns((prev) => [
            ...prev,
            {
              id: result.aiTurnId,
              role: "tutor",
              text: result.aiResponse,
              timestamp: new Date(),
            },
          ]);
          console.log("[Debug] AI Response:", result.aiResponse);
        } catch (e) {
          console.error("[Debug] Error:", e);
        }
      };
      console.log(
        "🎤 Debug mode: Use send('your message') in console to test without mic"
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).send;
      }
    };
  }, [sessionId]);

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

          // [NEW] Track speech start time
          if (!speechStartTimeRef.current) {
            speechStartTimeRef.current = Date.now();
          }

          // [NEW] Detect pauses (gap > 500ms between speech events)
          if (lastSpeechTimeRef.current) {
            const gap = Date.now() - lastSpeechTimeRef.current;
            if (gap > 500) {
              pauseCountRef.current++;
            }
          }
          lastSpeechTimeRef.current = Date.now();

          // Get the latest transcript
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const confidence = result[0].confidence;

            if (result.isFinal) {
              finalTranscript += result[0].transcript;
              // [NEW] Capture confidence for final results (for pronunciation scoring)
              if (confidence !== undefined && confidence !== null) {
                confidenceScoresRef.current.push(confidence);
              }
            } else {
              interimTranscript += result[0].transcript;
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
      // Get userId from auth session
      const userId = session?.user?.id || "user-1"; // Fallback for dev
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
          text: `📍SCENARIO: ${result.contextMessage}`,
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

        // [NEW] Start pitch analyzer for intonation scoring
        pitchAnalyzerRef.current = new PitchAnalyzer();
        pitchAnalyzerRef.current.start().catch((err) => {
          console.warn("[PitchAnalyzer] Failed to start:", err);
          // Non-critical - continue without pitch analysis
        });

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

    // [NEW] Calculate speech metrics before sending
    const wordCount = text.trim().split(/\s+/).length;

    // Calculate speaking duration: from first speech to last speech event
    // NOT from start to now (which includes 5s silence timeout)
    const speakingDurationMs =
      speechStartTimeRef.current && lastSpeechTimeRef.current
        ? lastSpeechTimeRef.current - speechStartTimeRef.current
        : 0;

    // [NEW] Stop pitch analyzer and get metrics
    const pitchMetrics = pitchAnalyzerRef.current?.stop();
    pitchAnalyzerRef.current = null;

    const speechMetrics = {
      confidenceScores: [...confidenceScoresRef.current], // Clone array
      wordCount,
      speakingDurationMs: Math.max(speakingDurationMs, 1000), // Min 1s to avoid extreme WPM
      pauseCount: pauseCountRef.current,
      // [NEW] Include pitch data for intonation scoring
      pitchVariance: pitchMetrics?.variance ?? null,
      avgPitch: pitchMetrics?.avgPitch ?? null,
      pitchSamplesCount: pitchMetrics?.sampleCount ?? null,
    };

    // Debug log
    console.log("[handleSendMessage] Speech metrics:", {
      wordCount,
      speakingDurationMs,
      adjustedDuration: speechMetrics.speakingDurationMs,
      confidenceCount: confidenceScoresRef.current.length,
      confidenceScores: confidenceScoresRef.current,
      pauseCount: pauseCountRef.current,
      pitchVariance: speechMetrics.pitchVariance,
      avgPitch: speechMetrics.avgPitch,
      pitchSamplesCount: speechMetrics.pitchSamplesCount,
    });

    // [NEW] Reset speech metrics refs for next turn
    confidenceScoresRef.current = [];
    speechStartTimeRef.current = null;
    pauseCountRef.current = 0;
    lastSpeechTimeRef.current = null;

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
      // [MODIFIED] Pass speech metrics to submitTurn
      const result = await submitTurn(sessionId, text, null, speechMetrics);

      // Update user turn with real ID (no scores during conversation)
      setTurns((prev) =>
        prev.map((t) =>
          t.id === tempId
            ? {
                ...t,
                id: result.userTurnId,
              }
            : t
        )
      );

      // Add AI turn
      const aiTurn: Turn = {
        id: result.aiTurnId,
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

  // handleExtractWords removed - vocabulary feature not in scope

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

  const handleSelectRecord = async (recordId: string) => {
    setSelectedRecordId(recordId);
    setIsLoadingFeedback(true);
    setViewState("detail");

    try {
      const sessionData = await getSessionDetailsById(recordId);

      if (sessionData) {
        // Helper function to generate corrected sentence from errors
        const generateCorrectedSentence = (
          text: string,
          errors: { word: string; correction: string; type: string }[]
        ): string => {
          if (!errors || errors.length === 0) return text;

          let corrected = text;
          const sortedErrors = [...errors].sort((a, b) => {
            const posA = text.toLowerCase().indexOf(a.word.toLowerCase());
            const posB = text.toLowerCase().indexOf(b.word.toLowerCase());
            return posB - posA;
          });

          for (const error of sortedErrors) {
            const regex = new RegExp(
              error.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              "gi"
            );
            corrected = corrected.replace(regex, error.correction);
          }
          return corrected;
        };

        // Transform session data to DetailedFeedbackData format
        const clientData: DetailedFeedbackData = {
          scores: [
            { label: "Relevance", value: sessionData.scores.relevance },
            { label: "Pronunciation", value: sessionData.scores.pronunciation },
            {
              label: "Intonation & Stress",
              value: sessionData.scores.intonation,
            },
            { label: "Fluency", value: sessionData.scores.fluency },
            { label: "Grammar", value: sessionData.scores.grammar },
          ],
          errorCategories: sessionData.errorCategories,
          conversation: sessionData.conversation.map((c) => {
            const userErrors = c.userErrors?.map((e) => ({
              word: e.word,
              correction: e.correction,
              type: e.type,
            }));

            return {
              role: c.role,
              text: c.text,
              userErrors,
              correctedSentence:
                c.role === "user" && userErrors && userErrors.length > 0
                  ? generateCorrectedSentence(c.text, userErrors)
                  : undefined,
            };
          }),
          overallRating: sessionData.session.feedbackRating || "N/A",
          tip: sessionData.session.feedbackTip || "Great effort!",
        };

        setDynamicFeedback(clientData);
      } else {
        toast.error("Session not found");
        setViewState("history");
      }
    } catch (error) {
      console.error("Error loading session details:", error);
      toast.error("Failed to load session details");
      setViewState("history");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // View detailed feedback - uses stored analysisResult (no API call needed)
  const handleViewDetailedFeedback = () => {
    if (!analysisResult) {
      toast.error("No analysis data available");
      return;
    }

    // Helper function to generate corrected sentence from errors
    const generateCorrectedSentence = (
      text: string,
      errors: { word: string; correction: string; type: string }[]
    ): string => {
      if (!errors || errors.length === 0) return text;

      let corrected = text;
      // Sort errors by position to replace from end to start (to preserve indices)
      const sortedErrors = [...errors].sort((a, b) => {
        const posA = text.toLowerCase().indexOf(a.word.toLowerCase());
        const posB = text.toLowerCase().indexOf(b.word.toLowerCase());
        return posB - posA; // Sort descending
      });

      for (const error of sortedErrors) {
        const regex = new RegExp(
          error.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        );
        corrected = corrected.replace(regex, error.correction);
      }
      return corrected;
    };

    // Transform analysisResult to DetailedFeedbackData format
    const clientData: DetailedFeedbackData = {
      scores: [
        { label: "Relevance", value: analysisResult.scores.relevance },
        { label: "Pronunciation", value: analysisResult.scores.pronunciation },
        {
          label: "Intonation & Stress",
          value: analysisResult.scores.intonation,
        },
        { label: "Fluency", value: analysisResult.scores.fluency },
        { label: "Grammar", value: analysisResult.scores.grammar },
      ],
      errorCategories: analysisResult.errorCategories,
      conversation: analysisResult.conversation.map((c) => {
        const userErrors = c.userErrors?.map((e) => ({
          word: e.word,
          correction: e.correction,
          type: e.type,
        }));

        return {
          role: c.role,
          text: c.text,
          userErrors,
          // Generate corrected sentence if there are errors
          correctedSentence:
            c.role === "user" && userErrors && userErrors.length > 0
              ? generateCorrectedSentence(c.text, userErrors)
              : undefined,
        };
      }),
      overallRating: analysisResult.sessionAnalysis.feedbackRating,
      tip: analysisResult.sessionAnalysis.feedbackTip,
    };

    setDynamicFeedback(clientData);
    setViewState("detail");
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
    if (isLoadingRecords) {
      // Skeleton loading for Learning Records
      return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6 border-[1.4px] border-primary-200 max-w-4xl mx-auto bg-white">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary-100 animate-pulse" />
                <div>
                  <div className="h-7 w-48 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            </div>
            {/* Stats Skeleton */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-primary-100 bg-card"
                >
                  <div className="h-8 w-8 rounded-lg bg-muted animate-pulse mb-2" />
                  <div className="h-8 w-12 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
            {/* Section Title Skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
            {/* Records List Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-primary-100 bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                      <div>
                        <div className="h-5 w-24 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <LearningHistory
          records={dynamicRecords}
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

    // Calculate overall score from the 5 individual scores
    const overallScore =
      analysisResult?.scores.overall ||
      Math.round(
        feedbackToUse.scores.reduce((sum, s) => sum + s.value, 0) /
          feedbackToUse.scores.length
      );

    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <DetailedFeedback
          scores={detailScoresWithIcons}
          errorCategories={feedbackToUse.errorCategories}
          conversation={feedbackToUse.conversation}
          overallRating={feedbackToUse.overallRating}
          overallScore={overallScore}
          tip={feedbackToUse.tip}
          onBack={() => {
            setViewState(selectedRecordId ? "history" : "complete");
            if (selectedRecordId) {
              setSelectedRecordId(null);
              setDynamicFeedback(null);
            }
          }}
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

        {/* Two-column layout with equal heights */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <Card className="p-8 bg-white flex flex-col">
            {/* Learning Goals Section */}
            <div className="flex-1">
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

            {/* Context Section */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-xl font-bold">Context</h2>
              </div>
              <div className="p-4 bg-primary-50 rounded-xl text-sm italic text-muted-foreground">
                {scenario.context}
              </div>
            </div>
          </Card>

          {/* Right Column */}
          <Card className="p-8 bg-white flex flex-col">
            <div className="aspect-video bg-linear-to-br from-primary-200 to-primary-300 rounded-2xl mb-6 relative overflow-hidden">
              <Image
                src={scenario.image || "/learning.png"}
                alt={scenario.title}
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <h1 className="text-3xl font-bold mb-4">{scenario.title}</h1>
              <p className="text-muted-foreground flex-1">
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
                  onClick={async () => {
                    setViewState("history");
                    setIsLoadingRecords(true);
                    try {
                      // Get userId from session
                      const userId = session?.user?.id || "user-1"; // Fallback for dev
                      const records = await getLearningRecordsForScenario(
                        userId,
                        scenarioId
                      );
                      setDynamicRecords(
                        records.map((r) => ({
                          id: r.id,
                          overallScore: r.overallScore,
                          grammarScore: r.grammarScore,
                          relevanceScore: r.relevanceScore,
                          fluencyScore: r.fluencyScore,
                          pronunciationScore: r.pronunciationScore,
                          intonationScore: r.intonationScore,
                          date: r.date,
                        }))
                      );
                    } catch (error) {
                      console.error("Failed to fetch learning records:", error);
                      toast.error("Failed to load learning records");
                    } finally {
                      setIsLoadingRecords(false);
                    }
                  }}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (viewState === "active") {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 h-screen max-h-screen flex flex-col">
        {/* Options Dialog (Hamburger menu) */}
        {showQuitDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-center mb-6">Option</h3>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-[#4f46e5] hover:bg-[#4338ca]"
                  onClick={() => setShowQuitDialog(false)}
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-primary-200 hover:bg-primary-50"
                  onClick={async () => {
                    setShowQuitDialog(false);
                    setViewState("analyzing");
                    try {
                      if (sessionId) {
                        const result = await analyzeAndScoreSession(sessionId);
                        setAnalysisResult(result);
                      }
                      setViewState("complete");
                    } catch (error) {
                      console.error("Analysis failed:", error);
                      toast.error("Failed to analyze session");
                      setViewState("complete");
                    }
                  }}
                >
                  Finish
                </Button>
                <Link href="/speaking" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-primary-200 hover:bg-primary-50"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Finish Confirmation Dialog (Fast Forward button) */}
        {showFinishDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-center mb-6">
                Are you sure you want to finish this conversation?
              </h3>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-[#4f46e5] hover:bg-[#4338ca]"
                  onClick={() => setShowFinishDialog(false)}
                >
                  No
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-primary-200 hover:bg-primary-50"
                  onClick={async () => {
                    setShowFinishDialog(false);
                    setViewState("analyzing");
                    try {
                      if (sessionId) {
                        const result = await analyzeAndScoreSession(sessionId);
                        setAnalysisResult(result);
                      }
                      setViewState("complete");
                    } catch (error) {
                      console.error("Analysis failed:", error);
                      toast.error("Failed to analyze session");
                      setViewState("complete");
                    }
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-center justify-center z-10 shrink-0 relative max-w-4xl mx-auto w-full">
          {/* Menu Button - with rotation animation */}
          <button
            onClick={() => setShowQuitDialog(true)}
            className={`absolute left-0 w-10 h-10 rounded-full bg-[#e0e7ff] flex items-center justify-center hover:bg-[#c7d2fe] transition-all duration-300 ${
              showQuitDialog ? "rotate-90" : "rotate-0"
            }`}
          >
            <Menu className="h-5 w-5 text-[#4b3fd4]" />
          </button>
          <h1 className="text-2xl font-bold text-center">{scenario.title}</h1>
          {/* Fast Forward Button */}
          <button
            onClick={() => setShowFinishDialog(true)}
            className="absolute right-0 w-10 h-10 rounded-full bg-[#e0e7ff] flex items-center justify-center hover:bg-[#c7d2fe] transition-all duration-300"
          >
            <FastForward className="h-5 w-5 text-[#4b3fd4]" />
          </button>
        </div>

        {/* Main Content - Centered Chat */}
        <div className="flex-1 flex justify-center min-h-0 pb-4">
          <div className="w-full max-w-4xl rounded-3xl border-2 border-border bg-primary-100 flex flex-col overflow-hidden relative shadow-lg">
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
                      Thinking...
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
        </div>

        {/* Sidebar - Commented out: Live Analysis and Vocab Helper
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
          {/* Live Analysis Card */}
        {/*
          <div className="rounded-3xl border-2 border-border p-6 bg-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Waveform className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-foreground">Live Analysis</h3>
            </div>
            <div className="space-y-6">
              ... Live Analysis content ...
            </div>
          </div>
          */}

        {/* Vocab Helper - Commented out */}
        {/*
          <div className="flex-1 min-h-0 rounded-3xl overflow-hidden shadow-xl bg-white border-2 border-border backdrop-blur-md">
            <VocabHelperChatbot />
          </div>
          */}
        {/* End Sidebar comment */}
      </div>
    );
  }

  // Analyzing state - show loading while AI analyzes the session
  if (viewState === "analyzing") {
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
              AI is reviewing your conversation, checking grammar, and
              calculating your scores. Please wait.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (viewState === "complete") {
    // Use analysisResult if available, otherwise calculate from turns (fallback)
    const scores = analysisResult?.scores || {
      grammar: 0,
      relevance: 0,
      fluency: 70,
      pronunciation: 70,
      intonation: 70,
      overall: 0,
    };

    const radarData = [
      { label: "Relevance", value: scores.relevance },
      { label: "Pronunciation", value: scores.pronunciation },
      { label: "Intonation & Stress", value: scores.intonation },
      { label: "Fluency", value: scores.fluency },
      { label: "Grammar", value: scores.grammar },
    ];

    const overallScore =
      scores.overall ||
      Math.round(
        (scores.grammar +
          scores.relevance +
          scores.fluency +
          scores.pronunciation +
          scores.intonation) /
          5
      );

    // Generate summary title and description based on analysisResult or fallback
    const getSummaryTitle = () => {
      if (analysisResult?.sessionAnalysis.feedbackTitle) {
        return analysisResult.sessionAnalysis.feedbackTitle;
      }
      if (overallScore >= 90) return "Outstanding Performance!";
      if (overallScore >= 80) return "Amazing Context Understanding";
      if (overallScore >= 70) return "Great Progress!";
      if (overallScore >= 60) return "Good Effort!";
      return "Keep Practicing!";
    };

    const getSummaryDescription = () => {
      if (analysisResult?.sessionAnalysis.feedbackSummary) {
        return analysisResult.sessionAnalysis.feedbackSummary;
      }
      if (overallScore >= 90)
        return "Your speaking skills are impressive! You demonstrated excellent control over grammar and vocabulary.";
      if (overallScore >= 80)
        return "You did a great job conveying your ideas. Your pronunciation is clear, and you used good vocabulary.";
      if (overallScore >= 70)
        return "You are making steady progress. Focus on improving your sentence structure and fluency.";
      return "Don't give up! Consistency is key. Try listening to native speakers and shadowing their pronunciation.";
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl w-full">
          {/* Back Button */}
          <Link href="/speaking">
            <Button variant="outline" className="gap-2 mb-6 bg-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Speaking Room
            </Button>
          </Link>

          {/* Score and Radar Chart Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Overall Score Card */}
            <Card className="p-6 border-2 border-border bg-white h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-32 h-32 text-white rounded-full bg-primary mb-4">
                  <span className="text-5xl font-bold">{overallScore}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Overall Score
                </h2>
              </div>
            </Card>

            {/* Radar Chart Card */}
            <Card className="p-4 border-2 border-border bg-white flex items-center justify-center">
              <RadarChart data={radarData} size={280} />
            </Card>
          </div>

          {/* AI Summary Card */}
          <Card className="p-6 border-2 border-border bg-white mb-6">
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
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={handleViewDetailedFeedback}
              className="h-14 gap-2 bg-primary hover:bg-primary/90"
            >
              <BarChart3 className="h-5 w-5" />
              Detailed Feedback
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
              onClick={() => {
                setSessionId(null);
                setTurns([]);
                setAnalysisResult(null);
                setDynamicFeedback(null);
                setViewState("preparation");
              }}
              className="h-14 gap-2 border-2 bg-white hover:border-primary"
            >
              <RotateCcw className="h-5 w-5 text-primary" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}
