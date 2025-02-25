import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/ui/blog';
import { GetPostsByTagDocument } from '@/graphql/generated/graphql';
import { query } from '@/lib/apolloClient';
import config from '@/lib/config';
import type { PageProps } from '@/types';

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
    query: GetPostsByTagDocument,
    variables: { first: 10, slug },
  });

  const { tag } = data;

  if (!tag || !tag?.posts?.nodes) {
    return {};
  }

  return {
    title: `${tag.name} - ${config.siteName}`,
    description: `เก็บแท็กสำหรับ ${tag.name}`,
  };
}

/**
 * The tag archive route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function Page({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const { data } = await query({
    query: GetPostsByTagDocument,
    variables: { first: 10, slug },
  });

  const { tag } = data;

  if (!tag || !tag?.posts?.nodes) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">{tag.name}</h1>
      <BlogList posts={tag.posts.nodes} />
    </>
  );
}
