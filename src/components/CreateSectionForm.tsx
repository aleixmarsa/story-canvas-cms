"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sectionTypes } from "@/lib/types/sectionTypes";
import { z } from "zod";

const sectionSchema = z.object({
  type: z.string(),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(0),
});

interface CreateSectionFormProps {
  storyId: number;
  onSectionCreated: () => void;
}

export default function CreateSectionForm({
  storyId,
  onSectionCreated,
}: CreateSectionFormProps) {
  const [formData, setFormData] = useState({
    type: "",
    content: "",
    order: 0,
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

    if (!parse.success) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storyId,
        type: parse.data.type,
        content: { text: parse.data.content },
        order: parse.data.order,
      }),
    });

    onSectionCreated();
    setFormData({ type: "", content: "", order: 0 });
    setLoading(false);
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
        {loading ? "Creating..." : "Create Section"}
      </Button>
    </form>
  );
}
