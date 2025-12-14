/*
  Warnings:

  - You are about to drop the column `contentScore` on the `SpeakingTurn` table. All the data in the column will be lost.
  - You are about to drop the column `fluencyScore` on the `SpeakingTurn` table. All the data in the column will be lost.
  - You are about to drop the column `grammarScore` on the `SpeakingTurn` table. All the data in the column will be lost.
  - You are about to drop the column `intonationScore` on the `SpeakingTurn` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciationScore` on the `SpeakingTurn` table. All the data in the column will be lost.
  - You are about to drop the column `relevanceScore` on the `SpeakingTurn` table. All the data in the column will be lost.
  - Added the required column `endIndex` to the `SpeakingTurnError` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startIndex` to the `SpeakingTurnError` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpeakingSession" ADD COLUMN     "feedbackRating" TEXT,
ADD COLUMN     "feedbackSummary" TEXT,
ADD COLUMN     "feedbackTip" TEXT,
ADD COLUMN     "feedbackTitle" TEXT,
ADD COLUMN     "fluencyScore" INTEGER,
ADD COLUMN     "grammarScore" INTEGER,
ADD COLUMN     "intonationScore" INTEGER,
ADD COLUMN     "pronunciationScore" INTEGER,
ADD COLUMN     "relevanceScore" INTEGER;

-- AlterTable
ALTER TABLE "SpeakingTurn" DROP COLUMN "contentScore",
DROP COLUMN "fluencyScore",
DROP COLUMN "grammarScore",
DROP COLUMN "intonationScore",
DROP COLUMN "pronunciationScore",
DROP COLUMN "relevanceScore";

-- AlterTable
ALTER TABLE "SpeakingTurnError" ADD COLUMN     "endIndex" INTEGER NOT NULL,
ADD COLUMN     "startIndex" INTEGER NOT NULL;
