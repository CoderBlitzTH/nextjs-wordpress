'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ExitPreview() {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Link
        href="/api/exit-preview"
        className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg transition-all duration-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Exit Preview Mode"
      >
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="font-medium text-gray-800 dark:text-gray-200">
          Exit Preview
        </span>
      </Link>
    </div>
  );
}
