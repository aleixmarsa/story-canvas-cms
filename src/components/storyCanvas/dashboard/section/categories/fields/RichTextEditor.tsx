"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import { Parchment } from "quill";
import "quill/dist/quill.snow.css";

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
      const Quill = (await import("quill")).default;

      const AlignStyle = Quill.import(
        "attributors/style/align"
      ) as Parchment.Attributor;
      Quill.register(AlignStyle, true);
      if (editorRef.current && !quillRef.current && mounted) {
        const instance = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link"],
              ["clean"],
              [{ align: [] }],
            ],
          },
          placeholder: "Write something...",
        });

        instance.on("text-change", () => {
          onChange(instance.root.innerHTML);
        });

        instance.root.innerHTML = value;
        quillRef.current = instance;
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
