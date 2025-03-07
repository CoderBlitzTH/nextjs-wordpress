import { BlogList } from '@/components/blog';
import { GetPostsDocument } from '@/graphql/generated/graphql';
import client from '@/lib/apolloClient';

export const revalidate = 60;

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
