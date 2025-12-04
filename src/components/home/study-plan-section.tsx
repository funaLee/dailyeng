"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    GraduationCap,
    ArrowRight,
    CheckCircle2,
    Users,
    Target,
    BookOpen,
    Check,
} from "lucide-react"
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"

export function StudyPlanSection() {
    return (
        <>
            {/* Test Your English Level Section */}
            <section className="py-20 bg-background">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <RevealOnScroll>
                        <Card className="relative overflow-hidden border-0 shadow-xl rounded-3xl bg-linear-to-r from-secondary-50 to-white cursor-pointer">
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Left Content */}
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 w-fit border border-secondary-100 cursor-pointer hover:bg-primary-100 transition-colors">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>Free Assessment</span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                        Test Your English Level
                                    </h2>

                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                        Discover your current proficiency with our comprehensive placement test. Get personalized
                                        recommendations based on your results.
                                    </p>

                                    <blockquote className="border-l-4 border-secondary-400 pl-4 mb-8 italic text-gray-500">
                                        "Knowing where you stand is the first step to reaching where you want to be."
                                    </blockquote>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link href="/placement-test" className="cursor-pointer">
                                            <Button
                                                size="lg"
                                                className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg font-semibold group cursor-pointer"
                                            >
                                                Take the Test
                                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckCircle2 className="w-4 h-4 text-accent-500" />
                                            <span>Takes only 15 minutes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Image */}
                                <div className="relative h-64 md:h-auto min-h-[300px] bg-primary-50">
                                    <Image src="/learning.png" alt="English Level Test" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/20 to-transparent" />

                                    {/* Floating badges */}
                                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                                        <div className="text-xs text-gray-500 font-medium">CEFR Levels</div>
                                        <div className="text-lg font-bold text-secondary-600">A1 - C2</div>
                                    </div>

                                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-secondary-500" />
                                            <span className="text-sm font-semibold text-gray-700">50K+ tests taken</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Build Study Plan Section */}
            <section className="py-24 bg-gradient-to-br from-primary-200 via-primary-100 to-accent-50 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium cursor-pointer">
                                <Target className="w-4 h-4" />
                                Personalized Learning
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Build Your
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                                    Study Plan
                                </span>
                            </h2>

                            <p className="text-lg text-gray-600 max-w-lg">
                                Tell us about your goals, schedule, and preferences. We will create a customized learning roadmap
                                designed specifically for your success.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/build-plan">
                                    <Button
                                        size="lg"
                                        className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg cursor-pointer"
                                    >
                                        Build My Plan
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 py-6 text-lg rounded-full cursor-pointer bg-transparent border-primary-300 text-primary-600 hover:bg-primary-50"
                                >
                                    Learn More
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 pt-6">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">5 min</div>
                                    <div className="text-sm text-gray-500">To complete</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">10+</div>
                                    <div className="text-sm text-gray-500">Course matches</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">100%</div>
                                    <div className="text-sm text-gray-500">Personalized</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative">
                            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-primary-100">
                                {/* Mock questionnaire preview */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <Target className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Study Plan Builder</div>
                                            <div className="text-sm text-gray-500">Question 1 of 10</div>
                                        </div>
                                    </div>

                                    <Progress value={10} className="h-2 [&>div]:bg-primary-500" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">What is your primary goal?</h3>
                                        <div className="space-y-3">
                                            {["Pass IELTS/TOEFL exam", "Improve for career", "Travel confidently", "Academic studies"].map(
                                                (option, idx) => (
                                                    <div
                                                        key={option}
                                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${idx === 0
                                                                ? "border-primary-500 bg-primary-50"
                                                                : "border-gray-200 hover:border-primary-300"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${idx === 0
                                                                        ? "border-primary-500 bg-primary-500"
                                                                        : "border-gray-300"
                                                                    }`}
                                                            >
                                                                {idx === 0 && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span
                                                                className={
                                                                    idx === 0
                                                                        ? "font-medium text-primary-700"
                                                                        : "text-gray-600"
                                                                }
                                                            >
                                                                {option}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 bg-primary-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-accent-500 text-white rounded-2xl p-4 shadow-lg cursor-pointer">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
