import { z } from "zod";
export type FieldTypes =
  | "text"
  | "number"
  | "textarea"
  | "url"
  | "richtext"
  | "radio"
  | "select"
  | "image"
  | "video"
  | "animation"
  | "color";

export type MediaFieldTypes = Extract<FieldTypes, "image" | "video">;

export type CompositeFieldMeta = {
  label: string;
  type: "composite";
  subtype: FieldTypes;
  required?: boolean;
  fields: Record<string, FieldMeta>;
};

export type StyleFieldMeta = {
  label: string;
  type: "composite";
  subtype: FieldTypes;
  required?: boolean;
};

export type FieldMeta =
  | {
      label: string;
      type: FieldTypes;
      default?: number | string | boolean;
      required?: boolean;
      placeholder?: string;
      options?: { value: string; label: string }[];
      group?: string;
    }
  | CompositeFieldMeta;

export type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: {
    data: Partial<{ [K in keyof z.infer<T>]: FieldMeta }>;
    style: Partial<{ [K in keyof z.infer<T>]: FieldMeta }>;
    animation: Partial<{ [K in keyof z.infer<T>]: FieldMeta }>;
  };
};
