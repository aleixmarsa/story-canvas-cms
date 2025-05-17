"use client";
import DOMPurify from "isomorphic-dompurify";
import { normalizeLinks } from "@/lib/utils";
import { cn } from "@/lib/utils";

type RichTextContentProps = {
  html: string;
  className?: string;
};

const RichTextContent = ({ html, className }: RichTextContentProps) => {
  const cleanHtml = DOMPurify.sanitize(normalizeLinks(html));

  return (
    <div
      className={cn("prose prose-lg", className)}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default RichTextContent;
