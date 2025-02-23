import { GetPostsQuery } from '@/gql/graphql';
import BlogCard from './BlogCard';

type BlogListProps = {
  posts: NonNullable<GetPostsQuery['posts']>['nodes'];
};

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="md:col-span-2">
      {posts.map(post => (
        <BlogCard key={post.databaseId} post={post} />
      ))}
    </div>
  );
}
