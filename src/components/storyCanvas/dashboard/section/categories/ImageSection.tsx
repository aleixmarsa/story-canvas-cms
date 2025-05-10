import { ImageSectionProps } from "@/sections/validation/sections/image-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ImageSection = ({
  image,
  alt,
  caption,
  imageSize,
}: ImageSectionProps) => {
  if (!image) return null;
  return (
    <div className="py-8">
      {image ? (
        <img
          src={image.url}
          alt={alt || "Image"}
          className="rounded-lg shadow-md"
          width={imageSize?.width || "auto"}
          height={imageSize?.height || "auto"}
        />
      ) : (
        <></>
      )}
      {caption && (
        <div className="mt-2">
          <RichTextContent html={caption} />
        </div>
      )}
    </div>
  );
};

export default ImageSection;
