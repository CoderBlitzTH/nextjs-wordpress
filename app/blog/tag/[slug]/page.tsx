import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/blog';
import { getPostsByTag } from '@/lib/queries/posts';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getPostsByTag({ slug });

  if (!tag) {
    return {
      title: 'ไม่พบแท็ก',
      description: undefined,
    };
  }

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
export default async function TagPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const tag = await getPostsByTag({ slug });

  if (!tag || !tag.posts?.nodes) notFound();

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">แท็ก: {tag.name}</h1>

      {tag.posts.nodes.length > 0 ? (
        <BlogList posts={tag.posts.nodes} />
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-400">ไม่พบบทความ</p>
      )}
    </>
  );
}
