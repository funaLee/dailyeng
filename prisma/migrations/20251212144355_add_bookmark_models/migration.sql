-- CreateTable
CREATE TABLE "VocabBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VocabBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrammarBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrammarBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VocabBookmark_userId_topicId_key" ON "VocabBookmark"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarBookmark_userId_topicId_key" ON "GrammarBookmark"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "VocabBookmark" ADD CONSTRAINT "VocabBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabBookmark" ADD CONSTRAINT "VocabBookmark_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarBookmark" ADD CONSTRAINT "GrammarBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarBookmark" ADD CONSTRAINT "GrammarBookmark_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
