import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentParser } from '@/components/common';
import { BlogList } from '@/components/features/blog';
import type { GetPageQuery, GetPostsQuery } from '@/graphql/generated/graphql';
import { generateSeoMetadata } from '@/lib/metadata';
import { getPage } from '@/lib/queries/pages';
import { getPosts } from '@/lib/queries/posts';

/**
 * Represents the possible return types from the fetchData function using discriminated union
 */
type FetchDataResult =
  | {
      type: 'posts';
      posts: NonNullable<NonNullable<GetPostsQuery['posts']>['nodes']>;
    }
  | { type: 'page'; page: NonNullable<GetPageQuery['page']> }
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
    const posts = await getPosts();

    if (!posts) {
      return { type: 'error', error: 'No posts found' };
    }

    return { type: 'posts', posts };
  }

  const page = await getPage({ slug });
  if (page) {
    return { type: 'page', page };
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
    <article className="prose dark:prose-invert prose-img:rounded mb-8 max-w-none">
      <h1 className="mb-4 text-center text-3xl font-bold">{page?.title}</h1>
      {page?.content && <ContentParser content={page.content} />}
    </article>
  );
}

/**
 * Generate the metadata for each page based on slug parameter.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage({ slug });

  return generateSeoMetadata(page?.seo);
}

/**
 * Catch-all Archive Page component that handles both single pages and post listings.
 * Uses type narrowing with discriminated unions for proper type checking.
 */
export default async function Page({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const data = await fetchData(slug);

  if (data.type === 'error') {
    notFound();
  }

  if (data.type === 'page') {
    return <RenderPage page={data.page} />;
  }

  if (data.type === 'posts' && data.posts.length > 0) {
    return (
      <section className="flex flex-col">
        <h1 className="mb-8 text-center text-3xl font-bold">บทความจากบล็อก</h1>
        <BlogList posts={data.posts} />
      </section>
    );
  }

  notFound();
}
