'use client';

import { LoaderCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ButtonThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const className =
    'rounded-lg bg-gray-200 p-2 text-gray-600 hover:cursor-pointer dark:bg-gray-700 dark:text-yellow-300';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={className} aria-label="Toggle Theme" disabled>
        <LoaderCircle size={20} className="animate-spin" />
      </button>
    );
  }

  const currentTheme = mounted ? (theme ?? systemTheme) : 'light';

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className={className}
      aria-label="Toggle Theme"
    >
      {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
