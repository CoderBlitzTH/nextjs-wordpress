import Link from 'next/link';

import { AutoLink } from '@/components/common';
import { getMenuPrimary } from '@/lib/queries/menu';
import NavbarWithMobile from './NavbarClient';
import type { NavbarItems } from './types';

export default async function Header() {
  const menuPrimary = await getMenuPrimary();

  const navbarItems: NavbarItems[] =
    menuPrimary?.map(item => ({
      id: item.id,
      url: item.url || '',
      label: item.label || '',
    })) || [];

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

          {navbarItems.length !== 0 && (
            <nav className="hidden space-x-8 md:flex">
              {navbarItems.map(item => (
                <AutoLink
                  key={item.id}
                  href={item.url || ''}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 hover:dark:text-white"
                >
                  {item.label}
                </AutoLink>
              ))}
            </nav>
          )}

          <NavbarWithMobile items={navbarItems} />
        </div>
      </div>
    </header>
  );
}
