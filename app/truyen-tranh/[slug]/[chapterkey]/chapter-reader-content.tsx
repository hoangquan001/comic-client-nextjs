'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useChapters, useChapterServer } from '@/lib/hooks/use-comic-queries';
import { useUpdateViewAndExp } from '@/lib/hooks/use-account-queries';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import Selection from '@/components/common/selection/selection';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { SettingCategory } from '@/types';
import type { ChapterPage, ChapterServer, Chapter, Comic } from '@/types';

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

  // State
  const [selectedServerIdx, setSelectedServerIdx] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('currentServerIdx');
    return saved ? Number(saved) : 0;
  });
  const [listImgs, setListImgs] = useState<string[]>(() => {
    const server = chapterServers[selectedServerIdx] || chapterServers[0];
    return server?.images ? [BANNER_IMG, ...server.images] : [];
  });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showAllServers, setShowAllServers] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isErrorPages, setIsErrorPages] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarStyle, setToolbarStyle] = useState<'sticky-top' | 'sticky-invisible' | ''>('');
  const [zoomValue, setZoomValue] = useState(100);
  const [zoomPanelOpen, setZoomPanelOpen] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);

  // Stores
  const { saveHistory } = useHistoryStore();
  const { getSettingValue } = useSettingsStore();
  const updateViewMutation = useUpdateViewAndExp();

  // Hooks
  const { data: chapters } = useChapters(comic.id);
  const allChapters = chapters || [];

  // Reading settings
  const isNightMode = getSettingValue('nightMode') as boolean ?? false;
  const isAutoNextChapter = getSettingValue('autoNextChapter') as boolean ?? false;
  const isVertical = getSettingValue('verticalReading') as boolean ?? true;
  const preloadPages = getSettingValue('preloadPages') as number ?? 3;

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

  // Server switching
  const changeServer = useCallback(
    (server: ChapterServer, idx: number) => {
      setSelectedServerIdx(idx);
      localStorage.setItem('currentServerIdx', String(idx));
      if (server.images && server.images.length > 0) {
        setListImgs([BANNER_IMG, ...server.images]);
        return;
      }
      setIsImageLoading(true);
    },
    []
  );

  const openReadingSettings = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('open-settings', {
        detail: { category: SettingCategory.READING },
      }),
    );
  }, []);

  const chapterServerQuery = useChapterServer(
    isErrorPages ? chapterServers[(selectedServerIdx + 1) % chapterServers.length]?.id : null
  );

  useEffect(() => {
    if (chapterServerQuery.data?.images) {
      setListImgs([BANNER_IMG, ...chapterServerQuery.data.images]);
      setIsImageLoading(false);
      setIsErrorPages(false);
      setErrorCount(0);
    }
  }, [chapterServerQuery.data]);

  // Auto error modal
  useEffect(() => {
    if (isErrorPages && chapterServers.length > 1) {
      setShowErrorModal(true);
      setCountdown(5);
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
      return () => clearInterval(interval);
    }
  }, [isErrorPages]);

  // History & view tracking
  useEffect(() => {
    saveHistory({
      ...comic,
      chapters: [{ id: chapterData.id, title: chapterData.title, slug: chapterData.slug, updateAt: chapterData.updateAt, viewCount: chapterData.viewCount }],
    });
  }, [comic.id]);

  useEffect(() => {
    if (!viewTracked) {
      const timer = setTimeout(() => {
        updateViewMutation.mutate({ comicId: comic.id, chapterId: chapterData.id, exp: 10 });
        setViewTracked(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [viewTracked, comic.id, chapterData.id]);

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
      } else if (isEndChapter) {
        setToolbarStyle('sticky-top');
        setShowScrollToTop(true);
      } else if (scrollState.current === 'up' && statePosition.current - scrollTop > 50) {
        setToolbarStyle('sticky-top');
        setShowScrollToTop(true);
      } else if (scrollState.current === 'down' && scrollTop - statePosition.current > 200) {
        setToolbarStyle('sticky-invisible');
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
  }, [isFullscreen, isAutoNextChapter, isVertical, nextChapter, comic, router]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateChapter(false);
      if (e.key === 'ArrowRight') navigateChapter(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [allChapters, chapterData.id, isImageLoading, comic]);

  const navigateChapter = useCallback(
    (isNext: boolean) => {
      if (isImageLoading) return;
      const chapter = isNext ? nextChapter : prevChapter;
      if (chapter) router.push(getChapterDetailUrl(comic, chapter));
    },
    [isImageLoading, nextChapter, prevChapter, comic, router]
  );

  // Image error handling
  const handleImageError = useCallback(() => {
    setErrorCount((prev) => {
      const newCount = prev + 1;
      const ratio = newCount / (listImgs.length || 1);
      if (ratio > 0.5 && chapterServers.length > 1 && !isErrorPages) {
        setIsErrorPages(true);
      }
      return newCount;
    });
  }, [listImgs.length, chapterServers.length, isErrorPages]);

  // Zoom
  const zoomIn = () => setZoomValue((v) => Math.min(v + 10, 150));
  const zoomOut = () => setZoomValue((v) => Math.max(v - 10, 50));
  const resetZoom = () => setZoomValue(100);

  const handleSubmitChangeServer = () => {
    setShowErrorModal(false);
    const nextIdx = (selectedServerIdx + 1) % chapterServers.length;
    const next = chapterServers[nextIdx];
    if (next && nextIdx !== selectedServerIdx) {
      changeServer(next, nextIdx);
    }
  };

  const scrollToTop = () => {
    if (isFullscreen && screenRef.current) {
      screenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={screenRef} className="chapter-container scrollbar-style-1">
      <div className="header-container">
        <div className="breadcrumb-wrapper">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: comic.title, href: getComicDetailUrl(comic) },
              { label: chapterData.title || `Chương ${chapterData.slug}` },
            ]}
          />
        </div>
      </div>

      <div className="main-container">
        <section className="chapter-header-container">
          <div className="chapter-header-card">
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
                      onClick={() => setShowErrorModal(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter Info */}
            <div className="chapter-info-section">
              <div className="comic-title-section">
                <h1 className="comic-title">
                  <Link
                    href={getComicDetailUrl(comic)}
                    title={`Đọc Truyện ${comic.title} - ${chapterData.title}`}
                    className="comic-title-link"
                  >
                    Đọc Truyện {comic.title} - {chapterData.title}
                  </Link>
                </h1>
              </div>
              <div className="chapter-details">
                <h2 className="chapter-title">{chapterData.title}</h2>
                <time className="chapter-date" dateTime={chapterData.updateAt?.split('T')[0]}>
                  Đăng lúc: {chapterData.updateAt ? new Date(chapterData.updateAt).toLocaleDateString('vi-VN') : ''}
                </time>
              </div>
            </div>

            {/* Server Selection */}
            <div className="server-selection-section">
              <div className="server-list">
                {(showAllServers ? chapterServers : chapterServers.slice(0, 3)).map((server, i) => (
                  <button
                    key={server.id}
                    onClick={() => changeServer(server, i)}
                    className={`server-button ${server.id === chapterServers[selectedServerIdx]?.id ? 'server-button-active' : ''}`}
                  >
                    <svg className="server-icon" viewBox="0 0 24 24">
                      <path d="M7 18a4.6 4.4 0 0 1 0 -9h0a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12" />
                    </svg>
                    <span className="server-text">Server {i + 1}</span>
                  </button>
                ))}
                {chapterServers.length > 3 && (
                  <button onClick={() => setShowAllServers(!showAllServers)} className="server-expand-button">
                    <svg
                      className={`expand-icon ${showAllServers ? 'expand-icon-rotated' : ''}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 15l-6-6l-6 6h12" />
                    </svg>
                  </button>
                )}
                <button className="report-error-button">
                  <svg className="report-icon" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="report-text">Báo lỗi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <nav ref={controlBarContainerRef} className="w-full h-12">
            <div ref={controlBarRef} className={`control-bar ${toolbarStyle}`}>
              {/* Home */}
              <div className="control-group">
                <Link href="/" title="Trang chủ" className="control-button control-button-home">
                  <svg className="control-icon" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                </Link>
              </div>

              {/* Fullscreen */}
              <div className="control-group">
                <button title="Toàn màn hình" className="control-button" onClick={toggleFullscreen}>
                  <svg className="control-icon" viewBox="0 0 24 24">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>

              {/* Chapter Navigation */}
              <div className="chapter-navigation-group">
                <button
                  className={`nav-button nav-button-prev ${prevChapter ? 'nav-button-active' : ''}`}
                  onClick={() => navigateChapter(false)}
                  aria-label="Chương trước"
                  disabled={isImageLoading || !prevChapter}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="chapter-selector-wrapper">
                  <Selection
                    className="text-sm border rounded px-2 py-1 bg-white dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-600"
                    value={chapterData.id}
                    options={allChapters.map((ch: Chapter) => ({
                      label: `Chapter ${ch.slug}`,
                      value: ch.id,
                    }))}
                    onChange={(nextValue) => {
                      const ch = allChapters.find((c: Chapter) => c.id === Number(nextValue));
                      if (ch) router.push(getChapterDetailUrl(comic, ch));
                    }}
                  />
                </div>

                <button
                  className={`nav-button nav-button-next ${nextChapter ? 'nav-button-active' : ''}`}
                  onClick={() => navigateChapter(true)}
                  aria-label="Chương tiếp"
                  disabled={isImageLoading || !nextChapter}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Zoom */}
              <div className="control-group zoom-group">
                <button
                  title="Thu phóng"
                  className="control-button zoom-button"
                  onClick={() => {
                    if (zoomValue < 150) zoomIn();
                    else zoomOut();
                    setZoomPanelOpen(true);
                  }}
                >
                  <svg className="control-icon" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    {zoomValue < 150 ? (
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
                  <div className="zoom-panel zoom-panel-active">
                    <div className="zoom-info">
                      <span className="zoom-percentage">{zoomValue}%</span>
                      <div className="zoom-controls">
                        <button className="zoom-control-btn" onClick={zoomOut} title="Thu nhỏ">
                          <svg className="zoom-control-icon" viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <button className="zoom-control-btn" onClick={zoomIn} title="Phóng to">
                          <svg className="zoom-control-icon" viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button onClick={resetZoom} title="Đặt lại" className="zoom-reset-btn">
                      <svg className="zoom-reset-icon" viewBox="0 0 24 24">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="control-group">
                <button type="button" title="Cài đặt" className="control-button settings-button" onClick={openReadingSettings}>
                  <svg className="control-icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
        <div onDoubleClick={toggleFullscreen} className="reading-container">
          <div
            ref={imageContainerRef}
            id="image-container"
            className="reading-content"
            style={{
              width: `${zoomValue}%`,
              left: `${(100 - zoomValue) * 0.5}%`,
            }}
          >
            {/* Loading */}
            {isImageLoading && (
              <div className="loading-container">
                <div className="loading-content">
                  <div className="loading-spinner">
                    <svg className="loading-icon" viewBox="0 0 24 24">
                      <circle className="loading-circle-bg" cx="12" cy="12" r="10" />
                      <circle className="loading-circle-progress" cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div className="loading-text">
                    <h3 className="loading-title">Đang tải chương...</h3>
                    <p className="loading-subtitle">Vui lòng đợi trong giây lát</p>
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            {!isImageLoading &&
              listImgs.map((img, i) => (
                <div key={i} className="page-chapter">
                  <Image
                    loading={i <= preloadPages ? 'eager' : 'lazy'}
                    fetchPriority={i <= 1 ? 'high' : 'auto'}
                    className={`chapter-page-image ${!isVertical ? 'chapter-page-horizontal' : ''} ${isNightMode ? 'night-mode' : ''}`}
                    alt={`${comic.title} Chương ${chapterData.slug} Ảnh ${i + 1}`}
                    src={img}
                    width={1200}
                    height={1800}
                    onError={handleImageError}
                  />
                </div>
              ))}
          </div>

          {/* End Chapter Navigation */}
          <div ref={endChapterRef} className="end-chapter-navigation">
            <div className="end-chapter-content">
              <Link
                title="Chương trước"
                href={prevChapterLink || '#'}
                className={`end-nav-button end-nav-prev ${!prevChapterLink ? 'disabled pointer-events-none opacity-50' : ''}`}
              >
                <svg className="end-nav-icon" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="end-nav-text">Chương trước</span>
              </Link>
              <div className="end-chapter-info">
                <h3 className="end-chapter-title">Kết thúc chương</h3>
                <p className="end-chapter-subtitle">{chapterData.title}</p>
              </div>
              <Link
                title="Chương tiếp"
                href={nextChapterLink || '#'}
                className={`end-nav-button end-nav-next ${!nextChapterLink ? 'disabled pointer-events-none opacity-50' : ''}`}
              >
                <span className="end-nav-text">Chương tiếp</span>
                <svg className="end-nav-icon" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top-btn ${showScrollToTop ? 'scroll-to-top-visible' : ''}`}
        title="Lên đầu trang"
        type="button"
      >
        <svg className="scroll-to-top-icon" viewBox="0 0 24 24">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
