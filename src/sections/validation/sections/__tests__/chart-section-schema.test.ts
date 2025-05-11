import { chartSectionSchema } from "../chart-section-schema";

describe("chartSectionSchema", () => {
  const baseValid = {
    name: "Chart Section",
    createdBy: "Author",
    title: "Sales Over Time",
    type: "line",
    xKey: "month",
    yKeys: "sales,revenue",
    data: JSON.stringify([
      { month: "Jan", sales: 100, revenue: 200 },
      { month: "Feb", sales: 150, revenue: 250 },
    ]),
  };

  it("passes with valid input", () => {
    const result = chartSectionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("fails if title is empty", () => {
    const result = chartSectionSchema.safeParse({
      ...baseValid,
      title: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().title?._errors).toContain(
      "Chart title is required"
    );
  });

  it("fails if type is invalid", () => {
    const result = chartSectionSchema.safeParse({
      ...baseValid,
      type: "pie",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().type?._errors?.[0]).toMatch(
      /Expected 'line' \| 'bar'/
    );
  });

  it("fails if xKey is empty", () => {
    const result = chartSectionSchema.safeParse({
      ...baseValid,
      xKey: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().xKey?._errors).toContain(
      "You must specify the key for the X-axis"
    );
  });

  it("fails if yKeys format is invalid", () => {
    const result = chartSectionSchema.safeParse({
      ...baseValid,
      yKeys: "sales, revenue", // space not allowed
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().yKeys?._errors).toContain(
      "Y keys must be comma-separated without spaces"
    );
  });

  it("fails if data is not valid JSON", () => {
    const result = chartSectionSchema.safeParse({
      ...baseValid,
      data: "[invalid-json]",
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().data?._errors).toContain(
      "Data must be a valid JSON array"
    );
  });

  it("fails if data is valid JSON but not an array", () => {
    const result = chartSectionSchema.safeParse({
      ...baseValid,
      data: JSON.stringify({ x: 1 }),
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().data?._errors).toContain(
      "Data must be a valid JSON array"
    );
  });

  it("fails if required baseFields are missing", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, createdBy, ...rest } = baseValid;
    const result = chartSectionSchema.safeParse(rest);
    expect(result.success).toBe(false);
    expect(result.error?.format().name?._errors).toContain("Required");
    expect(result.error?.format().createdBy?._errors).toContain("Required");
  });
});
