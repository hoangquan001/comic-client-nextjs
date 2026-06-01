import type { Comic, Chapter, Genre } from '@/types';

const DEFAULT_KEYWORDS =
  'truyện tranh, manga, comic, đọc truyện online, truyện tranh hay, manga việt nam, comic việt nam, truyện tranh miễn phí, đọc truyện tranh không quảng cáo, website đọc truyện tốt nhất, truyện tranh cập nhật nhanh nhất, đọc manga full hd chất lượng cao, truyện tranh online miễn phí Việt Nam';

export function getDefaultKeywords(): string {
  return DEFAULT_KEYWORDS;
}

export function generateLongTailKeywords(
  baseKeyword: string,
  type: 'genre' | 'comic' | 'chapter' | 'search' = 'genre'
): string[] {
  const kw = baseKeyword;
  switch (type) {
    case 'genre':
      return [
        `đọc truyện tranh ${kw} online miễn phí`,
        `truyện tranh ${kw} hay nhất Việt Nam`,
        `list truyện ${kw} đáng đọc nhất`,
        `truyện tranh ${kw} full bộ`,
        `tìm truyện ${kw} chất lượng cao`,
        `top truyện tranh ${kw} hay nhất`,
        `${kw} truyện tranh không lag`,
        `web đọc truyện ${kw} tốt nhất`,
      ];
    case 'comic':
      return [
        `đọc ${kw} chapter mới nhất`,
        `${kw} full bộ tiếng việt`,
        `truyện tranh ${kw} online`,
        `${kw} manga scan Việt`,
        `${kw} không quảng cáo`,
        `${kw} chất lượng hd`,
        `tải ${kw} về máy`,
        `${kw} update nhanh`,
        `${kw} dịch thuật chất lượng`,
        `${kw} đọc miễn phí`,
      ];
    case 'chapter':
      return [
        `đọc ${kw} chapter mới`,
        `${kw} chương mới nhất`,
        `${kw} full chapter`,
        `${kw} không lag`,
        `${kw} hd quality`,
        `${kw} tiếng Việt`,
        `${kw} scan chất lượng`,
        `${kw} online free`,
      ];
    case 'search':
      return [
        `tìm truyện tranh ${kw}`,
        `search manga ${kw}`,
        `${kw} truyện hay`,
        `${kw} manhwa recommend`,
        `${kw} top rated`,
        `${kw} full series`,
        `${kw} completed manga`,
        `${kw} ongoing series`,
      ];
  }
}

export function generateComicKeywords(comic: Comic, count = 8): string[] {
  const keywords = generateLongTailKeywords(comic.title, 'comic');
  // if (comic.genres) {
  //   const genreKeywords = comic.genres.map((g) => `truyện ${g.title}`);
  //   keywords.push(...genreKeywords);
  // }
  if (comic.status === 1) keywords.push(`${comic.title} đã hoàn thành`);
  return keywords.slice(0, count);
}

export function generateChapterKeywords(comic: Comic, chapter: Chapter): string[] {
  const chapterTitle = `${comic.title} chương ${chapter.chapterNumber || chapter.slug}`;
  return generateLongTailKeywords(chapterTitle, 'chapter');
}

export function genComicKeyWords(comic: Comic, chapter?: Chapter): string {
  const keywords = generateComicKeywords(comic);
  if (chapter) {
    keywords.push(...generateChapterKeywords(comic, chapter));
  }
  return [...new Set(keywords)].join(', ');
}
