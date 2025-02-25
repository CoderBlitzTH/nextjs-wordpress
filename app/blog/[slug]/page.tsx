import { BlogPost } from '@/components/ui/blog';
import { GetPostDocument } from '@/graphql/generated/graphql';
import { query } from '@/lib/apolloClient';
import type { PageProps } from '@/types/page';

export default async function Page({ params }: Readonly<PageProps>) {
  // Get the slug from the params.
  const { slug } = await params;

  const {
    data: { post },
  } = await query({
    query: GetPostDocument,
    variables: { slug },
  });

  if (!post) return <p className="text-center text-gray-500">ไม่พบบทความ</p>;

  return <BlogPost post={post} />;
}
