"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sectionTypes } from "@/lib/types/sectionTypes";
import { Section } from "@prisma/client";
import { z } from "zod";

const sectionSchema = z.object({
  type: z.string(),
  content: z.string().min(1),
  order: z.number().min(0),
});

type EditSectionFormProps = {
  section: Section;
  onSectionUpdated: () => void;
};

export default function EditSectionForm({
  section,
  onSectionUpdated,
}: EditSectionFormProps) {
  const [formData, setFormData] = useState({
    type: section.type,
    content: section.content?.text || "",
    order: section.order,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parse = sectionSchema.safeParse({
      ...formData,
      order: Number(formData.order),
    });
    console.log("🚀 ~ handleSubmit ~ parse:", parse);

    if (!parse.success) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: parse.data.type,
          content: { text: parse.data.content },
          order: parse.data.order,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update section");
      }
      onSectionUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to update section");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label>Section Type</Label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded w-full p-2"
          required
        >
          <option value="">Select section type</option>
          {sectionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Content</Label>
        <Input
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Order</Label>
        <Input
          type="number"
          name="order"
          value={formData.order}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
