"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParagraphAndImageSectionProps } from "@/sections/validation/sections/paragraph-and-image-section-schema";
import RichTextContent from "./fields/RichTextContent";
import { useGSAP } from "@gsap/react";
import { applyAnimation } from "@/lib/animations/apply-animation";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ParagraphAndImageSection = ({
  body,
  image,
  alt,
  caption,
  contentLayout,
  imageSize,
  textAnimation,
  imageAnimation,
  scrollTrigger,
}: ParagraphAndImageSectionProps) => {
  const isRow = contentLayout?.direction === "row";
  const imageFirst = contentLayout?.order === "image";

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
              end: scroll.end,
              scrub: scroll.scrub === "true",
            }
          : undefined,
      });

      if (textAnimation) applyAnimation(textElement, textAnimation, timeline);
      if (imageAnimation)
        applyAnimation(imageElement, imageAnimation, timeline);
    },
    { dependencies: [textAnimation, scrollTrigger], revertOnUpdate: true }
  );

  if (!image) return null;

  const imageUrl = typeof image === "string" ? image : image.url;

  return (
    <div className="py-8">
      <div
        className={cn(
          "flex gap-4 flex-col",
          isRow ? "md:flex-row" : "",
          imageFirst && isRow && "flex-col-reverse md:flex-row-reverse",
          imageFirst && !isRow && "flex-col-reverse",
          contentLayout?.justifyContent,
          contentLayout?.alignItems
        )}
      >
        <div ref={textRef} className="max-w-1/2">
          <RichTextContent html={body} />
        </div>
        <div className="shrink-0 w-fit" ref={imageRef}>
          {image && imageUrl.length !== 0 ? (
            <img
              src={imageUrl}
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
      </div>
    </div>
  );
};

export default ParagraphAndImageSection;
