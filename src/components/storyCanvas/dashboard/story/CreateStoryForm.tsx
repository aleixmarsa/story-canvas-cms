"use client";

import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/validation/story-schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import FormErrorMessage from "../../FormErrorMessage";
import { ROUTES } from "@/lib/constants/story-canvas";
import { toast } from "sonner";
import { createStory } from "@/lib/actions/stories/create-story";
import { useStories } from "@/lib/swr/useStories";
import { StoryDraftMetadata } from "@/lib/dal/draft";

type CreateStoryFormProps = {
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
};

const CreateStoryForm = forwardRef<HTMLFormElement, CreateStoryFormProps>(
  ({ setDirty, setIsSubmitting }, ref) => {
    const { mutate: mutateStories } = useStories();
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
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("slug", data.slug);
        formData.append("createdBy", data.createdBy);
        formData.append("description", data.description || "");

        const result = await createStory(formData);

        if ("error" in result) {
          if (result.type === "slug") {
            setError("slug", {
              type: "manual",
              message: "This slug is already in use",
            });
            return;
          }

          toast.error(result.error);
          return;
        }

        const newStory = result.story;
        const newStoryWithSections: StoryDraftMetadata = {
          ...newStory,
          sections: [],
        };

        mutateStories(
          (prev) =>
            prev && Array.isArray(prev)
              ? [...prev, newStoryWithSections]
              : [newStoryWithSections],
          { revalidate: false }
        );
        reset();
        toast.success("Story created successfully", {
          description: "You can now start editing your story.",
        });
        router.push(`${ROUTES.stories}`);
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>
            Title
          </Label>
          <Input
            id="title"
            {...register("title")}
            data-testid="create-story-title-input"
          />
          {errors.title && <FormErrorMessage error={errors.title.message} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="createdBy" className="font-medium" required>
            Created by
          </Label>
          <Input
            id="createdBy"
            {...register("createdBy")}
            data-testid="create-story-createdBy-input"
          />
          {errors.createdBy && (
            <FormErrorMessage error={errors.createdBy.message} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug" required>
            Slug (URL)
          </Label>
          <Input
            id="slug"
            {...register("slug")}
            data-testid="create-story-slug-input"
          />
          {errors.slug && <FormErrorMessage error={errors.slug.message} />}
        </div>
      </form>
    );
  }
);

CreateStoryForm.displayName = "CreateStoryForm";
export default CreateStoryForm;
