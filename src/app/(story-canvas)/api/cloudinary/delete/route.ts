import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/withAuth";
import { deleteCloudinaryMedia } from "@/lib/actions/cloudinary/delete-media";
import { TEMPLATE_IMAGE } from "@/lib/constants/template";

/**
 * POST /api/cloudinary/delete
 * Deletes a media file from Cloudinary.
 * @param req - The request object.
 * @returns A JSON response with the result of the deletion.
 * @throws 400 - Bad request if publicId is not provided.
 * @throws 500 - Internal server error if deletion fails.
 */
export async function POST(req: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
  }

  // Prevent deletion of the default template image
  if (publicId === TEMPLATE_IMAGE) {
    return NextResponse.json(
      { error: "Cannot delete the default template image" },
      { status: 400 }
    );
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
