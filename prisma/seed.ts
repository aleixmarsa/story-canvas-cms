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

  const editor = await prisma.user.create({
    data: {
      email: "editor@cms.com",
      password: hashedPassword,
      role: "EDITOR",
    },
  });

  // [ADMIN] Story to test the list
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

  // [EDITOR] Story to test the list
  const editorListStory = await prisma.story.create({ data: {} });
  const editorListVersion = await prisma.storyVersion.create({
    data: {
      title: "Editor story visible in list",
      slug: "editor-story-list",
      createdBy: editor.email,
      description: "Editor Story for list test",
      status: "draft",
      storyId: editorListStory.id,
      theme: {},
      content: {},
    },
  });
  await prisma.story.update({
    where: { id: editorListStory.id },
    data: { currentDraftId: editorListVersion.id },
  });

  // [ADMIN] Story to test editing
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

  // [EDITOR] Story to test editing
  const editorEditableStory = await prisma.story.create({ data: {} });
  const editorEditableVersion = await prisma.storyVersion.create({
    data: {
      title: "Editor Story to edit",
      slug: "editor-story-edit",
      createdBy: editor.email,
      description: "Editor Story for editing test",
      status: "draft",
      storyId: editorEditableStory.id,
      theme: {},
      content: {},
    },
  });
  await prisma.story.update({
    where: { id: editorEditableStory.id },
    data: { currentDraftId: editorEditableVersion.id },
  });

  // [ADMIN] Story to test deleting
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

  // [ADMIN] Section to test listing
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

  // [EDITOR] Section to test listing
  const editorListSection = await prisma.section.create({
    data: {
      storyId: editorListStory.id,
    },
  });
  const editorListSectionVersion = await prisma.sectionVersion.create({
    data: {
      name: "Editor Section visible in list",
      slug: slugify("Editor Section visible in list"),
      createdBy: editor.email,
      type: "TITLE",
      order: 1,
      content: { text: "Editor Section for listing" },
      status: "draft",
      sectionId: editorListSection.id,
    },
  });
  await prisma.section.update({
    where: { id: editorListSection.id },
    data: { currentDraftId: editorListSectionVersion.id },
  });

  // [ADMIN] Section to test editing
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

  // [EDITOR] Section to test editing
  const editorEditSection = await prisma.section.create({
    data: {
      storyId: editorListStory.id,
    },
  });
  const editorEditSectionVersion = await prisma.sectionVersion.create({
    data: {
      name: "Editor Section to edit",
      slug: slugify("Editor Section to edit"),
      createdBy: editor.email,
      type: "TITLE",
      order: 1,
      content: { text: "Editor Editable content" },
      status: "draft",
      sectionId: editorEditSection.id,
    },
  });
  await prisma.section.update({
    where: { id: editorEditSection.id },
    data: { currentDraftId: editorEditSectionVersion.id },
  });

  // [ADMIN] Section to test deleting
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

  // [EDITOR] Section to test deleting
  const editorDeleteSection = await prisma.section.create({
    data: {
      storyId: editorListStory.id,
    },
  });
  const editorDeleteSectionVersion = await prisma.sectionVersion.create({
    data: {
      name: "Editor Section to delete",
      slug: slugify("Editor Section to delete"),
      createdBy: editor.email,
      type: "IMAGE",
      order: 1,
      content: { text: "Editor Section to delete" },
      status: "draft",
      sectionId: deleteSection.id,
    },
  });
  await prisma.section.update({
    where: { id: editorDeleteSection.id },
    data: { currentDraftId: editorDeleteSectionVersion.id },
  });

  console.log(
    "Seeded: user + 6 stories (list, edit, delete) + 6 sections (list, edit, delete)"
  );
}

main()
  .catch(async (e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
