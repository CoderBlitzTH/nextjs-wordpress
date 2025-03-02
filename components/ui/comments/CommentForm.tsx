'use client';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import {
  CreateCommentDocument,
  GetCommentsDocument,
  type GetCommentsQuery,
} from '@/graphql/generated/graphql';
import { EMAIL_REGEX, ERROR_MESSAGES } from '@/lib/constants';
import { getButtonClassName, getInputClassName } from '@/lib/utils';

type CommentFormProps = {
  contentId: string;
  postId: number;
  handleNewComment: (
    comment: NonNullable<GetCommentsQuery['comments']>['nodes'][0]
  ) => void;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
};

export default function CommentForm({
  postId,
  contentId,
  handleNewComment,
  setCommentCount,
}: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load from localStorage
  useEffect(() => {
    setName(localStorage.getItem('commenterName') || '');
    setEmail(localStorage.getItem('commenterEmail') || '');
  }, []);

  const [createComment, { loading: isSubmitting }] = useMutation(
    CreateCommentDocument,
    {
      optimisticResponse: {
        createComment: {
          __typename: 'CreateCommentPayload',
          success: true,
          comment: {
            __typename: 'Comment',
            id: `temp-id-${Date.now()}`,
            author: {
              __typename: 'CommentToCommenterConnectionEdge',
              node: {
                __typename: 'CommentAuthor',
                name: name,
                avatar: {
                  __typename: 'Avatar',
                  url: null,
                },
              },
            },
            content: newComment,
            date: new Date().toISOString(),
          },
        },
      },
      update: (cache, { data }) => {
        if (!data?.createComment?.success) return;

        const existingComments =
          cache.readQuery({
            query: GetCommentsDocument,
            variables: { contentId, first: 10 },
          })?.comments?.nodes || [];

        if (data.createComment.comment?.__typename === 'Comment') {
          cache.writeQuery({
            query: GetCommentsDocument,
            variables: { contentId, first: 10 },
            data: {
              comments: {
                __typename: 'RootQueryToCommentConnection',
                nodes: [data.createComment.comment, ...existingComments],
              },
            },
          });

          if (data.createComment.comment.id.startsWith('temp-id-')) {
            handleNewComment(data.createComment.comment);
          }
        }
      },
      onCompleted: data => {
        if (data?.createComment?.success) {
          setNewComment('');
          setCommentCount(prev => prev + 1);
        } else {
          setErrorMessage(ERROR_MESSAGES.SUBMIT_FAIL);
        }
      },
      onError: () => setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR),
    }
  );

  const isValidForm = () =>
    name.trim() && email.trim() && newComment.trim() && EMAIL_REGEX.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidForm()) return;

    localStorage.setItem('commenterName', name);
    localStorage.setItem('commenterEmail', email);

    await createComment({
      variables: {
        author: name,
        authorEmail: email,
        content: newComment,
        postId,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8" autoComplete="off">
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ชื่อของคุณ"
          className={getInputClassName()}
          disabled={isSubmitting}
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="อีเมลของคุณ"
          className={getInputClassName(
            email && !EMAIL_REGEX.test(email) ? true : false
          )}
          disabled={isSubmitting}
        />
        {email && !EMAIL_REGEX.test(email) && (
          <p className="text-sm text-red-500 dark:text-red-400">
            {ERROR_MESSAGES.INVALID_EMAIL}
          </p>
        )}

        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="แบ่งปันความคิดของคุณ..."
          className={`${getInputClassName()} min-h-[100px] resize-y`}
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting || !isValidForm()}
          className={getButtonClassName(isSubmitting || !isValidForm())}
        >
          {isSubmitting ? 'กำลังส่ง...' : 'แสดงความคิดเห็น'}
        </button>
      </div>
    </form>
  );
}
