import type { GetPostQuery } from '@/gql/graphql';
import { getImageSizes } from '@/lib/utils';
import type { ImgSize } from '@/types/img';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type BlogCardProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export default function BlogCard({ post }: BlogCardProps) {
  const images = getImageSizes(
    (post.featuredImage?.node?.mediaDetails?.sizes as ImgSize[]) ?? []
  );

  return (
    <article className="mb-8 overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="relative h-48 w-full">
        {post.featuredImage?.node?.sourceUrl && (
          <Image
            src={post.featuredImage.node.sourceUrl}
            width={800}
            height={400}
            quality={80}
            blurDataURL={images.thumbnail?.sourceUrl}
            placeholder="blur"
            loading="lazy"
            alt={post.title || ''}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-600 dark:text-white">
            Technology
          </span>
        </div>
      </div>
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          {post.title}
        </h2>
        <div
          className="mb-4 text-gray-600 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.excerpt ?? '' }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Published on February 23, 2025
            </span>
            <div className="flex items-center space-x-1">
              <MessageCircle
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.commentCount} comments
              </span>
            </div>
          </div>
          <Link
            href={post?.link ?? '#'}
            className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
          >
            อ่านเพิ่มเติม →
          </Link>
        </div>
      </div>
    </article>
  );
}
