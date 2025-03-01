'use client';

import { useQuery } from '@apollo/client';
import { useCallback, useState } from 'react';

import { GetCommentsDocument } from '@/graphql/generated/graphql';
import LoadingSpinner from '../loading-spinner';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import type { CommentListProps } from './types';

export default function CommentList({
  contentId,
  postId,
  totalComments,
}: CommentListProps) {
  const [commentCount, setCommentCount] = useState(totalComments);

  const { loading, error, data, refetch } = useQuery(GetCommentsDocument, {
    variables: { contentId, first: 10 },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const handleCommentCounter = useCallback(() => {
    setCommentCount(prev => prev + 1);
    refetch();
  }, [refetch]);

  return (
    <section className="mt-8 max-w-4xl text-gray-700 dark:text-gray-300">
      <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        ร่วมแสดงความคิดเห็นของคุณ
      </h2>

      {/* Comment Form Section */}
      <CommentForm
        contentId={contentId}
        postId={postId}
        onCommentCounter={handleCommentCounter}
      />

      <h2 className="my-8 text-2xl font-bold text-gray-900 dark:text-white">
        ความคิดเห็น {commentCount} รายการ
      </h2>

      <div className="space-y-6">
        {loading ? (
          <LoadingSpinner textLoading="กำลังโหลดความคิดเห็น..." />
        ) : error ? (
          <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดความคิดเห็น</p>
        ) : commentCount !== 0 ? (
          data?.comments?.nodes.map((comment: any) => (
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
