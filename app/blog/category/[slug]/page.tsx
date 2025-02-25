import { notFound } from 'next/navigation';

import { BlogList } from '@/components/ui/blog';
import type { GetPostsByCategoryQuery } from '@/graphql/generated/graphql';
import { GetPostsByCategoryDocument } from '@/graphql/generated/graphql';
import { query } from '@/lib/apolloClient';
import { PageProps } from '@/types/page';

export default async function Page({ params }: Readonly<PageProps>) {
  // Get the slug from the params.
  const { slug } = await params;
  const { data } = await query<GetPostsByCategoryQuery>({
    query: GetPostsByCategoryDocument,
    variables: { first: 10, slug },
  });

  if (!data?.category || !data?.category?.posts?.nodes) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">
        หมวดหมู่: {data.category.name}
      </h1>
      <BlogList posts={data.category.posts.nodes} />
    </>
  );
}
