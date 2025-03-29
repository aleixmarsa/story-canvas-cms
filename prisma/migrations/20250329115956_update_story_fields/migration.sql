/*
  Warnings:

  - Made the column `author` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "author" SET NOT NULL;
