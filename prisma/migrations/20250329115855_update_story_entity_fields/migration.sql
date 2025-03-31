/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "coverImage",
DROP COLUMN "description",
DROP COLUMN "theme";
