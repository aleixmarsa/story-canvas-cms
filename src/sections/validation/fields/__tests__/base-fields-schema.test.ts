import { baseFields } from "../base-fields-schema";

describe("baseFields", () => {
  const validData = {
    name: "Title",
    createdBy: "Author",
  };

  it("passes with valid data", () => {
    const result = baseFields.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails if name is missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...rest } = validData;
    const result = baseFields.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
  });

  it("fails if name is empty", () => {
    const result = baseFields.safeParse({
      ...validData,
      name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Name is required");
  });

  it("fails if createdBy is missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdBy, ...rest } = validData;
    const result = baseFields.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });

  it("fails if createdBy is missing", () => {
    const result = baseFields.safeParse({
      ...validData,
      createdBy: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().createdBy?._errors).toContain(
      "Author is required"
    );
  });

  it("fails if name is empty", () => {
    const result = baseFields.safeParse({
      ...validData,
      name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Name is required");
  });

  it("fails if createdBy is empty", () => {
    const result = baseFields.safeParse({
      ...validData,
      createdBy: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().createdBy?._errors).toContain(
      "Author is required"
    );
  });

  it("fails if name is not a string", () => {
    const result = baseFields.safeParse({
      ...validData,
      name: 123,
    });
    expect(result.success).toBe(false);
  });

  it("fails if createdBy is not a string", () => {
    const result = baseFields.safeParse({
      ...validData,
      createdBy: true,
    });
    expect(result.success).toBe(false);
  });
});
