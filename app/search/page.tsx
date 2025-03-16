'use client';

import { useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/common';
import { BlogList } from '@/components/features/blog';
import { GetPostsBySearchDocument } from '@/graphql/generated/graphql';
import config from '@/lib/config';

const SearchForm = ({
  query,
  onQueryChange,
  onSearch,
  loading,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) => (
  <form onSubmit={onSearch} className="mx-auto mb-8 w-full max-w-2xl">
    <div className="group relative">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30 dark:from-blue-700 dark:to-purple-700" />
      <div className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800">
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="ค้นหาบทความ..."
          className="flex-1 border-none bg-transparent px-4 py-3 text-lg text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                />
              </svg>
              กำลังค้นหา
            </span>
          ) : (
            'ค้นหา'
          )}
        </button>
      </div>
    </div>
  </form>
);

const SearchResults = ({
  loading,
  error,
  posts,
  debouncedQuery,
}: {
  loading: boolean;
  error?: any;
  posts?: any;
  debouncedQuery: string;
}) => (
  <div className="mt-8">
    {error && (
      <div className="mb-8 text-center font-medium text-red-600 dark:text-red-400">
        เกิดข้อผิดพลาด: {error.message}
      </div>
    )}
    {loading ? (
      <div className="flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    ) : posts?.posts?.nodes && posts.posts.nodes.length > 0 ? (
      <BlogList posts={posts.posts.nodes} />
    ) : (
      debouncedQuery && (
        <div className="py-12 text-center text-gray-600 dark:text-gray-400">
          ไม่พบผลการค้นหาสำหรับ &quot;{debouncedQuery}&quot;
        </div>
      )
    )}
  </div>
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  const {
    loading,
    error,
    data: posts,
  } = useQuery(GetPostsBySearchDocument, {
    variables: { search: debouncedQuery, first: config.limitPosts },
    skip: !debouncedQuery,
  });

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newUrl = query
        ? `${window.location.pathname}?q=${encodeURIComponent(query)}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
      setDebouncedQuery(query);
    },
    [query]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchForm
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />
      <SearchResults
        loading={loading}
        error={error}
        posts={posts}
        debouncedQuery={debouncedQuery}
      />
    </div>
  );
}
