'use client';

import { Reply } from 'lucide-react';
import Image from 'next/image';

import { GetCommentsDocument } from '@/graphql/generated/graphql';
import { useQuery } from '@apollo/client';
import ContentParser from '../content-parser';
import DateFormatter from '../date-formatter';
import type { BlogPostCommentsProps } from './types';

export default function BlogPostComments({
  contentId,
  totalComments,
}: BlogPostCommentsProps) {
  const { loading, error, data } = useQuery(GetCommentsDocument, {
    variables: { contentId, first: 10 },
  });

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="mt-8 max-w-4xl text-gray-700 dark:text-gray-300">
      <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        ความคิดเห็น {totalComments} รายการ
      </h2>

      <div className="space-y-6">
        {totalComments === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            มาเป็นคนแรกที่แชร์ความคิดของคุณกันเถอะ!
          </p>
        )}

        {totalComments !== 0 &&
          data?.comments?.nodes.map(comment => (
            <div
              key={comment.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src={comment?.author?.node.avatar?.url || ''}
                    width={40}
                    height={40}
                    quality={80}
                    loading="lazy"
                    alt={comment.author?.node.name || 'Anonymous'}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {comment.author?.node.name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <DateFormatter
                        date={comment?.date ?? ''}
                        options={{
                          year: '2-digit',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert prose-img:rounded mb-4 max-w-none text-gray-700 dark:text-gray-300">
                {comment.content && <ContentParser content={comment.content} />}
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:cursor-pointer hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  <Reply className="h-5 w-5 -scale-x-100 transform" />
                  <span>ตอบกลับ</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
