import BlogPost from '@/components/blog/BlogPost';
import type { GetPostQuery } from '@/gql/graphql';
import { GET_POST_BY_SLUG } from '@/graphql/queries';
import { apolloClient } from '@/lib/apolloClient';
import type { PageProps } from '@/types/page';

export default async function Page({ params }: Readonly<PageProps>) {
  // Get the slug from the params.
  const { slug } = await params;

  const { query } = apolloClient();
  const {
    data: { post },
  } = await query<GetPostQuery>({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });

  if (!post) return <p className="text-center text-gray-500">ไม่พบบทความ</p>;

  return <BlogPost post={post} />;
}
