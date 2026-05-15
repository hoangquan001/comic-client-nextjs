import type { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Câu hỏi thường gặp',
    'Câu hỏi thường gặp về MeTruyenMoi - tài khoản, đồng bộ, tìm kiếm, đọc truyện.',
    'cau-hoi-thuong-gap'
  );
}

export default function FAQPage() {
  return (
    <section className="container mx-auto px-3 py-8">
      <div className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
        <h1 className="text-2xl font-bold mb-4">Câu hỏi thường gặp</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Tài khoản & đồng bộ</h2>
            <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800">
              <details className="py-3 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between">
                  Đăng ký tài khoản có lợi ích gì?
                  <span className="text-sm opacity-70 group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-2 text-sm opacity-80">Bạn có thể theo dõi truyện yêu thích, đồng bộ lịch sử giữa thiết bị, nhận gợi ý phù hợp và bình luận.</p>
              </details>
              <details className="py-3 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between">
                  Đồng bộ dữ liệu hoạt động thế nào?
                  <span className="text-sm opacity-70 group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-2 text-sm opacity-80">Tại trang &quot;Đồng bộ truyện&quot;, bạn có thể nhập dữ liệu theo định dạng hỗ trợ hoặc dùng công cụ import tự động (khi khả dụng).</p>
              </details>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Tìm kiếm & đọc truyện</h2>
            <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800">
              <details className="py-3 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between">
                  Làm sao để tìm truyện phù hợp?
                  <span className="text-sm opacity-70 group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-2 text-sm opacity-80">Dùng ô tìm kiếm, lọc theo thể loại tại trang &quot;Thể loại&quot;, hoặc xem các danh mục như &quot;Truyện Hot&quot;, &quot;Xếp hạng&quot;.</p>
              </details>
              <details className="py-3 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between">
                  Có quảng cáo làm phiền không?
                  <span className="text-sm opacity-70 group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-2 text-sm opacity-80">Chúng tôi hạn chế tối đa các hình thức quảng cáo gây khó chịu để không làm gián đoạn việc đọc của bạn.</p>
              </details>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/50 text-sm">
          Không tìm thấy câu trả lời? <Link href="/lien-he" className="text-blue-600 hover:underline">Liên hệ</Link> với chúng tôi.
        </div>
      </div>
    </section>
  );
}
