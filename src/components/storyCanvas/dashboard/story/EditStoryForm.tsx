"use client";

import { useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/validation/story-schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorMessage from "../../FormErrorMessage";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard-store";
import { StoryVersion } from "@prisma/client";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";
import { updateStoryVersion } from "@/lib/actions/story-versions/update-story-version";

type EditStoryFormProps = {
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
};

const EditStoryForm = forwardRef<HTMLFormElement, EditStoryFormProps>(
  ({ setDirty, setIsSubmitting }, ref) => {
    const { updateStory, selectedStory, selectStory } = useDashboardStore();
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
        title: selectedStory?.currentDraft?.title,
        slug: selectedStory?.currentDraft?.slug,
        createdBy: selectedStory?.currentDraft?.createdBy,
        storyId: selectedStory?.id,
      },
    });

    useEffect(() => {
      if (selectedStory?.currentDraft) {
        reset({
          title: selectedStory.currentDraft.title,
          slug: selectedStory.currentDraft.slug,
          createdBy: selectedStory.currentDraft.createdBy,
          storyId: selectedStory.id,
        });
      }
    }, [selectedStory, reset]);

    useEffect(() => {
      if (setDirty) setDirty(isDirty);
    }, [isDirty, setDirty]);

    useEffect(() => {
      if (setIsSubmitting) setIsSubmitting(isSubmitting);
    }, [isSubmitting, setIsSubmitting]);

    const onSubmit = async (data: StoryFormData) => {
      try {
        if (!selectedStory?.currentDraftId) {
          throw new Error("No story is selected for editing");
        }
        const result = await updateStoryVersion(
          selectedStory.currentDraftId,
          data
        );

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

        const updatedStoryVersion: StoryVersion = result.version;

        if (data.slug !== selectedStory?.currentDraft?.slug) {
          router.replace(`${ROUTES.stories}/${data.slug}/edit`);
        }

        if (selectedStory) {
          const updatedStory = {
            ...selectedStory,
            currentDraft: updatedStoryVersion,
          };
          updateStory(updatedStory);
          selectStory(updatedStory);
        }

        toast.success("Story updated successfully");
        reset(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unknown error occurred while updating the story");
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
          <Input
            id="title"
            {...register("title" as const)}
            data-testid="edit-story-title-input"
          />
          {errors.title && <FormErrorMessage error={errors.title.message} />}
        </div>

        <div>
          <Label htmlFor="createdBy">Created By</Label>
          <Input
            id="createdBy"
            {...register("createdBy" as const)}
            data-testid="edit-story-createdBy-input"
          />
          {errors.createdBy && (
            <FormErrorMessage error={errors.createdBy.message} />
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
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
