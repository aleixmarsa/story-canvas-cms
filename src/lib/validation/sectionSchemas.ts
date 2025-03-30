import { z } from "zod";
import { SectionType } from "@prisma/client";

// Helper type for field UI metadata
type FieldMeta = {
  label: string;
  type: "text" | "number" | "textarea" | "url" | "image" | "richtext";
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

const baseFields = {
  name: z.string().min(1, "Name is required"),
  order: z.number().int().min(0, "Order is required"),
};

const baseUI: Record<keyof typeof baseFields, FieldMeta> = {
  name: {
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Name of the section",
  },
  order: {
    label: "Order",
    type: "number",
    required: true,
    placeholder: "Order number",
  },
};

// Section schemas with UI metadata
export const sectionSchemas: Record<SectionType, SchemaWithUI<z.ZodTypeAny>> = {
  TITLE: {
    schema: z.object({
      ...baseFields,
      text: z.string().min(1, "Title cannot be empty"),
      backgroundImage: z.string().optional(),
      // textColor: z.string().optional(),
      // textSize: z.enum(["small", "medium", "large"]).optional(),
      // textAlign: z.enum(["left", "center", "right"]).optional(),
      // textWeight: z.enum(["normal", "bold"]).optional(),
      // textTransform: z.enum(["uppercase", "lowercase", "capitalize"]).optional(),
    }),
    ui: {
      ...baseUI,
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
      ...baseFields,
      body: z.string().min(1, "Text cannot be empty"),
    }),
    ui: {
      ...baseUI,
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
      ...baseFields,
      url: z.string().url("Invalid image URL"),
      alt: z.string().optional(),
      caption: z.string().optional(),
    }),
    ui: {
      ...baseUI,
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
      ...baseFields,
      embedUrl: z.string().url("Invalid video URL"),
      title: z.string().min(1, "Title is required"),
    }),
    ui: {
      ...baseUI,
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
