export const getArticleList = (response: any) => {
    console.log(response?.data?.articles);
    return response?.data?.articles
}