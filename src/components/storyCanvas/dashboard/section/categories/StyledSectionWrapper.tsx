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
  sectionBackground,
  sectionPadding,
  sectionMargin,
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
    backgroundColor: sectionBackground?.color || undefined,
    backgroundImage: sectionBackground?.image
      ? `url(${sectionBackground?.image})`
      : undefined,
    backgroundSize: sectionBackground?.size ?? "cover",
    backgroundPosition: sectionBackground?.position ?? "center",
    paddingTop: sectionPadding?.top ? `${sectionPadding.top}px` : undefined,
    paddingBottom: sectionPadding?.bottom
      ? `${sectionPadding.bottom}px`
      : undefined,
    paddingLeft: sectionPadding?.left ? `${sectionPadding.left}px` : undefined,
    paddingRight: sectionPadding?.right
      ? `${sectionPadding?.right}px`
      : undefined,
    marginTop: sectionMargin?.top ? `${sectionMargin.top}px` : undefined,
    marginBottom: sectionMargin?.bottom
      ? `${sectionMargin.bottom}px`
      : undefined,
    marginLeft: sectionMargin?.left ? `${sectionMargin.left}px` : undefined,
    marginRight: sectionMargin?.right ? `${sectionMargin.right}px` : undefined,
  };

  return (
    <section style={inlineStyle}>
      <div className="max-w-4xl mx-auto" ref={sectionRef}>
        {children}
      </div>
    </section>
  );
};
