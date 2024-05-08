import { defaultInstance } from "../utils/instance";

export const getArticle = async(keyWord: number, pageParam: number) => {
    try{
        const data = await defaultInstance.post(`/article/${keyWord}?page=${pageParam}`);
        return data
    } catch(err) {
        console.error(err)
    }
}

export const addBookMark = async(bookmarkId: string) => {
    try{
        const data = await defaultInstance.post(`/bookmark/${bookmarkId}`)
        return data
    } catch(err) {
        console.error(err)
    }
}