import type { GetPostQuery } from '@/gql/graphql';
import { getImageSizes } from '@/lib/utils';
import type { ImgSize } from '@/types/img';
import Image from 'next/image';

type BlogPostProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export default function BlogPost({ post }: BlogPostProps) {
  const images = getImageSizes(
    (post.featuredImage?.node?.mediaDetails?.sizes as ImgSize[]) ?? []
  );

  return (
    <article className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      {post.featuredImage?.node?.sourceUrl && (
        <Image
          src={post.featuredImage?.node?.sourceUrl}
          width={post.featuredImage?.node?.mediaDetails?.width ?? undefined}
          height={post.featuredImage?.node?.mediaDetails?.height ?? undefined}
          quality={80}
          blurDataURL={images.thumbnail?.sourceUrl}
          placeholder="blur"
          loading="lazy"
          sizes="(max-width: 480px) 400px, (max-width: 920px) 800px, (max-width: 1400px) 1200px, 1920px"
          alt={post.title ?? ''}
          className="mb-4 h-60 w-full rounded-lg object-cover"
        />
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
      />
    </article>
  );
}
