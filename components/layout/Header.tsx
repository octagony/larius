'use client';

import { Moon, ShieldCog, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <header className="flex items-center justify-between bg-zinc-50 dark:bg-black px-2 py-4">
      <div className="flex items-center gap-1 ">
        <ShieldCog className="size-8" />
        <span className="font-bold text-base">Larius</span>
      </div>

      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Moon className="size-6" /> : <Sun className="size-6" />}
      </button>
    </header>
  );
}
