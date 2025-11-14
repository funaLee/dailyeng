"use client"

import { useMemo } from "react"

interface RadarChartProps {
  data: Array<{
    label: string
    value: number
    maxValue?: number
  }>
  size?: number
  levels?: number
  className?: string
}

export function RadarChart({ data, size = 400, levels = 5, className = "" }: RadarChartProps) {
  const center = size / 2
  const maxRadius = center - 60 // Leave space for labels
  const angleStep = (2 * Math.PI) / data.length

  // Calculate polygon points for the data
  const dataPoints = useMemo(() => {
    return data.map((item, index) => {
      const angle = angleStep * index - Math.PI / 2 // Start from top
      const maxValue = item.maxValue || 100
      const normalizedValue = Math.min(item.value / maxValue, 1)
      const radius = normalizedValue * maxRadius
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return { x, y, ...item, angle }
    })
  }, [data, angleStep, center, maxRadius])

  // Generate background polygons for levels
  const backgroundPolygons = useMemo(() => {
    return Array.from({ length: levels }, (_, levelIndex) => {
      const ratio = (levelIndex + 1) / levels
      const points = data.map((_, index) => {
        const angle = angleStep * index - Math.PI / 2
        const radius = ratio * maxRadius
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return `${x},${y}`
      })
      return points.join(" ")
    })
  }, [levels, data.length, angleStep, center, maxRadius])

  // Generate axis lines
  const axisLines = useMemo(() => {
    return data.map((_, index) => {
      const angle = angleStep * index - Math.PI / 2
      const endX = center + maxRadius * Math.cos(angle)
      const endY = center + maxRadius * Math.sin(angle)
      return { x1: center, y1: center, x2: endX, y2: endY }
    })
  }, [data.length, angleStep, center, maxRadius])

  // Calculate label positions
  const labels = useMemo(() => {
    return dataPoints.map((point) => {
      const labelRadius = maxRadius + 30
      const x = center + labelRadius * Math.cos(point.angle)
      const y = center + labelRadius * Math.sin(point.angle)
      
      // Determine text anchor based on position
      let textAnchor: "start" | "middle" | "end" = "middle"
      if (x > center + 10) textAnchor = "start"
      else if (x < center - 10) textAnchor = "end"

      return {
        x,
        y,
        label: point.label,
        value: point.value,
        textAnchor,
      }
    })
  }, [dataPoints, center, maxRadius])

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ")

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Background level polygons */}
        {backgroundPolygons.map((points, index) => (
          <polygon
            key={`level-${index}`}
            points={points}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, index) => (
          <line
            key={`axis-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="#C2E2FA"
          fillOpacity="0.4"
          stroke="#60A5FA"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3B82F6"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {labels.map((label, index) => (
          <g key={`label-${index}`}>
            <text
              x={label.x}
              y={label.y - 8}
              textAnchor={label.textAnchor}
              className="text-xs font-semibold fill-gray-700"
            >
              {label.label}
            </text>
            <text
              x={label.x}
              y={label.y + 8}
              textAnchor={label.textAnchor}
              className="text-lg font-bold fill-gray-900"
            >
              {label.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
