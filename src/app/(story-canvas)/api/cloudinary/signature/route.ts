import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/lib/auth/withAuth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/cloudinary/signature
 * Generates a signature for Cloudinary upload widget.
 * This is used to securely upload files.
 * @param req - The request object.
 * @param params - The parameters object containing the params to sign.
 * @returns A JSON response with the signature.
 * @throws 400 - Bad request if paramsToSign is not provided.
 * @throws 500 - Internal server error if Cloudinary API secret is not set.
 */
export async function POST(request: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;
  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary API secret is not set" },
      { status: 500 }
    );
  }
  const body = await request.json();
  const { paramsToSign } = body;
  if (!paramsToSign) {
    return NextResponse.json(
      { error: "paramsToSign is required" },
      { status: 400 }
    );
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return Response.json({ signature });
}
