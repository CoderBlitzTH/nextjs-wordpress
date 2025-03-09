import { GetSitemapPostsAndPagesDocument } from '@/graphql/generated/graphql';
import client from '../apolloClient';

export async function getSitemapPostsAndPages(limit: number = 100) {
  try {
    const { data } = await client.query({
      query: GetSitemapPostsAndPagesDocument,
      variables: { first: limit },
    });

    return {
      posts: data?.posts?.nodes || null,
      pages: data?.pages?.nodes || null,
    };
  } catch (error) {
    console.error(
      `[getSitemapPostsAndPages] Error fetching posts and pages: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}
