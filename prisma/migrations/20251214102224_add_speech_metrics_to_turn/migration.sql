-- AlterTable
ALTER TABLE "SpeakingTurn" ADD COLUMN     "confidenceScores" DOUBLE PRECISION[],
ADD COLUMN     "fluencyScore" INTEGER,
ADD COLUMN     "pauseCount" INTEGER,
ADD COLUMN     "pronunciationScore" INTEGER,
ADD COLUMN     "speakingDurationMs" INTEGER,
ADD COLUMN     "wordCount" INTEGER;
