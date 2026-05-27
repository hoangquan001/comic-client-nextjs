
import Link from 'next/link';
import Image from 'next/image';
import { SearchBox, NotifyBell, ThemeToggle } from '@/components/common';
import { getServerCookie } from '@/lib/utils/cookie';
import { IUser } from '@/types';
import { UserIcon } from './user-icon';


export async function Header() {
  const initialUser = await getServerCookie<IUser>('auth');
  return (
    <header className="px-3 py-1.5 border-b border-primary-100 h-18.25">
      {/* Top header bar */}

      <div className="max-w-7xl mx-auto flex justify-between items-center h-full md:px-4">
        <Link href="/" className="shrink-0 text-primary-100 no-underline hover:scale-105 transition-transform duration-200">
          <Image className="w-[127.5px] h-15 object-contain" loading="eager" src="/logo.png" alt="logo" width={128} height={60} />
        </Link>

        <div className="flex gap-2 items-center">
          <SearchBox />
          <ThemeToggle />
          <NotifyBell />
          <UserIcon initialUser={initialUser} /> 
        </div>
      </div>
    </header>
  );
}
