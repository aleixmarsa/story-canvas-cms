import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all stories
export async function GET() {
  const stories = await prisma.story.findMany({
    include: { sections: true },
  });

  return NextResponse.json(stories);
}

// Create a new story
export async function POST(req: NextRequest) {
  const data = await req.json();
  const story = await prisma.story.create({
    data: {
      title: data.title,
      slug: data.slug,
      author: data.author,
      components: data.components,
    },
  });
  return NextResponse.json(story);
}
