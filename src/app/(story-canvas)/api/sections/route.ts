import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all sections (optionally filter by storyId)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storyId = searchParams.get("storyId");

  const sections = await prisma.section.findMany({
    where: storyId ? { storyId: Number(storyId) } : undefined,
    orderBy: { order: "asc" },
  });

  return NextResponse.json(sections);
}

// Create a new section for a story
export async function POST(req: NextRequest) {
  const data = await req.json();
  const section = await prisma.section.create({
    data: {
      storyId: data.storyId,
      name: data.name,
      type: data.type,
      content: data.content,
      order: data.order,
    },
  });

  return NextResponse.json(section);
}
