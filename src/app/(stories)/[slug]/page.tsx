import { getStoryByPublicSlug, getPublishedSlugs } from "@/lib/dal/stories";
import { notFound } from "next/navigation";
import StoryRenderer from "@/components/storyCanvas/renderer/StoryRenderer";
import { RenderSectionData } from "@/types/section";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map(({ publicSlug }) => ({ slug: publicSlug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryByPublicSlug(slug);
  if (!story || !story.publishedVersion) return {};
  return {
    title: story.publishedVersion.title,
    description: story.publishedVersion.description ?? "",
  };
}

export default async function PublishedStoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryByPublicSlug(slug);

  if (!story || !story.publishedVersion) return notFound();

  // Format sections for the renderer
  const publishedSections: RenderSectionData[] = story.sections
    .filter((section) => section.publishedVersion)
    .map((section) => ({
      id: section.publishedVersion!.id,
      name: section.publishedVersion!.name,
      type: section.publishedVersion!.type,
      order: section.publishedVersion!.order,
      content: section.publishedVersion!.content,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <main>
      <StoryRenderer sections={publishedSections} />
    </main>
  );
}
