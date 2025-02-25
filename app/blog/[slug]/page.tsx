import { Metadata } from 'next';

import { BlogPost } from '@/components/ui/blog';
import { GetPostDocument } from '@/graphql/generated/graphql';
import { query } from '@/lib/apolloClient';
import config from '@/lib/config';
import type { PageProps } from '@/types';

/**
 * Generate the static routes at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export function generateStaticParams() {
  return [];
}

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await query({
    query: GetPostDocument,
    variables: { slug },
  });

  const post = data?.post;

  if (!post) return {};

  return {
    title: `${post.title} - ${config.siteName}`,
    description: post.excerpt,
  };
}

/**
 * The blog post route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function BlogPostPage({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const {
    data: { post },
  } = await query({
    query: GetPostDocument,
    variables: { slug },
  });

  if (!post) return <p className="text-center text-gray-500">ไม่พบบทความ</p>;

  return <BlogPost post={post} />;
}
