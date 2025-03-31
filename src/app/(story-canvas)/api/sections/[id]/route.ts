import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { SectionType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { slugify } from "@/lib/utils";
// Update a section by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid section ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, order, content } = body;

    const existingSection = await prisma.section.findUnique({ where: { id } });
    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const schema = sectionSchemas[existingSection.type as SectionType].schema;
    const parsed = schema.safeParse({ name, order, ...content });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 422 }
      );
    }

    try {
      const updated = await prisma.section.update({
        where: { id },
        data: {
          name,
          order,
          content,
          slug: slugify(name),
        },
      });

      return NextResponse.json(updated);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Section name must be unique" },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
