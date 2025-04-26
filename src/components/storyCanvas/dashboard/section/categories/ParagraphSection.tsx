import { ParagraphSectionProps } from "@/sections/validation/paragraph-section-schema";

const ParagraphSection = ({ body }: ParagraphSectionProps) => {
  return (
    <section className="py-8 max-w-3xl mx-auto">
      <p className="text-lg leading-relaxed">{body}</p>
    </section>
  );
};

export default ParagraphSection;
