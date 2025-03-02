import Link from 'next/link';
import ButtonThemeSwitch from './ui/button-theme-switch';

export default function Header() {
  return (
    <header
      id="Header"
      className="fixed top-0 z-50 w-full bg-white shadow-md dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            <Link href="/">My Blog</Link>
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

          <ButtonThemeSwitch />
        </div>
      </div>
    </header>
  );
}
