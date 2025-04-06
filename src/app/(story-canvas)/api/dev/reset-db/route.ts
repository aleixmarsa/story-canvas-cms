import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const allowedTables = ["Story", "Section"];

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Forbidden in production" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");

  try {
    if (table) {
      if (!allowedTables.includes(table)) {
        return NextResponse.json(
          { error: "Invalid table name" },
          { status: 400 }
        );
      }

      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
      );
      return NextResponse.json({
        message: `Table "${table}" reset successfully`,
      });
    }

    // If no table specified, reset all
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Section", "Story" RESTART IDENTITY CASCADE;`
    );
    return NextResponse.json({ message: "All tables reset successfully" });
  } catch (error) {
    console.error("Error truncating tables:", error);
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
