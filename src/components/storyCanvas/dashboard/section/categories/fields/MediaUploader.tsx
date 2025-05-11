"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import type { MediaFieldTypes } from "@/types/section-fields";
import { MediaField } from "@/sections/validation/fields/media-field-schema";

type MediaUploaderProps = {
  onUpload: ({ url, publicId }: MediaField) => void;
  currentValue?: MediaField;
  type: MediaFieldTypes;
};

const MediaUploader = ({
  onUpload,
  currentValue,
  type,
}: MediaUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(currentValue?.url);
  const [publicId, setPublicId] = useState<string | undefined>(
    currentValue?.publicId
  );

  const handleRemove = async () => {
    if (!publicId) return;

    try {
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      setPreviewUrl(undefined);
      setPublicId(undefined);
      onUpload({
        url: "",
        publicId: "",
      });
    } catch (error) {
      console.error("Failed to delete from Cloudinary:", error);
    }
  };

  /**
   * Check widget options at:
   * https://cloudinary.com/documentation/upload_widget_reference#parameterså
   */
  return (
    <div className="space-y-2">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        signatureEndpoint="/api/cloudinary/signature"
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
          multiple: false,
          cropping: true,
          croppingShowDimensions: true,
          croppingShowBackButton: true,
          maxFileSize: type === "image" ? 2_000_000 : 15_000_000, // 2MB for images, 15MB for videos
        }}
        onSuccess={(result) => {
          const info = result.info as CloudinaryUploadWidgetInfo;
          const url = info.secure_url;
          const id = info.public_id;

          if (typeof url === "string" && typeof id === "string") {
            setPreviewUrl(url);
            setPublicId(id);
            onUpload({
              url,
              publicId: id,
            });
          }
        }}
        onError={(error) => {
          console.error("Upload error:", error);
        }}
      >
        {({ open }) => (
          <Button type="button" onClick={() => open?.()} size={"sm"}>
            Upload
          </Button>
        )}
      </CldUploadWidget>

      {previewUrl && (
        <div className="relative w-fit">
          {type === "image" ? (
            <img
              src={previewUrl}
              alt="Uploaded media"
              className="max-w-xs rounded border"
            />
          ) : (
            <video
              src={previewUrl}
              controls
              className="max-w-xs rounded border"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
