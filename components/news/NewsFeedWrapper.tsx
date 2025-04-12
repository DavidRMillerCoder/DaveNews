'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, fetchTopHeadlines, searchNews } from '@/lib/newsService';

const categories = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
];

// Media type colors
const mediaColors = {
  video: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  audio: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    )
  },
  podcast: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  article: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  }
};

// Function to determine media type based on URL or content
const getMediaType = (article: NewsArticle): keyof typeof mediaColors => {
  const url = article.url.toLowerCase();
  if (url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('.mp4')) {
    return 'video';
  } else if (url.includes('soundcloud.com') || url.includes('.mp3') || url.includes('.wav')) {
    return 'audio';
  } else if (url.includes('spotify.com') || url.includes('podcast') || url.includes('apple.com/podcast')) {
    return 'podcast';
  }
  return 'article';
};

export default function NewsFeedWrapper() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        let newsArticles: NewsArticle[];
        
        if (searchQuery) {
          newsArticles = await searchNews(searchQuery);
        } else {
          newsArticles = await fetchTopHeadlines(selectedCategory);
        }
        
        setArticles(newsArticles);
      } catch (err) {
        setError('Failed to fetch news articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;
    setSearchQuery(searchInput.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search news..."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const mediaType = getMediaType(article);
          const mediaStyle = mediaColors[mediaType];
          
          return (
            <article
              key={article.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border ${mediaStyle.border}`}
            >
              {article.urlToImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 right-4 p-2 rounded-lg ${mediaStyle.bg} ${mediaStyle.text}`}>
                    {mediaStyle.icon}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium ${mediaStyle.text}`}>
                    {article.source.name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {article.description}
                </p>
                {article.author && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    By {article.author}
                  </p>
                )}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center ${mediaStyle.text} hover:opacity-80 font-medium transition-colors duration-200`}
                >
                  {mediaType === 'video' ? 'Watch' : mediaType === 'audio' ? 'Listen' : mediaType === 'podcast' ? 'Listen to Podcast' : 'Read more'}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
} 