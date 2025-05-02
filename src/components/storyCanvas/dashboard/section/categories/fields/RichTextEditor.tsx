"use client";
import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill>(null);

  useEffect(() => {
    let mounted = true;
    const loadQuill = async () => {
      const { default: Quill } = await import("quill");
      if (editorRef.current && !quillRef.current && mounted) {
        const instance = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link"],
              ["clean"],
            ],
          },
          placeholder: "Write something...",
        });

        instance.on("text-change", () => {
          onChange(instance.root.innerHTML);
        });

        instance.root.innerHTML = value;
      }
    };
    loadQuill();
    return () => {
      mounted = false;
      quillRef.current = null;
    };
  }, []);

  return <div ref={editorRef} className="min-h-[300px]" />;
};
export default RichTextEditor;
