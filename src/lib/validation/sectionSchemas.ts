import { z } from "zod";
import { SectionType } from "@prisma/client";

// Helper type for field UI metadata
type FieldMeta = {
  label: string;
  type: "text" | "textarea" | "url" | "image" | "richtext";
  required?: boolean;
  placeholder?: string;
};

// Schema + metadata bundle
type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: Record<keyof z.infer<T>, FieldMeta>;
};

// Dynamic enum from Prisma
const sectionTypeValues = Object.values(SectionType) as [string, ...string[]];
export const SectionTypeEnum = z.enum(sectionTypeValues);

// Section schemas with UI metadata
export const sectionSchemas: Record<SectionType, SchemaWithUI<z.ZodTypeAny>> = {
  TITLE: {
    schema: z.object({
      text: z.string().min(1, "Title cannot be empty"),
      backgroundImage: z.string().optional(),
      // textColor: z.string().optional(),
      // textSize: z.enum(["small", "medium", "large"]).optional(),
      // textAlign: z.enum(["left", "center", "right"]).optional(),
      // textWeight: z.enum(["normal", "bold"]).optional(),
      // textTransform: z.enum(["uppercase", "lowercase", "capitalize"]).optional(),
    }),
    ui: {
      text: {
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Enter your title...",
      },
      backgroundImage: {
        label: "Background Image URL",
        type: "url",
        placeholder: "Enter a URL for the background image...",
      },
    },
  },

  PARAGRAPH: {
    schema: z.object({
      body: z.string().min(1, "Text cannot be empty"),
    }),
    ui: {
      body: {
        label: "Body",
        type: "textarea",
        required: true,
        placeholder: "Write your paragraph...",
      },
    },
  },

  IMAGE: {
    schema: z.object({
      url: z.string().url("Invalid image URL"),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }),
    ui: {
      url: {
        label: "Image URL",
        type: "url",
        required: true,
      },
      alt: {
        label: "Alt text",
        type: "text",
      },
      caption: {
        label: "Caption",
        type: "text",
      },
    },
  },

  VIDEO: {
    schema: z.object({
      embedUrl: z.string().url("Invalid video URL"),
      title: z.string().min(1, "Title is required"),
    }),
    ui: {
      embedUrl: {
        label: "Embed URL",
        type: "url",
        required: true,
      },
      title: {
        label: "Title",
        type: "text",
        required: true,
      },
    },
  },
};

// Validation function
export function validateSectionContent(type: SectionType, content: unknown) {
  const entry = sectionSchemas[type];
  if (!entry) throw new Error(`No schema found for type: ${type}`);
  return entry.schema.parse(content);
}
