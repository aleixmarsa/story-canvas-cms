"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/validation/storySchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorMessage from "../FormErrorMessage";

type EditStoryFormProps = {
  story: {
    currentDraftId: number | null;
    title: string;
    slug: string;
    createdBy: string;
  };
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
};

const EditStoryForm = forwardRef<HTMLFormElement, EditStoryFormProps>(
  ({ story, setDirty, setIsSubmitting }, ref) => {
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      setError,
      setValue,
      reset,
    } = useForm<StoryFormData>({
      resolver: zodResolver(storySchema),
      defaultValues: story,
    });

    useEffect(() => {
      if (setDirty) setDirty(isDirty);
    }, [isDirty, setDirty]);

    useEffect(() => {
      if (setIsSubmitting) setIsSubmitting(isSubmitting);
    }, [isSubmitting, setIsSubmitting]);

    useEffect(() => {
      setValue("title", story.title);
      setValue("slug", story.slug);
      setValue("createdBy", story.createdBy);
    }, [story, setValue]);

    const onSubmit = async (data: StoryFormData) => {
      setSubmitError(null);
      try {
        const res = await fetch(`/api/story-versions/${story.currentDraftId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.status === 409) {
          setError("slug", {
            type: "manual",
            message: "This slug is already in use",
          });
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to update story");
        }

        const updated = await res.json();
        if (!updated) {
          throw new Error("Failed to update story");
        }
        reset(data);
      } catch (err) {
        console.error(err);
        setSubmitError("Failed to update story. Please try again.");
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title" as const)} />
          {errors.title && <FormErrorMessage error={errors.title.message} />}
        </div>

        <div>
          <Label htmlFor="createdBy">Created By</Label>
          <Input id="createdBy" {...register("createdBy" as const)} />
          {errors.createdBy && (
            <FormErrorMessage error={errors.createdBy.message} />
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" {...register("slug" as const)} />
          {errors.slug && <FormErrorMessage error={errors.slug.message} />}
        </div>

        {submitError && <FormErrorMessage error={submitError} textRight />}
      </form>
    );
  }
);
EditStoryForm.displayName = "EditStoryForm";
export default EditStoryForm;
