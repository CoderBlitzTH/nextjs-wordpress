import { notFound } from 'next/navigation';

import { BlogList } from '@/components/ui/blog';
import type { GetPageQuery, GetPostsQuery } from '@/graphql/generated/graphql';
import { GetPageDocument, GetPostsDocument } from '@/graphql/generated/graphql';
import { query } from '@/lib/apolloClient';
import type { PageProps } from '@/types/page';

/**
 * Represents the possible return types from the fetchData function using discriminated union
 */
type FetchDataResult =
  | {
      type: 'posts';
      posts: NonNullable<NonNullable<GetPostsQuery['posts']>['nodes']>;
      context: string;
    }
  | { type: 'page'; post: NonNullable<GetPageQuery['page']> }
  | { type: 'error'; error: string };

/**
 * Fetches data from WordPress based on the provided slug.
 * Uses discriminated unions to ensure type safety.
 *
 * @param slug - The URL slug to fetch data for
 * @returns A promise containing either posts, a single post, or an error
 */
const fetchData = async (slug: string): Promise<FetchDataResult> => {
  if (slug === 'blog') {
    const { data } = await query({
      query: GetPostsDocument,
      variables: { first: 10 },
    });

    if (!data?.posts?.nodes) {
      return { type: 'error', error: 'No posts found' };
    }

    return {
      type: 'posts',
      posts: data.posts.nodes,
      context: 'blog',
    };
  }

  const { data } = await query({
    query: GetPageDocument,
    variables: { slug },
  });

  if (data?.page) {
    return {
      type: 'page',
      post: data.page,
    };
  }

  return { type: 'error', error: 'No data found' };
};

/**
 * Props for the RenderPage component
 */
type RenderPageProps = {
  page: NonNullable<GetPageQuery['page']>;
};

function RenderPage({ page }: RenderPageProps) {
  return (
    <article>
      <h1 dangerouslySetInnerHTML={{ __html: page?.title ?? '' }} />
      <div dangerouslySetInnerHTML={{ __html: page?.content ?? '' }} />
    </article>
  );
}

/**
 * Catch-all Archive Page component that handles both single pages and post listings.
 * Uses type narrowing with discriminated unions for proper type checking.
 */
export default async function Page({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const data = await fetchData(slug);

  if (data.type === 'error') {
    notFound();
  }

  if (data.type === 'page') {
    return <RenderPage page={data.post} />;
  }

  if (data.type === 'posts' && data.posts.length > 0) {
    return (
      <>
        <h1 className="mb-4 text-3xl font-bold">บทความล่าสุด</h1>
        <BlogList posts={data.posts} />
      </>
    );
  }

  notFound();
}
