/*
  Warnings:

  - You are about to drop the column `duration` on the `SpeakingScenario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SpeakingScenario" DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "SpeakingSession" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "overallScore" INTEGER;
