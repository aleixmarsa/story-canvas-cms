import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("securepassword", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@cms.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Story to test the list
  const listStory = await prisma.story.create({ data: {} });
  const listVersion = await prisma.storyVersion.create({
    data: {
      title: "Story visible in list",
      slug: "story-list",
      createdBy: admin.email,
      description: "Story for list test",
      status: "draft",
      storyId: listStory.id,
      theme: {},
      content: {},
    },
  });
  await prisma.story.update({
    where: { id: listStory.id },
    data: { currentDraftId: listVersion.id },
  });

  // Story to test editing
  const editableStory = await prisma.story.create({ data: {} });
  const editableVersion = await prisma.storyVersion.create({
    data: {
      title: "Story to edit",
      slug: "story-edit",
      createdBy: admin.email,
      description: "Story for editing test",
      status: "draft",
      storyId: editableStory.id,
      theme: {},
      content: {},
    },
  });
  await prisma.story.update({
    where: { id: editableStory.id },
    data: { currentDraftId: editableVersion.id },
  });

  //  Story to test deletion
  const deletableStory = await prisma.story.create({ data: {} });
  const deletableVersion = await prisma.storyVersion.create({
    data: {
      title: "Story to delete",
      slug: "story-delete",
      createdBy: admin.email,
      description: "Story for deletion test",
      status: "draft",
      storyId: deletableStory.id,
      theme: {},
      content: {},
    },
  });
  await prisma.story.update({
    where: { id: deletableStory.id },
    data: { currentDraftId: deletableVersion.id },
  });

  // Section for list test
  const listSection = await prisma.section.create({
    data: {
      storyId: listStory.id,
    },
  });
  const listSectionVersion = await prisma.sectionVersion.create({
    data: {
      name: "Section visible in list",
      slug: slugify("Section visible in list"),
      createdBy: admin.email,
      type: "TITLE",
      order: 1,
      content: { text: "Section for listing" },
      status: "draft",
      sectionId: listSection.id,
    },
  });
  await prisma.section.update({
    where: { id: listSection.id },
    data: { currentDraftId: listSectionVersion.id },
  });

  // Section for edit test
  const editSection = await prisma.section.create({
    data: {
      storyId: listStory.id,
    },
  });
  const editSectionVersion = await prisma.sectionVersion.create({
    data: {
      name: "Section to edit",
      slug: slugify("Section to edit"),
      createdBy: admin.email,
      type: "TITLE",
      order: 1,
      content: { text: "Editable content" },
      status: "draft",
      sectionId: editSection.id,
    },
  });
  await prisma.section.update({
    where: { id: editSection.id },
    data: { currentDraftId: editSectionVersion.id },
  });

  // Section for delete test
  const deleteSection = await prisma.section.create({
    data: {
      storyId: listStory.id,
    },
  });
  const deleteSectionVersion = await prisma.sectionVersion.create({
    data: {
      name: "Section to delete",
      slug: slugify("Section to delete"),
      createdBy: admin.email,
      type: "IMAGE",
      order: 1,
      content: { text: "Section to delete" },
      status: "draft",
      sectionId: deleteSection.id,
    },
  });
  await prisma.section.update({
    where: { id: deleteSection.id },
    data: { currentDraftId: deleteSectionVersion.id },
  });

  console.log(
    "✅ Seeded: user + 3 stories (list, edit, delete) + 3 sections (list, edit, delete)"
  );
}

main()
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
