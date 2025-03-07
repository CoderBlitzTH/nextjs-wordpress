'use client';

import Link from 'next/link';

/**
 * Not Found component.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFound() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-9xl font-bold text-gray-800 dark:text-white">
        404
      </h1>

      <div className="relative mb-8">
        <div className="mx-auto h-1 w-24 bg-blue-600 dark:bg-blue-500"></div>
      </div>

      <h2 className="mb-4 text-3xl font-semibold text-gray-700 dark:text-gray-200">
        ไม่พบหน้าที่คุณกำลังค้นหา
      </h2>

      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        ขออภัย หน้าที่คุณพยายามเข้าถึงอาจถูกย้าย ลบ หรือไม่เคยมีอยู่
      </p>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <button
          onClick={() => history.back()}
          className="rounded-lg border-2 border-gray-300 bg-transparent px-6 py-3 font-medium text-gray-700 transition duration-300 hover:cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ย้อนกลับ
        </button>

        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
