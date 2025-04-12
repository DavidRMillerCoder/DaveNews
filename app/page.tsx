'use client';

import NewsFeedWrapper from '@/components/news/NewsFeedWrapper';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          DaveNews
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
          Your personalized news feed
        </p>
        <NewsFeedWrapper />
      </main>
    </div>
  );
}
