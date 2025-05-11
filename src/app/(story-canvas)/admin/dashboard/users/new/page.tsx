"use client";
import { useRef, useState } from "react";
import { ROUTES } from "@/lib/constants/story-canvas";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";
import { UserForm } from "@/components/storyCanvas/dashboard/user/UserForm";

const CreateUserPage = () => {
  const [isDirty, setDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <DashboardHeader
        title="New User"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Users", href: ROUTES.users },
        ]}
        onSaveDraft={() => formRef.current?.requestSubmit()}
        saveDisabled={!isDirty}
        isSaving={isSubmitting}
      />
      <div className="px-6">
        <UserForm
          setDirty={setDirty}
          setIsSubmitting={setIsSubmitting}
          ref={formRef}
        />
      </div>
    </>
  );
};

export default CreateUserPage;
