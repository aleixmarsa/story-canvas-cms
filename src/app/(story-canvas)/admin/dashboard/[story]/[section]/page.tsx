"use client";

import { useCmsStore } from "@/stores/cms-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditSectionForm from "@/components/storyCanvas/dashboard/section/EditSectionForm";
import { SectionType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/client";
import DashboardHeader from "@/components/storyCanvas/dashboard/DashboardHeader";

const EditSectionPage = () => {
  const { sections, selectedStory } = useCmsStore();
  const { section: sectionSlug } = useParams();
  const router = useRouter();

  const [section, setSection] = useState<{
    id: number;
    name: string;
    order: number;
    createdBy: string;
    type: SectionType;
    content: JsonValue;
    currentDraftId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!sectionSlug) {
      router.push("/admin/dashboard");
      return;
    }

    const found = sections.find((s) => s.currentDraft?.slug === sectionSlug);
    if (!found) {
      router.push("/admin/dashboard");
      return;
    }
    const { id, currentDraft, currentDraftId } = found;

    if (!currentDraft) {
      router.push("/admin/dashboard");
      return;
    }

    const { name, order, type, content, createdBy } = currentDraft;

    setSection({
      id,
      name,
      order,
      createdBy,
      type,
      content,
      currentDraftId,
    });
  }, [sectionSlug, sections, router]);

  if (!section || !selectedStory) return null;

  return (
    <>
      <DashboardHeader
        title="Edit Section"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          {
            label: selectedStory.currentDraft?.title ?? "Untitled",
            href: `/admin/dashboard/${selectedStory.currentDraft?.slug}`,
          },
        ]}
        onSaveDraft={() => {}}
        onPublish={() => {}}
      />
      <div className="px-6">
        <EditSectionForm
          section={section}
          onCancelNavigateTo={`/admin/dashboard/${selectedStory.currentDraft?.slug}`}
        />
      </div>
    </>
  );
};

export default EditSectionPage;
