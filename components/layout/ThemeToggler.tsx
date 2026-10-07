import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        className="hover:scale-110 w-6 h-6"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <Moon className="size-6 hover:cursor-pointer transition-all" />
        ) : (
          <Sun className="size-6 hover:cursor-pointer transition-all" />
        )}
      </TooltipTrigger>
      <TooltipContent>Toggle Theme</TooltipContent>
    </Tooltip>
  );
}
