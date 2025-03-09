'use client';

import Image from 'next/image';

import { ContentParser, DateFormatter } from '@/components/common';
import type { GetCommentsQuery } from '@/graphql/generated/graphql';

import defaultAvatar from '@/public/images/default-avatar.jpg';

type CommentCardClientProps = {
  comment: NonNullable<GetCommentsQuery['comments']>['nodes'][0];
};

export default function CommentCardClient({ comment }: CommentCardClientProps) {
  return (
    <div
      data-comment-id={comment.id}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={comment?.author?.node.avatar?.url || defaultAvatar.src}
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
                  year: 'numeric',
                  month: 'long',
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
    </div>
  );
}
