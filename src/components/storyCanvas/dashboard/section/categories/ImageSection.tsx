import { ImageSectionProps } from "@/sections/validation/image-section-schema";

const ImageSection = ({ image, alt, caption }: ImageSectionProps) => {
  return (
    <section className="py-8 text-center">
      <img
        src={image.url}
        alt={alt || "Image"}
        className="mx-auto rounded-lg shadow-md"
      />
      {caption && <p className="mt-2 text-sm text-gray-600">{caption}</p>}
    </section>
  );
};

export default ImageSection;
