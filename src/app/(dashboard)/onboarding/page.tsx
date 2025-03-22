"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    author: "",
    theme: "",
    components: "",
    assetsConfig: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    setLoading(false);
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
    </div>
  );
}
