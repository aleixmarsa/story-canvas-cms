"use client";

import { useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/validation/story-schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorMessage from "../../FormErrorMessage";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { updateStoryVersion } from "@/lib/actions/story-versions/update-story-version";
import { useStories, Response } from "@/lib/swr/useStories";
import { StoryMetadata } from "@/lib/dal/draft";

type EditStoryFormProps = {
  story: StoryMetadata;
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
  skipNotFoundRedirect: React.MutableRefObject<boolean>;
};

const EditStoryForm = forwardRef<HTMLFormElement, EditStoryFormProps>(
  ({ story, setDirty, setIsSubmitting, skipNotFoundRedirect }, ref) => {
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
        title: story.currentDraft?.title,
        slug: story.currentDraft?.slug,
        createdBy: story.currentDraft?.createdBy,
        storyId: story.id,
      },
    });
    const { mutate: mutateStories } = useStories();

    useEffect(() => {
      if (story?.currentDraft) {
        reset({
          title: story.currentDraft.title,
          slug: story.currentDraft.slug,
          createdBy: story.currentDraft.createdBy,
          storyId: story.id,
        });
      }
    }, [story, reset]);

    useEffect(() => {
      setDirty?.(isDirty);
    }, [isDirty, setDirty]);

    useEffect(() => {
      setIsSubmitting?.(isSubmitting);
    }, [isSubmitting, setIsSubmitting]);

    const onSubmit = async (data: StoryFormData) => {
      try {
        if (!story?.currentDraftId) {
          throw new Error("No story is selected for editing");
        }

        const result = await updateStoryVersion(story.currentDraftId, data);

        if ("error" in result) {
          if (result.type === "slug") {
            setError("slug", {
              type: "manual",
              message: "This slug is already in use",
            });
          } else {
            toast.error(result.error);
          }
          return;
        }

        mutateStories(
          (prev): Response => {
            if (prev && "success" in prev && prev.stories) {
              return {
                success: true,
                stories: prev.stories.map((s) =>
                  s.id === story.id ? { ...s, currentDraft: result.version } : s
                ),
              };
            }
            // Fallback
            return {
              success: true,
              stories: [],
            };
          },
          { revalidate: false }
        );

        //If slug changed, update the route
        if (data.slug !== story.currentDraft?.slug) {
          skipNotFoundRedirect.current = true;
          router.replace(`${ROUTES.stories}/${data.slug}/edit`);
        }

        toast.success("Story updated successfully");
        reset(data);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while updating the story"
        );
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="title" required>
            Title
          </Label>
          <Input
            id="title"
            {...register("title" as const)}
            data-testid="edit-story-title-input"
          />
          {errors.title && <FormErrorMessage error={errors.title.message} />}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="createdBy" required>
            Created By
          </Label>
          <Input
            id="createdBy"
            {...register("createdBy" as const)}
            data-testid="edit-story-createdBy-input"
          />
          {errors.createdBy && (
            <FormErrorMessage error={errors.createdBy.message} />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="slug" required>
            Slug (URL)
          </Label>
          <Input
            id="slug"
            {...register("slug" as const)}
            data-testid="edit-story-slug-input"
          />
          {errors.slug && <FormErrorMessage error={errors.slug.message} />}
        </div>
      </form>
    );
  }
);
EditStoryForm.displayName = "EditStoryForm";
export default EditStoryForm;
