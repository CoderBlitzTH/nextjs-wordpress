import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogPost } from '@/components/features/blog';
import { generateSeoMetadata } from '@/lib/metadata';
import { getPost, getPosts } from '@/lib/queries/posts';

/**
 * Generate the metadata for each blog post based on slug parameter.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost({ slug });

  return generateSeoMetadata(post?.seo);
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
