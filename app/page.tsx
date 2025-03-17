import { Metadata } from 'next';

import { ContentParser } from '@/components/common';
import { BlogList } from '@/components/features/blog';
import config from '@/lib/config';
import { generateSeoMetadata } from '@/lib/metadata';
import { getPage } from '@/lib/queries/pages';
import { getPosts } from '@/lib/queries/posts';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage({ slug: config.slugHomePage });

  return generateSeoMetadata(page?.seo);
}

export default async function HomePage() {
  const page = await getPage({ slug: config.slugHomePage });
  const posts = await getPosts();

  return (
    <>
      {page?.content && (
        <div className="prose dark:prose-invert prose-img:rounded mb-8 max-w-none">
          <ContentParser content={page.content} />
        </div>
      )}

      <section className="flex flex-col">
        <h2 className="mb-8 text-center text-3xl font-bold">บทความล่าสุด</h2>
        {posts && posts.length > 0 && <BlogList posts={posts} />}
      </section>
    </>
  );
}
