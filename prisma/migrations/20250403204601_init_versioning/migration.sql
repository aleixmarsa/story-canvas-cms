/*
  Warnings:

  - You are about to drop the column `draftVersion` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `publishedVersion` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `components` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `draftVersion` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `publishedVersion` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Story` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentDraftId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publishedVersionId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicSlug]` on the table `Story` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentDraftId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publishedVersionId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Section_storyId_name_key";

-- DropIndex
DROP INDEX "Story_slug_key";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "draftVersion",
DROP COLUMN "name",
DROP COLUMN "order",
DROP COLUMN "publishedVersion",
DROP COLUMN "slug",
DROP COLUMN "type",
ADD COLUMN     "currentDraftId" INTEGER,
ADD COLUMN     "lastEditedBy" TEXT,
ADD COLUMN     "lockedBy" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "publishedVersionId" INTEGER;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "author",
DROP COLUMN "components",
DROP COLUMN "draftVersion",
DROP COLUMN "publishedVersion",
DROP COLUMN "slug",
DROP COLUMN "status",
ADD COLUMN     "currentDraftId" INTEGER,
ADD COLUMN     "lastEditedBy" TEXT,
ADD COLUMN     "lockedBy" TEXT,
ADD COLUMN     "publicSlug" TEXT,
ADD COLUMN     "publishedVersionId" INTEGER;

-- CreateTable
CREATE TABLE "StoryVersion" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "theme" JSONB,
    "components" JSONB,
    "content" JSONB,
    "status" "StoryStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "comment" TEXT,

    CONSTRAINT "StoryVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionVersion" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "status" "StoryStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "comment" TEXT,

    CONSTRAINT "SectionVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryVersion_storyId_status_idx" ON "StoryVersion"("storyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StoryVersion_slug_status_key" ON "StoryVersion"("slug", "status");

-- CreateIndex
CREATE INDEX "SectionVersion_sectionId_status_idx" ON "SectionVersion"("sectionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SectionVersion_sectionId_status_key" ON "SectionVersion"("sectionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Section_currentDraftId_key" ON "Section"("currentDraftId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_publishedVersionId_key" ON "Section"("publishedVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_publicSlug_key" ON "Story"("publicSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Story_currentDraftId_key" ON "Story"("currentDraftId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_publishedVersionId_key" ON "Story"("publishedVersionId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_currentDraftId_fkey" FOREIGN KEY ("currentDraftId") REFERENCES "StoryVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_publishedVersionId_fkey" FOREIGN KEY ("publishedVersionId") REFERENCES "StoryVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryVersion" ADD CONSTRAINT "StoryVersion_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_currentDraftId_fkey" FOREIGN KEY ("currentDraftId") REFERENCES "SectionVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_publishedVersionId_fkey" FOREIGN KEY ("publishedVersionId") REFERENCES "SectionVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionVersion" ADD CONSTRAINT "SectionVersion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
