import { TitleSectionProps } from "@/sections/validation/sections/title-section-schema";

const TitleSection = ({ text, backgroundImage }: TitleSectionProps) => {
  return (
    <section className="py-8">
      {backgroundImage && (
        <div
          className="w-full h-64 bg-cover bg-center mb-4"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <h1 className="text-4xl font-bold">{text}</h1>
    </section>
  );
};

export default TitleSection;
