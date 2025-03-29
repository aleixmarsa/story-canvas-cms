/*
  Warnings:

  - Changed the type of `type` on the `Section` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('TITLE', 'PARAGRAPH', 'IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "type",
ADD COLUMN     "type" "SectionType" NOT NULL;
