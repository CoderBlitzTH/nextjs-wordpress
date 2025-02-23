'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            My Blog
          </div>

          <nav className="hidden space-x-8 md:flex">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-white"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-white"
            >
              Blog
            </Link>

            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-white"
            >
              About
            </a>
          </nav>
          <button
            onClick={toggleDarkMode}
            className="rounded-lg bg-gray-200 p-2 text-gray-600 dark:bg-gray-700 dark:text-yellow-300"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
