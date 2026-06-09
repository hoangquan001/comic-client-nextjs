'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { AccountIcon, type IconName } from './_components/account-ui';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  description: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/tai-khoan/ho-so', label: 'Thông tin cá nhân', icon: 'user', description: 'Quản lý thông tin tài khoản' },
  { href: '/tai-khoan/nhiem-vu', label: 'Nhiệm vụ', icon: 'target', description: 'Nhiệm vụ hằng ngày và tuần', badge: 3 },
  { href: '/tai-khoan/yeu-thich', label: 'Truyện yêu thích', icon: 'heart', description: 'Danh sách truyện đã lưu' },
  { href: '/tai-khoan/lich-su', label: 'Lịch sử đọc', icon: 'clock', description: 'Truyện đã đọc gần đây' },
  { href: '/tai-khoan/thong-ke', label: 'Thống kê', icon: 'chart', description: 'Thống kê hoạt động đọc truyện' },
  { href: '/tai-khoan/thanh-tich', label: 'Thành tích', icon: 'trophy', description: 'Huy hiệu và thành tựu' },
  { href: '/tai-khoan/tui-do', label: 'Kho đồ', icon: 'package', description: 'Quản lý vật phẩm' },
];

function formatJoinDate(date?: string) {
  if (!date) return '';
  const parsed = dayjs(date);
  if (!parsed.isValid()) return '';
  return parsed.format('DD/MM/YYYY');
}

export default function TaiKhoanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-dark-bg">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Vui lòng đăng nhập</h2>
          <Link href="/auth/dang-nhap" className="font-semibold text-primary-100 hover:text-primary-200">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'User';

  return (
    <div className="min-h-screen w-full bg-white dark:bg-dark-bg lg:container md:mx-auto">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full shrink-0 border-b border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-900 md:w-80 md:border-b-0 md:border-r md:bg-neutral-100 md:dark:bg-neutral-800 lg:w-80">
          <div className="flex h-full flex-col p-3 xs:p-4 md:p-4">
            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-800 xs:gap-3 xs:p-4 md:mb-4 md:justify-start md:rounded-lg md:bg-white md:p-3 md:dark:bg-neutral-700">
              <div className="relative">
                <Image
                  src={user?.avatar || '/default_avatar.jpg'}
                  alt={fullName}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-10 w-10 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-600 xs:h-12 xs:w-12 md:h-14 md:w-14"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-lime-500 dark:border-neutral-700" />
              </div>
              <div className="min-w-0 flex-1 md:flex-none">
                <h3 className="truncate text-xs font-bold text-neutral-900 dark:text-light-text xs:text-sm md:text-base">{fullName}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatJoinDate(user?.createAt) ? `Tham gia ${formatJoinDate(user?.createAt)}` : 'Tham gia --/----'}</p>
              </div>
            </div>

            <nav className="flex-none md:flex-1">
              <h4 className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 md:block">Tài khoản</h4>
              <ul className="grid grid-cols-3 gap-1 xs:grid-cols-4 xs:gap-2 md:block md:space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        title={item.description}
                        className={
                          active
                            ? 'relative flex min-h-[65px] flex-col items-center justify-center rounded-lg bg-primary-100 p-1.5 text-white shadow-lg shadow-primary-100/25 transition-all duration-200 hover:bg-primary-100 xs:min-h-[75px] xs:p-2 md:block md:min-h-0 md:p-3 md:shadow-none'
                            : 'relative flex min-h-[65px] flex-col items-center justify-center rounded-lg bg-neutral-50 p-1.5 text-neutral-900 transition-all duration-200 hover:-translate-y-px hover:bg-neutral-100 hover:shadow-md dark:bg-neutral-800 dark:text-light-text dark:hover:bg-neutral-700 xs:min-h-[75px] xs:p-2 md:block md:min-h-0 md:bg-transparent md:p-3 md:hover:translate-y-0 md:hover:bg-white md:hover:shadow-none md:dark:bg-transparent md:dark:hover:bg-neutral-700'
                        }
                      >
                        <div className="flex flex-col items-center gap-1 md:flex-row md:gap-3">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-200 xs:h-8 xs:w-8 md:h-9 md:w-9 ${active ? 'bg-white/20' : 'bg-transparent md:bg-neutral-200 md:dark:bg-neutral-600'}`}>
                            <AccountIcon name={item.icon} className={`h-4 w-4 xs:h-5 xs:w-5 md:h-4 md:w-4 ${active ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`} />
                          </div>
                          <span className={`block max-w-full truncate text-center text-xs font-medium leading-tight md:hidden ${active ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>{item.label}</span>
                          <div className="hidden min-w-0 flex-1 md:block">
                            <span className={`block text-sm font-medium ${active ? 'text-white' : 'text-neutral-900 dark:text-light-text'}`}>{item.label}</span>
                            <span className={`block truncate text-xs ${active ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400'}`}>{item.description}</span>
                          </div>
                          {!!item.badge && (
                            <div className={`absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-red-500 px-1 py-0 text-xs font-bold text-white xs:h-4 xs:min-w-4 xs:px-1.5 md:static md:h-auto md:min-w-[18px] md:bg-primary-100 md:px-2 md:py-1 ${active ? 'md:bg-white/20' : ''}`}>
                              {item.badge > 99 ? '99+' : item.badge}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="flex-1 overflow-auto bg-white p-3 dark:bg-dark-bg md:p-4">{children}</div>
      </div>
    </div>
  );
}
