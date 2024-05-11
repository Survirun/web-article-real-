import { getArticle } from "@/apis/api/article";
import { getArticleList } from "@/apis/services/article";
import { useInfiniteQuery } from "@tanstack/react-query";

export const uesArticlePage = (
  keyWord: number,
) => {
  const { data, isLoading, isFetching, ...rest } = useInfiniteQuery({
    queryKey: ["getPlacesOfCategory"],
    queryFn: ({ pageParam }) =>
      getArticle(keyWord, pageParam),
    initialPageParam: 1, 

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data.total_places) {
        const totalPages = Math.ceil(lastPage.data.total_places / 20); // 총 페이지 개수값 구하기
        console.log(totalPages)
        return allPages.length < totalPages ? allPages.length + 1 : undefined;
      }
    },

    retry: 0,
  });
  
  return { data: data, article: getArticleList(data), isLoading, isFetching, ...rest };
};
