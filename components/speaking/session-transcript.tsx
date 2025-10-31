"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Turn {
  id: string
  role: "user" | "tutor"
  text: string
  timestamp: Date
}

interface SessionTranscriptProps {
  turns: Turn[]
  scenarioTitle: string
}

export function SessionTranscript({ turns, scenarioTitle }: SessionTranscriptProps) {
  const handleDownload = () => {
    const transcript = turns.map((turn) => `${turn.role === "user" ? "You" : "Tutor"}: ${turn.text}`).join("\n\n")

    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`)
    element.setAttribute("download", `${scenarioTitle}-transcript.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Transcript</h3>
        <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 text-sm">
        {turns.map((turn) => (
          <div key={turn.id}>
            <p className="font-medium text-xs text-muted-foreground uppercase">
              {turn.role === "user" ? "You" : "Tutor"}
            </p>
            <p className="text-sm mt-1">{turn.text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
