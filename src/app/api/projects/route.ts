import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Return all projects
export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

// Create a new project
export async function POST(req: NextRequest) {
  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      slug: body.slug,
      author: body.author,
      theme: body.theme || {},
      components: body.components || {},
      assetsConfig: body.assetsConfig || {},
    },
  });

  return NextResponse.json(project);
}
