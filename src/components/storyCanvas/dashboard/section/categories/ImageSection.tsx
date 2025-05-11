"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageSectionProps } from "@/sections/validation/sections/image-section-schema";
import RichTextContent from "./fields/RichTextContent";
import { useGSAP } from "@gsap/react";
import { applyAnimation } from "@/lib/animations/apply-animation";

gsap.registerPlugin(ScrollTrigger);

const ImageSection = ({
  image,
  alt,
  caption,
  imageSize,
  imageAnimation,
  scrollTrigger,
}: ImageSectionProps) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const imageElement = imageRef.current;
      if (
        !imageElement ||
        !imageAnimation ||
        imageAnimation?.animationType === "none"
      )
        return;

      const scroll =
        scrollTrigger && scrollTrigger.start !== "none" ? scrollTrigger : null;

      const timeline = gsap.timeline({
        scrollTrigger: scroll
          ? {
              trigger: imageElement,
              start: scroll.start,
              end: scroll.end,
              scrub: scroll.scrub === "true",
            }
          : undefined,
      });

      applyAnimation(imageElement, imageAnimation, timeline);
    },
    { dependencies: [imageAnimation, scrollTrigger], revertOnUpdate: true }
  );

  if (!image) return null;
  return (
    <div className="py-8" ref={imageRef}>
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
