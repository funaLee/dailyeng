"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GrammarTopicPage() {
  const params = useParams()
  const topicId = params.topicId as string

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/grammar">
        <Button variant="ghost" className="gap-2 mb-6 bg-purple-200 hover:bg-purple-300 text-purple-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Grammar Hub
        </Button>
      </Link>

      <Card className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Grammar Topic: {topicId}</h1>
        <p className="text-muted-foreground">Grammar lesson content will be displayed here.</p>
      </Card>
    </div>
  )
}
