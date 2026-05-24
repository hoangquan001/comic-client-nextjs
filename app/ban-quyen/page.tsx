import type { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Chính sách bản quyền (DMCA)',
    'Chính sách bản quyền DMCA của MeTruyenMoi. Hướng dẫn gửi yêu cầu gỡ bỏ nội dung vi phạm.',
    'ban-quyen'
  );
}

export default function DMCAPage() {
  return (
    <section className="lg:container mx-auto px-3 py-8">
      <div className="bg-white/80 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-6">
        <h1 className="text-2xl font-bold mb-4">Chính sách bản quyền (DMCA)</h1>
        <p className="opacity-80">
          Chúng tôi tôn trọng quyền sở hữu trí tuệ. Nếu bạn cho rằng một nội dung bất kỳ trên MeTruyenMoi vi phạm bản quyền, hãy gửi yêu cầu gỡ bỏ theo hướng dẫn dưới đây.
        </p>

        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Cách gửi yêu cầu</h2>
            <ol className="list-decimal pl-5 text-sm opacity-90 space-y-1">
              <li>Chuẩn bị bằng chứng quyền sở hữu (giấy tờ, liên kết gốc, thông tin liên quan).</li>
              <li>
                Gửi yêu cầu qua trang{' '}
                <Link href="/lien-he" className="font-medium text-blue-800 underline hover:text-blue-900 dark:text-blue-300">Liên hệ</Link>{' '}
                hoặc email: <span className="font-mono">cskh.metruyenmoi&#64;gmail.com</span>.
              </li>
              <li>Nêu rõ URL nội dung cần gỡ và mô tả phạm vi vi phạm.</li>
            </ol>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Thời gian xử lý</h2>
            <p className="text-sm opacity-80">
              Chúng tôi sẽ xác minh và xử lý trong thời gian sớm nhất (thông thường 24–72 giờ). Trường hợp cần thêm thông tin, chúng tôi sẽ liên hệ lại.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800 text-sm">
          Lưu ý: MeTruyenMoi là nền tảng tổng hợp, một số nội dung có thể được đồng bộ từ nguồn bên thứ ba. Chúng tôi sẵn sàng hợp tác để bảo vệ tác quyền một cách minh bạch.
        </div>
      </div>
    </section>
  );
}
