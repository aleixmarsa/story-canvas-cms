import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { storySchema } from "@/lib/validation/storySchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const storyId = Number(params.id);
  if (isNaN(storyId)) {
    return NextResponse.json({ message: "Invalid story ID" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = storySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  }

  try {
    const updated = await prisma.story.update({
      where: { id: storyId },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        author: parsed.data.author,
      },
    });

    return NextResponse.json(updated);
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
