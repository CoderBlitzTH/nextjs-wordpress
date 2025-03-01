import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/ui/blog';
import { getPostsByTag } from '@/lib/queries/posts';
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
  const tag = await getPostsByTag({ slug });

  if (!tag) throw notFound();

  return {
    title: tag.name,
    description: `เก็บแท็กสำหรับ ${tag.name}`,
  };
}

/**
 * The tag archive route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function TagPage({ params }: Readonly<DynamicRouteArgs>) {
  const { slug } = await params;
  const tag = await getPostsByTag({ slug });

  if (!tag || !tag.posts?.nodes) notFound();

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">แท็ก: {tag.name}</h1>
      <BlogList posts={tag.posts.nodes} />
    </>
  );
}
