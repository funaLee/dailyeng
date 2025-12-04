"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare, BookOpen } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpPage() {
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      setFeedbackSubmitted(true);
      setFeedback("");
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    }
  };

  const faqs = [
    {
      question: "How does the spaced repetition system work?",
      answer:
        "Our SRS uses the SM-2 algorithm to optimize your learning. Cards are reviewed at increasing intervals based on how well you remember them. Rate your recall from 'Again' to 'Perfect' to adjust the next review date.",
    },
    {
      question: "Can I create my own topics?",
      answer:
        "Yes! Click 'Create with AI' in the Vocabulary Hub to create custom topics. You can also create custom speaking scenarios in the Speaking Room.",
    },
    {
      question: "How are my speaking sessions scored?",
      answer:
        "Your speaking is evaluated on four criteria: Pronunciation (accent and sound clarity), Fluency (speed and smoothness), Grammar (correct sentence structure), and Content (relevance and completeness).",
    },
    {
      question: "What do the different learning levels mean?",
      answer:
        "A1-A2 are beginner levels, B1-B2 are intermediate. Choose your level during onboarding to get personalized content.",
    },
    {
      question: "How can I maintain my streak?",
      answer:
        "Complete at least one task per day to maintain your streak. Your daily tasks are customized based on your study plan.",
    },
    {
      question: "Is my data saved?",
      answer:
        "Yes, your progress is saved locally in your browser. Your flashcards, speaking sessions, and study plan are all preserved.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Help & FAQ
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions about EnglishFlow
        </p>
      </div>

      {/* Quick Start */}
      <Card className="p-8 mb-12 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">1</div>
            <h3 className="font-semibold mb-2">Choose a Topic</h3>
            <p className="text-sm text-muted-foreground">
              Browse the Vocabulary Hub and select a topic that interests you.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-500 dark:text-purple-400 mb-2">
              2
            </div>
            <h3 className="font-semibold mb-2">Learn & Practice</h3>
            <p className="text-sm text-muted-foreground">
              Study vocabulary, grammar, and practice speaking with our AI
              tutor.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">
              3
            </div>
            <h3 className="font-semibold mb-2">Review & Improve</h3>
            <p className="text-sm text-muted-foreground">
              Use flashcards and spaced repetition to reinforce what you've
              learned.
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Frequently Asked Questions
        </h2>
        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Send Us Feedback
        </h2>
        <div className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think about EnglishFlow..."
            className="w-full h-32 p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-3">
            <Button onClick={handleSubmitFeedback} disabled={!feedback.trim()}>
              Submit Feedback
            </Button>
            {feedbackSubmitted && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Thank you for your feedback!
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
