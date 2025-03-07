import Link from 'next/link';

import AutoLink from '../auto-link';
import NavbarWithMobile from './NavbarWithMobile';
import type { NavbarItem } from './types';

const navbarItems: NavbarItem[] = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '#', label: 'About' },
];

export default function Header() {
  return (
    <header
      id="Header"
      className="fixed top-0 z-50 w-full bg-white shadow-md dark:bg-gray-800"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            <Link href="/">My Blog</Link>
          </div>

          <nav className="hidden space-x-8 md:flex">
            {navbarItems.map((item, index) => (
              <AutoLink
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-white"
              >
                {item.label}
              </AutoLink>
            ))}
          </nav>

          <NavbarWithMobile items={navbarItems} />
        </div>
      </div>
    </header>
  );
}
