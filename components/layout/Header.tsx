'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Navigation } from './Navigation';
import { ThemeToggler } from './ThemeToggler';

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <header className="fixed h-16 z-10 w-full bg-white drop-shadow-sm dark:bg-black px-2 py-4 ">
      <div className="flex justify-between max-w-7xl mx-auto">
        <Logo />

        <div className="flex items-center gap-4">
          <Navigation />
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
