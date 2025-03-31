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
    type: SectionType;
    content: JsonValue;
  } | null>(null);

  useEffect(() => {
    if (!sectionSlug) {
      router.push("/admin/dashboard");
      return;
    }

    const found = sections.find((s) => s.slug === sectionSlug);
    if (!found) {
      router.push("/admin/dashboard");
      return;
    }
    const { id, name, order, type, content } = found;
    setSection({
      id,
      name,
      order,
      type,
      content,
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
            label: selectedStory.title,
            href: `/admin/dashboard/${selectedStory.slug}`,
          },
        ]}
        onSaveDraft={() => {}}
        onPublish={() => {}}
      />
      <EditSectionForm
        section={section}
        onCancelNavigateTo={`/admin/dashboard/${selectedStory.slug}`}
      />
    </>
  );
};

export default EditSectionPage;
