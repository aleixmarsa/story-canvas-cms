import { createAnimationSchema } from "../create-animation-schema";
import {
  ANIMATION_TYPES_VALUES,
  EASE_TYPES,
} from "../../fields/animation-field-schema";

describe("createTextAnimationSchema", () => {
  const schema = createAnimationSchema();

  const validData = {
    animationType: ANIMATION_TYPES_VALUES[0],
    delay: 2,
    duration: 3,
    easing: EASE_TYPES[0],
  };

  it("passes with valid input", () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("passes with only required field", () => {
    const result = schema.safeParse({
      animationType: ANIMATION_TYPES_VALUES[1],
    });
    expect(result.success).toBe(true);
  });

  it("passes with undefined (since schema is optional)", () => {
    const result = schema.safeParse(undefined);
    expect(result.success).toBe(true);
  });

  it("fails if animationType is missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { animationType, ...rest } = validData;
    const result = schema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(
      result.error?.format().animationType?._errors.length
    ).toBeGreaterThan(0);
  });

  it("fails if delay is negative", () => {
    const result = schema.safeParse({
      ...validData,
      delay: -1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().delay?._errors).toContain(
      "Number must be greater than or equal to 0"
    );
  });

  it("fails if duration exceeds maximum", () => {
    const result = schema.safeParse({
      ...validData,
      duration: 20,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().duration?._errors).toContain(
      "Number must be less than or equal to 10"
    );
  });

  it("fails if easing is invalid", () => {
    const result = schema.safeParse({
      ...validData,
      easing: "INVALID_EASE",
    });
    expect(result.success).toBe(false);
  });
});
