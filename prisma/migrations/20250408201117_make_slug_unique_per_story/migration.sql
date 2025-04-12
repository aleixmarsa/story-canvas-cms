/*
  Warnings:

  - A unique constraint covering the columns `[slug,storyId]` on the table `StoryVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StoryVersion_slug_status_key";

-- CreateIndex
CREATE UNIQUE INDEX "StoryVersion_slug_storyId_key" ON "StoryVersion"("slug", "storyId");
