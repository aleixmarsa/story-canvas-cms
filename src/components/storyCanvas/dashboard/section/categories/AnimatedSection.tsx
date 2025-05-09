"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimationFields } from "@/sections/validation/fields/animation-field-schema";

type AnimatedSectionProps = {
  children: React.ReactNode;
} & AnimationFields;

export const AnimatedSection = ({
  animationType,
  delay,
  duration,
  easing,
  children,
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return <div ref={sectionRef}>{children}</div>;
};
