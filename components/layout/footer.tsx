import Link from 'next/link';
import { config } from '@/lib/config';

export function Footer() {
  return (
    <>
      <div className="border-t border-primary-100" />
      <div className="footer-content bg-white dark:bg-dark-bg text-gray-700 dark:text-light-text">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <img className="h-12 object-contain" src="/logo.png" alt={`${config.APP_NAME} Logo`} />
              <p className="mt-2 text-sm text-gray-500">{config.APP_NAME} - Luôn cập nhật truyện tranh mới mỗi ngày</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Khám phá hàng nghìn bộ truyện tranh hấp dẫn từ khắp nơi trên thế giới. Cập nhật liên tục, đọc miễn phí, trải nghiệm tuyệt vời.
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Email liên hệ: cskh.metruyenmoi&#64;gmail.com</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Link href="/gioi-thieu" className="text-sm text-primary-100 hover:underline">Giới thiệu</Link>
                <Link href="/lien-he" className="text-sm text-primary-100 hover:underline">Liên hệ</Link>
                <Link href="/chinh-sach-bao-mat" className="text-sm text-primary-100 hover:underline">Chính sách</Link>
                <Link href="/dieu-khoan" className="text-sm text-primary-100 hover:underline">Điều khoản</Link>
                <Link href="/so-do-website" className="text-sm text-primary-100 hover:underline">Sơ đồ website</Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Kết nối với {config.APP_NAME}</h3>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/metruyenmoicom" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6" itemProp="keywords">
              <h2 className="text-sm font-semibold mb-3">Từ khóa phổ biến</h2>
              <div className="flex flex-wrap gap-2">
                {['Truyện tranh online miễn phí', 'Đọc manga không quảng cáo', 'Website truyện tranh tốt nhất', 'Manga hay nhất 2025', 'Manhwa completed full', 'Manhua tu tiên hay', 'Truyện tranh cập nhật nhanh', 'Đọc truyện HD chất lượng cao', 'Top manga việt nam', 'Truyện tranh hot trending', 'Manga full bộ tiếng việt', 'Website đọc truyện không lag'].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-700 py-4 px-4 max-w-7xl mx-auto">
          <p className="text-xs text-gray-500">&copy; 2024 {config.APP_NAME}.</p>
          <p className="text-xs text-gray-400 mt-1">
            Trang web này cung cấp nội dung với mục đích <strong>giải trí</strong>. Chúng tôi <strong>không chịu trách nhiệm</strong> về bất kỳ nội dung quảng cáo hay liên kết của bên thứ ba.
          </p>
        </div>
      </div>
    </>
  );
}
