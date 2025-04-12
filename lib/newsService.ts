const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string;
  author?: string;
  content?: string;
}

interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string;
  author?: string;
  content?: string;
}

interface NewsApiResponse {
  articles: NewsApiArticle[];
}

export async function fetchTopHeadlines(category?: string): Promise<NewsArticle[]> {
  try {
    if (!API_KEY) {
      throw new Error('NewsAPI key is not configured');
    }

    const categoryParam = category ? `&category=${category}` : '';
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us${categoryParam}&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data: NewsApiResponse = await response.json();
    return data.articles.map((article: NewsApiArticle, index: number) => ({
      id: `${index}-${article.publishedAt}`,
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source,
      urlToImage: article.urlToImage,
      author: article.author,
      content: article.content
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  try {
    if (!API_KEY) {
      throw new Error('NewsAPI key is not configured');
    }

    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search news');
    }

    const data: NewsApiResponse = await response.json();
    return data.articles.map((article: NewsApiArticle, index: number) => ({
      id: `${index}-${article.publishedAt}`,
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source,
      urlToImage: article.urlToImage,
      author: article.author,
      content: article.content
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
} 