import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting notification seeding (50 per user)...");

  // Get all users from database
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    console.error("❌ No users found in database.");
    return;
  }

  console.log(`📧 Found ${users.length} users`);

  // Full notification templates (50 total)
  const notificationTemplates = [
    // NOTEBOOK (15)
    {
      title: "Word Added to Notebook",
      message:
        "You've successfully added 'perseverance' to your vocabulary notebook.",
      type: NotificationType.notebook,
    },
    {
      title: "Notebook Milestone",
      message: "Congratulations! You now have 50 words in your notebook.",
      type: NotificationType.notebook,
    },
    {
      title: "Review Reminder",
      message: "You have 12 words ready for review in your notebook.",
      type: NotificationType.notebook,
    },
    {
      title: "Word Mastered",
      message:
        "Great job! You've mastered the word 'eloquent' after 5 reviews.",
      type: NotificationType.notebook,
    },
    {
      title: "Word of the Day",
      message: "Today's word 'serendipity' has been added to your notebook.",
      type: NotificationType.notebook,
    },
    {
      title: "New Note Added",
      message: "Grammar note for 'Present Perfect Tense' has been saved.",
      type: NotificationType.notebook,
    },
    {
      title: "Notebook Backup",
      message:
        "Your notebook has been automatically backed up. 127 items saved.",
      type: NotificationType.notebook,
    },
    {
      title: "Collection Created",
      message: "New collection 'Business English' created with 8 words.",
      type: NotificationType.notebook,
    },
    {
      title: "Vocabulary Export",
      message: "Your vocabulary list has been exported successfully.",
      type: NotificationType.notebook,
    },
    {
      title: "Study Set Ready",
      message:
        "Your custom study set 'IELTS Vocabulary' is ready for practice.",
      type: NotificationType.notebook,
    },
    {
      title: "Notebook Sync",
      message: "Your notebook has been synced across all devices.",
      type: NotificationType.notebook,
    },
    {
      title: "Review Streak",
      message: "Amazing! You've reviewed your notebook for 7 days straight.",
      type: NotificationType.notebook,
    },
    {
      title: "Difficult Words",
      message: "5 words marked as difficult are ready for focused practice.",
      type: NotificationType.notebook,
    },
    {
      title: "Notebook Organized",
      message: "Your notebook has been automatically organized by topic.",
      type: NotificationType.notebook,
    },
    {
      title: "Example Sentence Added",
      message: "New example sentence added for 'ambiguous' in your notebook.",
      type: NotificationType.notebook,
    },

    // PLAN (15)
    {
      title: "Daily Lesson Ready",
      message: "Your daily English lesson is ready. Let's start learning!",
      type: NotificationType.plan,
    },
    {
      title: "Study Plan Updated",
      message: "Your study plan has been updated based on your progress.",
      type: NotificationType.plan,
    },
    {
      title: "Weekly Goal Reminder",
      message: "You're 60% towards your weekly goal. Keep it up!",
      type: NotificationType.plan,
    },
    {
      title: "New Topic Unlocked",
      message: "You've unlocked a new topic: Advanced Conversation Skills.",
      type: NotificationType.plan,
    },
    {
      title: "Daily Mission Available",
      message: "New daily missions are available. Complete them to earn XP!",
      type: NotificationType.plan,
    },
    {
      title: "Lesson Completed",
      message: "Congratulations! You've completed today's grammar lesson.",
      type: NotificationType.plan,
    },
    {
      title: "Study Streak Alert",
      message: "Don't break your 15-day streak! Complete today's lesson.",
      type: NotificationType.plan,
    },
    {
      title: "Practice Reminder",
      message: "Time for your daily speaking practice session!",
      type: NotificationType.plan,
    },
    {
      title: "Weekly Report Ready",
      message: "Your weekly progress report is ready to view.",
      type: NotificationType.plan,
    },
    {
      title: "Study Goal Achieved",
      message: "Excellent! You've reached your monthly study goal of 20 hours.",
      type: NotificationType.plan,
    },
    {
      title: "Personalized Recommendation",
      message:
        "Based on your progress, we recommend focusing on pronunciation.",
      type: NotificationType.plan,
    },
    {
      title: "Exam Preparation",
      message: "Your IELTS exam is in 30 days. Here's your preparation plan.",
      type: NotificationType.plan,
    },
    {
      title: "Study Session Scheduled",
      message: "Your next study session is scheduled for tomorrow at 6:00 PM.",
      type: NotificationType.plan,
    },
    {
      title: "Progress Milestone",
      message: "You've completed 25% of your B2 level curriculum!",
      type: NotificationType.plan,
    },
    {
      title: "Study Plan Reminder",
      message: "You have 3 pending lessons in your study plan.",
      type: NotificationType.plan,
    },

    // ACHIEVEMENT (10)
    {
      title: "New Badge Earned",
      message: "You've earned the 'Week Warrior' badge! Keep up the streak.",
      type: NotificationType.achievement,
    },
    {
      title: "Level Up!",
      message: "Congratulations! You've advanced to B1 level.",
      type: NotificationType.achievement,
    },
    {
      title: "XP Milestone",
      message: "Amazing! You've reached 1,000 XP points.",
      type: NotificationType.achievement,
    },
    {
      title: "Perfect Score",
      message: "Outstanding! You scored 100% on your grammar quiz.",
      type: NotificationType.achievement,
    },
    {
      title: "Speaking Master",
      message:
        "You've completed 50 speaking sessions. You're a conversation pro!",
      type: NotificationType.achievement,
    },
    {
      title: "Vocabulary Champion",
      message: "Impressive! You've learned 500 new words this month.",
      type: NotificationType.achievement,
    },
    {
      title: "Early Bird Badge",
      message: "You've earned the 'Early Bird' badge for studying before 8 AM!",
      type: NotificationType.achievement,
    },
    {
      title: "Consistency Award",
      message: "30-day study streak achieved! You're unstoppable.",
      type: NotificationType.achievement,
    },
    {
      title: "Top Learner",
      message: "You're in the top 10% of learners this week!",
      type: NotificationType.achievement,
    },
    {
      title: "Challenge Completed",
      message: "You've completed the '7-Day Speaking Challenge'. Well done!",
      type: NotificationType.achievement,
    },

    // SYSTEM (10)
    {
      title: "Welcome to DailyEng",
      message: "Welcome! Start your English learning journey today.",
      type: NotificationType.system,
    },
    {
      title: "New Feature Available",
      message: "Check out our new AI-powered pronunciation feedback feature!",
      type: NotificationType.system,
    },
    {
      title: "Privacy Policy Update",
      message: "We've updated our privacy policy. Please review the changes.",
      type: NotificationType.system,
    },
    {
      title: "Community Event",
      message:
        "Join our live English conversation session this Saturday at 3 PM!",
      type: NotificationType.system,
    },
    {
      title: "System Restored",
      message: "All systems are operational. Thank you for your patience.",
      type: NotificationType.system,
    },
    {
      title: "System Maintenance",
      message: "Scheduled maintenance on Dec 20, 2:00-4:00 AM.",
      type: NotificationType.system,
    },
    {
      title: "Update Available",
      message:
        "A new version of DailyEng is available. Update for better performance.",
      type: NotificationType.system,
    },
    {
      title: "Account Security",
      message: "Your password was changed successfully.",
      type: NotificationType.system,
    },
    {
      title: "Feedback Request",
      message:
        "Help us improve! Share your feedback about your learning experience.",
      type: NotificationType.system,
    },
    {
      title: "Special Offer",
      message: "Premium features are now 50% off for the next 48 hours!",
      type: NotificationType.system,
    },
  ];

  const now = new Date();
  let totalCreated = 0;

  for (const user of users) {
    // Clear existing notifications for this user
    await prisma.notification.deleteMany({ where: { userId: user.id } });

    const notifications = [];

    for (let i = 0; i < notificationTemplates.length; i++) {
      const template = notificationTemplates[i];

      // Create timestamps going back in time (newest first)
      const minutesAgo = i * 15; // 15 minutes apart
      const createdAt = new Date(now.getTime() - minutesAgo * 60 * 1000);

      // First 25 are unread (page 1-3), last 25 are read (page 4-5)
      const isRead = i >= 25;

      notifications.push({
        userId: user.id,
        title: template.title,
        message: template.message,
        type: template.type,
        isRead,
        createdAt,
      });
    }

    const result = await prisma.notification.createMany({
      data: notifications,
    });
    totalCreated += result.count;
    console.log(`   ✅ ${user.email}: ${result.count} notifications`);
  }

  console.log(
    `\n🎉 Total created: ${totalCreated} notifications for ${users.length} users`
  );
  console.log(`📄 Each user has 50 notifications = 5 pages of 10`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding notifications:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
