/*
  Warnings:

  - A unique constraint covering the columns `[storyId,name]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Section_storyId_name_key" ON "Section"("storyId", "name");
