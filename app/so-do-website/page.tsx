import type { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Sơ đồ website',
    'Sơ đồ website MeTruyenMoi - Khám phá toàn bộ nội dung và các trang quan trọng.',
    'so-do-website'
  );
}

export default function HtmlSitemapPage() {
  return (
    <section className="lg:container mx-auto px-3 py-8">
      <div className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shadow-lg backdrop-blur-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-100 mb-3">Sơ đồ website</h1>
          <p className="text-base opacity-75 max-w-2xl mx-auto leading-relaxed">
            Khám phá toàn bộ nội dung trên MeTruyenMoi. Tất cả các trang quan trọng được tổ chức một cách rõ ràng để bạn dễ dàng điều hướng.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Trang chính */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800/50 dark:to-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Trang chính</h2>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Trang chủ' },
                { href: '/so-do-website', label: 'Sơ đồ website' },
                { href: '/the-loai', label: 'Thể loại' },
                { href: '/tim-truyen', label: 'Tìm truyện' },
                { href: '/truyen-hot', label: 'Truyện hot' },
                { href: '/xep-hang', label: 'Bảng xếp hạng' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cá nhân + Công cụ */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-zinc-800/50 dark:to-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">Cá nhân</h2>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/lich-su', label: 'Lịch sử' },
                { href: '/theo-doi', label: 'Theo dõi' },
                { href: '/tai-khoan', label: 'Tài khoản' },
                { href: '/auth/dang-nhap', label: 'Đăng nhập' },
                { href: '/auth/dang-ky', label: 'Đăng ký' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 transition-colors group">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-600 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center mb-4 mt-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.533 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Công cụ</h2>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/dong-bo-truyen', label: 'Đồng bộ truyện' },
                { href: '/tro-ly-ai', label: 'Trợ lý AI' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-600 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin + Pháp lý */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-800/50 dark:to-orange-900/20 rounded-xl p-6 border border-orange-100 dark:border-orange-800/30">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-orange-700 dark:text-orange-300">Thông tin</h2>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/gioi-thieu', label: 'Giới thiệu' },
                { href: '/cau-hoi-thuong-gap', label: 'Câu hỏi thường gặp' },
                { href: '/lien-he', label: 'Liên hệ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-600 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center mb-4 mt-6">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Pháp lý</h2>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/dieu-khoan', label: 'Điều khoản sử dụng' },
                { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
                { href: '/ban-quyen', label: 'DMCA' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:bg-red-600 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
