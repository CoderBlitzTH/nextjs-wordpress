import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogList } from '@/components/ui/blog';
import type { GetPostsByCategoryQuery } from '@/graphql/generated/graphql';
import { GetPostsByCategoryDocument } from '@/graphql/generated/graphql';
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
  const { data } = await query<GetPostsByCategoryQuery>({
    query: GetPostsByCategoryDocument,
    variables: { first: 10, slug },
  });

  const { category } = data;

  if (!category || !category?.posts?.nodes) {
    return {};
  }

  return {
    title: `${category.name} - ${config.siteName}`,
    description: `หมวดหมู่ ${category.name}`,
  };
}

/**
 * The archive page route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function Page({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const { data } = await query<GetPostsByCategoryQuery>({
    query: GetPostsByCategoryDocument,
    variables: { first: 10, slug },
  });

  const { category } = data;

  if (!category || !category?.posts?.nodes) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">{category.name}</h1>
      <BlogList posts={category.posts.nodes} />
    </>
  );
}
