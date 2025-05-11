"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ParagraphSectionProps } from "@/sections/validation/sections/paragraph-section-schema";
import RichTextContent from "./fields/RichTextContent";
import { useGSAP } from "@gsap/react";
import { applyAnimation } from "@/lib/animations/apply-animation";

gsap.registerPlugin(ScrollTrigger);

const ParagraphSection = ({
  body,
  textPadding,
  textAnimation,
  scrollTrigger,
}: ParagraphSectionProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const textElement = textRef.current;
      if (
        !textElement ||
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

      applyAnimation(textElement, textAnimation, timeline);
    },
    { dependencies: [textAnimation, scrollTrigger], revertOnUpdate: true }
  );

  const inlineStyle: React.CSSProperties = {
    paddingTop: textPadding?.top ? `${textPadding.top}px` : undefined,
    paddingBottom: textPadding?.bottom ? `${textPadding.bottom}px` : undefined,
    paddingLeft: textPadding?.left ? `${textPadding.left}px` : undefined,
    paddingRight: textPadding?.right ? `${textPadding.right}px` : undefined,
  };

  return (
    <div className="py-8" style={inlineStyle}>
      <div ref={textRef}>
        <RichTextContent html={body} />
      </div>
    </div>
  );
};

export default ParagraphSection;
