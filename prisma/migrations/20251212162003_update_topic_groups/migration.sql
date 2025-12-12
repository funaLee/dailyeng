-- CreateEnum
CREATE TYPE "HubType" AS ENUM ('speaking', 'grammar');

-- AlterTable
ALTER TABLE "SpeakingScenario" ADD COLUMN     "topicGroupId" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "topicGroupId" TEXT;

-- CreateTable
CREATE TABLE "TopicGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "hubType" "HubType" NOT NULL,
    "subcategories" TEXT[],

    CONSTRAINT "TopicGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopicGroup_name_hubType_key" ON "TopicGroup"("name", "hubType");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_topicGroupId_fkey" FOREIGN KEY ("topicGroupId") REFERENCES "TopicGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakingScenario" ADD CONSTRAINT "SpeakingScenario_topicGroupId_fkey" FOREIGN KEY ("topicGroupId") REFERENCES "TopicGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
