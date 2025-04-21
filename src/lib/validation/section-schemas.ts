import { z } from "zod";
import { SectionType } from "@prisma/client";

// ----------
// UI metadata types
// ----------
type FieldMeta = {
  label: string;
  type: "text" | "number" | "textarea" | "url" | "image" | "richtext";
  required?: boolean;
  placeholder?: string;
};

type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: Record<keyof z.infer<T>, FieldMeta>;
};

// ----------
// Base fields for all section types
// ----------
export const SectionTypeEnum = z.enum(
  Object.values(SectionType) as [SectionType, ...SectionType[]]
);

const baseFields = {
  name: z.string().min(1, "Name is required"),
  order: z.number().int().min(0, "Order is required"),
  createdBy: z.string().min(1, "Author is required"),
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
  createdBy: {
    label: "Created by",
    type: "text",
    required: true,
    placeholder: "Author of this section",
  },
};

// ----------
// Frontend schemas by type (with UI metadata)
// ----------
export const sectionSchemas: Record<SectionType, SchemaWithUI<z.ZodTypeAny>> = {
  TITLE: {
    schema: z.object({
      ...baseFields,
      text: z.string().min(1, "Title cannot be empty"),
      backgroundImage: z.string().optional(),
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

// ----------
// Backend schemas for API use
// ----------

// For creating a new SectionVersion
export const createSectionVersionSchema = z.object({
  storyId: z.number().min(1),
  name: baseFields.name,
  type: SectionTypeEnum,
  order: baseFields.order,
  content: z.record(z.any()),
  createdBy: z.string().min(1),
  comment: z.string().optional(),
});

// For updating an existing SectionVersion
export const updateSectionVersionSchema = createSectionVersionSchema.omit({
  createdBy: true,
});

export type SectionFormData = z.infer<typeof createSectionVersionSchema>;
