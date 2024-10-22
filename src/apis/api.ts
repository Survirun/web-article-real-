import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 3000,
});

export type Passed = string[];

export interface Article {
  snippet: string | null;
  date: string | null;
  thumbnail: string | null;
  keywords: string[];
  displayLink: string;
  sitename: string;
  link: string;
  title: string;
  cx: number;
  _id: string;
  weight: number | null;
  type: number;
}

export interface Data {
  page: number;
  maxPage: number;
  articles: Article[];
}

export interface ArticleResponse {
  status: boolean;
  data: Data;
}

export const getArticleKeyword = async (keyword: number, page: number, passed: Passed): Promise<ArticleResponse> => {
  try {
    const response = await api.post<ArticleResponse>(
      `/article/${keyword}`,
      { passed: [] },
      {
        params: { page: page },
        headers: {
          'uid': 'l8Z8k1UzGKhJuydX0Kyxu3rFMgJ3',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export default api;
