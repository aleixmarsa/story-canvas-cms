import useSWR, { KeyedMutator } from "swr";
import { getCurrentDraftStories } from "@/lib/actions/draft/get-draft-stories";
import type { StoryDraftMetadata } from "@/lib/dal/draft";

export type Response = Awaited<ReturnType<typeof getCurrentDraftStories>>;

const fetcher = (url: string): Promise<Response> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch stories");
    return res.json();
  });

export function useStories(): {
  stories: StoryDraftMetadata[];
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<Response>;
} {
  const { data, error, isLoading, mutate } = useSWR<Response>(
    "/api/draft/stories",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );

  return {
    stories: data && "success" in data && data.stories ? data.stories : [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
