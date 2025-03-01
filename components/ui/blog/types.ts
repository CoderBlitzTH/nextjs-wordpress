import type { GetPostQuery, GetPostsQuery } from '@/graphql/generated/graphql';

export type BlogCardProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export type BlogListProps = {
  posts: NonNullable<GetPostsQuery['posts']>['nodes'];
};

export type BlogPostProps = {
  post: NonNullable<GetPostQuery['post']>;
};

export type BlogPostCommentsProps = {
  contentId: string;
  totalComments: number;
};
