/*
  Warnings:

  - Added the required column `updatedAt` to the `SectionVersion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SectionVersion_sectionId_status_key";

-- AlterTable
ALTER TABLE "SectionVersion" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
