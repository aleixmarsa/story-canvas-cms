import { getPublishedSlugs } from "@/lib/dal/stories";
import {
  getPublishedSectionsBySlug,
  getPublishedStoryByPublicSlug,
} from "@/lib/dal/published";
import { notFound } from "next/navigation";
import StoryRenderer from "@/components/storyCanvas/renderer/StoryRenderer";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map(({ publicSlug }) => ({ slug: publicSlug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const story = await getPublishedStoryByPublicSlug(slug);
  if (!story || !story.publishedVersion) return {};
  return {
    title: story.publishedVersion.title,
    description: story.publishedVersion.description ?? "",
  };
}

export default async function PublishedStoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getPublishedStoryByPublicSlug(slug);

  if (!story || !story.publishedVersion) return notFound();

  const sections = await getPublishedSectionsBySlug(slug);

  return (
    <main>
      <StoryRenderer sections={sections} />
    </main>
  );
}
