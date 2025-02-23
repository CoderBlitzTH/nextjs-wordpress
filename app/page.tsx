import type { GetPostsQuery } from '@/gql/graphql';
import { GET_POSTS } from '@/graphql/queries';
import { apolloClient } from '@/lib/apolloClient';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const { query } = apolloClient();
  const { data } = await query<GetPostsQuery>({
    query: GET_POSTS,
    variables: { first: 10 },
  });

  return (
    <main>
      <h1>Recent Posts</h1>
      <ul>
        {(data?.posts?.nodes ?? []).map(post => (
          <li key={post.databaseId}>
            <Link href={post?.link ?? '#'}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
