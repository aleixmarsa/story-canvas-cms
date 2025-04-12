/*
  Warnings:

  - Added the required column `slug` to the `SectionVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SectionVersion" ADD COLUMN     "slug" TEXT NOT NULL;
