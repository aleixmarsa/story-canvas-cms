import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update a section by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sectionId = Number(params.id);
  const data = await req.json();

  const updatedSection = await prisma.section.update({
    where: { id: sectionId },
    data: {
      type: data.type,
      content: data.content,
      order: data.order,
    },
  });

  return NextResponse.json(updatedSection);
}
