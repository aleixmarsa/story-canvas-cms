"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const sectionSchema = z.object({
  type: z.string().min(2, "Type is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(0, "Order is required"),
});

type SectionFormData = z.infer<typeof sectionSchema>;

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Parse with Zod
    const parse = sectionSchema.safeParse({
      ...formData,
      order: Number(formData.order),
    });

    if (!parse.success) {
      console.error(parse.error.format());
      alert("Please fill in the required fields");
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          type: parse.data.type,
          content: { text: parse.data.content }, // Wrapped as JSON
          order: parse.data.order,
        }),
      });
      onSectionCreated();
      setFormData({ type: "", content: "", order: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label>Section Type (text, image, video...)</Label>
        <Input
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
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
        <Label>Order (number)</Label>
        <Input
          name="order"
          type="number"
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
