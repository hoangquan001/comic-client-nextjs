import type { Comic, Chapter, Genre } from '@/types';
import { config } from '@/lib/config';
import { fillDescription } from '../utils/description';

export type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

function absoluteUrl(path = ''): string {
  if (!path) return config.BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${config.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function normalizeImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return absoluteUrl(image);
  return `https://cdn1.anhtruyen.com/coverimg/${image}`;
}

function stripHtml(value?: string | null): string | undefined {
  return value?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || undefined;
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.APP_NAME,
    url: config.BASE_URL,
    inLanguage: 'vi-VN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.BASE_URL}/tim-truyen?keyword={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.APP_NAME,
    url: config.BASE_URL,
    logo: absoluteUrl('/logo.png'),
    sameAs: [config.BASE_URL],
  };
}

export function generateComicSchema(comic: Comic) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: comic.title,
    alternateName: comic.otherName || undefined,
    description: stripHtml(fillDescription(comic.description, comic, false)),
    image: normalizeImageUrl(comic.coverImage),
    author: comic.author ? { '@type': 'Person', name: comic.author } : undefined,
    url: `${config.BASE_URL}/truyen-tranh/${comic.url}`,
    genre: comic.genres?.map((g) => g.title).join(', '),
    inLanguage: 'vi',
    bookFormat: 'GraphicNovel',
    aggregateRating: comic.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: comic.rating,
          bestRating: 5,
          worstRating: 1,
          ratingCount: Math.max(Math.floor(comic.viewCount / 100) || 1, 1),
        }
      : undefined,
    dateModified: comic.updateAt,
  };
}

export function generateChapterSchema(comic: Comic, chapter: Chapter, chapterPath?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${comic.title} - Chương ${chapter.chapterNumber || chapter.slug}`,
    description: `Đọc ${comic.title} chương ${chapter.chapterNumber || chapter.slug} online miễn phí`,
    url: absoluteUrl(chapterPath || `/truyen-tranh/${comic.url}/chuong-${chapter.slug}`),
    image: normalizeImageUrl(comic.coverImage),
    isPartOf: {
      '@type': 'Book',
      name: comic.title,
      url: `${config.BASE_URL}/truyen-tranh/${comic.url}`,
    },
    author: comic.author ? { '@type': 'Person', name: comic.author } : undefined,
    publisher: {
      '@type': 'Organization',
      name: config.APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    inLanguage: 'vi',
    dateModified: chapter.updateAt || comic.updateAt,
  };
}

export function generateComicListSchema(
  comics: Comic[],
  listName: string,
  listDescription?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    itemListElement: comics.slice(0, 10).map((comic, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Book',
        name: comic.title,
        url: `${config.BASE_URL}/truyen-tranh/${comic.url}`,
        image: normalizeImageUrl(comic.coverImage),
      },
    })),
  };
}

export function generateComicFAQSchema(comic: Comic) {
  const faqs = [
    {
      '@type': 'Question',
      name: `Đọc truyện ${comic.title} ở đâu?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Bạn có thể đọc truyện ${comic.title} miễn phí tại ${config.APP_NAME} - ${config.BASE_URL}`,
      },
    },
    {
      '@type': 'Question',
      name: `Truyện ${comic.title} đã hoàn thành chưa?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: comic.status === 1
          ? `Truyện ${comic.title} đã hoàn thành.`
          : `Truyện ${comic.title} đang trong quá trình cập nhật.`,
      },
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs,
  };
}

export function generateSearchSchema(query: string, totalResults?: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Tìm kiếm: ${query}`,
    description: `Kết quả tìm kiếm cho "${query}"${totalResults ? ` - ${totalResults} kết quả` : ''}`,
    url: `${config.BASE_URL}/tim-truyen?keyword=${encodeURIComponent(query)}`,
  };
}

export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Liên hệ',
    url: `${config.BASE_URL}/lien-he`,
    inLanguage: 'vi-VN',
  };
}

export function generateGenreSchema(genre: Genre, comics?: Comic[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Truyện tranh ${genre.title}`,
    description: genre.description || `Tổng hợp truyện tranh thể loại ${genre.title}`,
    url: `${config.BASE_URL}/the-loai/${genre.slug}`,
    inLanguage: 'vi-VN',
    mainEntity: comics?.length ? generateComicListSchema(comics, `Truyện ${genre.title}`).itemListElement : undefined,
  };
}

export function generateFAQPageSchema(
  faqs: { question: string; answer: string }[],
  name = 'Câu hỏi thường gặp'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
