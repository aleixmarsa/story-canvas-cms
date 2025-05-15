import useSWR, { KeyedMutator } from "swr";
import { getCurrentDraftStories } from "@/lib/actions/draft/get-draft-stories";
import type { StoryDraftMetadata } from "@/lib/dal/draft";

export type Response = Awaited<ReturnType<typeof getCurrentDraftStories>>;

const fetcher = (url: string): Promise<Response> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch stories");
    return res.json();
  });

export const useStories = (): {
  stories: StoryDraftMetadata[];
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<Response>;
} => {
  const { data, error, isLoading, mutate } = useSWR<Response>(
    "/api/stories/draft",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );

  return {
    stories: data ? data : [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
