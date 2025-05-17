"use client";

import { CallToActionSectionProps } from "@/sections/validation/sections/call-to-action-schema";

const CallToActionSection = ({
  label,
  url,
  newTab,
  button,
  buttonPadding,
}: CallToActionSectionProps) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: button?.buttonColor || "#000000",
    paddingTop: buttonPadding?.top ? `${buttonPadding.top}px` : undefined,
    paddingBottom: buttonPadding?.bottom
      ? `${buttonPadding.bottom}px`
      : undefined,
    paddingLeft: buttonPadding?.left ? `${buttonPadding.left}px` : undefined,
    paddingRight: buttonPadding?.right ? `${buttonPadding.right}px` : undefined,
    borderRadius: button?.buttonBorderRadius
      ? `${button.buttonBorderRadius}px`
      : undefined,
    color: button?.labelColor || "#ffffff",
    fontSize: button?.labelSize ? `${button.labelSize}px` : "16px",
  };

  return (
    <a
      href={url}
      target={newTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      style={buttonStyle}
      className="flex items-center justify-center text-center"
    >
      {label}
    </a>
  );
};

export default CallToActionSection;
