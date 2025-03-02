import type { GetPostsQuery } from '@/graphql/generated/graphql';
import BlogCard from './BlogCard';

export type BlogListProps = {
  posts: NonNullable<GetPostsQuery['posts']>['nodes'];
};

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="md:col-span-2">
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
