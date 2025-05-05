import { z } from "zod";

export type FieldTypes =
  | "text"
  | "number"
  | "textarea"
  | "url"
  | "richtext"
  | "radio"
  | "image"
  | "video";

export type MediaFieldTypes = Extract<FieldTypes, "image" | "video">;

export type FieldMeta = {
  label: string;
  type: FieldTypes;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: { [K in keyof z.infer<T>]: FieldMeta };
};
