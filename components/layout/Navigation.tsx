import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { cn } from 'cn';
import { GithubLink } from './GithubLink';
import { FileScan, Link2, Menu } from 'lucide-react';
import { Logo } from './Logo';

export function Navigation() {
  return (
    <>
      <ul className="hidden md:flex gap-8 items-center pr-4">
        <li className="w-6 h-6">
          <Link href="/scan/file">
            <Tooltip>
              <TooltipTrigger>
                <FileScan className="size-6 hover:scale-110 hover:cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>Scan file</TooltipContent>
            </Tooltip>
          </Link>
        </li>
        <li className="w-6 h-6">
          <Link href="/scan/url">
            <Tooltip>
              <TooltipTrigger>
                <Link2 className="size-6 hover:scale-110 hover:cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>Scan URL</TooltipContent>
            </Tooltip>
          </Link>
        </li>
      </ul>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button>
                <Menu />
              </Button>
            }
          />
          <SheetContent>
            <SheetHeader>
              <Logo />
              <SheetDescription className={cn('py-2')}>
                Scan files, urls and links for malicious content
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min px-4">
              <div className="grid">
                <SheetClose>
                  <Link href="/scan/file">
                    <Label htmlFor="sheet-demo-name">
                      <FileScan className="size-6" />
                      <span>Scan File</span>
                    </Label>
                  </Link>
                </SheetClose>
              </div>
              <hr className="my-2 h-0.5 border-t-0 bg-secondary" />
              <div className="grid">
                <SheetClose>
                  <Link href="/scan/url">
                    <Label htmlFor="sheet-demo-name">
                      <Link2 className="size-6" />
                      <span>Scan Url</span>
                    </Label>
                  </Link>
                </SheetClose>
              </div>
            </div>
            <SheetFooter>
              <hr className="my-2 h-0.5 border-t-0 bg-secondary" />
              <GithubLink />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
