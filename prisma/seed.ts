import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  // Seed 1: Story to test the list
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

  // Seed 2: Story to test editing
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

  // Seed 3: Story to test deletion
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

  console.log("✅ Seeded: user + 3 stories (list, edit, delete)");
}

main()
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
