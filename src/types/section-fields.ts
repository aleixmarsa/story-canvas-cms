import { z } from "zod";

export type FieldTypes =
  | "text"
  | "number"
  | "textarea"
  | "url"
  | "image"
  | "richtext";

export type FieldMeta = {
  label: string;
  type: FieldTypes;
  required?: boolean;
  placeholder?: string;
};

export type SchemaWithUI<T extends z.ZodTypeAny> = {
  schema: T;
  ui: { [K in keyof z.infer<T>]: FieldMeta };
};
