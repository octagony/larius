import { Logo } from '@/components/layout/Logo';
import { GithubLink } from './GithubLink';

export function Footer() {
  return (
    <footer className="bg-white drop-shadow-sm dark:bg-black rounded-base shadow-xs border border-default">
      <div className="max-w-7xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Logo />
        </div>
        <hr className="my-6 border-default sm:mx-auto lg:my-8" />
        <GithubLink />
      </div>
    </footer>
  );
}
