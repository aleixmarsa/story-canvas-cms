"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParagraphAndImageSectionProps } from "@/sections/validation/sections/paragraph-and-image-section-schema";
import RichTextContent from "./fields/RichTextContent";
import { useGSAP } from "@gsap/react";
import { applyAnimation } from "@/lib/animations/apply-animation";

gsap.registerPlugin(ScrollTrigger);

const ParagraphAndImageSection = ({
  body,
  image,
  alt,
  caption,
  layout,
  imageSize,
  textAnimation,
  imageAnimation,
  scrollTrigger,
}: ParagraphAndImageSectionProps) => {
  const isLeft = layout === "left";

  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const textElement = textRef.current;
      const imageElement = imageRef.current;
      if (
        !textElement ||
        !imageElement ||
        !textAnimation ||
        textAnimation?.animationType === "none"
      )
        return;

      const scroll =
        scrollTrigger && scrollTrigger.start !== "none" ? scrollTrigger : null;

      const timeline = gsap.timeline({
        scrollTrigger: scroll
          ? {
              trigger: textElement,
              start: scroll.start,
              end: "scroll.end",
              scrub: scroll.scrub === "true",
            }
          : undefined,
      });

      applyAnimation(textElement, textAnimation, timeline);
      applyAnimation(imageElement, imageAnimation, timeline);
    },
    { dependencies: [textAnimation, scrollTrigger], revertOnUpdate: true }
  );

  return (
    <div className="py-8">
      <div
        className={`flex flex-col md:flex-row md:justify-between ${
          isLeft ? "md:flex-row-reverse" : ""
        } gap-6 items-center`}
      >
        <div className="shrink-0 w-full md:w-1/2" ref={imageRef}>
          {image ? (
            <img
              src={image.url}
              alt={alt || "Image"}
              className="mx-auto rounded-lg shadow-md"
              width={imageSize?.width || "auto"}
              height={imageSize?.height || "auto"}
            />
          ) : (
            <></>
          )}
          {caption && <RichTextContent html={caption} />}
        </div>
        <div ref={textRef}>
          <RichTextContent html={body} />
        </div>
      </div>
    </div>
  );
};

export default ParagraphAndImageSection;
