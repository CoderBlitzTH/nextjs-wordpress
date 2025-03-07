import { Metadata } from 'next';

import { BlogPost } from '@/components/blog';
import { getPost, getPosts } from '@/lib/queries/posts';
import { notFound } from 'next/navigation';

/**
 * Generate the metadata for each static route at build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost({ slug });

  if (!post) {
    return {
      title: 'ไม่พบบทความ',
      description: undefined,
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

/**
 * ใช้ generateStaticParams เพื่อ Pre-render ที่ Build Time
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const posts = await getPosts({ limit: 50 });

  if (!posts || !posts.length) return [];

  return posts.filter(post => post?.slug).map(post => ({ slug: post.slug }));
}

/**
 * The blog post route.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
export default async function BlogPostPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const post = await getPost({ slug });

  if (!post) notFound();

  return <BlogPost post={post} />;
}
