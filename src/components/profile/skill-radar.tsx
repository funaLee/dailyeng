"use client";

import { Card } from "@/components/ui/card";

interface SkillRadarProps {
  skills: {
    vocabulary: number;
    grammar: number;
    speaking: number;
    listening: number;
    reading: number;
  };
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const skillsArray = Object.entries(skills).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const maxValue = 100;
  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  // Calculate points for pentagon
  const points = skillsArray.map((skill, i) => {
    const angle = (i * 2 * Math.PI) / skillsArray.length - Math.PI / 2;
    const x = centerX + ((radius * skill.value) / maxValue) * Math.cos(angle);
    const y = centerY + ((radius * skill.value) / maxValue) * Math.sin(angle);
    return { x, y, ...skill };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Skill Levels</h3>
      <svg width="240" height="240" viewBox="0 0 240 240" className="mx-auto">
        {/* Background grid */}
        {[20, 40, 60, 80, 100].map((level) => {
          const r = (radius * level) / maxValue;
          const gridPoints = skillsArray
            .map((_, i) => {
              const angle =
                (i * 2 * Math.PI) / skillsArray.length - Math.PI / 2;
              const x = centerX + r * Math.cos(angle);
              const y = centerY + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={gridPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.2"
            />
          );
        })}

        {/* Axes */}
        {skillsArray.map((_, i) => {
          const angle = (i * 2 * Math.PI) / skillsArray.length - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${i}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.2"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="rgb(59, 130, 246)"
          fillOpacity="0.3"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />

        {/* Labels */}
        {points.map((point, i) => {
          const angle = (i * 2 * Math.PI) / skillsArray.length - Math.PI / 2;
          const labelRadius = radius + 30;
          const labelX = centerX + labelRadius * Math.cos(angle);
          const labelY = centerY + labelRadius * Math.sin(angle);
          return (
            <g key={`label-${i}`}>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium"
                fill="currentColor"
              >
                {point.name}
              </text>
              <text
                x={labelX}
                y={labelY + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold"
                fill="rgb(59, 130, 246)"
              >
                {point.value}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
