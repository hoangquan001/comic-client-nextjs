'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useComics, useRecommendComics } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { TopList } from '@/components/common/top-list/top-list';
import { AnnouncementBanner } from '@/components/common/announcement/announcement';
import { Spinner } from '@/components/common/spinner/spinner';
import { getComicDetailUrl } from '@/lib/utils/url';
import { formatNumber } from '@/lib/utils/number';

export default function HomeContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading } = useComics({
    page: String(page),
    step: '30',
    genre: '-1',
    sort: '1',
    status: '-1',
  });

  const { data: carouselComics } = useRecommendComics();

  const comics = data?.comics ?? [];
  const totalpage = data?.totalpage ?? 1;
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  return (
    <div className="container mx-auto px-3 py-4">
      {/* Carousel / Recommend Comics */}
      {carouselComics && carouselComics.length > 0 && page === 1 && (
        <div className="hidden sm:block mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
              <title>Truyện đang thịnh hành</title>
              <path d="M16,2a9,9,0,0,0-6,15.69V30l6-4,6,4V17.69A9,9,0,0,0,16,2Zm4,24.26-2.89-1.92L16,23.6l-1.11.74L12,26.26V19.05a8.88,8.88,0,0,0,8,0ZM20.89,16A7,7,0,1,1,23,11,7,7,0,0,1,20.89,16Z" />
            </svg>
            <h2 className="block-title">Truyện đang thịnh hành</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {carouselComics.slice(0, 5).map((comic) => (
              <Link
                key={comic.id}
                href={getComicDetailUrl(comic)}
                className="group relative rounded-xl overflow-hidden h-48 bg-neutral-900"
              >
                <img
                  src={comic.coverImage}
                  alt={comic.title}
                  className="absolute inset-0 w-full h-full object-cover blur-[2px] grayscale"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-3 flex flex-col justify-end h-full">
                  <h3 className="text-white text-sm font-bold line-clamp-2">{comic.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
                    <span className="bg-black/50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {comic.rating}
                    </span>
                    <span className="bg-black/50 px-1.5 py-0.5 rounded-full">
                      {formatNumber(comic.viewCount)}
                    </span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 z-20">
                  <img
                    src={comic.coverImage}
                    alt={comic.title}
                    className="w-16 h-24 object-cover rounded border border-white/60 shadow-lg"
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <AnnouncementBanner />

      {/* Main Grid */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-2 lg:gap-4">
        <div id="comics" className="xl:col-span-3 row-span-3">
          {isLoading ? (
            <Spinner />
          ) : (
            <GridComic
              title="Mới cập nhật"
              listComics={comics}
            />
          )}
          <Pagination
            currentPage={page}
            totalpage={totalpage}
            rootLink="/"
          />
        </div>
        <div className="flex flex-col gap-4">
          <TopList />
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-6 p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            MeTruyenMoi - Website Đọc Truyện Tranh Online Hàng Đầu Việt Nam
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Khám phá thế giới truyện tranh đầy màu sắc với kho tàng khổng lồ gồm manga Nhật Bản, manhwa Hàn Quốc, manhua Trung Quốc hoàn toàn miễn phí.
          </p>
        </div>

        <div className="relative">
          <div className={`overflow-hidden transition-all duration-500 ${isContentExpanded ? 'max-h-none' : 'max-h-96'}`}>
            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm">
              <div>
                <h2 className="text-xl font-semibold mb-3">MeTruyenMoi - Điểm Đến Tin Cậy Của Mọi Tín Đồ Truyện Tranh</h2>
                <p className="leading-relaxed">
                  <strong>MeTruyenMoi</strong> tự hào là một trong những nền tảng đọc truyện tranh online hàng đầu tại Việt Nam. Với cam kết mang đến trải nghiệm đọc truyện tốt nhất, chúng tôi không ngừng cập nhật những bộ truyện hot nhất từ khắp châu Á.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Kho Truyện Đa Dạng - Cập Nhật Liên Tục 24/7</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><h3 className="font-medium mb-1">Manga Nhật Bản</h3><p className="text-xs">One Piece, Naruto, Attack on Titan, Jujutsu Kaisen, Demon Slayer...</p></div>
                  <div><h3 className="font-medium mb-1">Manhwa Hàn Quốc</h3><p className="text-xs">Solo Leveling, Tower of God, The God of High School...</p></div>
                  <div><h3 className="font-medium mb-1">Manhua Trung Quốc</h3><p className="text-xs">Võ luyện đỉnh phong, phàm nhân tu tiên, tiên nghịch...</p></div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Vì Sao Chọn MeTruyenMoi?</h2>
                <div className="space-y-2">
                  <p><strong>1. Chất lượng hàng đầu:</strong> Scan và dịch thuật chất lượng HD, hình ảnh sắc nét, không quảng cáo phủ màn hình.</p>
                  <p><strong>2. Cập nhật nhanh nhất:</strong> Hệ thống 24/7, nhiều series cập nhật chỉ vài giờ sau bản gốc.</p>
                  <p><strong>3. Hoàn toàn miễn phí:</strong> Không phí đăng ký, không giới hạn lượt đọc.</p>
                  <p><strong>4. An toàn và bảo mật:</strong> SSL/TLS, không virus, không malware.</p>
                  <p><strong>5. Tương thích mọi thiết bị:</strong> Responsive hoàn hảo, tối ưu Dark Mode.</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold mb-2">Bắt Đầu Hành Trình Khám Phá Ngay Hôm Nay!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tham gia cộng đồng độc giả MeTruyenMoi. Khám phá, đọc và thưởng thức những bộ truyện tranh hay nhất miễn phí!
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  {['#TruyenTranh', '#Manga', '#Manhwa', '#MeTruyenMoi', '#DocTruyenMienPhi'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!isContentExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 pointer-events-none" />
          )}

          <div className="text-center mt-4">
            <button
              onClick={() => setIsContentExpanded(!isContentExpanded)}
              className="inline-flex items-center px-6 py-2 text-blue-600 dark:text-blue-400 hover:shadow-md text-sm"
            >
              <span>{isContentExpanded ? 'Thu gọn' : 'Đọc thêm'}</span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${isContentExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
