'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useChapters, useSimilarComic } from '@/lib/hooks/use-comic-queries';
import { useFollow, } from '@/lib/hooks/use-account-queries';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { TopList } from '@/components/common/top-list/top-list';
import { CommentSection, RecentCommentsPanel } from '@/components/common';
import TopUsers from '@/components/common/top-users/top-users';
import StarRating from '@/components/common/star-rating/star-rating';
import { getChapterDetailUrl } from '@/lib/utils/url';
import { fillDescription } from '@/lib/utils/description';
import { formatNumber } from '@/lib/utils/number';
import { generateComicKeywords, generateChapterKeywords } from '@/lib/seo/keywords';
import type { Comic, Chapter } from '@/types';
import { toast } from 'sonner';
import ChapterList from '@/components/page/chapter-list';

const FOLLOW_COOLDOWN = 3000;
interface ComicDetailProps {
  comic: Comic
  gridType: number
}
export default function ComicDetailContent({ comic: initialComic, gridType }: ComicDetailProps) {
  const [comic, setComic] = useState(initialComic);
  const [isOpen, setIsOpen] = useState(false);
  const [followRequestTime, setFollowRequestTime] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [ratingInitial, setRatingInitial] = useState(0);

  const { isAuthenticated } = useAuthStore();
  const { data: chapters } = useChapters(comic.id);
  const { data: similarComics } = useSimilarComic(comic.id);
  const followMutation = useFollow();
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      setComic((prev) => ({ ...prev, chapters }));
    }
  }, [chapters]);

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
        onSuccess: (res) => {
          const response = res as { status?: number; message?: string };

          if (response.status === 1) {
            setComic((prev) => ({ ...prev, isFollow: !prev.isFollow }));
            toast.success(comic.isFollow ? 'Đã hủy theo dõi' : 'Đã theo dõi');
          } else {
            toast.error(response.message || 'Lỗi');
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
      <div className="relative flex h-full w-full flex-col overflow-hidden border-spacing-3 text-secondary-100 dark:text-light-text">
        <div className="lg:container mx-auto w-full z-10 mt-3 mb-5">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Truyện tranh', href: '/tim-truyen' },
              { label: comic.title },
            ]}
            style='transparent'
          />
        </div>

        <div className="absolute inset-0 z-[1] h-full border-spacing-2">

          <img
            className="h-auto w-full -translate-y-[20%] bg-cover"
            src={comic.coverImage || '/option2.png'}
            alt={comic.title}
            loading="eager"
            fetchPriority="high"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/option2.png';
            }}
          />
          <div className="absolute inset-0 z-10 bg-black opacity-50" />
        </div>

        <div className="flex flex-col">
          <article className="z-[2] mx-auto mt-8 w-full rounded-t-3xl bg-gradient-to-t from-white to-white/80 backdrop-blur-sm md:w-3/4 lg:container lg:mt-5 lg:flex lg:w-full dark:from-dark-bg dark:to-dark-bg/50">
            <div className="lg:ml-10">
              <div className="relative flex h-[280px] justify-center lg:h-auto">
                <div className="absolute bottom-8 flex h-[300px] w-[220px] translate-y-4 overflow-hidden rounded border-4 border-neutral-200 shadow-md lg:relative lg:bottom-5 lg:translate-y-0 dark:border-dark-bg">
                  <Image
                    src={comic.coverImage || '/option2.png'}
                    alt={comic.title}
                    loading="eager"
                    fetchPriority="high"
                    fill
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/option2.png';
                    }}
                  />
                </div>
              </div>
              <div className="mb-3 flex justify-center">
                {!comic.isFollow ? (
                  <button type="button" className="flex cursor-pointer items-center gap-1 rounded border-none bg-sky-700 px-4 py-1 text-white transition-colors duration-150 hover:bg-sky-800" onClick={() => handleFollow(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                      <path fill="#ffffff" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                    Theo dõi
                  </button>
                ) : (
                  <button type="button" className="flex cursor-pointer items-center gap-1 space-x-1 rounded border border-red-500 bg-transparent px-4 py-1 text-red-500 transition-all duration-150 hover:opacity-75" onClick={() => handleFollow(false)}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Đang theo dõi
                  </button>
                )}
              </div>
            </div>

            <div className="mx-4 my-3 mb-5 flex flex-col items-center justify-center gap-1 lg:items-start">
              <h1 className="text-pretty text-center text-xl font-bold uppercase leading-tight text-gray-700 lg:text-left lg:text-2xl dark:text-white">{comic.title}</h1>
              {comic.otherName && (
                <h2 className="line-clamp-2 text-sm font-medium capitalize text-neutral-600 lg:line-clamp-1 lg:text-base dark:text-light-text">
                  Tên khác: {comic.otherName.replaceAll(';', ' - ')}
                </h2>
              )}

              <div className="col-span-3 flex items-center">
                <span className="mr-2">Đánh giá: </span>
                {stars.map((width, i) => (
                  <div key={i} className="relative mr-1 cursor-pointer transform rounded-full transition-all duration-200 hover:scale-125 active:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300/50" onClick={() => rateStar(i + 1)}>
                    <svg className="h-4 w-4 fill-current text-neutral-300 transition-all duration-200 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512">
                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                    </svg>
                    <div className="absolute left-0 top-0 h-full overflow-hidden" style={{ width: `${width}%` }}>
                      <svg className="h-4 w-4 fill-current text-amber-400 drop-shadow-sm transition-all duration-200" xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512">
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <span className="text-sm dark:text-light-text sm:text-base">
                Tác giả: {comic.author || 'Đang cập nhật'}
              </span>

              <div className="text-sm">
                <ul className="flex flex-wrap justify-center gap-3 text-sm sm:gap-4 lg:justify-start">
                  <li className="flex flex-col items-center lg:items-start">
                    <span className="text-sm dark:text-light-text sm:text-base">Số chương:</span>
                    <div className="flex items-center space-x-1 text-gray-800 dark:text-light-text">
                      <svg className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-800 dark:text-light-text sm:text-sm">{comic.numChapter}</span>
                    </div>
                  </li>
                  <li className="flex flex-col items-center lg:items-start">
                    <span className="text-sm dark:text-light-text sm:text-base">Lượt xem:</span>
                    <div className="flex items-center space-x-1 text-gray-800 dark:text-light-text">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 sm:size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-800 dark:text-light-text sm:text-sm">{formatNumber(comic.viewCount)}</span>
                    </div>
                  </li>
                  <li className="flex flex-col items-center lg:items-start">
                    <span className="text-sm dark:text-light-text sm:text-base">Đánh giá:</span>
                    <div className="flex items-center space-x-1 text-gray-800 dark:text-light-text">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-4 sm:size-5">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="text-xs font-semibold text-gray-800 dark:text-light-text sm:text-sm">{comic.rating}</span>
                    </div>
                  </li>
                  <li className="flex flex-col items-center lg:items-start">
                    <span className="text-sm dark:text-light-text sm:text-base">Tình trạng:</span>
                    <div className="flex space-x-2 items-center font-semibold">
                      {comic.status === 0 ? (
                        <>
                          <span className="relative flex h-2 w-2 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-65" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
                          </span>
                          <div className="text-xs text-gray-800 dark:text-light-text sm:text-sm">Đang tiến hành</div>
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-2 w-2 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-65" />
                            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 512 512">
                              <path fill="#2debb2" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                            </svg>
                          </span>
                          <div className="text-sm font-semibold">Đã hoàn thành</div>
                        </>
                      )}
                    </div>
                  </li>
                </ul>


              </div>
              <div className="mx-auto w-full mt-0">
                <span className="text-base shrink-0 mr-2">Thể loại:</span>
                <span className="inline-flex flex-wrap justify-center gap-2 text-sm sm:text-base lg:justify-normal">
                  {comic.genres?.map((genre) => (
                    <Link
                      key={genre.id}
                      className="inline-block whitespace-nowrap rounded-md border border-dashed border-neutral-400 px-1.5 text-[0.75rem] font-semibold leading-[20px] text-neutral-600 no-underline hover:bg-primary-100 hover:text-white dark:border-neutral-500 dark:text-light-text"
                      title={genre.title}
                      href={`/the-loai/${genre.slug}`}
                    >
                      {genre.title}
                    </Link>
                  ))}
                </span>
              </div>
              <time className="inline-block text-sm dark:text-light-text sm:text-base">
                Cập nhật lúc: {comic.updateAt ? new Date(comic.updateAt).toLocaleDateString('vi-VN') : ''}
              </time>

              <div className="mt-2 lg:mx-0 lg:mt-1 lg:w-full lg:text-left">
                <h2 className="text-base font-medium">
                  <svg className="size-5 inline-block" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8,3 L8,17 L19,17 L19,3.5 C19,3.22385763 18.7761424,3 18.5,3 L8,3 Z M7,3 L6.5,3 C5.67157288,3 5,3.67157288 5,4.5 L5,17.4998169 C5.41783027,17.1859724 5.93719704,17 6.5,17 L7,17 L7,3 Z M4.15121433,20.3582581 C4.05793442,20.2674293 4,20.1404803 4,20 L4,4.5 C4,3.11928813 5.11928813,2 6.5,2 L18.5,2 C19.3284271,2 20,2.67157288 20,3.5 L20,20.5 C20,21.3284271 19.3284271,22 18.5,22 L6.5,22 C5.42082093,22 4.50134959,21.3162099 4.15121433,20.3582581 L4.15121433,20.3582581 Z M19,18 L6.5,18 C5.67157288,18 5,18.6715729 5,19.5 C5,20.3284271 5.67157288,21 6.5,21 L18.5,21 C18.7761424,21 19,20.7761424 19,20.5 L19,18 Z M10.5,10 C10.2238576,10 10,9.77614237 10,9.5 C10,9.22385763 10.2238576,9 10.5,9 L16.5,9 C16.7761424,9 17,9.22385763 17,9.5 C17,9.77614237 16.7761424,10 16.5,10 L10.5,10 Z M10.5,8 C10.2238576,8 10,7.77614237 10,7.5 C10,7.22385763 10.2238576,7 10.5,7 L14.5,7 C14.7761424,7 15,7.22385763 15,7.5 C15,7.77614237 14.7761424,8 14.5,8 L10.5,8 Z" />
                  </svg>
                  Giới thiệu truyện {comic.title}:
                </h2>
                <p
                  className={`text-sm lg:mr-4 ${isOpen ? 'line-clamp-none' : 'line-clamp-2'}`}
                  dangerouslySetInnerHTML={{
                    __html: fillDescription(comic.description, comic),
                  }}
                />
                <button className="cursor-pointer border-none bg-transparent text-sm font-semibold underline transition-colors duration-150 hover:text-neutral-700 dark:text-neutral-500" onClick={() => setIsOpen(!isOpen)}>
                  <span>{isOpen ? 'Thu gọn' : 'Đọc thêm'}</span>
                </button>
              </div>

              <div className="mt-3 flex space-x-4">
                {canShowReadFromBeginning && firstChapter ? (
                  <Link
                    className="flex items-center space-x-2 rounded border-none bg-primary-100 p-1 px-4 text-white no-underline transition-all duration-150 hover:opacity-90 md:p-2"
                    href={getChapterDetailUrl(comic, firstChapter)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 448 512">
                      <path fill="#ffffff" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                    <p className="text-sm font-semibold">Đọc từ đầu</p>
                  </Link>
                ) : canShowContinueReading && latestHistoryChapter ? (
                  <Link
                    className="flex items-center space-x-2 rounded border-none bg-primary-100 p-1 px-4 text-white no-underline transition-all duration-150 hover:opacity-90 md:p-2"
                    href={getChapterDetailUrl(comic, latestHistoryChapter)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512" className="w-4 h-4">
                      <path fill="#ffffff" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                    <p className="font-semibold text-sm">Đọc tiếp chapter {getHistoryChapter()}</p>
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

      <div className="grid grid-cols-4 gap-2 lg:container mx-auto w-full w-full">
        <div className="col-span-4 2xl:col-span-3 mt-2 mx-2 dark:text-light-text">
          <ChapterList comic={comic} chapters={allChapters} />

          <div className="mt-4">
            <GridComic
              title="Truyện Liên Quan"
              listComics={similarComics || []}
              gridClass="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2"
              defaultGridType={gridType}
              nPreview={12}
            />
          </div>


          <div className="mt-2 inline-block items-center space-x-2 px-3" itemProp="keywords">
            <h2 className="inline-block no-underline text-lg font-bold">Từ khóa:</h2>
            {keywords.map((kw, i) => (
              <a key={i} title={kw.title} className="h-fit cursor-pointer rounded bg-neutral-100 px-2 py-0.5 text-sm text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300" href={kw.href}>{kw.title}</a>
            ))}
          </div>

          {comic.chapters && comic.chapters.length > 0 && (
            <div>
              <CommentSection comic={comic} chapterID={comic.chapters[0].id} />
            </div>
          )}
        </div>
        <div className="flex flex-col col-span-4 2xl:col-span-1 gap-4 mx-2 2xl:mt-4">
          <Suspense fallback={<div>Loading...</div>} >
            <TopList />
            <RecentCommentsPanel />
            <TopUsers />
          </Suspense>
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
