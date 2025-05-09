import { ImageSectionProps } from "@/sections/validation/sections/image-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ImageSection = ({ image, alt, caption }: ImageSectionProps) => {
  return (
    <div className="py-8 text-center">
      <img
        src={image.url}
        alt={alt || "Image"}
        className="mx-auto rounded-lg shadow-md"
      />
      {caption && (
        <div className="mt-2">
          <RichTextContent html={caption} />
        </div>
      )}
    </div>
  );
};

export default ImageSection;
