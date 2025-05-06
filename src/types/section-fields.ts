import { z } from "zod";

export type FieldTypes =
  | "text"
  | "number"
  | "textarea"
  | "url"
  | "richtext"
  | "radio"
  | "image"
  | "video"
  | "animation";

export type MediaFieldTypes = Extract<FieldTypes, "image" | "video">;

export type CompositeFieldMeta = {
  label: string;
  type: "composite";
  subtype: FieldTypes;
  required?: boolean;
  fields: Record<string, FieldMeta>;
};

export type FieldMeta =
  | {
      label: string;
      type: FieldTypes;
      required?: boolean;
      placeholder?: string;
      options?: { value: string; label: string }[];
    }
  | CompositeFieldMeta;

export type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: { [K in keyof z.infer<T>]: FieldMeta };
};
