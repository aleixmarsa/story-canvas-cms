"use client";
import DOMPurify from "isomorphic-dompurify";
import { normalizeLinks } from "@/lib/utils";

type RichTextContentProps = {
  html: string;
};

const RichTextContent = ({ html }: RichTextContentProps) => {
  const cleanHtml = DOMPurify.sanitize(normalizeLinks(html));

  return (
    <div
      className="prose prose-lg"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default RichTextContent;
