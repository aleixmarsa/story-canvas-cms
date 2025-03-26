/*
  Warnings:

  - You are about to drop the column `projectId` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_projectId_fkey";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "projectId",
ADD COLUMN     "author" TEXT;

-- DropTable
DROP TABLE "Project";
