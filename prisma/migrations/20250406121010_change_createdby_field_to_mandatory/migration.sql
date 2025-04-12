/*
  Warnings:

  - Made the column `createdBy` on table `StoryVersion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StoryVersion" ALTER COLUMN "createdBy" SET NOT NULL;
