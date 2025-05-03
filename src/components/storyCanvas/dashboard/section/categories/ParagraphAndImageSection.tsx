import { ParagraphAndImageSectionProps } from "@/sections/validation/paragraph-and-image-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ParagraphAndImageSection = ({
  body,
  url,
  alt,
  caption,
  layout,
}: ParagraphAndImageSectionProps) => {
  const isLeft = layout === "left";
  return (
    <section className="py-8 max-w-3xl mx-auto">
      <div
        className={`flex flex-col md:flex-row md:justify-between ${
          isLeft ? "md:flex-row-reverse" : ""
        } gap-6 items-center`}
      >
        <div className="w-full md:w-1/2">
          <img
            src={url}
            alt={alt || ""}
            className="rounded-lg w-full h-auto object-cover"
          />
          {caption && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {caption}
            </p>
          )}
        </div>

        <RichTextContent html={body} />
      </div>
    </section>
  );
};

export default ParagraphAndImageSection;
