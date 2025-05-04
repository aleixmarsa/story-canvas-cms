import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/withAuth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete media: ${error}` },
      { status: 500 }
    );
  }
}
