"use client";
import { useRef, useState } from "react";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import CreateStoryForm from "@/components/storyCanvas/dashboard/story/CreateStoryForm";
import { ROUTES } from "@/lib/constants/story-canvas";

const NewStoryPage = () => {
  const [isDirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <DashboardHeader
        title="New Story"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Stories", href: ROUTES.stories },
        ]}
        onSaveDraft={() => formRef.current?.requestSubmit()}
        saveDisabled={!isDirty}
        isSaving={isSubmitting}
      />
      <div className="px-6">
        <CreateStoryForm
          setDirty={setDirty}
          setIsSubmitting={setIsSubmitting}
          ref={formRef}
        />
      </div>
    </>
  );
};

export default NewStoryPage;
