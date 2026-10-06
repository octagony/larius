'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

export default function Header() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <header className="fixed h-16 z-10 w-full bg-white drop-shadow-sm dark:bg-black px-2 py-4 ">
      <div className="flex justify-between max-w-3xl mx-auto">
        <Logo />

        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Moon className="size-6" /> : <Sun className="size-6" />}
        </button>
      </div>
    </header>
  );
}
