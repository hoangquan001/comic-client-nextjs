import type { Metadata } from 'next';
import type { Comic, Chapter, Genre } from '@/types';
import { config } from '@/lib/config';
import { getDefaultKeywords, generateLongTailKeywords, generateComicKeywords } from './keywords';
import { fillSeoDescription } from '../utils/description';

const DEFAULT_OG_IMAGE = '/logo.png';
const SITE_DESCRIPTION = `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Kho truyện manga, manhwa, manhua cập nhật nhanh, hình ảnh chất lượng cao, đọc mượt trên mọi thiết bị.`;

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string | string[];
  type?: 'website' | 'article' | 'book';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

function absoluteUrl(path = ''): string {
  if (!path) return config.BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${config.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function normalizeImageUrl(image?: string): string {
  if (!image) return absoluteUrl(DEFAULT_OG_IMAGE);
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return absoluteUrl(image);
  return `https://cdn1.anhtruyen.com/coverimg/${image}`;
}

function cleanDescription(description: string): string {
  return description.replace(/\s+/g, ' ').trim().slice(0, 300);
}

export function generatePageMetadata({
  title,
  description,
  path = '/',
  image,
  keywords = getDefaultKeywords(),
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const pageDescription = cleanDescription(description);
  const ogImage = normalizeImageUrl(image);

  return {
    title,
    description: pageDescription,
    keywords,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title,
      description: pageDescription,
      url: canonical,
      siteName: config.APP_NAME,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'vi_VN',
      publishedTime,
      modifiedTime,
      authors,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

export function generateHomeMetadata(): Metadata {
  return generatePageMetadata({
    title: `${config.APP_NAME} - Đọc Truyện Tranh Online Miễn Phí, Cập Nhật Nhanh Nhất`,
    description: SITE_DESCRIPTION,
    path: '/',
  });
}

export function generateComicMetadata(comic: Comic): Metadata {
  return generatePageMetadata({
    title: `${comic.title} - Đọc Truyện ${comic.title} Online Miễn Phí`,
    description: fillSeoDescription(comic.description, comic),
    keywords: generateComicKeywords(comic),
    path: `/truyen-tranh/${comic.url}`,
    image: comic.coverImage,
    type: 'book',
    authors: comic.author ? [comic.author] : undefined,
    publishedTime: comic.createAt,
    modifiedTime: comic.updateAt,
  });
}

export function generateChapterMetadata(comic: Comic, chapter: Chapter, chapterPath?: string): Metadata {
  const chapterTitle = `${comic.title} Chương ${chapter.chapterNumber || chapter.slug}`;
  return generatePageMetadata({
    title: `${chapterTitle} - Đọc Online Miễn Phí`,
    description: `Đọc ${chapterTitle} online miễn phí. Truyện ${comic.title} cập nhật nhanh, hình ảnh sắc nét tại ${config.APP_NAME}.`,
    keywords: generateLongTailKeywords(chapterTitle, 'chapter'),
    path: chapterPath || `/truyen-tranh/${comic.url}/chuong-${chapter.slug}`,
    image: comic.coverImage,
    type: 'article',
    authors: comic.author ? [comic.author] : undefined,
    modifiedTime: chapter.updateAt || comic.updateAt,
  });
}

export function generateGenreMetadata(genre: Genre): Metadata {
  return generatePageMetadata({
    title: `Truyện ${genre.title} - Đọc Truyện ${genre.title} Hay Nhất`,
    description: genre.description || `Tổng hợp truyện tranh thể loại ${genre.title} hay nhất, cập nhật nhanh và đọc miễn phí tại ${config.APP_NAME}.`,
    keywords: generateLongTailKeywords(genre.title, 'genre'),
    path: `/the-loai/${genre.slug}`,
  });
}

export function generateSearchMetadata(query?: string): Metadata {
  return generatePageMetadata({
    title: query ? `Tìm truyện: ${query}` : 'Tìm kiếm truyện tranh',
    description: query
      ? `Tìm truyện tranh "${query}" tại ${config.APP_NAME}. Lọc theo thể loại, trạng thái, năm phát hành và cập nhật mới nhất.`
      : `Tìm kiếm truyện tranh tại ${config.APP_NAME}. Kho truyện manga, manhwa, manhua với nhiều thể loại và bộ truyện mới cập nhật.`,
    keywords: query ? generateLongTailKeywords(query, 'search') : getDefaultKeywords(),
    path: query ? `/tim-truyen?keyword=${encodeURIComponent(query)}` : '/tim-truyen',
  });
}

export function generateRankingMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Xếp hạng truyện tranh hay nhất',
    description: `Bảng xếp hạng truyện tranh hay nhất theo lượt xem, độ hot và trạng thái. Cập nhật liên tục tại ${config.APP_NAME}.`,
    path: '/xep-hang',
    keywords: ['xếp hạng truyện tranh', 'top truyện tranh', 'truyện tranh hay nhất', 'manga hot', 'manhwa hay'],
  });
}

export function generateHotComicsMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Truyện tranh hot - Truyện trending',
    description: `Tổng hợp truyện tranh hot nhất, trending nhất hiện nay. Cập nhật nhanh các bộ manga, manhwa, manhua đang được đọc nhiều tại ${config.APP_NAME}.`,
    path: '/truyen-hot',
    keywords: ['truyện tranh hot', 'truyện trending', 'manga hot', 'manhwa hot', 'truyện mới nổi'],
  });
}

export function generateStaticMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  return generatePageMetadata({
    title,
    description,
    path: `/${slug}`,
  });
}

export function generateNoIndexMetadata(title: string, path = '/'): Metadata {
  return generatePageMetadata({
    title,
    description: `${title} tại ${config.APP_NAME}.`,
    path,
    noIndex: true,
  });
}
