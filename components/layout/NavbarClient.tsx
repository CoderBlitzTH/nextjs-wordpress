'use client';

import { ChevronRight, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AutoLink } from '@/components/common';
import ButtonThemeSwitchClient from './ThemeSwitchClient';
import type { NavbarItems } from './types';

type NavbarClientProps = {
  items: NavbarItems[];
};

export default function NavbarClient({ items }: NavbarClientProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isNavbarItems = items.length !== 0;

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <ButtonThemeSwitchClient />
        <button className="ml-4 md:hidden" aria-label="Toggle mobile menu">
          <Menu size={28} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Theme Switch and Mobile Menu Toggle */}
      <div className="flex items-center">
        <ButtonThemeSwitchClient />

        {/* Hamburger Menu for Mobile */}
        {isNavbarItems && (
          <button
            onClick={toggleMobileMenu}
            className="ml-4 rounded-full p-2 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none md:hidden dark:hover:bg-gray-700"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={28} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Navigation Menu */}
      {isNavbarItems && (
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 z-50 h-full w-72 overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden dark:bg-gray-800 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                เมนู
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close menu"
              >
                <X size={24} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-2">
              {items?.map(item => (
                <div
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-700"
                >
                  <AutoLink
                    href={item.url || ''}
                    className="flex items-center justify-between px-6 py-4 text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </AutoLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
