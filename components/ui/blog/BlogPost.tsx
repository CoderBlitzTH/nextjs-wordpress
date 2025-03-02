import Image from 'next/image';
import Link from 'next/link';

import { getImageSizes } from '@/lib/utils';
import type { ImgSize } from '@/types';
import CommentList from '../comments/CommentList';
import ContentParser from '../content-parser';
import DateFormatter from '../date-formatter';
import NoImage from '../no-image';

import { GetPostQuery } from '@/graphql/generated/graphql';
import defaultAvatar from '@/public/images/default-avatar.jpg';

type BlogPostProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export default function BlogPost({ post }: BlogPostProps) {
  const images = getImageSizes(
    (post.featuredImage?.node?.mediaDetails?.sizes as ImgSize[]) ?? []
  );

  return (
    <article className="mx-auto max-w-4xl text-gray-700 dark:text-gray-300">
      {/* Title section */}
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          {post.title}
        </h1>

        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href={`/blog/author/${post.author?.node.slug || '#'}`}>
              <Image
                src={post?.author?.node.avatar?.url || defaultAvatar.src}
                width={40}
                height={40}
                quality={80}
                loading="lazy"
                alt={post.author?.node.name || ''}
                className="h-10 w-10 rounded-full"
              />
            </Link>

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                <Link href={`/blog/author/${post.author?.node.slug || '#'}`}>
                  {post.author?.node.name}
                </Link>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <DateFormatter
                  date={post?.date ?? ''}
                  options={{
                    year: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  }}
                />
                <span className="mx-1.5">·</span>
                <span>10 min read</span>
              </p>
            </div>
          </div>

          {/* Category section */}
          {post.categories?.nodes && post.categories.nodes.length !== 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {post.categories.nodes.map(category => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* FeaturedImage section */}
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage?.node?.sourceUrl}
            width={736}
            height={384}
            quality={80}
            blurDataURL={images.thumbnail?.sourceUrl}
            placeholder="blur"
            loading="lazy"
            alt={post.title || ''}
            className="mb-4 h-96 w-full rounded-lg object-cover"
          />
        ) : (
          <NoImage />
        )}
      </div>

      {/* Content section */}
      {post.content && (
        <div className="prose dark:prose-invert prose-img:rounded mb-8 max-w-none">
          <ContentParser content={post.content} />
        </div>
      )}

      {/* Tags section */}
      {post.tags?.nodes && post.tags.nodes.length !== 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {post.tags.nodes.map(tag => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Comments section */}
      {post?.commentStatus && post.commentStatus === 'open' && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <CommentList
            contentId={post.id || ''}
            postId={post.databaseId || 0}
            totalComments={post.commentCount || 0}
          />
        </div>
      )}
    </article>
  );
}
