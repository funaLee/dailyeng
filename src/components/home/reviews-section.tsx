"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
    Star,
    Quote,
    Users,
    Trophy,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"

export function ReviewsSection() {
    const reviews = [
        {
            name: "Nguyen Van A",
            avatar: "/asian-male-student-portrait.png",
            ielts: "7.5",
            content: "DailyEng helped me improve my speaking skills dramatically. The AI tutor is amazing!",
            direction: "up",
            fullFeedback:
                "DailyEng completely transformed my English learning journey. Before using this platform, I struggled with speaking confidence and couldn't hold a conversation for more than a few minutes. The AI tutor feature is incredibly patient and provides instant feedback on pronunciation and grammar. After 6 months of consistent practice, I achieved my dream IELTS score. The gamification elements kept me motivated throughout, and the speaking room sessions with other learners gave me real-world practice opportunities.",
            courses: ["IELTS Speaking Mastery", "Academic Writing", "Pronunciation Pro"],
            result: { type: "IELTS", score: "7.5", previousScore: "5.5" },
            duration: "6 months",
            photo: "/learning.png",
        },
        {
            name: "Tran Thi B",
            avatar: "/asian-female-student-portrait.png",
            ielts: "8.0",
            content: "I love the gamification features. Learning English has never been this fun!",
            direction: "up",
            fullFeedback:
                "As someone who always found traditional English classes boring, DailyEng was a breath of fresh air. The gamification features made me actually look forward to my daily lessons. I earned badges, competed on leaderboards, and the streak system ensured I never missed a day. The vocabulary hub is particularly impressive - I learned over 3000 new words in just 4 months. The platform's ability to adapt to my learning pace and style made all the difference in my IELTS preparation.",
            courses: ["Vocabulary Builder", "IELTS Complete Preparation", "Grammar Fundamentals"],
            result: { type: "IELTS", score: "8.0", previousScore: "6.0" },
            duration: "4 months",
            photo: "/learning.png",
        },
        {
            name: "Le Van C",
            avatar: "/asian-male-professional-portrait.jpg",
            ielts: "7.0",
            content: "The personalized study plan keeps me motivated every day. Highly recommended!",
            direction: "up",
            fullFeedback:
                "Working full-time made it challenging to find time for English study, but DailyEng's personalized study plan fit perfectly into my busy schedule. The platform analyzed my strengths and weaknesses and created a custom curriculum just for me. The mobile app allowed me to study during commutes, and the short, focused lessons were perfect for my attention span. I went from intermediate to advanced level while maintaining my job, something I thought was impossible before.",
            courses: ["Business English", "Daily Conversation", "Listening Skills"],
            result: { type: "IELTS", score: "7.0", previousScore: "5.0" },
            duration: "8 months",
            photo: "/learning.png",
        },
        {
            name: "Pham Thi D",
            avatar: "/asian-female-graduate-portrait.jpg",
            ielts: "8.5",
            content: "Best English learning platform I've ever used. The speaking room is a game-changer!",
            direction: "down",
            fullFeedback:
                "I've tried numerous English learning platforms before DailyEng, but none came close to this experience. The speaking room feature connected me with learners from around the world, giving me invaluable practice in real conversations. The AI feedback on my speaking was spot-on and helped me identify issues I never knew I had. The comprehensive IELTS preparation materials, especially for the writing section, were exceptional. I achieved a band 8.5, exceeding my target of 7.5!",
            courses: ["IELTS Writing Excellence", "Speaking Room Premium", "Reading Strategies"],
            result: { type: "IELTS", score: "8.5", previousScore: "6.5" },
            duration: "5 months",
            photo: "/learning.png",
        },
        {
            name: "Hoang Van E",
            avatar: "/asian-male-university-student-portrait.jpg",
            ielts: "7.5",
            content: "Great for exam preparation. I improved my IELTS score significantly!",
            direction: "down",
            fullFeedback:
                "DailyEng's exam preparation materials are comprehensive and well-structured. The practice tests closely mimic the actual IELTS format, which helped me feel confident on test day. The detailed explanations for each answer taught me valuable strategies and techniques. The progress tracking feature allowed me to see my improvement over time, which was incredibly motivating. I particularly loved the writing feedback system that provided specific suggestions for improvement.",
            courses: ["IELTS Full Preparation", "Test Strategies", "Time Management Skills"],
            result: { type: "IELTS", score: "7.5", previousScore: "6.0" },
            duration: "3 months",
            photo: "/learning.png",
        },
        {
            name: "Nguyen Thi F",
            avatar: "/asian-female-business-professional-portrait.jpg",
            ielts: "N/A",
            content: "TOEIC preparation on DailyEng helped me get promoted at work!",
            direction: "up",
            fullFeedback:
                "My company required a minimum TOEIC score for promotion, and DailyEng helped me exceed that requirement by a huge margin. The business English focus was exactly what I needed for my career. The listening practice with various accents prepared me well for the real test. The vocabulary specific to corporate settings has been useful in my daily work communications. Within 2 months, I went from 650 to 890, opening new doors in my career.",
            courses: ["TOEIC Complete", "Business Communication", "Email Writing"],
            result: { type: "TOEIC", score: "890", previousScore: "650" },
            duration: "2 months",
            photo: "/learning.png",
        },
    ]

    const [showReviewsDialog, setShowReviewsDialog] = useState(false)
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

    const nextReview = () => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    }

    const prevReview = () => {
        setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }

    return (
        <>
            {/* Social Proof Section */}
            <section className="py-24 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Rating Card */}
                        <RevealOnScroll>
                            <Card className="bg-primary-500 text-white border-0 p-6 shadow-xl rounded-2xl relative overflow-hidden group transition-transform hover:scale-[1.02] h-full cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-primary-100 font-medium text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>Our Community</span>
                                        </div>
                                        <div className="text-4xl font-bold mb-1 tracking-tighter">100k+</div>
                                        <div className="text-primary-100 text-base mb-4">active learners worldwide</div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 w-fit border border-white/10">
                                        <div className="flex -space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                            ))}
                                        </div>
                                        <div className="h-6 w-px bg-white/20"></div>
                                        <div>
                                            <span className="font-bold text-base">4.9</span>
                                            <span className="text-primary-100 text-xs ml-1">/ 5.0</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </RevealOnScroll>

                        {/* Quote Card */}
                        <RevealOnScroll delay={200}>
                            <Card className="bg-gray-50 border border-gray-200 p-6 shadow-lg rounded-2xl relative flex flex-col justify-center group hover:border-primary-200 transition-colors h-full cursor-pointer">
                                <Quote className="absolute top-4 right-4 w-10 h-10 text-primary-100 -z-0 rotate-12" />
                                <div className="relative z-10">
                                    <div className="mb-4 flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary-500 text-primary-500" />
                                        ))}
                                    </div>
                                    <p className="text-gray-900 text-lg font-medium leading-relaxed mb-6">
                                        "This app completely changed how I prepare for my interviews. The AI speaking partner feels
                                        incredibly realistic."
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                                            TT
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">Thanh Truc</div>
                                            <div className="text-primary-500 text-xs font-medium">Software Engineer</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* Reviews Marquee Section */}
            <section className="py-24 bg-primary-50 overflow-hidden">
                <RevealOnScroll className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-primary-900 mb-2">Learner Stories</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="font-medium text-primary-600">4.8/5 average rating</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="hidden sm:flex bg-white hover:bg-white cursor-pointer"
                        onClick={() => setShowReviewsDialog(true)}
                    >
                        View all reviews
                    </Button>
                </RevealOnScroll>

                <div className="relative w-full">
                    {/* Fade masks for smooth scrolling edges */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-primary-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-primary-50 to-transparent z-10 pointer-events-none" />

                    <div
                        className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px] overflow-hidden"
                        style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
                    >
                        {/* Column 1 - Scroll Up */}
                        <div className="space-y-6 animate-scroll-up hover:paused">
                            {[...reviews, ...reviews].map((review, idx) => (
                                <Card
                                    key={`col1-${idx}`}
                                    className="p-6 border-0 shadow-sm bg-white rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                            <Image
                                                src={review.avatar || "/learning.png"}
                                                alt={review.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                                            <p className="text-xs text-gray-500">IELTS {review.ielts}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">"{review.content}"</p>
                                </Card>
                            ))}
                        </div>

                        {/* Column 2 - Scroll Down */}
                        <div className="space-y-6 animate-scroll-down hover:paused hidden md:block">
                            {[...reviews.reverse(), ...reviews].map((review, idx) => (
                                <Card
                                    key={`col2-${idx}`}
                                    className="p-6 border-0 shadow-sm bg-white rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center font-bold text-sm">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                                            <p className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full inline-block">
                                                Verified Student
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">"{review.content}"</p>
                                </Card>
                            ))}
                        </div>
                        {/* Column 3 - Scroll Up */}
                        <div className="space-y-6 animate-scroll-up hover:paused hidden lg:block">
                            {[...reviews, ...reviews].map((review, idx) => (
                                <Card
                                    key={`col3-${idx}`}
                                    className="p-6 border-0 shadow-sm bg-white rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                            <Image
                                                src={review.avatar || "/placeholder.svg"}
                                                alt={review.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                                            <p className="text-xs text-gray-500">TOEFL 105</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">"{review.content}"</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Dialog */}
            <Dialog open={showReviewsDialog} onOpenChange={setShowReviewsDialog}>
                <DialogContent className="!max-w-[1400px] w-[95vw] max-h-[90vh] overflow-y-auto p-0">
                    <div className="relative">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white border-b px-10 py-6">
                            <DialogTitle className="text-3xl font-bold text-gray-800">Learner Stories</DialogTitle>
                            <p className="text-gray-500 text-base mt-1">Real success stories from our community</p>

                            {/* Review navigation dots */}
                            <div className="flex items-center gap-2 mt-4">
                                {reviews.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentReviewIndex(idx)}
                                        className={`h-2.5 rounded-full transition-all cursor-pointer ${idx === currentReviewIndex ? "bg-primary-500 w-8" : "bg-gray-300 hover:bg-gray-400 w-2.5"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Current Review Card */}
                        <div className="p-10">
                            <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-3xl p-10">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                    {/* Left Column - Photo and Result (2 cols) */}
                                    <div className="lg:col-span-2">
                                        {/* Photo */}
                                        <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-lg">
                                            <Image
                                                src={reviews[currentReviewIndex].photo || "/placeholder.svg"}
                                                alt={`${reviews[currentReviewIndex].name}'s journey`}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                                <Quote className="w-10 h-10 text-white/70" />
                                                {/* Result badge on photo */}
                                                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                                    <span className="font-bold text-gray-800">
                                                        {reviews[currentReviewIndex].result.type}: {reviews[currentReviewIndex].result.score}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score improvement card */}
                                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                                Score Improvement
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-500 mb-1">Before</p>
                                                    <p className="text-2xl font-bold text-gray-400">
                                                        {reviews[currentReviewIndex].result.previousScore}
                                                    </p>
                                                </div>
                                                <div className="flex-1 mx-4">
                                                    <div className="h-2 bg-gray-200 rounded-full relative">
                                                        <div
                                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-400 to-primary-500 rounded-full"
                                                            style={{ width: "100%" }}
                                                        />
                                                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 text-primary-500" />
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm text-gray-500 mb-1">After</p>
                                                    <p className="text-2xl font-bold text-primary-500">
                                                        {reviews[currentReviewIndex].result.score}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-center text-sm text-gray-500 mt-3">
                                                Achieved in {reviews[currentReviewIndex].duration}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column - User Info and Review (3 cols) */}
                                    <div className="lg:col-span-3 flex flex-col">
                                        {/* Top section with avatar and basic info */}
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                                    <Image
                                                        src={reviews[currentReviewIndex].avatar || "/placeholder.svg"}
                                                        alt={reviews[currentReviewIndex].name}
                                                        width={96}
                                                        height={96}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-accent-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-md">
                                                    Verified
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-800">
                                                    {reviews[currentReviewIndex].name}
                                                </h3>
                                                <p className="text-gray-500 text-base mt-1">
                                                    Studied for {reviews[currentReviewIndex].duration}
                                                </p>

                                                {/* Stars */}
                                                <div className="flex gap-1 mt-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full feedback */}
                                        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm flex-1">
                                            <Quote className="w-8 h-8 text-primary-200 mb-3" />
                                            <p className="text-gray-700 leading-relaxed text-lg">
                                                "{reviews[currentReviewIndex].fullFeedback}"
                                            </p>
                                        </div>

                                        {/* Courses taken */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                                Courses Completed
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {reviews[currentReviewIndex].courses.map((course, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                                                    >
                                                        {course}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation buttons */}
                            <div className="flex justify-between items-center px-10 py-6 border-t bg-white">
                                <Button variant="outline" onClick={prevReview} className="cursor-pointer bg-transparent px-6 py-5">
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Previous
                                </Button>

                                <span className="text-gray-500 text-base font-medium">
                                    {currentReviewIndex + 1} of {reviews.length}
                                </span>

                                <Button
                                    onClick={nextReview}
                                    className="bg-primary-500 hover:bg-primary-600 text-white cursor-pointer px-6 py-5"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
