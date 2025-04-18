"use client";

import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/validation/story-schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useRouter } from "next/navigation";
import { StoryWithVersions } from "@/types/story";
import FormErrorMessage from "../../FormErrorMessage";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";

type CreateStoryFormProps = {
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
};

const CreateStoryForm = forwardRef<HTMLFormElement, CreateStoryFormProps>(
  ({ setDirty, setIsSubmitting }, ref) => {
    const { addStory } = useDashboardStore();
    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      setError,
      reset,
    } = useForm<StoryFormData>({
      resolver: zodResolver(storySchema),
      defaultValues: {
        title: "",
        slug: "",
        createdBy: "",
      },
    });

    useEffect(() => {
      if (setDirty) setDirty(isDirty);
    }, [isDirty, setDirty]);

    useEffect(() => {
      if (setIsSubmitting) setIsSubmitting(isSubmitting);
    }, [isSubmitting, setIsSubmitting]);

    const onSubmit = async (data: StoryFormData) => {
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
        if (!res || !res.ok) {
          throw new Error("Failed to create story");
        }

        const newStory: StoryWithVersions = await res.json();
        addStory(newStory);
        reset();
        toast.success("Story created successfully", {
          description: "You can now start editing your story.",
        });
        router.push(`${ROUTES.dashboard}/${newStory.currentDraft?.slug}`);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unknown error occurred while creating the story");
        }
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
          <Input id="title" {...register("title")} />
          {errors.title && <FormErrorMessage error={errors.title.message} />}
        </div>

        <div>
          <Label htmlFor="createdBy">Created by</Label>
          <Input id="createdBy" {...register("createdBy")} />
          {errors.createdBy && (
            <FormErrorMessage error={errors.createdBy.message} />
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <FormErrorMessage error={errors.slug.message} />}
        </div>
      </form>
    );
  }
);

CreateStoryForm.displayName = "CreateStoryForm";
export default CreateStoryForm;
