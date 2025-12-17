/**
 * Seed file for Learner Stories (Comments/Reviews) on the home page.
 *
 * This file contains mock user reviews with:
 * - Avatar images: Face portraits from Pexels (professional headshots)
 * - Success photos: Achievement/success images from Pexels (shown when clicking "View all reviews")
 *
 * To use these in the application:
 * 1. Copy the `reviews` array to `src/app/page.tsx`
 * 2. Or import this file and use the data directly
 */

import type { Review } from "@/components/page/HomePageClient";

// Pexels image URLs for user avatars (face portraits)
const avatarImages = {
  // Male portraits
  maleStudent1:
    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  maleProfessional1:
    "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  maleStudent2:
    "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",

  // Female portraits
  femaleStudent1:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  femaleGraduate1:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  femaleProfessional1:
    "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
};

// Pexels image URLs for success/achievement photos (shown in the "View all reviews" dialog)
const successImages = {
  graduation1:
    "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800",
  celebration1:
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  achievement1:
    "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
  success1:
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
  studying1:
    "https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=800",
  office1:
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
};

/**
 * Mock reviews data for Learner Stories section
 * - avatar: User's profile picture (face from Pexels)
 * - photo: Success/achievement image shown in the detail dialog (from Pexels)
 */
export const reviews: Review[] = [
  {
    name: "Nguyen Van A",
    avatar: avatarImages.maleStudent1,
    ielts: "7.5",
    content:
      "DailyEng helped me improve my speaking skills dramatically. The AI tutor is amazing!",
    direction: "up",
    fullFeedback:
      "DailyEng completely transformed my English learning journey. Before using this platform, I struggled with speaking confidence and couldn't hold a conversation for more than a few minutes. The AI tutor feature is incredibly patient and provides instant feedback on pronunciation and grammar. After 6 months of consistent practice, I achieved my dream IELTS score. The gamification elements kept me motivated throughout, and the speaking room sessions with other learners gave me real-world practice opportunities.",
    courses: [
      "IELTS Speaking Mastery",
      "Academic Writing",
      "Pronunciation Pro",
    ],
    result: { type: "IELTS", score: "7.5", previousScore: "5.5" },
    duration: "6 months",
    photo: successImages.graduation1,
  },
  {
    name: "Tran Thi B",
    avatar: avatarImages.femaleStudent1,
    ielts: "8.0",
    content:
      "I love the gamification features. Learning English has never been this fun!",
    direction: "up",
    fullFeedback:
      "As someone who always found traditional English classes boring, DailyEng was a breath of fresh air. The gamification features made me actually look forward to my daily lessons. I earned badges, competed on leaderboards, and the streak system ensured I never missed a day. The vocabulary hub is particularly impressive - I learned over 3000 new words in just 4 months. The platform's ability to adapt to my learning pace and style made all the difference in my IELTS preparation.",
    courses: [
      "Vocabulary Builder",
      "IELTS Complete Preparation",
      "Grammar Fundamentals",
    ],
    result: { type: "IELTS", score: "8.0", previousScore: "6.0" },
    duration: "4 months",
    photo: successImages.celebration1,
  },
  {
    name: "Le Van C",
    avatar: avatarImages.maleProfessional1,
    ielts: "7.0",
    content:
      "The personalized study plan keeps me motivated every day. Highly recommended!",
    direction: "up",
    fullFeedback:
      "Working full-time made it challenging to find time for English study, but DailyEng's personalized study plan fit perfectly into my busy schedule. The platform analyzed my strengths and weaknesses and created a custom curriculum just for me. The mobile app allowed me to study during commutes, and the short, focused lessons were perfect for my attention span. I went from intermediate to advanced level while maintaining my job, something I thought was impossible before.",
    courses: ["Business English", "Daily Conversation", "Listening Skills"],
    result: { type: "IELTS", score: "7.0", previousScore: "5.0" },
    duration: "8 months",
    photo: successImages.achievement1,
  },
  {
    name: "Pham Thi D",
    avatar: avatarImages.femaleGraduate1,
    ielts: "8.5",
    content:
      "Best English learning platform I've ever used. The speaking room is a game-changer!",
    direction: "down",
    fullFeedback:
      "I've tried numerous English learning platforms before DailyEng, but none came close to this experience. The speaking room feature connected me with learners from around the world, giving me invaluable practice in real conversations. The AI feedback on my speaking was spot-on and helped me identify issues I never knew I had. The comprehensive IELTS preparation materials, especially for the writing section, were exceptional. I achieved a band 8.5, exceeding my target of 7.5!",
    courses: [
      "IELTS Writing Excellence",
      "Speaking Room Premium",
      "Reading Strategies",
    ],
    result: { type: "IELTS", score: "8.5", previousScore: "6.5" },
    duration: "5 months",
    photo: successImages.success1,
  },
  {
    name: "Hoang Van E",
    avatar: avatarImages.maleStudent2,
    ielts: "7.5",
    content:
      "Great for exam preparation. I improved my IELTS score significantly!",
    direction: "down",
    fullFeedback:
      "DailyEng's exam preparation materials are comprehensive and well-structured. The practice tests closely mimic the actual IELTS format, which helped me feel confident on test day. The detailed explanations for each answer taught me valuable strategies and techniques. The progress tracking feature allowed me to see my improvement over time, which was incredibly motivating. I particularly loved the writing feedback system that provided specific suggestions for improvement.",
    courses: [
      "IELTS Full Preparation",
      "Test Strategies",
      "Time Management Skills",
    ],
    result: { type: "IELTS", score: "7.5", previousScore: "6.0" },
    duration: "3 months",
    photo: successImages.studying1,
  },
  {
    name: "Nguyen Thi F",
    avatar: avatarImages.femaleProfessional1,
    ielts: "N/A",
    content: "TOEIC preparation on DailyEng helped me get promoted at work!",
    direction: "up",
    fullFeedback:
      "My company required a minimum TOEIC score for promotion, and DailyEng helped me exceed that requirement by a huge margin. The business English focus was exactly what I needed for my career. The listening practice with various accents prepared me well for the real test. The vocabulary specific to corporate settings has been useful in my daily work communications. Within 2 months, I went from 650 to 890, opening new doors in my career.",
    courses: ["TOEIC Complete", "Business Communication", "Email Writing"],
    result: { type: "TOEIC", score: "890", previousScore: "650" },
    duration: "2 months",
    photo: successImages.office1,
  },
];

// Named exports for individual use
export { avatarImages, successImages };

// Default export for convenience
export default reviews;
