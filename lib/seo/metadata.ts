import type { Metadata } from 'next';
import type { Comic, Chapter, Genre } from '@/types';
import { config } from '@/lib/config';
import { getDefaultKeywords, generateLongTailKeywords, generateComicKeywords } from './keywords';
import { fillSeoDescription } from '../utils/description';

export function generateHomeMetadata(): Metadata {
  return {
    title: `${config.APP_NAME} - Đọc Truyện Tranh Online Miễn Phí, Cập Nhật Nhanh Nhất`,
    description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Kho truyện manga, manhwa, manhua khổng lồ, cập nhật liên tục, chất lượng cao.`,
    keywords: getDefaultKeywords(),
    openGraph: {
      title: `${config.APP_NAME} - Đọc Truyện Tranh Online`,
      description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}`,
      url: config.BASE_URL,
      siteName: config.APP_NAME,
      type: 'website',
      images: [{ url: '/logo.png' }],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: { canonical: config.BASE_URL },
  };
}

export function generateComicMetadata(comic: Comic): Metadata {
  const keywords = generateComicKeywords(comic).join(', ');
  return {
    title: `${comic.title} - Đọc Truyện ${comic.title} Online Miễn Phí | ${config.APP_NAME}`,
    description: fillSeoDescription(comic.description, comic),
    keywords,
    openGraph: {
      title: `${comic.title} - ${config.APP_NAME}`,
      description: comic.description?.slice(0, 200) || undefined,
      url: `${config.BASE_URL}/truyen-tranh/${comic.url}`,
      siteName: config.APP_NAME,
      type: 'book',
      images: comic.coverImage ? [{ url: comic.coverImage }] : [{ url: '/logo.png' }],
      locale: 'vi_VN',
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `${config.BASE_URL}/truyen-tranh/${comic.url}` },
  };
}

export function generateChapterMetadata(comic: Comic, chapter: Chapter): Metadata {
  const chapterTitle = `${comic.title} Chương ${chapter.chapterNumber || chapter.slug}`;
  return {
    title: `${chapterTitle} - Đọc Online Miễn Phí | ${config.APP_NAME}`,
    description: `Đọc ${chapterTitle} online miễn phí. Truyện ${comic.title} cập nhật nhanh nhất tại ${config.APP_NAME}.`,
    keywords: generateLongTailKeywords(chapterTitle, 'chapter').join(', '),
    openGraph: {
      title: `${chapterTitle} - ${config.APP_NAME}`,
      description: `Đọc ${chapterTitle} online miễn phí`,
      url: `${config.BASE_URL}/truyen-tranh/${comic.url}/chuong-${chapter.slug}`,
      siteName: config.APP_NAME,
      type: 'article',
      images: comic.coverImage ? [{ url: comic.coverImage }] : [{ url: '/logo.png' }],
      locale: 'vi_VN',
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `${config.BASE_URL}/truyen-tranh/${comic.url}/chuong-${chapter.slug}` },
  };
}

export function generateGenreMetadata(genre: Genre): Metadata {
  return {
    title: `Truyện ${genre.title} - Đọc Truyện ${genre.title} Hay Nhất | ${config.APP_NAME}`,
    description: genre.description || `Tổng hợp truyện tranh thể loại ${genre.title} hay nhất.`,
    keywords: generateLongTailKeywords(genre.title, 'genre').join(', '),
    openGraph: {
      title: `Truyện ${genre.title} - ${config.APP_NAME}`,
      description: genre.description || undefined,
      url: `${config.BASE_URL}/the-loai/${genre.slug}`,
      siteName: config.APP_NAME,
      type: 'website',
      images: [{ url: '/logo.png' }],
      locale: 'vi_VN',
    },
    alternates: { canonical: `${config.BASE_URL}/the-loai/${genre.slug}` },
  };
}

export function generateSearchMetadata(query?: string): Metadata {
  return {
    title: query
      ? `Tìm truyện: ${query} | ${config.APP_NAME}`
      : `Tìm kiếm truyện tranh | ${config.APP_NAME}`,
    description: `Tìm kiếm truyện tranh tại ${config.APP_NAME}. Kho truyện khổng lồ với nhiều thể loại.`,
    keywords: query ? generateLongTailKeywords(query, 'search').join(', ') : getDefaultKeywords(),
    openGraph: {
      title: `Tìm kiếm truyện tranh | ${config.APP_NAME}`,
      url: `${config.BASE_URL}/tim-truyen`,
      siteName: config.APP_NAME,
    },
    alternates: { canonical: `${config.BASE_URL}/tim-truyen` },
  };
}

export function generateRankingMetadata(): Metadata {
  return {
    title: `Xếp hạng truyện tranh hay nhất | ${config.APP_NAME}`,
    description: `Bảng xếp hạng truyện tranh hay nhất theo ngày, tuần, tháng. Cập nhật liên tục tại ${config.APP_NAME}.`,
    openGraph: {
      title: `Xếp hạng truyện tranh | ${config.APP_NAME}`,
      url: `${config.BASE_URL}/xep-hang`,
      siteName: config.APP_NAME,
    },
    alternates: { canonical: `${config.BASE_URL}/xep-hang` },
  };
}

export function generateHotComicsMetadata(): Metadata {
  return {
    title: `Truyện tranh hot - Truyện trending | ${config.APP_NAME}`,
    description: `Tổng hợp truyện tranh hot nhất, trending nhất hiện nay. Cập nhật liên tục tại ${config.APP_NAME}.`,
    openGraph: {
      title: `Truyện tranh hot | ${config.APP_NAME}`,
      url: `${config.BASE_URL}/truyen-hot`,
      siteName: config.APP_NAME,
    },
    alternates: { canonical: `${config.BASE_URL}/truyen-hot` },
  };
}

export function generateStaticMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  return {
    title: `${title} | ${config.APP_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${config.APP_NAME}`,
      description,
      url: `${config.BASE_URL}/${slug}`,
      siteName: config.APP_NAME,
      images: [{ url: '/logo.png' }],
    },
    alternates: { canonical: `${config.BASE_URL}/${slug}` },
  };
}

export function generateNoIndexMetadata(title: string): Metadata {
  return {
    title: `${title} | ${config.APP_NAME}`,
    robots: { index: false, follow: true },
  };
}
