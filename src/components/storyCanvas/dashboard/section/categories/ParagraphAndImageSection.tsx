import { ParagraphAndImageSectionProps } from "@/sections/validation/sections/paragraph-and-image-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ParagraphAndImageSection = ({
  body,
  image,
  alt,
  caption,
  layout,
  imageSize,
}: ParagraphAndImageSectionProps) => {
  const isLeft = layout === "left";
  return (
    <div className="py-8">
      <div
        className={`flex flex-col md:flex-row md:justify-between ${
          isLeft ? "md:flex-row-reverse" : ""
        } gap-6 items-center`}
      >
        <div className="shrink-0 w-full md:w-1/2">
          <img
            src={image.url}
            alt={alt || "Image"}
            className="mx-auto rounded-lg shadow-md"
            width={imageSize?.width || "auto"}
            height={imageSize?.height || "auto"}
          />
          {caption && <RichTextContent html={caption} />}
        </div>

        <RichTextContent html={body} />
      </div>
    </div>
  );
};

export default ParagraphAndImageSection;
