import { BlogList } from '@/components/features/blog';
import { GetPostsDocument } from '@/graphql/generated/graphql';
import client from '@/lib/apolloClient';
import config from '@/lib/config';
import { getPage } from '@/lib/queries/pages';
import { Metadata } from 'next';

export const revalidate = 3600;

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage({ slug: config.slugHomePage });

  if (!page) {
    return {};
  }

  return {
    title: page?.seo?.title,
    description: page?.seo?.description,
    keywords: page?.seo?.focusKeywords?.join(', '),
    openGraph: {
      title: page?.seo?.openGraph?.title || undefined,
      description: page?.seo?.openGraph?.description || undefined,
      url: page?.seo?.openGraph?.url || undefined,
      siteName: page?.seo?.openGraph?.siteName || undefined,
    },
  };
}

export default async function HomePage() {
  const { data } = await client.query({
    query: GetPostsDocument,
    variables: { first: 10 },
  });

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">บทความล่าสุด</h1>
      {data?.posts?.nodes && <BlogList posts={data?.posts?.nodes} />}
    </>
  );
}
