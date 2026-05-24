import Link from 'next/link';
import Image from 'next/image';
import { config } from '@/lib/config';

export function Footer() {
  return (
    <>
      <div className="border-t border-neutral-300 dark:border-neutral-600 border-opacity-60 mt-5" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex flex-col items-center lg:items-start gap-4">
              <Image className="h-16 w-auto object-contain" src="/logo.png" alt={`${config.APP_NAME} Logo`} width={136} height={64} />
              <p className="text-sm text-neutral-800 dark:text-neutral-400">{config.APP_NAME} - Luôn cập nhật truyện tranh mới mỗi ngày</p>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-6">
              Khám phá hàng nghìn bộ truyện tranh hấp dẫn từ khắp nơi trên thế giới. Cập nhật liên tục, đọc miễn phí, trải nghiệm tuyệt vời.
            </p>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Email liên hệ: cskh.metruyenmoi&#64;gmail.com</p>
              <div className="flex gap-4">
                <Link href="/gioi-thieu" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-100 dark:hover:text-primary-100 text-sm hover:underline">Giới thiệu</Link>
                <Link href="/lien-he" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-100 dark:hover:text-primary-100 text-sm hover:underline">Liên hệ</Link>
                <Link href="/chinh-sach-bao-mat" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-100 dark:hover:text-primary-100 text-sm hover:underline">Chính sách</Link>
                <Link href="/dieu-khoan" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-100 dark:hover:text-primary-100 text-sm hover:underline">Điều khoản</Link>
                <Link href="/so-do-website" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-100 dark:hover:text-primary-100 text-sm hover:underline">Sơ đồ website</Link>
              </div>
            </div>
            {/* Social Media */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-light-text mb-4">Kết nối với {config.APP_NAME}</h2>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/metruyenmoicom"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-sky-100 dark:hover:bg-sky-600 hover:text-sky-600 dark:hover:text-white text-neutral-700 dark:text-neutral-300 rounded-lg text-sm hover:scale-105 hover:shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-sky-50 dark:hover:bg-sky-400 hover:text-sky-400 dark:hover:text-white text-neutral-700 dark:text-neutral-300 rounded-lg text-sm hover:scale-105 hover:shadow-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-indigo-100 dark:hover:bg-indigo-600 hover:text-indigo-600 dark:hover:text-white text-neutral-700 dark:text-neutral-300 rounded-lg text-sm hover:scale-105 hover:shadow-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189z" />
                  </svg>
                  <span>Discord</span>
                </a>
              </div>
            </div>
          </div>

          {/* Facebook & Keywords Section */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <div className="flex flex-wrap gap-2" itemProp="keywords">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-light-text mb-2 w-full">Từ khóa phổ biến</h2>
              {[
                'Truyện tranh online miễn phí',
                'Đọc manga không quảng cáo',
                'Website truyện tranh tốt nhất',
                'Manga hay nhất 2025',
                'Manhwa completed full',
                'Manhua tu tiên hay',
                'Truyện tranh cập nhật nhanh',
                'Đọc truyện HD chất lượng cao',
                'Top manga việt nam',
                'Truyện tranh hot trending',
                'Manga full bộ tiếng việt',
                'Website đọc truyện không lag',
                'nhattruyenvn',
              ].map((tag) => (
                <Link
                  key={tag}
                  href="/"
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 dark:hover:bg-primary-100 text-neutral-700 dark:text-neutral-300 hover:text-white dark:hover:text-white text-xs hover:scale-105 dark:border-neutral-600 hover:border-primary-100 no-underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-neutral-900 dark:text-light-text font-medium mb-2">&copy; 2024 {config.APP_NAME}.</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Trang web này cung cấp nội dung với mục đích <strong>giải trí</strong>. Chúng tôi <strong>không chịu trách nhiệm</strong> về bất kỳ nội dung quảng cáo hay liên kết của bên thứ ba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
