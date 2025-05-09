import { ImageSectionProps } from "@/sections/validation/sections/image-section-schema";

const ImageSection = ({ image, alt, caption }: ImageSectionProps) => {
  return (
    <div className="py-8 text-center">
      <img
        src={image.url}
        alt={alt || "Image"}
        className="mx-auto rounded-lg shadow-md"
      />
      {caption && <p className="mt-2 text-sm text-gray-600">{caption}</p>}
    </div>
  );
};

export default ImageSection;
