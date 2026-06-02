import type { Metadata } from 'next';
import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema } from '@/lib/seo/json-ld';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Giới thiệu',
    'MeTruyenMoi là nền tảng đọc truyện tranh miễn phí, tốc độ nhanh, tối ưu cho mọi thiết bị.',
    'gioi-thieu'
  );
}

export default function AboutPage() {
  return (
    <section className="lg:container mx-auto w-full px-3 py-8">
      <JsonLdScript
        data={generateBreadcrumbSchema([
          { name: 'Trang chủ', url: '/' },
          { name: 'Giới thiệu', url: '/gioi-thieu' },
        ])}
      />
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/10 via-emerald-500/10 to-fuchsia-600/10 dark:from-blue-400/10 dark:via-emerald-400/10 dark:to-fuchsia-400/10 border border-zinc-200/60 dark:border-zinc-800">
        <div className="p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">MeTruyenMoi là gì?</h1>
          <p className="mt-3 md:text-lg opacity-80 max-w-3xl">
            Nền tảng đọc truyện tranh miễn phí, tốc độ nhanh, tối ưu cho mọi thiết bị. Tập trung vào trải nghiệm sạch, ổn định và chất lượng nội dung.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '15K+', label: 'Bộ truyện' },
              { value: '100K+', label: 'Độc giả thường xuyên' },
              { value: '24/7', label: 'Cập nhật nhanh' },
              { value: 'Không ads khó chịu', label: 'Tập trung nội dung' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          {
            title: 'Kho nội dung phong phú',
            desc: 'Hàng chục thể loại từ hành động, phiêu lưu, lãng mạn đến kinh dị. Danh mục được sắp xếp khoa học giúp bạn khám phá dễ dàng.',
          },
          {
            title: 'Trải nghiệm mượt mà',
            desc: 'Tối ưu hiệu năng đọc chương dài, nén ảnh thông minh, chuyển chương nhanh, ghi nhớ vị trí đọc tự động.',
          },
          {
            title: 'Cộng đồng tích cực',
            desc: 'Theo dõi, bình luận, đánh giá, gợi ý AI và đồng bộ lịch sử để bạn không bỏ lỡ chương mới.',
          },
        ].map((feature) => (
          <div key={feature.title} className="p-5 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            <h2 className="font-semibold mb-2">{feature.title}</h2>
            <p className="text-sm opacity-80">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <h2 className="text-xl font-semibold mb-2">Sứ mệnh</h2>
          <p className="opacity-80">Mang đến trải nghiệm đọc truyện nhanh, sạch, thân thiện và hữu ích cho mọi độc giả yêu truyện tranh tại Việt Nam.</p>
          <ul className="list-disc pl-5 mt-3 text-sm opacity-80 space-y-1">
            <li>Tôn trọng tác phẩm và cộng đồng người làm nội dung.</li>
            <li>Ưu tiên tốc độ và tính ổn định.</li>
            <li>Đề cao quyền riêng tư của người dùng.</li>
          </ul>
        </div>
        <div className="p-6 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <h2 className="text-xl font-semibold mb-2">Giá trị cốt lõi</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm opacity-90">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">Minh bạch & đơn giản</div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">Tốc độ & mượt mà</div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5">Tôn trọng người dùng</div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5">Không spam quảng cáo</div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-semibold">Bạn có góp ý hay muốn hợp tác?</h2>
            <p className="text-sm opacity-80">Liên hệ với chúng tôi để cùng xây dựng một cộng đồng đọc truyện văn minh.</p>
          </div>
          <Link href="/lien-he" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-center">
            Liên hệ
          </Link>
        </div>
      </div>
    </section>
  );
}
