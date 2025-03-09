import { Calendar, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { DateFormatter, NoImage } from '@/components/common';
import type { GetPostQuery } from '@/graphql/generated/graphql';
import { getImageSizes } from '@/lib/utils';
import type { ImgSize } from '@/types';

type BlogCardProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export default function BlogCard({ post }: BlogCardProps) {
  const images = getImageSizes(
    (post.featuredImage?.node?.mediaDetails?.sizes as ImgSize[]) ?? []
  );

  return (
    <article className="mb-8 overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="relative h-96 w-full">
        <Link href={post?.link ?? '#'} className="relative block h-full w-full">
          {post.featuredImage?.node?.sourceUrl ? (
            <Image
              src={post.featuredImage.node.sourceUrl}
              blurDataURL={images.thumbnail?.sourceUrl}
              placeholder="blur"
              loading="lazy"
              quality={80}
              fill={true}
              alt={post.title || ''}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          ) : (
            <NoImage />
          )}
        </Link>

        <div className="absolute top-4 left-4">
          <Link
            href={`/blog/category/${post.categories?.nodes[0].slug}`}
            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-600 dark:text-white"
          >
            {post.categories?.nodes[0].name}
          </Link>
        </div>
      </div>
      <div className="p-6">
        <Link href={post?.link ?? '#'}>
          <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            {post.title}
          </h2>
        </Link>

        <div
          className="mb-4 text-gray-600 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.excerpt ?? '' }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <DateFormatter
                  date={post?.date ?? ''}
                  options={{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }}
                />
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <MessageCircle
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.commentCount} ความคิดเห็น
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
