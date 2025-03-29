"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useCmsStore } from "@/stores/cms-store";
import { on } from "events";

const storySchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  author: z.string(),
});

type CreateStoryFormProps = {
  onCancel: () => void;
};

type StoryFormData = z.infer<typeof storySchema>;

const CreateStoryForm = ({ onCancel }: CreateStoryFormProps) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: "",
    slug: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const { addStory } = useCmsStore();

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
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parse.data,
          components: [],
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create story");
      }
      const newStory = await res.json();
      setFormData({ title: "", slug: "", author: "" });
      addStory(newStory);
      onCancel();
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
        <Label>Author</Label>
        <Input name="author" value={formData.author} onChange={handleChange} />
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
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Story"}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateStoryForm;
