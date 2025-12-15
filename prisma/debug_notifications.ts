import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get all users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });

  console.log("All users:");
  users.forEach((u) => console.log(`  - ${u.id} | ${u.email} | ${u.name}`));

  // Get notification counts per user
  console.log("\nNotifications per user:");
  for (const user of users) {
    const count = await prisma.notification.count({
      where: { userId: user.id },
    });
    console.log(`  - ${user.email}: ${count} notifications`);
  }

  // Get total notifications
  const total = await prisma.notification.count();
  console.log(`\nTotal notifications: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
