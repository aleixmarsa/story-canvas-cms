/*
  Warnings:

  - A unique constraint covering the columns `[sectionId,status,name]` on the table `SectionVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SectionVersion_sectionId_status_name_key" ON "SectionVersion"("sectionId", "status", "name");
