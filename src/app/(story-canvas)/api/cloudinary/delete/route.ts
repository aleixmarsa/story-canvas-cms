import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/withAuth";
import { deleteCloudinaryMedia } from "@/lib/actions/cloudinary/delete-media";

export async function POST(req: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  try {
    const result = await deleteCloudinaryMedia(publicId);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete media: ${error}` },
      { status: 500 }
    );
  }
}
