import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/ui/blog';
import { getPostsByAuthor } from '@/lib/queries/posts';
import type { DynamicRouteArgs } from '@/types';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: DynamicRouteArgs): Promise<Metadata> {
  const { slug } = await params;
  const author = await getPostsByAuthor({ slug });

  if (!author) throw notFound();

  return {
    title: author.name,
    description: `บทความทั้งหมดของ ${author.name}`,
  };
}

/**
 * The archive page route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function AuthorPage({
  params,
}: Readonly<DynamicRouteArgs>) {
  const { slug } = await params;
  const author = await getPostsByAuthor({ slug });

  if (!author || !author.posts?.nodes) notFound();

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">บทความของ: {author.name}</h1>
      <BlogList posts={author.posts.nodes} />
    </>
  );
}
