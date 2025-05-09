import { ParagraphSectionProps } from "@/sections/validation/sections/paragraph-section-schema";
import RichTextContent from "./fields/RichTextContent";

const ParagraphSection = ({ body }: ParagraphSectionProps) => {
  return (
    <div className="py-8">
      <RichTextContent html={body} />
    </div>
  );
};

export default ParagraphSection;
