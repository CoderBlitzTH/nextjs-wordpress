import type { GetCommentsQuery } from '@/graphql/generated/graphql';

type CommentsType = NonNullable<GetCommentsQuery['comments']>;

type CommentBase = {
  contentId: string;
  postId: number;
};

export type CommentListProps = {
  totalComments: number;
} & CommentBase;

export type CommentCardProps = {
  comment: CommentsType['nodes'][0];
};

export type CommnetReplyCardProps = {
  reply: NonNullable<CommentsType['nodes'][0]['replies']>['nodes'][0];
};

export type CommentFormProps = {
  onCommentCounter: () => void;
} & CommentBase;
