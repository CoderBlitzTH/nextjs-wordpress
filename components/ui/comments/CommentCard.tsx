'use client';

import { Reply } from 'lucide-react';
import Image from 'next/image';

import ContentParser from '../content-parser';
import DateFormatter from '../date-formatter';
import CommentReplyCard from './CommentReplyCard';
import type { CommentCardProps } from './types';

import defaultAvatar from '@/public/images/default-avatar.jpg';

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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

      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:cursor-pointer hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <Reply className="h-5 w-5 -scale-x-100 transform" />
          <span>ตอบกลับ</span>
        </button>
      </div>

      {/* Comment replies (if any) */}
      {comment?.replies && comment?.replies?.nodes?.length !== 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.nodes.map(reply => (
            <CommentReplyCard key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
