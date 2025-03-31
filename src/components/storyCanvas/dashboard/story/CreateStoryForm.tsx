"use client";

import { useForm } from "react-hook-form";
import FormErrorMessage from "../FormErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCmsStore } from "@/stores/cms-store";
import { storySchema, StoryFormData } from "@/lib/validation/storySchema";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CreateStoryFormProps = {
  onCancelNavigateTo: string;
};

const CreateStoryForm = ({ onCancelNavigateTo }: CreateStoryFormProps) => {
  const { addStory } = useCmsStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      slug: "",
      author: "",
    },
  });

  const onSubmit = async (data: StoryFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, components: [] }),
      });

      if (res.status === 409) {
        setError("slug", {
          type: "manual",
          message: "This slug is already in use",
        });
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to create story");
      }

      const newStory = await res.json();
      addStory(newStory);
      reset();
      router.push(`/admin/dashboard/${newStory.slug}`);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to create story. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title" as const)} />
        {errors.title && <FormErrorMessage error={errors.title.message} />}
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" {...register("author" as const)} />
        {errors.author && <FormErrorMessage error={errors.author.message} />}
      </div>

      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" {...register("slug" as const)} />
        {errors.slug && <FormErrorMessage error={errors.slug.message} />}
      </div>

      {submitError && <FormErrorMessage error={submitError} textRight />}

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Story"}
        </Button>
        <Button type="button" asChild variant="secondary">
          <Link href={onCancelNavigateTo}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
};

export default CreateStoryForm;
