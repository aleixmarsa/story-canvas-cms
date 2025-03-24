"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const storySchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

interface CreateStoryFormProps {
  projectId: number;
  onStoryCreated: () => void;
}

const CreateStoryForm = ({
  projectId,
  onStoryCreated,
}: CreateStoryFormProps) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
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

    const parse = storySchema.safeParse(formData);
    if (!parse.success) {
      console.error(parse.error.format());
      alert("Please fill in the required fields");
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parse.data,
          projectId,
          theme: {},
          components: [],
        }),
      });
      onStoryCreated();
      setFormData({ title: "", slug: "", description: "", coverImage: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label>Title</Label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Slug (URL)</Label>
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Cover Image URL</Label>
        <Input
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Story"}
      </Button>
    </form>
  );
};

export default CreateStoryForm;
