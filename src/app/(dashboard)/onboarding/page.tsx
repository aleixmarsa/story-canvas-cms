"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  author: z.string().optional(),
  theme: z.any().optional(),
  components: z.any().optional(),
  assetsConfig: z.any().optional(),
});

type Project = z.infer<typeof projectSchema>;

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    author: "",
    theme: "",
    components: "",
    assetsConfig: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, [loading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parse = projectSchema.safeParse(formData);
    if (!parse.success) {
      console.error(parse.error.format());
      alert("Please fill in the required fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          theme: { primaryColor: "#fff" },
          components: ["text", "image"],
          assetsConfig: { storage: "local" },
        }),
      });

      const result = await res.json();
      console.log("Project Created:", result);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create a new Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Project name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Slug (url)</Label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Author</Label>
          <Input
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </form>
      <h2 className="text-xl font-semibold mt-10">Created Projects:</h2>
      <ul className="mt-4 space-y-2">
        {projects.map((project) => (
          <li key={project.slug} className="p-3 border rounded shadow-sm">
            <strong>{project.name}</strong> - <code>{project.slug}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
