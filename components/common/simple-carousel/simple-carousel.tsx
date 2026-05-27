'use client';
import Image from 'next/image';

import { Comic } from '@/types';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { useRef, useCallback, useEffect } from 'react';
import { getComicDetailUrl } from '@/lib/utils/url';
import { formatNumber } from '@/lib/utils/number';
import { fillDescription } from '@/lib/utils/description';

interface SimpleCarouselProps {
  comics: Comic[]
}

export function SimpleCarousel({
  comics
}: SimpleCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: true,
    slidesToScroll: 1,
  });



  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoplayPausedRef = useRef(false);
  const stopAutoplay = useCallback(() => {
    if (!autoplayTimerRef.current) return;
    clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = null;
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!emblaApi || comics.length <= 1) return;

    autoplayTimerRef.current = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 4000);
  }, [comics.length, emblaApi, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return undefined;

    const pauseOnDrag = () => stopAutoplay();
    const resumeAfterDrag = () => {
      if (!autoplayPausedRef.current) startAutoplay();
    };

    emblaApi.on('pointerDown', pauseOnDrag);
    emblaApi.on('pointerUp', resumeAfterDrag);

    return () => {
      emblaApi.off('pointerDown', pauseOnDrag);
      emblaApi.off('pointerUp', resumeAfterDrag);
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  const handleMouseEnter = () => {
    autoplayPausedRef.current = true;
    stopAutoplay();
  };

  const handleMouseLeave = () => {
    autoplayPausedRef.current = false;
    startAutoplay();
  };
  return (
    <>
      <div className="hidden sm:flex mt-3 mb-2 flex-row justify-between gap-6 rounded-t">
        <div className="min-w-32 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 32 32">
            <title>Truyện đang thịnh hành</title>
            <path d="M16,2a9,9,0,0,0-6,15.69V30l6-4,6,4V17.69A9,9,0,0,0,16,2Zm4,24.26-2.89-1.92L16,23.6l-1.11.74L12,26.26V19.05a8.88,8.88,0,0,0,8,0ZM20.89,16A7,7,0,1,1,23,11,7,7,0,0,1,20.89,16Z" />
          </svg>
          <h2 className="block-title">Truyện đang thịnh hành</h2>
        </div>
      </div>

      <div
        ref={emblaRef}
        className="relative overflow-hidden sm:mt-2 h-56 sm:mx-0 simple-carousel-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex select-none gap-[var(--sc-gap)] w-full">
          {comics.map((comic, i) => (
            <div
              key={comic.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${comics.length}`}
              className="shrink-0 [flex:0_0_calc((100%_-_(var(--sc-items)_-_1)_*_var(--sc-gap))_/_var(--sc-items))]"
            >
              <Link
                href={getComicDetailUrl(comic)}
                draggable={false}
                className="group relative p-4 w-full h-full xl:rounded-xl text-white dark:text-light-text flex overflow-hidden no-underline"
              >
                <div className="absolute inset-0 bg-neutral-900" />

                {/* Content */}
                <div className="grow flex flex-col gap-2 z-10 pr-4">
                  <h3 className="text-xl sm:text-2xl font-bold line-clamp-2 drop-shadow-lg leading-tight">
                    {comic.title}
                  </h3>

                  {/* Genres */}
                  {comic.genres && comic.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {comic.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre.id}
                          className="text-xs bg-primary-100/50 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium"
                        >
                          {genre.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="z-50 text-sm line-clamp-3 mt-auto">
                    {fillDescription(comic.description, comic, false)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-200">
                    <div className="flex items-center space-x-2">
                      {/* Rating */}
                      <div className="flex justify-between items-center">
                        {comic.rating > 0 && (
                          <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex">
                            <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-bold">{comic.rating}</span>
                          </div>
                        )}
                      </div>
                      {/* Views */}
                      <span className="bg-black/50 backdrop-blur-sm text-xs px-2 py-1 rounded-full flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {formatNumber(comic.viewCount)}
                      </span>
                      {/* Chapters */}
                      <span className="text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {comic.numChapter}
                        <span className="ml-1 hidden md:inline"> chương</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="shrink-0 z-20 w-32 h-48">
                  <Image
                    src={comic.coverImage || ''}
                    alt={`Thumbnail ${comic.title}`}
                    className=" object-cover rounded-lg border-2 size-full border-white/80 shadow-lg"
                    loading={i < 1 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    quality={40}
                    draggable={false}
                    width={128}
                    height={192}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous"
          className="group absolute top-1/2 left-2 z-10 w-12 h-12 cursor-pointer -translate-y-1/2 rounded-xl overflow-hidden bg-black/20 hover:bg-black/60 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100/50"
        >
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white opacity-40 group-hover:opacity-80 transition-opacity duration-200" viewBox="0 0 512 512" fill="currentColor">
            <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256" />
          </svg>
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next"
          className="group absolute top-1/2 right-2 z-10 w-12 h-12 cursor-pointer -translate-y-1/2 rounded-xl overflow-hidden bg-black/20 hover:bg-black/60 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100/50"
        >
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white opacity-40 group-hover:opacity-80 transition-opacity duration-200" viewBox="0 0 512 512" fill="currentColor">
            <polygon points="160,128.4 192.3,96 352,256 352,256 352,256 192.3,416 160,383.6 287.3,256" />
          </svg>
        </button>
      </div></>
  );
}
