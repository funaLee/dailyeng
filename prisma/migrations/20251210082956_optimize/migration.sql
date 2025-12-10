/*
  Warnings:

  - You are about to drop the column `courseId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `CollectionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseRegistration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShopItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseRegistration" DROP CONSTRAINT "CourseRegistration_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRegistration" DROP CONSTRAINT "CourseRegistration_userId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserCollection" DROP CONSTRAINT "UserCollection_itemId_fkey";

-- DropForeignKey
ALTER TABLE "UserCollection" DROP CONSTRAINT "UserCollection_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserInventory" DROP CONSTRAINT "UserInventory_itemId_fkey";

-- DropForeignKey
ALTER TABLE "UserInventory" DROP CONSTRAINT "UserInventory_userId_fkey";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "courseId";

-- DropTable
DROP TABLE "CollectionItem";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseRegistration";

-- DropTable
DROP TABLE "ShopItem";

-- DropTable
DROP TABLE "UserCollection";

-- DropTable
DROP TABLE "UserInventory";

-- DropEnum
DROP TYPE "CollectionRarity";

-- DropEnum
DROP TYPE "CollectionType";

-- DropEnum
DROP TYPE "ShopItemCategory";
