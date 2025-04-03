/*
  Warnings:

  - You are about to drop the column `content` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Story` table. All the data in the column will be lost.
  - Added the required column `draftVersion` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `draftVersion` to the `Story` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "content",
ADD COLUMN     "draftVersion" JSONB NOT NULL,
ADD COLUMN     "publishedVersion" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "title",
ADD COLUMN     "draftVersion" JSONB NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "publishedVersion" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
