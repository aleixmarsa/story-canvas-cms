"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { PropsWithChildren } from "react";
import type { StylesFields } from "@/sections/validation/fields/styles-fields-schema";
import type { AnimationFields } from "@/sections/validation/fields/animation-field-schema";

type StyledSectionWrapperProps = PropsWithChildren<
  StylesFields & AnimationFields
>;

export const StyledSectionWrapper = ({
  children,
  animationType,
  delay,
  duration,
  easing,
  backgroundColor,
  backgroundImage,
}: StyledSectionWrapperProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle GSAP animation
  useEffect(() => {
    if (!sectionRef.current || animationType === "none") return;

    const config = {
      duration: duration ?? 0.5,
      delay: delay ?? 0,
      ease: easing ?? "power1.out",
    };

    switch (animationType) {
      case "fade":
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0 },
          { opacity: 1, ...config }
        );
        break;
      case "slide-up":
        gsap.fromTo(
          sectionRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ...config }
        );
        break;
      case "zoom-in":
        gsap.fromTo(
          sectionRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, ...config }
        );
        break;
    }
  }, [animationType, delay, duration, easing]);

  const inlineStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: backgroundImage ? "cover" : undefined,
    backgroundPosition: backgroundImage ? "center" : undefined,
  };
  console.log("🚀 ~ inlineStyle:", inlineStyle);

  return (
    <section ref={sectionRef} className="p-8" style={inlineStyle}>
      <div className="max-w-3xl mx-auto">{children}</div>
    </section>
  );
};
