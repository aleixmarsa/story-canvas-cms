import { v2 as cloudinary } from "cloudinary";
import { verifySession } from "@/lib/dal/auth";

export const deleteCloudinaryMedia = async (publicId: string) => {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" };

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary.uploader.destroy(publicId);
};
