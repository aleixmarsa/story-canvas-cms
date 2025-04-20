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

  const story = await prisma.story.create({
    data: {},
  });

  const version = await prisma.storyVersion.create({
    data: {
      title: "Sample Story Title",
      slug: "sample-story",
      createdBy: admin.email,
      description: "A demo story created from seed",
      status: "draft",
      storyId: story.id,
      theme: {},
      content: {},
    },
  });

  // Update the story with the current draft ID
  await prisma.story.update({
    where: { id: story.id },
    data: {
      currentDraftId: version.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
