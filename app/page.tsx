import { BlogList } from '@/components/ui/blog';
import { GetPostsDocument } from '@/graphql/generated/graphql';
import { query } from '@/lib/apolloClient';

export const revalidate = 60;

export default async function HomePage() {
  const { data } = await query({
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
