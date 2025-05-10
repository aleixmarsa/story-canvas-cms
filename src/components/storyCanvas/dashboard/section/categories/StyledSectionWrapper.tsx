"use client";

import { useRef } from "react";
import type { PropsWithChildren } from "react";
import type { StylesFields } from "@/sections/validation/fields/styles-fields-schema";
import type { AnimationFields } from "@/sections/validation/fields/animation-field-schema";

type StyledSectionWrapperProps = PropsWithChildren<
  StylesFields & AnimationFields
>;

export const StyledSectionWrapper = ({
  children,

  sectionBackground,
  sectionPadding,
  sectionMargin,
}: StyledSectionWrapperProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
