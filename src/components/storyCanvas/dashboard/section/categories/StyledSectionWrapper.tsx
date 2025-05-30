"use client";

import type { PropsWithChildren } from "react";
import type { StylesFields } from "@/sections/validation/fields/base-styles-schema";

type StyledSectionWrapperProps = PropsWithChildren<StylesFields>;

export const StyledSectionWrapper = ({
  children,
  sectionLayout,
  sectionBackground,
  sectionPadding,
  sectionMargin,
}: StyledSectionWrapperProps) => {
  const inlineSectionStyle: React.CSSProperties = {
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

  const inlineDivStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: sectionLayout?.justifyContent,
    alignItems: sectionLayout?.alignItems,
    height: sectionLayout?.height || "fit-content",
  };

  return (
    <section style={inlineSectionStyle}>
      <div className="max-w-4xl mx-auto" style={inlineDivStyle}>
        {children}
      </div>
    </section>
  );
};
