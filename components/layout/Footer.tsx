import { Logo } from '@/components/layout/Logo';
import { GithubLink } from './GithubLink';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white drop-shadow-sm dark:bg-black rounded-base shadow-xs border border-default">
      <div className="max-w-7xl mx-auto p-4 md:py-8">
        <div className="flex items-center justify-center flex-col gap-4 md:flex-row md:justify-between">
          <Logo />
          <div className="flex items-center justify-center gap-4">
            <a href="https://cloud.google.com/terms" className="hover:text-primary">
              Terms of Service
            </a>
            <a
              href="https://cloud.google.com/terms/secops/privacy-notice"
              className="hover:text-primary"
            >
              Privacy Notice
            </a>
            <Link href="/scan/url" className="hover:text-primary">
              Scan URL
            </Link>
            <Link href="/scan/file" className="hover:text-primary">
              Scan File
            </Link>
          </div>
        </div>
        <hr className="my-6 border-default sm:mx-auto lg:my-8" />
        <GithubLink />
      </div>
    </footer>
  );
}
