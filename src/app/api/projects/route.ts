import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Return all projects
export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

// Create a new project
export async function POST(req: NextRequest) {
  const data = await req.json();
  const project = await prisma.project.create({
    data: {
      name: data.name,
      slug: data.slug,
      author: data.author,
      description: data.description,
    },
  });
  return NextResponse.json(project);
}
