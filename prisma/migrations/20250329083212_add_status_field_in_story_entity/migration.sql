-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('draft', 'published');

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "status" "StoryStatus" NOT NULL DEFAULT 'draft';
