import { XCircle } from 'lucide-react';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlogPost } from '@/components/features/blog';
import { getPostPreview } from '@/lib/queries/posts';

/**
 * Force the route to be dynamic.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-dynamic';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  if (!isEnabled) {
    return {
      title: 'ไม่ได้รับอนุญาตให้เข้าถึงหน้านี้',
      description: undefined,
      robots: 'noindex',
    };
  }

  const post = await getPostPreview({ slug });
  if (!post) {
    return {
      title: 'ไม่พบบทความ',
      description: undefined,
      robots: 'noindex',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    robots: 'noindex',
  };
}

/**
 * The blog post route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function BlogPostPreviewPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { isEnabled } = await draftMode();
  const { slug } = await params;

  if (!isEnabled) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          ไม่ได้รับอนุญาตให้เข้าถึงหน้านี้
        </h1>
      </div>
    );
  }

  const post = await getPostPreview({ slug });
  if (!post) notFound();

  return (
    <>
      <BlogPost post={post} />

      <div className="fixed right-4 bottom-4 z-50">
        <Link
          href="/api/exit-preview"
          className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg transition-all duration-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Exit Preview Mode"
        >
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Exit Preview
          </span>
        </Link>
      </div>
    </>
  );
}
