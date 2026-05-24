'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useChapters, useSimilarComic } from '@/lib/hooks/use-comic-queries';
import { useFollow, useUpdateViewAndExp } from '@/lib/hooks/use-account-queries';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { TopList } from '@/components/common/top-list/top-list';
import Selection from '@/components/common/selection/selection';
import { CommentSection, RecentCommentsPanel } from '@/components/common';
import TopUsers from '@/components/common/top-users/top-users';
import StarRating from '@/components/common/star-rating/star-rating';
import LoopScroll from '@/components/common/loop-scroll/loop-scroll';
import type { LoopScrollHandle } from '@/components/common/loop-scroll/loop-scroll';
import { getComicDetailUrl, getChapterDetailUrl, getCharacterListUrl } from '@/lib/utils/url';
import { fillDescription } from '@/lib/utils/description';
import { formatNumber } from '@/lib/utils/number';
import { generateComicKeywords, generateChapterKeywords } from '@/lib/seo/keywords';
import type { Comic, Chapter } from '@/types';
import { toast } from 'sonner';
import { dateAgo } from '@/lib/utils/date';

const FOLLOW_COOLDOWN = 3000;

export default function ComicDetailContent({ comic: initialComic }: { comic: Comic }) {
  const pathname = usePathname();

  const [comic, setComic] = useState(initialComic);
  const [isOpen, setIsOpen] = useState(false);
  const [followRequestTime, setFollowRequestTime] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [ratingInitial, setRatingInitial] = useState(0);

  const { isAuthenticated } = useAuthStore();
  const { saveHistory } = useHistoryStore();

  const { data: chapters } = useChapters(comic.id);
  const { data: similarComics } = useSimilarComic(comic.id);
  const followMutation = useFollow();
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      setComic((prev) => ({ ...prev, chapters }));
    }
  }, [chapters]);

  useEffect(() => {
    if (comic.chapters && comic.chapters.length > 0) {
      saveHistory({
        ...comic,
        chapters: [comic.chapters[0]],
      });
    }
  }, [comic.id]);

  const allChapters = comic.chapters ?? [];
  const lastChapter = allChapters[allChapters.length - 1];
  const historyComic = useHistoryStore((s) => s.listHistory.find((c) => c.id === comic.id));

  const latestHistoryChapter = historyComic?.chapters?.reduce<Chapter | null>(
    (max, ch) => (!max || Number(ch.slug) > Number(max.slug) ? ch : max),
    null
  );

  const stars = [0, 1, 2, 3, 4].map((i) => getStarWidth(i + 1));

  const keywords = useMemo(() => {
    const kws = generateComicKeywords(comic);
    if (lastChapter) kws.push(...generateChapterKeywords(comic, lastChapter));
    return [...new Set(kws)].map((kw) => ({
      title: kw,
      href: `/tim-truyen?query=${encodeURIComponent(kw)}`,
    }));
  }, [comic, lastChapter]);

  function getStarWidth(index: number): number {
    if (index <= comic.rating) return 100;
    if (index - comic.rating < 1) return (1 - (index - comic.rating)) * 100;
    return 0;
  }

  function rateStar(starIndex: number) {
    if (!isAuthenticated) {
      window.location.href = '/auth/dang-nhap';
      return;
    }
    setRatingInitial(starIndex);
    setShowRating(true);
  }

  function handleFollow(isFollow: boolean) {
    if (!isAuthenticated) {
      window.location.href = '/auth/dang-nhap';
      return;
    }
    const now = Date.now();
    if (followRequestTime + FOLLOW_COOLDOWN > now) {
      toast.info('Thao tác quá nhanh!');
      return;
    }
    setFollowRequestTime(now);
    followMutation.mutate(
      { comicId: comic.id, isFollow },
      {
        onSuccess: (res: any) => {
          if (res.status === 1) {
            setComic((prev) => ({ ...prev, isFollow: !prev.isFollow }));
            toast.success(comic.isFollow ? 'Đã hủy theo dõi' : 'Đã theo dõi');
          } else {
            toast.error(res.message || 'Lỗi');
          }
        },
      }
    );
  }

  function isAgeLimit() {
    return comic.genres?.some((g) => g.id === 2 || g.id === 13) || false;
  }

  function getHistoryChapter() {
    if (!latestHistoryChapter?.title) return '';
    const match = latestHistoryChapter.title.match(/[\.\d]+/iu);
    return match ? match[0] : latestHistoryChapter.slug;
  }

  const canShowReadFromBeginning = !historyComic && allChapters.length > 0;
  const canShowContinueReading = !!historyComic && !!latestHistoryChapter;

  const firstChapter = allChapters[allChapters.length - 1];

  return (
    <div className="dark:text-light-text">
      <div className="comic-content">
        <div className="lg:container mx-auto w-full z-10 mt-3 mb-5">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Truyện tranh', href: '/tim-truyen' },
              { label: comic.title },
            ]}
            style = 'transparent'
          />
        </div>

        <div className="comic-bg">
          <div
            className="comic-bg-image"
            style={{ backgroundImage: `url(${comic.coverImage})` }}
>
            <div className="comic-bg-overlay" />
          </div>
        </div>

        <div className="flex flex-col">
          <article className="comic-detail">
            <div className="comic-image-section">
              <div className="comic-image-container">
                <div className="comic-bg-img">
                  <Image
                    className="comic-cover-image"
                    src={comic.coverImage || '/option2.png'}
                    alt={comic.title}
                    loading="eager"
                    fetchPriority="high"
                    quality={50}
                    sizes="216px"
                    width={216}
                    height={300}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/option2.png';
                    }}
                  />
                </div>
              </div>
              <div className="follow-button-container">
                {!comic.isFollow ? (
                  <button type="button" className="btn-follow" onClick={() => handleFollow(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                      <path fill="#ffffff" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                    Theo dõi
                  </button>
                ) : (
                  <button type="button" className="btn-unfollow" onClick={() => handleFollow(false)}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Đang theo dõi
                  </button>
                )}
              </div>
            </div>

            <div className="comic-detail-info">
              <h1 className="comic-detail-title">{comic.title}</h1>
              {comic.otherName && (
                <h2 className="comic-other-title">
                  Tên khác: {comic.otherName.replaceAll(';', ' - ')}
                </h2>
              )}

              <div className="star-rating-container-1">
                <span className="mr-2">Đánh giá: </span>
                {stars.map((width, i) => (
                  <div key={i} className="star-rating-item" onClick={() => rateStar(i + 1)}>
                    <svg className="comic-star-icon star-empty" xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512">
                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                    </svg>
                    <div className="star-fill-overlay" style={{ width: `${width}%` }}>
                      <svg className="comic-star-icon star-filled" xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512">
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <span className="comic-author">
                Tác giả: {comic.author || 'Đang cập nhật'}
              </span>

              <div className="comic-info-list">
                <ul className="list-main-info">
                  <li className="info-item">
                    <span className="info-label">Số chương:</span>
                    <div className="info-value">
                      <svg className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="info-label-text info-number">{comic.numChapter}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <span className="info-label">Lượt xem:</span>
                    <div className="info-value">
                      <svg xmlns="http://www.w3.org/2000/svg" className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="info-label-text info-number">{formatNumber(comic.viewCount)}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <span className="info-label">Đánh giá:</span>
                    <div className="info-value">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="info-icon">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="info-label-text info-number">{comic.rating}</span>
                    </div>
                  </li>
                  <li className="info-item">
                    <span className="info-label">Tình trạng:</span>
                    <div className="flex space-x-2 items-center font-semibold">
                      {comic.status === 0 ? (
                        <>
                          <span className="relative flex h-2 w-2 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-65" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
                          </span>
                          <div className="info-label-text">Đang tiến hành</div>
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-2 w-2 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-65" />
                            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 512 512">
                              <path fill="#2debb2" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                            </svg>
                          </span>
                          <div className="status-text">Đã hoàn thành</div>
                        </>
                      )}
                    </div>
                  </li>
                </ul>


              </div>
              <div className="mx-auto w-full mt-0">
                <span className="text-base shrink-0 mr-2">Thể loại:</span>
                <span className="list-genre">
                  {comic.genres?.map((genre) => (
                    <Link
                      key={genre.id}
                      className="genre-item"
                      title={genre.title}
                      href={`/the-loai/${genre.slug}`}
                    >
                      {genre.title}
                    </Link>
                  ))}
                </span>
              </div>
              <time className="comic-update">
                Cập nhật lúc: {comic.updateAt ? new Date(comic.updateAt).toLocaleDateString('vi-VN') : ''}
              </time>

              <div className="comic-description-section">
                <h2 className="text-base font-medium">
                  <svg className="size-5 inline-block" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8,3 L8,17 L19,17 L19,3.5 C19,3.22385763 18.7761424,3 18.5,3 L8,3 Z M7,3 L6.5,3 C5.67157288,3 5,3.67157288 5,4.5 L5,17.4998169 C5.41783027,17.1859724 5.93719704,17 6.5,17 L7,17 L7,3 Z M4.15121433,20.3582581 C4.05793442,20.2674293 4,20.1404803 4,20 L4,4.5 C4,3.11928813 5.11928813,2 6.5,2 L18.5,2 C19.3284271,2 20,2.67157288 20,3.5 L20,20.5 C20,21.3284271 19.3284271,22 18.5,22 L6.5,22 C5.42082093,22 4.50134959,21.3162099 4.15121433,20.3582581 L4.15121433,20.3582581 Z M19,18 L6.5,18 C5.67157288,18 5,18.6715729 5,19.5 C5,20.3284271 5.67157288,21 6.5,21 L18.5,21 C18.7761424,21 19,20.7761424 19,20.5 L19,18 Z M10.5,10 C10.2238576,10 10,9.77614237 10,9.5 C10,9.22385763 10.2238576,9 10.5,9 L16.5,9 C16.7761424,9 17,9.22385763 17,9.5 C17,9.77614237 16.7761424,10 16.5,10 L10.5,10 Z M10.5,8 C10.2238576,8 10,7.77614237 10,7.5 C10,7.22385763 10.2238576,7 10.5,7 L14.5,7 C14.7761424,7 15,7.22385763 15,7.5 C15,7.77614237 14.7761424,8 14.5,8 L10.5,8 Z" />
                  </svg>
                  Giới thiệu truyện {comic.title}:
                </h2>
                <p
                  className={`comic-description ${isOpen ? 'description-expanded' : 'description-collapsed'}`}
                  dangerouslySetInnerHTML={{
                    __html: fillDescription(comic.description, comic),
                  }}
                />
                <button className="btn-viewmore" onClick={() => setIsOpen(!isOpen)}>
                  <span>{isOpen ? 'Thu gọn' : 'Đọc thêm'}</span>
                </button>
              </div>

              <div className="read-action-container">
                {canShowReadFromBeginning && firstChapter ? (
                  <Link
                    className="btn-recent"
                    href={getChapterDetailUrl(comic, firstChapter)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="read-action-icon" viewBox="0 0 448 512">
                      <path fill="#ffffff" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                    <p className="read-action-text">Đọc từ đầu</p>
                  </Link>
                ) : canShowContinueReading && latestHistoryChapter ? (
                  <Link
                    className="btn-recent"
                    href={getChapterDetailUrl(comic, latestHistoryChapter)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512" className="w-4 h-4">
                      <path fill="#ffffff" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                    <p className="font-semibold text-sm">Đọc tiếp chương {getHistoryChapter()}</p>
                  </Link>
                ) : null}

              </div>
            </div>
          </article>

          {isAgeLimit() && (
            <div className="mx-auto lg:container w-full z-10 p-4 bg-white dark:bg-dark-bg">
              <p className="bg-red-200/50 dark:bg-red-200 border-l-4 border-red-500 rounded-r-lg p-4 text-sm">
                <svg fill="#000000" version="1.1" className="w-5 h-5 inline-block mr-2" viewBox="0 0 367.011 367.01" xmlSpace="preserve">
                  <path d="M365.221,329.641L190.943,27.788c-1.542-2.674-4.395-4.318-7.479-4.318c-3.084,0-5.938,1.645-7.48,4.318L1.157,330.584 c-1.543,2.674-1.543,5.965,0,8.639c1.542,2.674,4.395,4.318,7.48,4.318h349.65c0.028,0,0.057,0,0.086,0 c4.77,0,8.638-3.863,8.638-8.639C367.011,332.92,366.342,331.1,365.221,329.641z M23.599,326.266L183.464,49.381l159.864,276.885 H23.599z" />
                  <path d="M174.826,136.801v123.893c0,4.773,3.867,8.638,8.638,8.638c4.77,0,8.637-3.863,8.637-8.638V136.801 c0-4.766-3.867-8.637-8.637-8.637C178.693,128.165,174.826,132.036,174.826,136.801z" />
                  <path d="M183.464,279.393c-5.922,0-10.725,4.8-10.725,10.722s4.803,10.729,10.725,10.729c5.921,0,10.725-4.809,10.725-10.729 C194.189,284.193,189.386,279.393,183.464,279.393z" />
                </svg>
                <span className="font-bold">Cảnh báo độ tuổi:</span>
                Truyện tranh <b className="text-neutral-700">{comic.title}</b> có thể có nội dung và hình ảnh không phù hợp với lứa tuổi của bạn. Nếu bạn dưới 16 tuổi, vui lòng chọn một truyện khác để giải trí. Chúng tôi sẽ không chịu trách nhiệm liên quan nếu bạn bỏ qua cảnh báo này.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 lg:container mx-auto w-full">
        <div className="col-span-4 2xl:col-span-3 mt-2 mx-2 dark:text-light-text">
          {allChapters.length > 0 && (
            <ChapterList comic={comic} chapters={allChapters} />
          )}

          {similarComics && similarComics.length > 0 && (
            <div className="mt-4">
              <GridComic
                title="Truyện Liên Quan"
                listComics={similarComics}
                gridClass="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2"
              />
            </div>
          )}

          <div className="keywords" itemProp="keywords">
            <h2 className="inline-block no-underline text-lg font-bold">Từ khóa:</h2>
            {keywords.map((kw, i) => (
              <a key={i} title={kw.title} className="keyword" href={kw.href}>{kw.title}</a>
            ))}
          </div>

          {comic.chapters && comic.chapters.length > 0 && (
            <div className="comments">
              <CommentSection comic={comic} chapterID={comic.chapters[0].id} />
            </div>
          )}
        </div>
        <div className="flex flex-col col-span-4 2xl:col-span-1 gap-4 mx-2 2xl:mt-4">
          <TopList />
          <RecentCommentsPanel />
          <TopUsers />
        </div>
      </div>

      <StarRating
        isVisible={showRating}
        onClose={() => setShowRating(false)}
        comicId={comic.id}
        initialRating={ratingInitial}
      />
    </div>
  );
}

const DEFAULT_CHAPTER_GRID_SIZE = 4;

function calcGridSize(): number {
  if (window.innerWidth < 640) return 2;
  if (window.innerWidth < 1100) return 3;
  return DEFAULT_CHAPTER_GRID_SIZE;
}

function ChapterList({ comic, chapters: initialChapters }: { comic: Comic; chapters: Chapter[] }) {

  const [asc, setAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [gridSize, setGridSize] = useState(DEFAULT_CHAPTER_GRID_SIZE);
  const [curOptionValue, setCurOptionValue] = useState(0);
  const loopRef = useRef<LoopScrollHandle>(null);

  const history = useHistoryStore((s) => s.listHistory);
  const historyComic = history.find((c) => c.id === comic.id);
  const readChapters = useMemo(() => new Set(historyComic?.chapters?.map((ch) => ch.id) ?? []), [historyComic]);

  useEffect(() => {
    const handleResize = () => setGridSize(calcGridSize());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sorted = useMemo(() =>
    [...initialChapters].sort((a, b) => asc ? a.slug - b.slug : b.slug - a.slug),
    [initialChapters, asc]
  );

  const filtered = useMemo(() => {
    if (!search) return sorted;
    return sorted.filter((ch) => ch.title?.toLowerCase().includes(search.toLowerCase()));
  }, [sorted, search]);

  const distance = comic.numChapter > 1000 ? 100 : comic.numChapter > 200 ? 50 : 30;
  const options = useMemo(() => {
    const _length = Math.floor((comic.numChapter - 1) / distance + 1);
    return Array.from({ length: _length }, (_, i) => ({
      label: `${i * distance} - ${(i + 1) * distance}`,
      value: asc ? i : _length - i - 1,
    }));
  }, [comic.numChapter, distance, asc]);

  function onScrollChange(idx: number) {
    const optionValue = Math.round(idx * gridSize / distance);
    setCurOptionValue((prev) => {
      const newVal = Math.min(optionValue, options.length - 1);
      return newVal !== prev ? newVal : prev;
    });
  }

  function onSelectRange(value: string | number | boolean) {
    const idx = Number(value);
    loopRef.current?.goToItem(idx * distance);
  }

  function renderChapter(ch: Chapter) {
    const isRead = readChapters.has(ch.id);
    return (
      <Link href={getChapterDetailUrl(comic, ch)} title={ch.title}>
        <div className={`chapter-item ${isRead ? 'chapter-item-read' : ''}`}>
          <div className="chapter-item-content">
            <p className={`chapter-item-title ${isRead ? 'chapter-item-title-read' : ''}`}>
              Chapter {ch.slug}
            </p>
          </div>
          <div className="chapter-item-date">
            <div className="chapter-item-date-text">{dateAgo(ch.updateAt)}</div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="max-h-96 flex flex-col">
      <div className="chapter-panel">
        <span className="chapter-title">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor" viewBox="0 0 512 512">
            <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
          </svg>
          <p className="chapter-title-text">Danh sách chương</p>
        </span>
        <div className="chapter-controls">
          <div className="chapter-search-container">
            <div className="chapter-search-icon">
              <svg className="chapter-search-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="search"
              maxLength={255}
              className="chapter-search-input"
              placeholder="Tìm chương..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="p-0.5 rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 cursor-pointer">
              <input
                className="hidden peer"
                type="checkbox"
                checked={asc}
                onChange={(e) => setAsc(e.target.checked)}
              />
              <svg className="size-4 peer-checked:hidden" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 17H16M4 12H13M4 7H10M18 13V5M18 5L21 8M18 5L15 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="size-4 hidden peer-checked:block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 17H10M4 12H13M18 11V19M18 19L21 16M18 19L15 16M4 7H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            {options.length > 1 && (
              <Selection
                ariaLabel="Chọn nhóm chương"
                className="chapter-selection"
                value={curOptionValue}
                onChange={onSelectRange}
                options={options}
              />
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="chapter-not-found">Không tìm thấy chương ...</div>
      )}

      <div className="chapter-list-container overflow-hidden min-h-32">
        <LoopScroll
          loopRef={loopRef}
          allItems={filtered}
          gridSize={gridSize}
          preloadItemCount={40}
          itemHeight={56}
          renderItem={renderChapter}
          onChange={onScrollChange}
          trackById={(ch: Chapter) => ch.id}
        />
      </div>
    </div>
  );
}
