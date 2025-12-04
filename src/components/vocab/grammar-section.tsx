"use client"

import type { GrammarNote } from "@/types"
import { Card } from "@/components/ui/card"

interface GrammarSectionProps {
  notes: GrammarNote[]
}

export function GrammarSection({ notes }: GrammarSectionProps) {
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="p-6">
          <h3 className="text-lg font-semibold mb-3">{note.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{note.explanation}</p>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Examples</p>
            {note.examples.map((example, idx) => (
              <div key={idx} className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">{example.en}</p>
                <p className="text-sm text-muted-foreground italic">{example.vi}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
