import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/blog';
import { getPostsByCategory } from '@/lib/queries/posts';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPostsByCategory({ slug });

  if (!category) {
    return {
      title: 'ไม่พบหมวดหมู่',
      description: undefined,
    };
  }

  return {
    title: category.name,
    description: `คลังเก็บหมวดหมู่สำหรับ ${category.name}`,
  };
}

/**
 * The archive page route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function CategoryPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const category = await getPostsByCategory({ slug });

  if (!category || !category.posts?.nodes) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">หมวดหมู่: {category.name}</h1>

      {category.posts.nodes.length > 0 ? (
        <BlogList posts={category.posts.nodes} />
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-400">ไม่พบบทความ</p>
      )}
    </>
  );
}
