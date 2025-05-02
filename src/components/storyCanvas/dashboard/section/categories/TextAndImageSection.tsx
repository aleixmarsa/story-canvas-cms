import { TextAndImageSectionProps } from "@/sections/validation/text-and-image-section-schema";
import RichTextContent from "./fields/RichTextContent";
const TextAndImageSection = ({
  body,
  url,
  alt,
  caption,
  layout,
}: TextAndImageSectionProps) => {
  const isLeft = layout === "left";
  return (
    <section className="py-8 max-w-3xl mx-auto">
      <div
        className={`flex flex-col md:flex-row ${
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

export default TextAndImageSection;
