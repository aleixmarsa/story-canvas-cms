import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all stories (optionally filter by projectId)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const stories = await prisma.story.findMany({
    where: projectId ? { projectId: Number(projectId) } : undefined,
    include: { sections: true },
  });

  return NextResponse.json(stories);
}

// Create a new story
export async function POST(req: NextRequest) {
  const data = await req.json();
  const story = await prisma.story.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      coverImage: data.coverImage,
      theme: data.theme,
      components: data.components,
    },
  });
  return NextResponse.json(story);
}
