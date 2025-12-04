"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";

interface MindMapNode {
  id: string;
  label: string;
  type: "root" | "topic" | "word";
  level?: string;
  pronunciation?: string;
  x: number;
  y: number;
  children?: MindMapNode[];
}

interface MindMapProps {
  selectedGroup: string;
  selectedSubcategory: string;
}

export function MindMap({ selectedGroup, selectedSubcategory }: MindMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const vocabularyData: Record<
    string,
    Record<
      string,
      Array<{ word: string; level: string; pronunciation: string }>
    >
  > = {
    Animals: {
      Animals: [
        { word: "cat", level: "A1", pronunciation: "/kæt/" },
        { word: "dog", level: "A1", pronunciation: "/dɒɡ/" },
        { word: "elephant", level: "A2", pronunciation: "/ˈelɪfənt/" },
        { word: "lion", level: "A2", pronunciation: "/ˈlaɪən/" },
      ],
      Birds: [
        { word: "sparrow", level: "A2", pronunciation: "/ˈspærəʊ/" },
        { word: "eagle", level: "B1", pronunciation: "/ˈiːɡəl/" },
        { word: "penguin", level: "A2", pronunciation: "/ˈpeŋɡwɪn/" },
      ],
      "Fish and shellfish": [
        { word: "salmon", level: "A2", pronunciation: "/ˈsæmən/" },
        { word: "tuna", level: "A2", pronunciation: "/ˈtjuːnə/" },
        { word: "shrimp", level: "A2", pronunciation: "/ʃrɪmp/" },
      ],
      "Insects, worms, etc.": [
        { word: "butterfly", level: "A2", pronunciation: "/ˈbʌtəflaɪ/" },
        { word: "ant", level: "A1", pronunciation: "/ænt/" },
        { word: "bee", level: "A1", pronunciation: "/biː/" },
      ],
    },
  };

  const generateMindMap = (): MindMapNode => {
    const centerX = 400;
    const centerY = 300;

    const root: MindMapNode = {
      id: "root",
      label: selectedGroup,
      type: "root",
      x: centerX,
      y: centerY,
      children: [],
    };

    const subtopics = Object.keys(vocabularyData[selectedGroup] || {});
    const angleStep = (2 * Math.PI) / subtopics.length;
    const topicRadius = 200;

    subtopics.forEach((subtopic, index) => {
      const angle = index * angleStep;
      const topicX = centerX + topicRadius * Math.cos(angle);
      const topicY = centerY + topicRadius * Math.sin(angle);

      const topicNode: MindMapNode = {
        id: `topic-${index}`,
        label: subtopic,
        type: "topic",
        x: topicX,
        y: topicY,
        children: [],
      };

      const words = vocabularyData[selectedGroup]?.[subtopic] || [];
      const wordAngleStep = Math.PI / 3 / Math.max(words.length - 1, 1);
      const wordRadius = 120;

      words.forEach((word, wordIndex) => {
        const wordAngle = angle + (wordAngleStep * wordIndex - Math.PI / 6);
        const wordX = topicX + wordRadius * Math.cos(wordAngle);
        const wordY = topicY + wordRadius * Math.sin(wordAngle);

        topicNode.children?.push({
          id: `word-${index}-${wordIndex}`,
          label: word.word,
          type: "word",
          level: word.level,
          pronunciation: word.pronunciation,
          x: wordX,
          y: wordY,
        });
      });

      root.children?.push(topicNode);
    });

    return root;
  };

  const mindMapData = generateMindMap();

  const renderConnections = (node: MindMapNode) => {
    if (!node.children) return null;

    return node.children.map((child) => (
      <g key={child.id}>
        <line
          x1={node.x}
          y1={node.y}
          x2={child.x}
          y2={child.y}
          stroke="#93C5FD"
          strokeWidth="2"
          opacity="0.6"
        />
        {child.children && renderConnections(child)}
      </g>
    ));
  };

  const renderNodes = (node: MindMapNode) => {
    const isHovered = hoveredNode === node.id;
    const isSelected = selectedNode === node.id;

    return (
      <g key={node.id}>
        {node.type === "root" && (
          <g>
            <circle
              cx={node.x}
              cy={node.y}
              r="60"
              fill="#1E3A8A"
              stroke={isHovered || isSelected ? "#C2E2FA" : "#3B82F6"}
              strokeWidth={isHovered || isSelected ? "4" : "2"}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node.id)}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="16"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {node.label}
            </text>
          </g>
        )}

        {node.type === "topic" && (
          <g>
            <rect
              x={node.x - 60}
              y={node.y - 30}
              width="120"
              height="60"
              rx="8"
              fill="#C2E2FA"
              stroke={isHovered || isSelected ? "#1E3A8A" : "#93C5FD"}
              strokeWidth={isHovered || isSelected ? "3" : "2"}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node.id)}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy=".3em"
              fill="#1E3A8A"
              fontSize="13"
              fontWeight="600"
              className="pointer-events-none"
            >
              {node.label.length > 12
                ? node.label.slice(0, 12) + "..."
                : node.label}
            </text>
          </g>
        )}

        {node.type === "word" && (
          <g>
            <ellipse
              cx={node.x}
              cy={node.y}
              rx="45"
              ry="25"
              fill="white"
              stroke={isHovered || isSelected ? "#3B82F6" : "#C2E2FA"}
              strokeWidth={isHovered || isSelected ? "2" : "1.5"}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node.id)}
            />
            <text
              x={node.x}
              y={node.y - 2}
              textAnchor="middle"
              dy=".3em"
              fill="#1E3A8A"
              fontSize="11"
              fontWeight="500"
              className="pointer-events-none"
            >
              {node.label}
            </text>
            {node.level && (
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                dy=".3em"
                fill="#6B7280"
                fontSize="8"
                className="pointer-events-none"
              >
                {node.level}
              </text>
            )}
          </g>
        )}

        {node.children && node.children.map((child) => renderNodes(child))}
      </g>
    );
  };

  const selectedNodeData = (() => {
    const findNode = (node: MindMapNode): MindMapNode | null => {
      if (node.id === selectedNode) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(mindMapData);
  })();

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).tagName === "svg") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    setPan((prev) => ({
      x: prev.x - e.deltaX * 0.5,
      y: prev.y - e.deltaY * 0.5,
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-linear-to-br from-blue-50 to-white">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Vocabulary Mind Map
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore the vocabulary hierarchy. Click and drag to move the canvas.
            Click on nodes to see details.
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
          <svg
            ref={svgRef}
            width="800"
            height="600"
            viewBox="0 0 800 600"
            className={`w-full h-auto ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
          >
            <g transform={`translate(${pan.x}, ${pan.y})`}>
              {renderConnections(mindMapData)}

              {renderNodes(mindMapData)}
            </g>
          </svg>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-900" />
            <span className="text-muted-foreground">Main Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#C2E2FA]" />
            <span className="text-muted-foreground">Subtopic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-[#C2E2FA]" />
            <span className="text-muted-foreground">Vocabulary</span>
          </div>
        </div>
      </Card>

      {selectedNodeData && selectedNodeData.type === "word" && (
        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-2xl font-bold text-blue-900 mb-1">
                {selectedNodeData.label}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedNodeData.pronunciation}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedNodeData.level}</Badge>
              <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
                <Volume2 className="h-5 w-5 text-blue-700" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold text-blue-900">Meaning:</span>
              <p className="text-muted-foreground mt-1">
                Click "Practice" to learn this word with examples and exercises.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
              Practice
            </button>
            <button className="px-4 py-2 bg-white text-blue-900 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
              Add to Notebook
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
