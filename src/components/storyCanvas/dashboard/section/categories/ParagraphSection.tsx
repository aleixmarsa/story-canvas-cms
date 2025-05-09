import { ParagraphSectionProps } from "@/sections/validation/sections/paragraph-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ParagraphSection = ({ body }: ParagraphSectionProps) => {
  return (
    <section className="py-8 max-w-3xl mx-auto">
      <RichTextContent html={body} />
    </section>
  );
};

export default ParagraphSection;
