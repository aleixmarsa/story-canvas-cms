import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { SectionType } from "@prisma/client";

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
  try {
    const data = await req.json();

    const { storyId, name, order, type, content } = data;

    if (!storyId || !name || typeof order !== "number" || !type || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!(type in sectionSchemas)) {
      return NextResponse.json(
        { error: `Unsupported section type: ${type}` },
        { status: 400 }
      );
    }

    // Validate content according to section type schema
    const schema = sectionSchemas[type as SectionType].schema;
    const parsed = schema.safeParse({ name, order, ...content });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 422 }
      );
    }

    const section = await prisma.section.create({
      data: {
        storyId,
        name,
        order,
        type,
        content,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("POST /api/sections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
