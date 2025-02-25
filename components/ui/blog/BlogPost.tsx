import Image from 'next/image';

import type { GetPostQuery } from '@/graphql/generated/graphql';
import { getImageSizes } from '@/lib/utils';
import type { ImgSize } from '@/types';

type BlogPostProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export default function BlogPost({ post }: BlogPostProps) {
  const images = getImageSizes(
    (post.featuredImage?.node?.mediaDetails?.sizes as ImgSize[]) ?? []
  );

  return (
    <article className="mx-auto max-w-4xl text-gray-700 dark:text-gray-300">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          {post.title}
        </h1>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={post?.author?.node.avatar?.url ?? ''}
              width={40}
              height={40}
              quality={80}
              loading="lazy"
              alt={post.author?.node.name ?? ''}
              className="h-10 w-10 rounded-full"
            />

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {post.author?.node.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Feb 23, 2025 · 10 min read
              </p>
            </div>
          </div>
        </div>

        {post.featuredImage?.node?.sourceUrl && (
          <Image
            src={post.featuredImage?.node?.sourceUrl}
            width={736}
            height={384}
            quality={80}
            blurDataURL={images.thumbnail?.sourceUrl}
            placeholder="blur"
            loading="lazy"
            alt={post.title ?? ''}
            className="mb-4 h-96 w-full rounded-lg object-cover"
          />
        )}
      </div>

      <div
        className="prose prose-lg mb-12 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
      />
    </article>
  );
}
