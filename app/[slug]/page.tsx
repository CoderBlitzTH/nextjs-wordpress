import BlogList from '@/components/blog/BlogList';
import type { GetPageQuery, GetPostsQuery } from '@/gql/graphql';
import { GET_PAGE_BY_SLUG, GET_POSTS } from '@/graphql/queries';
import { apolloClient } from '@/lib/apolloClient';
import type { PageProps } from '@/types/page';
import { notFound } from 'next/navigation';

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
  const { query } = apolloClient();

  if (slug === 'blog') {
    const { data } = await query<GetPostsQuery>({
      query: GET_POSTS,
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

  const { data } = await query<GetPageQuery>({
    query: GET_PAGE_BY_SLUG,
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
    <main className="flex flex-col gap-8">
      <article>
        <h1 dangerouslySetInnerHTML={{ __html: page?.title ?? '' }} />
        <div dangerouslySetInnerHTML={{ __html: page?.content ?? '' }} />
      </article>
    </main>
  );
}

/**
 * Props for the RenderPostsList component
 */
type RenderPostsListProps = {
  posts: NonNullable<NonNullable<GetPostsQuery['posts']>['nodes']>;
  context: string;
};

function RenderPostsList({ posts, context }: RenderPostsListProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
      <BlogList posts={posts} />
    </main>
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
    return <RenderPostsList posts={data.posts} context={data.context} />;
  }

  notFound();
}
