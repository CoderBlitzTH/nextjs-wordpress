'use client';

import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  GetCommentsDocument,
  type GetCommentsQuery,
} from '@/graphql/generated/graphql';
import LoadingSpinner from '../loading-spinner';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

type CommentListProps = {
  totalComments: number;
  contentId: string;
  postId: number;
};

export default function CommentList({
  contentId,
  postId,
  totalComments,
}: CommentListProps) {
  const [commentCount, setCommentCount] = useState(totalComments);
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
  const commentListRef = useRef<HTMLDivElement>(null);

  const { loading, error, data } = useQuery(GetCommentsDocument, {
    variables: { contentId, first: 10 },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const comments = useMemo(() => data?.comments?.nodes || [], [data]);

  const handleNewComment = useCallback(
    (comment: NonNullable<GetCommentsQuery['comments']>['nodes'][0]) => {
      setNewCommentId(comment.id);
    },
    []
  );

  useEffect(() => {
    if (newCommentId && commentListRef.current) {
      const newCommentElement = commentListRef.current.querySelector(
        `[data-comment-id="${newCommentId}"]`
      );

      if (newCommentElement) {
        const headerElement = document.getElementById('Header');
        const headerHeight =
          headerElement?.getBoundingClientRect().height || 64;
        const elementPosition =
          newCommentElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - (headerHeight + 86);

        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          setNewCommentId(null);
        }, 500);
      }
    }
  }, [newCommentId, comments]);

  return (
    <section className="mt-8 max-w-4xl text-gray-700 dark:text-gray-300">
      <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        ร่วมแสดงความคิดเห็นของคุณ
      </h2>

      {/* Comment Form Section */}
      <CommentForm
        contentId={contentId}
        postId={postId}
        handleNewComment={handleNewComment}
        setCommentCount={setCommentCount}
      />

      <h2 className="my-8 text-2xl font-bold text-gray-900 dark:text-white">
        ความคิดเห็น {commentCount} รายการ
      </h2>

      <div ref={commentListRef} className="space-y-6">
        {loading ? (
          <LoadingSpinner textLoading="กำลังโหลดความคิดเห็น..." />
        ) : error ? (
          <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดความคิดเห็น</p>
        ) : comments.length !== 0 ? (
          comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            มาเป็นคนแรกที่แชร์ความคิดของคุณกันเถอะ!
          </p>
        )}
      </div>
    </section>
  );
}
