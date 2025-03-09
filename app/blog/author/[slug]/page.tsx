import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/features/blog';
import { getPostsByAuthor } from '@/lib/queries/posts';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const author = await getPostsByAuthor({ slug });

  if (!author) {
    return {
      title: 'ไม่พบนักเขียน',
      description: undefined,
    };
  }

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
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const author = await getPostsByAuthor({ slug });

  if (!author || !author.posts?.nodes) notFound();

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">บทความของ: {author.name}</h1>

      {author.posts.nodes.length > 0 ? (
        <BlogList posts={author.posts.nodes} />
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-400">ไม่พบบทความ</p>
      )}
    </>
  );
}
