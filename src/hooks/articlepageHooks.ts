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
    initialPageParam: 1, // v5 달라진 점 -> 본인이 불러와야 하는 첫 페이지를 지정!

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data.total_places) {
        const totalPages = Math.ceil(lastPage.data.total_places / 20); // 총 페이지 개수값 구하기
        console.log(totalPages)
        return allPages.length < totalPages ? allPages.length + 1 : undefined;
      }
      // return값이 pageParam으로 전달
    },

    retry: 0,
  });
  
  return { data: data, article: getArticleList(data), isLoading, isFetching, ...rest };
};
