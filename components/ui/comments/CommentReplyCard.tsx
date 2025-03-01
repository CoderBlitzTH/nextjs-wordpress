import Image from 'next/image';

import ContentParser from '../content-parser';
import DateFormatter from '../date-formatter';
import type { CommnetReplyCardProps } from './types';

import defaultAvatar from '@/public/images/default-avatar.jpg';

export default function CommentReplyCard({ reply }: CommnetReplyCardProps) {
  return (
    <div
      key={reply.id}
      className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="mb-2 flex items-center space-x-3">
        <Image
          src={reply?.author?.node.avatar?.url || defaultAvatar.src}
          width={32}
          height={32}
          quality={80}
          loading="lazy"
          alt={reply.author?.node.name || 'Anonymous'}
          className="h-8 w-8 rounded-full"
        />

        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {reply.author?.node.name || 'Anonymous'}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <DateFormatter
              date={reply?.date ?? ''}
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
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {reply.content && <ContentParser content={reply.content} />}
      </div>
    </div>
  );
}
