/*
  Warnings:

  - You are about to drop the column `collectionId` on the `NotebookItem` table. All the data in the column will be lost.
  - Added the required column `notebookId` to the `NotebookItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotebookItem" DROP COLUMN "collectionId",
ADD COLUMN     "notebookId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'primary',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notebook_userId_name_key" ON "Notebook"("userId", "name");

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookItem" ADD CONSTRAINT "NotebookItem_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
