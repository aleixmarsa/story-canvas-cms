export const dynamic = "force-dynamic";
import {
  getPublishedSectionsBySlug,
  getPublishedStoryByPublicSlug,
} from "@/lib/dal/published";
import { notFound } from "next/navigation";
import StoryRenderer from "@/components/storyCanvas/renderer/StoryRenderer";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const story = await getPublishedStoryByPublicSlug(slug);
  if (!story || !story.publishedVersion) return {};
  return {
    title: story.publishedVersion.title,
    description: story.publishedVersion.description ?? "",
  };
}

export default async function PublishedStoryPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const story = await getPublishedStoryByPublicSlug(slug);

  if (!story || !story.publishedVersion) return notFound();

  const sections = await getPublishedSectionsBySlug(slug);

  return (
    <div>
      <StoryRenderer sections={sections} />
    </div>
  );
}
