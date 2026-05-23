
import Link from 'next/link';
import Image from 'next/image';
import { UserMenu } from './user-menu';
import { SearchBox, NotifyBell, ThemeToggle } from '@/components/common';

export function Header() {

  return (
    <header className="px-3 py-1.5 border-b border-primary-100 h-[73px]">
      {/* Top header bar */}

      <div className="max-w-7xl mx-auto flex justify-between items-center h-full md:px-4">
        <Link href="/" className="shrink-0 text-primary-100 no-underline hover:scale-105 transition-transform duration-200">
          <Image className="w-[127.5px] h-[60px] object-contain" loading="eager" src="/logo.png" alt="logo" width={128} height={60} />
        </Link>

        <div className="flex gap-2 items-center">
          <SearchBox />
          <ThemeToggle />
          <NotifyBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
