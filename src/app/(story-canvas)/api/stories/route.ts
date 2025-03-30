import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

  try {
    const story = await prisma.story.create({
      data: {
        title: data.title,
        slug: data.slug,
        author: data.author,
        components: data.components,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
