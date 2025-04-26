import { sectionCategoriesSchemasWithUI } from "@/sections/section-categories";
import type { SectionSchemas } from "@/sections/section-categories";
import { z } from "zod";

/**
 * Generates default values for a Zod schema.
 * @param schema - The Zod schema to generate default values for.
 * @returns An object containing default values for each field in the schema.
 * Strings -> ""
 * Numbers -> 0
 * Booleans -> false
 * Optionals -> undefined
 * Arrays -> []
 * Objects -> {}
 * Fallback -> null
 */
function generateDefaultValues<T extends z.ZodRawShape>(
  schema: SectionSchemas
): z.infer<z.ZodObject<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaults: any = {};

  for (const key in schema) {
    const field = schema[key as keyof typeof schema];

    if (field instanceof z.ZodString) {
      defaults[key] = "";
    } else if (field instanceof z.ZodNumber) {
      defaults[key] = 0;
    } else if (field instanceof z.ZodBoolean) {
      defaults[key] = false;
    } else if (field instanceof z.ZodArray) {
      defaults[key] = [];
    } else if (field instanceof z.ZodObject) {
      defaults[key] = {};
    } else if (field instanceof z.ZodOptional) {
      defaults[key] = undefined;
    } else {
      defaults[key] = null;
    }
  }

  return defaults;
}

/**
 *  Same as Object.fromEntries but with type safety.
 * @param entries - An array of tuples where each tuple is a key-value pair.
 * @returns An object with keys and values from the tuples.
 */
function typedFromEntries<K extends string, V>(
  entries: [K, V][]
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * Generates default content for each section type.
 * @returns An object where keys are section types and values are default content objects.
 */
export const defaultContentByType = typedFromEntries(
  Object.entries(sectionCategoriesSchemasWithUI).map(
    ([key, sectionSchemaWithUI]) => {
      const defaults = generateDefaultValues(sectionSchemaWithUI.schema);
      return [key, defaults] as [
        keyof typeof sectionCategoriesSchemasWithUI,
        z.infer<(typeof sectionCategoriesSchemasWithUI)[typeof key]["schema"]>
      ];
    }
  )
);
