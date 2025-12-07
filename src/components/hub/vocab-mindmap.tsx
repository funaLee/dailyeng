"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Volume2,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import type { VocabItem } from "@/types";

// --- Types ---
interface TopicGroup {
  id: string;
  name: string;
  color: "primary" | "secondary" | "accent" | "success" | "warning" | "info";
  topics: {
    id: string;
    title: string;
    words: Partial<VocabItem>[];
  }[];
}

interface VocabMindmapProps {
  topicGroups: TopicGroup[];
}

interface CalculatedNode {
  id: string;
  type: "center" | "group" | "topic" | "word";
  x: number;
  y: number;
  data: any;
  style: NodeStyle;
  parent?: { x: number; y: number };
}

interface NodeStyle {
  bg: string;
  border: string;
  text: string;
  shadow: string;
  line: string; // CSS Variable string for SVG stroke
  badgeBg: string;
  badgeText: string;
  ring: string;
}

// --- Theme Mapping based on globals.css ---
const getColorTheme = (colorKey: string): NodeStyle => {
  const themes: Record<string, NodeStyle> = {
    primary: {
      // Blue-Violet Scale
      bg: "bg-primary-50 hover:bg-primary-100",
      border: "border-primary-200",
      text: "text-primary-900",
      shadow: "shadow-primary-500/10",
      line: "var(--primary-500)",
      badgeBg: "bg-primary-100",
      badgeText: "text-primary-700",
      ring: "ring-primary-200",
    },
    secondary: {
      // Pink Scale
      bg: "bg-secondary-50 hover:bg-secondary-100",
      border: "border-secondary-200",
      text: "text-secondary-900",
      shadow: "shadow-secondary-500/10",
      line: "var(--secondary-500)",
      badgeBg: "bg-secondary-100",
      badgeText: "text-secondary-700",
      ring: "ring-secondary-200",
    },
    accent: {
      // Mint Scale
      bg: "bg-accent-50 hover:bg-accent-100",
      border: "border-accent-200",
      text: "text-accent-900",
      shadow: "shadow-accent-500/10",
      line: "var(--accent-500)",
      badgeBg: "bg-accent-100",
      badgeText: "text-accent-700",
      ring: "ring-accent-200",
    },
    // Semantic Colors (Limited palette in globals)
    success: {
      bg: "bg-success-100/40 hover:bg-success-100/60",
      border: "border-success-200",
      text: "text-success-300",
      shadow: "shadow-success-200/10",
      line: "var(--success-200)",
      badgeBg: "bg-success-100",
      badgeText: "text-success-300",
      ring: "ring-success-200",
    },
    warning: {
      bg: "bg-warning-100/40 hover:bg-warning-100/60",
      border: "border-warning-200",
      text: "text-warning-300",
      shadow: "shadow-warning-200/10",
      line: "var(--warning-200)",
      badgeBg: "bg-warning-100",
      badgeText: "text-warning-300",
      ring: "ring-warning-200",
    },
    info: {
      bg: "bg-info-100/40 hover:bg-info-100/60",
      border: "border-info-200",
      text: "text-info-300",
      shadow: "shadow-info-200/10",
      line: "var(--info-200)",
      badgeBg: "bg-info-100",
      badgeText: "text-info-300",
      ring: "ring-info-200",
    },
  };
  return themes[colorKey] || themes.primary;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

export function VocabMindmap({ topicGroups }: VocabMindmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // View State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(0.9);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedWord, setSelectedWord] = useState<Partial<VocabItem> | null>(
    null
  );
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupPlacement, setPopupPlacement] = useState<"top" | "bottom">("top");

  const toggleTopic = useCallback((topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }, []);

  // --- Layout Calculation ---
  const layoutData = useMemo(() => {
    const nodes: CalculatedNode[] = [];

    // Compact Geometry
    const R_GROUP = 170;
    const R_TOPIC = 320;
    const R_WORD_BASE = 460;

    // Center Node - Dark Theme for Contrast
    const centerStyle: NodeStyle = {
      bg: "bg-gray-900",
      border: "border-gray-800",
      text: "text-white",
      shadow: "shadow-2xl shadow-primary-900/20",
      line: "",
      badgeBg: "",
      badgeText: "",
      ring: "",
    };

    nodes.push({
      id: "root",
      type: "center",
      x: 0,
      y: 0,
      data: { name: "Vocabulary" },
      style: centerStyle,
    });

    const groupCount = topicGroups.length;
    const angleStep = 360 / groupCount;

    topicGroups.forEach((group, i) => {
      const baseAngle = i * angleStep;
      const groupRad = toRad(baseAngle);
      const groupX = Math.cos(groupRad) * R_GROUP;
      const groupY = Math.sin(groupRad) * R_GROUP;
      const style = getColorTheme(group.color);

      nodes.push({
        id: `g-${group.id}`,
        type: "group",
        x: groupX,
        y: groupY,
        data: group,
        style: style,
        parent: { x: 0, y: 0 },
      });

      const topics = group.topics;
      const topicCount = topics.length;
      const topicSpread = 60;
      const topicStep = topicCount > 1 ? topicSpread / (topicCount - 1) : 0;
      const topicStartAngle =
        baseAngle - (topicCount > 1 ? topicSpread / 2 : 0);

      topics.forEach((topic, j) => {
        const currentTopicAngle = topicStartAngle + j * topicStep;
        const topicRad = toRad(currentTopicAngle);
        const topicX = Math.cos(topicRad) * R_TOPIC;
        const topicY = Math.sin(topicRad) * R_TOPIC;
        const isExpanded = expandedTopics.has(topic.id);

        nodes.push({
          id: topic.id,
          type: "topic",
          x: topicX,
          y: topicY,
          data: { ...topic, isExpanded },
          style: style,
          parent: { x: groupX, y: groupY },
        });

        if (isExpanded) {
          const words = topic.words;
          const wordCount = words.length;
          if (wordCount > 0) {
            const dynamicSpread = Math.min(140, Math.max(50, wordCount * 9));
            const dynamicRadius =
              R_WORD_BASE + (wordCount > 8 ? (wordCount - 8) * 12 : 0);
            const wordStep =
              wordCount > 1 ? dynamicSpread / (wordCount - 1) : 0;
            const wordStartAngle =
              currentTopicAngle - (wordCount > 1 ? dynamicSpread / 2 : 0);

            words.forEach((word, k) => {
              const currentWordAngle = wordStartAngle + k * wordStep;
              const wordRad = toRad(currentWordAngle);
              nodes.push({
                id: `w-${word.id}`,
                type: "word",
                x: Math.cos(wordRad) * dynamicRadius,
                y: Math.sin(wordRad) * dynamicRadius,
                data: word,
                style: style,
                parent: { x: topicX, y: topicY },
              });
            });
          }
        }
      });
    });
    return nodes;
  }, [topicGroups, expandedTopics]);

  // --- Handlers ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => Math.min(Math.max(0.3, prev + delta), 4));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".interactive-area")) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWordClick = useCallback(
    (word: Partial<VocabItem>, e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        const relativeTop = rect.top - containerRect.top;
        const relativeLeft = rect.left - containerRect.left + rect.width / 2;

        setPopupPosition({ x: relativeLeft, y: relativeTop });

        // Logic Smart Placement: flip to bottom if top space < 280px
        if (relativeTop < 280) {
          setPopupPlacement("bottom");
        } else {
          setPopupPlacement("top");
        }
      }
      setSelectedWord(word);
    },
    []
  );

  useEffect(() => {
    const handleClickOutside = () => setSelectedWord(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-background h-screen w-screen"
    : "relative w-full h-[700px] bg-background/50";

  return (
    <div
      className={`${containerClasses} flex flex-col font-sans text-foreground rounded-xl overflow-hidden border border-border bg-white`}
      ref={containerRef}
    >
      {/* Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 p-1.5 bg-background/80 backdrop-blur-md border border-border/60 rounded-full shadow-lg shadow-primary-900/5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScale((s) => Math.max(s - 0.2, 0.2))}
          className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-bold w-12 text-center text-foreground tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScale((s) => Math.min(s + 0.2, 4))}
          className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setScale(0.9);
            setPosition({ x: 0, y: 0 });
          }}
          className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="h-9 w-9 rounded-full hover:bg-muted text-muted-foreground"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing relative select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage:
            "radial-gradient(var(--gray-300) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 w-0 h-0 transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {/* Layer 1: Lines */}
          <svg className="overflow-visible pointer-events-none absolute left-0 top-0">
            <defs>
              <filter
                id="glow-line"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {layoutData.map((node) => {
              if (!node.parent) return null;
              const isWordLine = node.type === "word";
              return (
                <path
                  key={`edge-${node.id}`}
                  d={`M ${node.parent.x} ${node.parent.y} C ${node.parent.x} ${
                    node.parent.y
                  }, ${(node.x + node.parent.x) / 2} ${
                    (node.y + node.parent.y) / 2
                  }, ${node.x} ${node.y}`}
                  stroke={node.style.line} // CSS Variable used here
                  strokeWidth={
                    node.type === "group" ? 4 : node.type === "topic" ? 3 : 1.5
                  }
                  strokeOpacity={isWordLine ? 0.3 : 0.6}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Layer 2: Nodes */}
          {layoutData.map((node) => {
            // --- CENTER NODE ---
            if (node.type === "center") {
              return (
                <div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center ${node.style.bg} ${node.style.border} ${node.style.shadow} ring-4 ring-background ring-offset-2`}
                  style={{ left: node.x, top: node.y }}
                >
                  <Sparkles className="w-6 h-6 text-warning-200 mb-1 opacity-90" />
                  <span
                    className={`font-black text-2xl tracking-tight ${node.style.text}`}
                  >
                    {node.data.name}
                  </span>
                  <span className="text-gray-400 text-xs font-medium mt-1 uppercase tracking-widest">
                    Mindmap
                  </span>
                </div>
              );
            }

            // --- GROUP NODE ---
            if (node.type === "group") {
              return (
                <div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-full border-2 ${node.style.bg} ${node.style.border} ${node.style.shadow} z-10`}
                  style={{ left: node.x, top: node.y }}
                >
                  <span
                    className={`font-extrabold text-xl tracking-tight ${node.style.text}`}
                  >
                    {node.data.name}
                  </span>
                </div>
              );
            }

            // --- TOPIC NODE ---
            if (node.type === "topic") {
              const wordCount = node.data.words.length;
              const isExpanded = node.data.isExpanded;

              return (
                <div
                  key={node.id}
                  className={`interactive-area absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out ${
                    isExpanded ? "scale-110 z-30" : "hover:scale-105"
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={(e) => toggleTopic(node.id, e)}
                >
                  <div
                    className={`
                    relative px-6 py-3 rounded-full border-2 cursor-pointer flex items-center gap-3 shadow-md transition-colors duration-300
                    ${
                      isExpanded
                        ? `bg-background ring-4 ring-offset-0 ring-background/50 ${node.style.border}`
                        : "bg-background/90 hover:bg-background border-transparent"
                    }
                  `}
                  >
                    <span className={`font-bold text-lg ${node.style.text}`}>
                      {node.data.title}
                    </span>

                    <div
                      className={`flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-bold transition-colors ${
                        isExpanded
                          ? "bg-foreground text-background"
                          : `${node.style.badgeBg} ${node.style.badgeText}`
                      }`}
                    >
                      {wordCount}
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                </div>
              );
            }

            // --- WORD NODE ---
            if (node.type === "word") {
              return (
                <div
                  key={node.id}
                  className="interactive-area absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hover:z-50"
                  style={{ left: node.x, top: node.y }}
                  onClick={(e) => handleWordClick(node.data, e)}
                >
                  <div className="group relative transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <div
                      className={`
                        px-5 py-2.5 rounded-2xl bg-background border-2 shadow-sm transition-all
                        hover:shadow-lg hover:shadow-primary-900/5 cursor-pointer flex items-center gap-2
                        ${node.style.border}
                     `}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: node.style.line }}
                      ></div>
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">
                        {node.data.word}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* COMPACT & SMART POPUP */}
      {selectedWord && (
        <div
          className={`absolute z-50 w-72 animate-in fade-in duration-200 ease-out
            ${
              popupPlacement === "top"
                ? "slide-in-from-bottom-2"
                : "slide-in-from-top-2"
            }
          `}
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
            transform: `translate(-50%, ${
              popupPlacement === "top" ? "-100%" : "0"
            }) translateY(${popupPlacement === "top" ? "-16px" : "36px"})`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="overflow-hidden rounded-xl border border-border shadow-2xl shadow-primary-900/10 bg-background/95 backdrop-blur-xl">
            <div className="p-3">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {selectedWord.word}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {selectedWord.pronunciation}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-1 -mt-1 rounded-full hover:bg-muted text-muted-foreground"
                  onClick={() => setSelectedWord(null)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider border border-primary-100">
                  {selectedWord.partOfSpeech}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <p className="text-sm text-foreground leading-snug">
                  {selectedWord.meaning}
                </p>
                {selectedWord.vietnameseMeaning && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary-100 pl-2">
                    {selectedWord.vietnameseMeaning}
                  </p>
                )}
              </div>

              {selectedWord.exampleSentence && (
                <div className="p-2 bg-muted/50 rounded-lg border border-border mb-3">
                  <p className="text-xs text-muted-foreground italic">
                    "{selectedWord.exampleSentence}"
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs flex-1 bg-background hover:bg-muted"
                >
                  <Volume2 className="h-3 w-3 mr-1.5 text-primary-600" /> Listen
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                >
                  <BookOpen className="h-3 w-3 mr-1.5" /> Practice
                </Button>
              </div>
            </div>

            {/* Smart Pointer */}
            <div
              className={`absolute left-1/2 w-3 h-3 bg-background border-r border-b border-border transform rotate-45 -translate-x-1/2
                 ${
                   popupPlacement === "top"
                     ? "bottom-0 translate-y-1/2"
                     : "top-0 -translate-y-1/2 border-l border-t border-r-0 border-b-0"
                 }
               `}
            ></div>
          </Card>
        </div>
      )}
    </div>
  );
}
