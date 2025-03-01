'use client';

import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import {
  CreateCommentDocument,
  GetCommentsDocument,
} from '@/graphql/generated/graphql';
import type { CommentFormProps } from './types';

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_MESSAGES = {
  SUBMIT_FAIL: 'ไม่สามารถโพสต์ความคิดเห็นได้ โปรดลองอีกครั้ง',
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการส่งความคิดเห็น กรุณาลองใหม่อีกครั้ง',
  INVALID_EMAIL: 'กรุณากรอกอีเมลให้ถูกต้อง',
} as const;

const getInputClassName = (isEmailInvalid: boolean = false) => {
  const baseClasses = [
    'w-full',
    'rounded-lg',
    'border',
    'p-4',
    'focus:border-transparent',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus-visible:outline-none',
    'bg-white',
    'text-gray-900',
    'dark:bg-gray-800',
    'dark:text-gray-100',
    'disabled:opacity-50',
  ];
  const borderClasses = isEmailInvalid
    ? ['border-red-500', 'dark:border-red-400']
    : ['border-gray-200', 'dark:border-gray-700'];
  return [...baseClasses, ...borderClasses].join(' ');
};

const getButtonClassName = (isDisabled: boolean) => {
  const baseClasses = [
    'self-end',
    'rounded-lg',
    'px-6',
    'py-2',
    'text-white',
    'transition-colors',
    'hover:cursor-pointer',
  ];
  const stateClasses = isDisabled
    ? ['bg-gray-400', 'cursor-not-allowed', 'dark:bg-gray-600']
    : [
        'bg-blue-600',
        'hover:bg-blue-700',
        'dark:bg-blue-500',
        'dark:hover:bg-blue-600',
      ];
  return [...baseClasses, ...stateClasses].join(' ');
};

export default function CommentForm({
  postId,
  contentId,
  onCommentCounter,
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
      update: (cache, { data }) => {
        if (!data?.createComment?.success) return;

        const existingComments = cache.readQuery({
          query: GetCommentsDocument,
          variables: { contentId, first: 10 },
        })?.comments?.nodes;

        if (
          existingComments &&
          data.createComment.comment?.__typename === 'Comment'
        ) {
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
        }
      },
      onCompleted: data => {
        if (data?.createComment?.success) {
          setNewComment('');
          onCommentCounter();
        } else {
          setErrorMessage(ERROR_MESSAGES.SUBMIT_FAIL);
        }
      },
      onError: () => setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR),
    }
  );

  const isValidForm = useCallback(() => {
    return (
      name.trim() &&
      email.trim() &&
      newComment.trim() &&
      EMAIL_REGEX.test(email)
    );
  }, [name, email, newComment]);

  const handleSubmitComment = useCallback(
    async (e: React.FormEvent) => {
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
    },
    [name, email, newComment, createComment, postId, isValidForm]
  );
  return (
    <form onSubmit={handleSubmitComment} className="mb-8" autoComplete="off">
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
          {isSubmitting ? 'กำลังโพสต์...' : 'แสดงความคิดเห็น'}
        </button>
      </div>
    </form>
  );
}
