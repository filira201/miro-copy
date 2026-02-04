import { rqClient } from "@/shared/api/instance";
import { useCallback, type RefCallback } from "react";

type useBoardsListParams = {
  limit?: number;
  sort?: "createdAt" | "updatedAt" | "lastOpenedAt" | "name";
  isFavorite?: boolean;
  search?: string;
};

export function useBoardsList({
  limit = 20,
  sort,
  isFavorite,
  search,
}: useBoardsListParams) {
  const { fetchNextPage, data, isFetchingNextPage, isPending, hasNextPage } =
    rqClient.useInfiniteQuery(
      "get",
      "/boards",
      {
        params: {
          query: {
            page: 1,
            limit,
            sort,
            isFavorite,
            search,
          },
        },
      },
      {
        initialPageParam: 1,
        pageParamName: "page",
        getNextPageParam: (lastPage, _, lastPageParams) =>
          Number(lastPageParams) < lastPage.totalPages
            ? Number(lastPageParams) + 1
            : undefined,
      }
    );

  const cursorRef: RefCallback<HTMLDivElement> = useCallback(
    (node) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 }
      );

      if (node) {
        observer.observe(node);

        return () => {
          observer.disconnect();
        };
      }
    },
    [fetchNextPage]
  );

  const boards = data?.pages.flatMap((page) => page.list) ?? [];

  return { boards, cursorRef, isFetchingNextPage, isPending, hasNextPage };
}
