'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/use-auth-store';

const NAV_ITEMS = [
  { href: '/tai-khoan/ho-so', label: 'Hồ sơ', icon: 'user' },
  { href: '/tai-khoan/yeu-thich', label: 'Yêu thích', icon: 'heart' },
  { href: '/tai-khoan/lich-su', label: 'Lịch sử', icon: 'clock' },
  { href: '/tai-khoan/nhiem-vu', label: 'Nhiệm vụ', icon: 'quest' },
  { href: '/tai-khoan/thanh-tich', label: 'Thành tích', icon: 'trophy' },
  { href: '/tai-khoan/tui-do', label: 'Túi đồ', icon: 'bag' },
];

export default function TaiKhoanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <Link href="/auth/dang-nhap" className="text-primary-100 hover:text-primary-200 font-semibold">Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {/* User card */}
            <div className="p-6 bg-gradient-to-br from-primary-100 to-primary-200 text-white text-center">
              <Image src={user?.avatar || '/default_avatar.jpg'} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 border-3 border-white/30 object-cover" width={80} height={80} />
              <h3 className="font-bold text-lg">{user?.firstName || user?.username || 'User'}</h3>
              <p className="text-sm opacity-80">{user?.email || ''}</p>
            </div>
            {/* Nav */}
            <nav className="p-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === item.href ? 'bg-primary-100/10 text-primary-100' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                  {item.icon === 'user' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>}
                  {item.icon === 'heart' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
                  {item.icon === 'clock' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                  {item.icon === 'quest' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                  {item.icon === 'trophy' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34M18 2H6v7a6 6 0 0012 0V2z" /></svg>}
                  {item.icon === 'bag' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </main>
  );
}
