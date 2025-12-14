-- AlterTable
ALTER TABLE "SpeakingTurn" ADD COLUMN     "avgPitch" DOUBLE PRECISION,
ADD COLUMN     "pitchSamplesCount" INTEGER,
ADD COLUMN     "pitchVariance" DOUBLE PRECISION;
