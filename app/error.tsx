'use client';

import { CircleAlert } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Error component.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-gray-800">
        <div className="mb-6">
          <CircleAlert className="mx-auto h-16 w-16 text-red-500" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          มีข้อผิดพลาดเกิดขึ้น
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:cursor-pointer hover:bg-blue-700"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  );
}
