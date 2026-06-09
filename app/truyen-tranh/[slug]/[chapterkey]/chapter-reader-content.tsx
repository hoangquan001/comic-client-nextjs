'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useChapters, useChapterServer } from '@/lib/hooks/use-comic-queries';
import { useUpdateViewAndExp } from '@/lib/hooks/use-account-queries';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import ChapterSelector from '@/components/common/chapter-selector/chapter-selector';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { openReportError, openSettings } from '@/lib/utils/event.define';
import { SettingCategory } from '@/types';
import type { ChapterPage, ChapterServer, Chapter } from '@/types';
import { CommentSection } from '@/components/common';

const BANNER_IMG = '/banner/banner-manga-4.webp';

interface ChapterReaderContentProps {
  chapterData: ChapterPage;
}

export default function ChapterReaderContent({ chapterData }: ChapterReaderContentProps) {
  const router = useRouter();
  const comic = chapterData.comic;
  const chapterServers = chapterData.chapterServers;
  // Refs
  const screenRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const controlBarRef = useRef<HTMLDivElement>(null);
  const controlBarContainerRef = useRef<HTMLElement>(null);
  const endChapterRef = useRef<HTMLDivElement>(null);
  const zoomGroupRef = useRef<HTMLDivElement>(null);

  useClickOutside(zoomGroupRef, () => setZoomPanelOpen(false));

  // State
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [listImgs, setListImgs] = useState<string[]>(() => {
    const server = chapterServers[0];
    return server?.images ? [BANNER_IMG, ...server.images] : [];
  });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showAllServers, setShowAllServers] = useState(false);
  const [, setErrorCount] = useState(0);
  const [isErrorPages, setIsErrorPages] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarStyle, setToolbarStyle] = useState<'top' | 'hidden' | ''>('');
  const [zoomValue, setZoomValue] = useState(100);
  const [zoomPanelOpen, setZoomPanelOpen] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [canPreloadPages, setCanPreloadPages] = useState(false);

  // Stores
  const { saveHistory } = useHistoryStore();
  const { getSettingValue } = useSettingsStore();
  const { mutate: updateView } = useUpdateViewAndExp();

  // Hooks
  const { data: chapters } = useChapters(comic.id);
  const allChapters = useMemo(() => chapters || [], [chapters]);

  // Reactive reading settings via event subscription
  const [readingSettings, setReadingSettings] = useState(() => ({
    isNightMode: (getSettingValue('nightMode') as boolean) ?? false,
    isAutoNextChapter: (getSettingValue('autoNextChapter') as boolean) ?? false,
    isVertical: (getSettingValue('verticalReading') as boolean) ?? true,
    preloadPages: (getSettingValue('preloadPages') as number) ?? 3,
    fixedToolbar: (getSettingValue('fixedToolbar') as boolean) ?? false,
    toolbarStyle: (getSettingValue('styleToolbar') as string) ?? 'classic',
    doubleClickToFullscreen: (getSettingValue('DoubleClick') as boolean) ?? false,
    zoom: (getSettingValue('zoom-reading') as number) ?? 100,
  }));

  useEffect(() => {
    const handler = (e: Event) => {
      const { key, newValue } = (e as CustomEvent).detail;
      setReadingSettings((prev) => {
        switch (key) {
          case 'nightMode':
            return { ...prev, isNightMode: newValue as boolean };
          case 'autoNextChapter':
            return { ...prev, isAutoNextChapter: newValue as boolean };
          case 'verticalReading':
            return { ...prev, isVertical: newValue as boolean };
          case 'preloadPages':
            return { ...prev, preloadPages: newValue as number };
          case 'fixedToolbar':
            return { ...prev, fixedToolbar: newValue as boolean };
          case 'styleToolbar':
            return { ...prev, toolbarStyle: newValue as string };
          case 'DoubleClick':
            return { ...prev, doubleClickToFullscreen: newValue as boolean };
          case 'zoom-reading':
            return { ...prev, zoom: newValue as number };
          default:
            return prev;
        }
      });
    };
    window.addEventListener('setting-change', handler);
    return () => window.removeEventListener('setting-change', handler);
  }, []);

  const { isNightMode, isAutoNextChapter, isVertical, preloadPages, fixedToolbar, toolbarStyle: toolbarStyleSetting, doubleClickToFullscreen, zoom: settingZoom } = readingSettings;

  // Sync zoom from settings
  useEffect(() => {
    setZoomValue(settingZoom);
    setIsZoomIn(settingZoom >= 150);
    if (settingZoom >= 150 || settingZoom <= 50) setZoomPanelOpen(false);
  }, [settingZoom]);

  useEffect(() => {
    const timer = window.setTimeout(() => setCanPreloadPages(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  // Chapter navigation helpers
  const currentChapterIndex = useMemo(
    () => allChapters.findIndex((ch: Chapter) => ch.id === chapterData.id),
    [allChapters, chapterData.id]
  );

  const nextChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
  const prevChapter =
    currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  const nextChapterLink = nextChapter ? getChapterDetailUrl(comic, nextChapter) : null;
  const prevChapterLink = prevChapter ? getChapterDetailUrl(comic, prevChapter) : null;
  const isPrevChapterDisabled = isImageLoading || !prevChapterLink;
  const isNextChapterDisabled = isImageLoading || !nextChapterLink;

  const navigateChapter = useCallback(
    (isNext: boolean) => {
      if (isImageLoading) return;
      const chapter = isNext ? nextChapter : prevChapter;
      if (chapter) router.push(getChapterDetailUrl(comic, chapter));
    },
    [isImageLoading, nextChapter, prevChapter, comic, router]
  );

  // Server switching
  const changeServer = useCallback(
    (server: ChapterServer, idx: number) => {
      setSelectedServerIdx(idx);
      localStorage.setItem('currentServerIdx', String(idx));
      if (server.images && server.images.length > 0) {
        setListImgs([BANNER_IMG, ...server.images]);
        setIsImageLoading(false);
        return;
      }
      setListImgs([]);
      setIsImageLoading(true);
    },
    []
  );

  useEffect(() => {
    const savedIndex = Number(localStorage.getItem('currentServerIdx'));
    const index = Number.isInteger(savedIndex) && chapterServers[savedIndex] ? savedIndex : 0;
    const server = chapterServers[index];
    if (!server) return;
    const timer = window.setTimeout(() => changeServer(server, index), 0);
    return () => window.clearTimeout(timer);
  }, [changeServer, chapterServers]);

  const handleSubmitChangeServer = useCallback(() => {
    setShowErrorModal(false);
    const nextIdx = (selectedServerIdx + 1) % chapterServers.length;
    const next = chapterServers[nextIdx];
    if (next && nextIdx !== selectedServerIdx) {
      changeServer(next, nextIdx);
    }
  }, [changeServer, chapterServers, selectedServerIdx]);

  const cancelServerFallback = useCallback(() => {
    setShowErrorModal(false);
    setIsErrorPages(false);
    setErrorCount(0);
  }, []);

  const openReadingSettings = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(openSettings, {
        detail: { category: SettingCategory.READING },
      }),
    );
  }, []);

  const openChapterErrorReport = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(openReportError, {
        detail: { chapterID: chapterData.id },
      }),
    );
  }, [chapterData.id]);

  const chapterServerQuery = useChapterServer(
    isErrorPages ? chapterServers[(selectedServerIdx + 1) % chapterServers.length]?.id : null
  );

  useEffect(() => {
    const images = chapterServerQuery.data?.images;
    if (images) {
      const timer = window.setTimeout(() => {
        setListImgs([BANNER_IMG, ...images]);
        setIsImageLoading(false);
        setIsErrorPages(false);
        setErrorCount(0);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [chapterServerQuery.data]);

  // Auto error modal
  useEffect(() => {
    if (isErrorPages && chapterServers.length > 1) {
      const openTimer = window.setTimeout(() => {
        setShowErrorModal(true);
        setCountdown(5);
      }, 0);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitChangeServer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        window.clearTimeout(openTimer);
        clearInterval(interval);
      };
    }
  }, [chapterServers.length, handleSubmitChangeServer, isErrorPages]);

  // History & view tracking
  useEffect(() => {
    saveHistory({
      ...comic,
      chapters: [{ id: chapterData.id, title: chapterData.title, slug: chapterData.slug, updateAt: chapterData.updateAt, viewCount: chapterData.viewCount }],
    });
  }, [comic, chapterData.id, chapterData.slug, chapterData.title, chapterData.updateAt, chapterData.viewCount, saveHistory]);

  useEffect(() => {
    if (!viewTracked) {
      const timer = setTimeout(() => {
        updateView({ comicId: comic.id, chapterId: chapterData.id, exp: 10 });
        setViewTracked(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [viewTracked, comic.id, chapterData.id, updateView]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    const elem = screenRef.current;
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Scroll handling
  const lastScrollTop = useRef(0);
  const statePosition = useRef(0);
  const scrollState = useRef<'up' | 'down'>('down');

  useEffect(() => {
    const container = isFullscreen ? screenRef.current : null;
    const handleScroll = () => {
      const el = container;
      const scrollTop = el ? el.scrollTop : window.scrollY;
      const scrollHeight = el ? el.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = el ? el.clientHeight : window.innerHeight;

      // Auto next chapter
      if (isAutoNextChapter && isVertical && scrollTop + clientHeight >= scrollHeight - 1 && nextChapter) {
        router.push(getChapterDetailUrl(comic, nextChapter));
        return;
      }

      // Sticky toolbar
      const toolbarPos = controlBarContainerRef.current?.getBoundingClientRect().top ?? 0;
      const isPastToolbar = scrollTop > (isFullscreen ? toolbarPos : toolbarPos + scrollTop);

      const endChapterTop = endChapterRef.current
        ? isFullscreen
          ? endChapterRef.current.getBoundingClientRect().top - (screenRef.current?.getBoundingClientRect().top ?? 0) + scrollTop
          : endChapterRef.current.offsetTop
        : 0;
      const isEndChapter = scrollTop + clientHeight > endChapterTop;

      const newState = scrollTop < lastScrollTop.current ? 'up' : 'down';
      if (newState !== scrollState.current) {
        statePosition.current = scrollTop;
        scrollState.current = newState;
      }

      if (!isPastToolbar) {
        setToolbarStyle('');
        setShowScrollToTop(false);
      } else if (fixedToolbar || isEndChapter) {
        setToolbarStyle('top');
        setShowScrollToTop(true);
      } else if (scrollState.current === 'up' && statePosition.current - scrollTop > 200) {
        setToolbarStyle('top');
        setShowScrollToTop(true);
      } else if (scrollState.current === 'down' && scrollTop - statePosition.current > 200) {
        setToolbarStyle('hidden');
        setShowScrollToTop(false);
      }

      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
      else window.removeEventListener('scroll', handleScroll);
    };
  }, [isFullscreen, isAutoNextChapter, isVertical, nextChapter, comic, router, fixedToolbar]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        e.defaultPrevented ||
        target?.isContentEditable ||
        target?.closest('input, textarea, select, [role="dialog"]')
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') navigateChapter(false);
      if (e.key === 'ArrowRight') navigateChapter(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigateChapter]);

  // Image error handling
  const handleImageError = useCallback((e: any) => {
    e.target.style.display = 'none';
    setErrorCount((prev) => {
      const newCount = prev + 1;
      const ratio = newCount / (listImgs.length || 1);
      if (ratio > 0.5 && chapterServers.length > 1 && !isErrorPages) {
        setIsErrorPages(true);
      }
      return newCount;
    });
  }, [listImgs.length, isErrorPages]);

  // Zoom
  const [isZoomIn, setIsZoomIn] = useState(false);

  const handleZoomToggle = useCallback(() => {
    if (!isZoomIn) {
      setZoomValue((prev) => {
        const next = Math.min(prev + 10, 150);
        if (next >= 150) {
          setIsZoomIn(true);
          setZoomPanelOpen(false);
        } else {
          setZoomPanelOpen(true);
        }
        return next;
      });
    } else {
      setZoomValue((prev) => {
        const next = Math.max(prev - 10, 50);
        if (next <= 50) {
          setIsZoomIn(false);
          setZoomPanelOpen(false);
        } else {
          setZoomPanelOpen(true);
        }
        return next;
      });
    }
  }, [isZoomIn]);

  const zoomIn = useCallback(() => {
    setZoomValue((v) => {
      const next = Math.min(v + 10, 150);
      if (next >= 150) setIsZoomIn(true);
      return next;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoomValue((v) => {
      const next = Math.max(v - 10, 50);
      if (next <= 50) setIsZoomIn(false);
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomValue(100);
    setIsZoomIn(false);
  }, []);

  const scrollToTop = () => {
    if (isFullscreen && screenRef.current) {
      screenRef.current.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Double click fullscreen
  const handleDoubleClick = useCallback(() => {
    if (doubleClickToFullscreen) toggleFullscreen();
  }, [doubleClickToFullscreen, toggleFullscreen]);

  // Toolbar style class
  const isModern = toolbarStyleSetting === 'modern';
  const stickyClasses = toolbarStyle === 'top'
    ? isModern
      ? 'fixed top-1 left-1/2 -translate-x-1/2 rounded-xl border'
      : 'fixed left-0 right-0 top-0 rounded-none border'
    : toolbarStyle === 'hidden'
      ? isModern
        ? 'fixed -top-14 left-1/2 -translate-x-1/2 rounded-xl'
        : 'fixed -top-14 left-0 right-0 rounded-none'
      : '';

  return (
    <div ref={screenRef} className="scrollbar-style-1 relative flex flex-col overflow-y-auto overflow-x-hidden bg-[#333] dark:bg-dark-bg">
      <div className="mx-auto mb-2 w-full text-white lg:container">
        <div className="z-10 mx-auto my-2 flex">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: comic.title, href: getComicDetailUrl(comic) },
              { label: chapterData.title || `Chương ${chapterData.slug}` },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto min-h-screen w-full lg:container">
        <section className="relative z-10 mx-auto flex w-full flex-col items-center text-base font-bold">
          <div className="z-20 w-full rounded-t-xl border bg-white p-4 text-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-light-text lg:p-6 max-sm:rounded-t-lg max-sm:p-3">
            {/* Error Modal */}
            {showErrorModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl">
                  <div className="text-center flex flex-col items-center gap-3">
                    <svg width="64px" height="64px" viewBox="-5.44 -5.44 26.88 26.88" fill="#ffffff">
                      <rect x="-5.44" y="-5.44" width="26.88" height="26.88" rx="13.44" fill="#eab308" />
                      <path
                        fill="#ffffff"
                        fillRule="evenodd"
                        d="M9.71093422,1.9716895 C8.93428422,0.6761035 7.05680422,0.6761035 6.28015422,1.9716895 L0.287692215,11.9681595 C-0.511423785,13.3011595 0.448847215,14.9964595 2.00308422,14.9964595 L13.9880442,14.9964595 C15.5422442,14.9964595 16.5025442,13.3011595 15.7034442,11.9681595 L9.71093422,1.9716895 Z M7.99556422,9.9964595 L9.06454422,6.4331995 C9.27936422,5.7171295 8.74315422,4.9964595 7.99556422,4.9964595 C7.24796422,4.9964595 6.71176422,5.7171295 6.92658422,6.4331995 L7.99556422,9.9964595 Z M7.99554422,12.9964595 C8.54783422,12.9964595 8.99554422,12.5487595 8.99554422,11.9964595 C8.99554422,11.4441595 8.54783422,10.9964595 7.99554422,10.9964595 C7.44326422,10.9964595 6.99554422,11.4441595 6.99554422,11.9964595 C6.99554422,12.5487595 7.44326422,12.9964595 7.99554422,12.9964595Z"
                      />
                    </svg>
                    <h3 className="text-xl text-center mb-2 font-medium dark:text-white">LỖI SERVER ẢNH</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-center font-normal mt-2">
                    Tự động chuyển server ảnh trong <span className="font-bold text-primary-100">{countdown}</span> giây
                  </p>
                  <div className="flex justify-center gap-2 w-full mt-4">
                    <button
                      className="bg-primary-100 text-white px-4 py-2 rounded"
                      onClick={handleSubmitChangeServer}
                    >
                      OK
                    </button>
                    <button
                      className="border border-gray-300 text-gray-700 dark:text-gray-300 px-4 py-2 rounded"
                      onClick={cancelServerFallback}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter Info */}
            <div className="space-y-4 text-center">
              <div className="space-y-2">

                <Link
                  href={getComicDetailUrl(comic)}
                  title={`Đọc Truyện ${comic.title} - ${chapterData.title}`}
                  className="text-xl font-bold text-gray-700 transition-colors duration-200 hover:text-primary-200 hover:underline max-sm:text-lg lg:text-2xl dark:text-primary-100"
                >
                  <h1>
                    Đọc Truyện {comic.title} - {chapterData.title}
                  </h1>
                </Link>
              </div>
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900 max-sm:text-sm lg:text-lg dark:text-light-text">{chapterData.title}</h2>
                <time className="text-xs font-medium text-gray-500 dark:text-gray-300" dateTime={chapterData.updateAt?.split('T')[0]}>
                  Đăng lúc: {chapterData.updateAt ? new Date(chapterData.updateAt).toLocaleDateString('vi-VN') : ''}
                </time>
              </div>
            </div>

            {/* Server Selection */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-center gap-3 max-sm:gap-2">
                {(showAllServers ? chapterServers : chapterServers.slice(0, 3)).map((server, i) => (
                  <button
                    key={server.id}
                    onClick={() => changeServer(server, i)}
                    className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 max-sm:text-xs dark:border-neutral-600 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 ${server.id === chapterServers[selectedServerIdx]?.id ? 'border-sky-500 text-sky-500' : ''}`}
                  >
                    <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                      <path d="M7 18a4.6 4.4 0 0 1 0 -9h0a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12" />
                    </svg>
                    <span className="font-medium">Server {i + 1}</span>
                  </button>
                ))}
                {chapterServers.length > 3 && (
                  <button onClick={() => setShowAllServers(!showAllServers)} className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600">
                    <svg
                      className={`h-5 w-5 fill-none stroke-current stroke-2 transition-transform duration-200 [stroke-linecap:round] [stroke-linejoin:round] ${showAllServers ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 15l-6-6l-6 6h12" />
                    </svg>
                  </button>
                )}
                <button type="button" className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-yellow-800 hover:border-yellow-300 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:border-yellow-700 dark:hover:bg-yellow-900/30" onClick={openChapterErrorReport}>
                  <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="text-xs font-bold">Báo lỗi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <nav ref={controlBarContainerRef} className="w-full h-12">
            <div
              ref={controlBarRef}
              className={`z-[999] flex max-w-full items-center justify-center gap-2 rounded-b-lg border bg-white px-2 py-1.5 transition-[top] duration-500 ease-in-out transform-gpu dark:border-neutral-700 dark:bg-neutral-800 md:gap-3 ${stickyClasses}`}
            >
              {/* Home */}
              <div className="z-10 flex items-center gap-2">
                <Link href="/" title="Trang chủ" className="flex items-center gap-2 rounded-lg border border-primary-100/30 bg-primary-100/5 px-3 py-2 text-sm font-medium text-primary-100 hover:border-primary-100/50 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700">
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                </Link>
              </div>

              {/* Fullscreen */}
              <div className="z-10 flex items-center gap-2">
                <button title="Toàn màn hình" className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-primary-100/50 hover:bg-gray-100 hover:text-primary-100 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700" onClick={toggleFullscreen}>
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>

              {/* Chapter Navigation */}
              <div className="flex items-center gap-1 px-4 max-md:gap-0 max-md:px-1">
                <Link
                  href={prevChapterLink || '#'}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border-none bg-gray-200 px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-100 hover:text-white max-md:px-1 max-md:py-1.5 max-md:text-xs  dark:text-gray-300 ${isPrevChapterDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'bg-primary-100 text-white'}`}
                  aria-label="Chương trước"
                  aria-disabled={isPrevChapterDisabled}
                  tabIndex={isPrevChapterDisabled ? -1 : undefined}
                  onClick={(event) => {
                    if (isPrevChapterDisabled) event.preventDefault();
                  }}
                >
                  <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </Link>

                <div className="mx-1">
                  <ChapterSelector
                    chapters={allChapters}
                    currentChapter={ chapterData}
                    topToBottom={true}
                    onChapterChange={(ch) => {
                      if (ch.id !== chapterData.id) {
                        router.push(getChapterDetailUrl(comic, ch));
                      }
                    }}
                  />
                </div>

                <Link
                  href={nextChapterLink || '#'}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border-none bg-gray-200 px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-100 hover:text-white max-md:px-1 max-md:py-1.5 max-md:text-xs  dark:text-gray-300 ${isNextChapterDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'bg-primary-100 text-white'}`}
                  aria-label="Chương tiếp"
                  aria-disabled={isNextChapterDisabled}
                  tabIndex={isNextChapterDisabled ? -1 : undefined}
                  onClick={(event) => {
                    if (isNextChapterDisabled) event.preventDefault();
                  }}
                >
                  <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Zoom */}
              <div ref={zoomGroupRef} className="relative z-10 flex items-center gap-2">
                <button
                  title="Thu phóng"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-primary-100/50 hover:bg-gray-100 hover:text-primary-100 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700"
                  onClick={handleZoomToggle}
                >
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    {!isZoomIn ? (
                      <>
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </>
                    ) : (
                      <line x1="8" y1="11" x2="14" y2="11" />
                    )}
                  </svg>
                </button>
                {zoomPanelOpen && (
                  <div className="absolute top-12 z-[9999] min-w-40 -translate-x-full items-center space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="flex w-full items-center gap-4">
                      <span className="min-w-12 text-sm font-semibold text-primary-100">{zoomValue}%</span>
                      <div className="flex gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-primary-100 dark:text-gray-300 dark:hover:bg-neutral-700" onClick={zoomOut} title="Thu nhỏ">
                          <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-primary-100 dark:text-gray-300 dark:hover:bg-neutral-700" onClick={zoomIn} title="Phóng to">
                          <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button onClick={resetZoom} title="Đặt lại" className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-primary-100 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-200">
                      <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="z-10 flex items-center gap-2">
                <button type="button" title="Cài đặt" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 hover:border-primary-100/50 hover:bg-gray-100 hover:text-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-700" onClick={openReadingSettings}>
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        </section>

        {/* Reading Container */}
        <div onDoubleClick={handleDoubleClick} className="relative z-0 mt-2 sm:px-[5%] md:px-[15%]">
          <div
            ref={imageContainerRef}
            id="image-container"
            className="relative min-h-screen"
            style={{
              width: `${zoomValue}%`,
              left: `${(100 - zoomValue) * 0.5}%`,
            }}
          >
            {/* Loading */}
            {isImageLoading && (
              <div className="mt-10 flex flex-col items-center justify-center space-y-8 p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <svg className="h-16 w-16 animate-spin text-primary-100" viewBox="0 0 24 24">
                      <circle className="fill-none stroke-current stroke-2 opacity-25" cx="12" cy="12" r="10" />
                      <path className="fill-none stroke-current stroke-2 opacity-75 [stroke-linecap:round]" d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-light-text">Đang tải chương...</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vui lòng đợi trong giây lát</p>
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            {!isImageLoading &&
              listImgs.map((img, i) => (
                <div key={i} className="relative mx-auto block object-contain">
                  <Image
                    loading={i <= 1 || (canPreloadPages && i <= preloadPages) ? 'eager' : 'lazy'}
                    fetchPriority={i === 1 ? 'high' : 'auto'}
                    className={`h-full w-full object-cover ${!isVertical ? 'h-full min-w-80' : ''} ${isNightMode ? 'brightness-90 sepia' : ''}`}
                    alt={`${comic.title} Chương ${chapterData.slug} Ảnh ${i + 1}`}
                    src={img}
                    width={1200}
                    height={1800}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 1200px"
                    onError={handleImageError}
                  />
                </div>
              ))}
          </div>

          {/* End Chapter Navigation */}
          <div ref={endChapterRef} className="mt-8 mb-6 flex w-full justify-center">
            <div className="flex w-full max-w-4xl items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <Link
                title="Chương trước"
                href={prevChapterLink || '#'}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-primary-100 hover:text-white max-md:w-full max-md:justify-center dark:border-neutral-600 dark:bg-neutral-700 dark:text-gray-300 ${!prevChapterLink ? 'pointer-events-none opacity-50' : ''}`}
              >
                <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="font-medium max-sm:hidden">Chương trước</span>
              </Link>
              <div className="hidden flex-1 space-y-2 text-center sm:block">
                <h3 className="text-lg font-bold text-gray-900 dark:text-light-text">Kết thúc chương</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{chapterData.title}</p>
              </div>
              <Link
                title="Chương tiếp"
                href={nextChapterLink || '#'}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-primary-100 hover:text-white max-md:w-full max-md:justify-center dark:border-neutral-600 dark:bg-neutral-700 dark:text-gray-300 ${!nextChapterLink ? 'pointer-events-none opacity-50' : ''}`}
              >
                <span className="font-medium max-sm:hidden">Chương tiếp</span>
                <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 mx-auto w-full lg:container">
        <CommentSection chapterID={chapterData.id} comic={comic}></CommentSection>
      </div>
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary-100 px-4 py-3 text-white shadow-lg transition-all duration-300 hover:bg-primary-200 max-md:bottom-4 max-md:right-4 max-md:px-3 max-md:py-2 ${showScrollToTop ? 'translate-y-0 opacity-100 pointer-events-auto' : 'pointer-events-none translate-y-4 opacity-0'}`}
        title="Lên đầu trang"
        type="button"
      >
        <svg className="h-5 w-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
