import { GridComic, Pagination, TopList, AnnouncementBanner, RecentRead, TopUsers, SimpleCarousel, RecentCommentsPanel } from '@/components/common';
import type { ComicList, Comic } from '@/types';
import { Suspense } from 'react';

interface HomeContentProps {
  page: number;
  initialComics?: ComicList | null;
  initialCarousel?: Comic[] | null;
}

export default function HomeContent({ page, initialComics, initialCarousel }: HomeContentProps) {

  const comics = initialComics?.comics ?? [];
  const totalpage = initialComics?.totalpage ?? 1;
  const carousel = initialCarousel ?? [];


  const isContentExpanded = true;
  return (
    <div className="container mx-auto pb-4">
      {/* Carousel / Recommend Comics */}
      {/* Title - hidden on mobile */}
      <SimpleCarousel comics={carousel} />
      <AnnouncementBanner />

      {/* Main Grid */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-2 lg:gap-4">
        <div id="comics" className="xl:col-span-3 row-span-3">

          <GridComic
            title="Mới cập nhật"
            listComics={comics}
            nPreview={30}
          />

          <Pagination
            currentPage={page}
            totalpage={totalpage}
            rootLink="/"
          />
        </div>
        <div className="row-start-1 xl:row-start-auto">
          <RecentRead />
        </div>
        <div className="flex flex-col gap-4">
          <Suspense>
            <TopList />
            {/* <RecentCommentsPanel /> */}
            <TopUsers />
          </Suspense>
        </div>

      </div>

      {/* SEO Content */}
      <div className="mt-6 p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            MeTruyenMoi - Đọc Truyện Tranh Online Miễn Phí
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Đọc manga, manhwa, manhua mới nhất với tốc độ cập nhật nhanh, giao diện mượt mà và hoàn toàn miễn phí.
          </p>
        </div>

        <div className="relative">
          <div
            className={`overflow-hidden transition-all duration-500 ${isContentExpanded ? 'max-h-none' : 'max-h-80'
              }`}
          >
            <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  Kho Truyện Đa Dạng
                </h2>
                <p className="leading-relaxed">
                  MeTruyenMoi liên tục cập nhật các bộ truyện nổi tiếng từ Nhật Bản,
                  Hàn Quốc và Trung Quốc như One Piece, Jujutsu Kaisen,
                  Solo Leveling hay Võ Luyện Đỉnh Phong.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">
                  Trải Nghiệm Đọc Tối Ưu
                </h2>
                <p className="leading-relaxed">
                  Giao diện thân thiện trên điện thoại và máy tính, hỗ trợ Dark Mode,
                  tải trang nhanh và hạn chế quảng cáo gây khó chịu.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">
                  Cập Nhật Nhanh Mỗi Ngày
                </h2>
                <p className="leading-relaxed">
                  Hệ thống cập nhật chapter mới liên tục giúp bạn theo dõi truyện yêu
                  thích nhanh chóng và không bỏ lỡ nội dung mới.
                </p>
              </section>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <p className="font-medium mb-2">
                  Khám phá hàng ngàn bộ truyện tranh hấp dẫn miễn phí tại
                  MeTruyenMoi.
                </p>

                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  {[
                    '#Manga',
                    '#Manhwa',
                    '#Manhua',
                    '#DocTruyen',
                    '#MeTruyenMoi',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!isContentExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 pointer-events-none" />
          )}

          <div className="text-center mt-4">
            <button className="inline-flex items-center px-5 py-2 text-sm text-blue-600 dark:text-blue-400 hover:shadow-md">
              <span>{isContentExpanded ? 'Thu gọn' : 'Đọc thêm'}</span>

              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isContentExpanded ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
