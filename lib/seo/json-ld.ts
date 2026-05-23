import type { Comic, Chapter, Genre } from '@/types';
import { config } from '@/lib/config';
import { fillDescription } from '../utils/description';

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
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.APP_NAME,
    url: config.BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.BASE_URL}/tim-truyen?keyword={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateComicSchema(comic: Comic) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: comic.title,
    description: fillDescription(comic.description, comic),
    image: comic.coverImage || undefined,
    author: comic.author ? { '@type': 'Person', name: comic.author } : undefined,
    url: `${config.BASE_URL}/truyen-tranh/${comic.url}`,
    genre: comic.genres?.map((g) => g.title).join(', '),
    inLanguage: 'vi',
    bookFormat: 'GraphicNovel',
  };
}

export function generateChapterSchema(comic: Comic, chapter: Chapter) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${comic.title} - Chương ${chapter.chapterNumber || chapter.slug}`,
    description: `Đọc ${comic.title} chương ${chapter.chapterNumber || chapter.slug} online miễn phí`,
    url: `${config.BASE_URL}/truyen-tranh/${comic.url}/chuong-${chapter.slug}`,
    isPartOf: {
      '@type': 'Book',
      name: comic.title,
      url: `${config.BASE_URL}/truyen-tranh/${comic.url}`,
    },
    author: comic.author ? { '@type': 'Person', name: comic.author } : undefined,
    inLanguage: 'vi',
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
        image: comic.coverImage || undefined,
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
  };
}

export function generateGenreSchema(genre: Genre, comics?: Comic[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Truyện tranh ${genre.title}`,
    description: genre.description || `Tổng hợp truyện tranh thể loại ${genre.title}`,
    url: `${config.BASE_URL}/the-loai/${genre.slug}`,
  };
}
