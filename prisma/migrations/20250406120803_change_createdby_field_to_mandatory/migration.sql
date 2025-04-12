/*
  Warnings:

  - Made the column `createdBy` on table `SectionVersion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SectionVersion" ALTER COLUMN "createdBy" SET NOT NULL;
