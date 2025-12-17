/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "HubType" ADD VALUE 'vocab';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "VocabItem" ADD COLUMN     "antonyms" TEXT[],
ADD COLUMN     "definitions" JSONB,
ADD COLUMN     "phonBr" TEXT,
ADD COLUMN     "phonNAm" TEXT,
ADD COLUMN     "synonyms" TEXT[],
ALTER COLUMN "pronunciation" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserVocabProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabItemId" TEXT NOT NULL,
    "masteryLevel" INTEGER NOT NULL DEFAULT 0,
    "lastReviewed" TIMESTAMP(3),
    "nextReview" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVocabProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVocabProgress_userId_vocabItemId_key" ON "UserVocabProgress"("userId", "vocabItemId");

-- AddForeignKey
ALTER TABLE "UserVocabProgress" ADD CONSTRAINT "UserVocabProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabProgress" ADD CONSTRAINT "UserVocabProgress_vocabItemId_fkey" FOREIGN KEY ("vocabItemId") REFERENCES "VocabItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
