/*
  Warnings:

  - You are about to drop the column `components` on the `StoryVersion` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `StoryVersion` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `StoryVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "StoryVersion" DROP COLUMN "components",
DROP COLUMN "content",
DROP COLUMN "theme";
