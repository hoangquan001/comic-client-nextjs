import { config } from '@/lib/config';
import type { Comic, Chapter } from '@/types';

export enum DomainType {
  Main = 0,
  Sub = 1,
}

export const DOMAIN_TYPE: DomainType = DomainType.Sub;

export function getComicDetailUrl(comic: { url: string; id: number }): string {
  if (DOMAIN_TYPE === DomainType.Sub) {
    return `/truyen-tranh/${comic.url}`;
  }
  return `/truyen-tranh/${comic.url}-${comic.id}`;
}

export function getCharacterListUrl(comic: Comic): string {
  if (DOMAIN_TYPE === DomainType.Sub) {
    return `/truyen-tranh/${comic.url}/nhan-vat`;
  }
  return `/truyen-tranh/${comic.url}-${comic.id}/nhan-vat`;
}

export function getChapterDetailUrl(
  comic: Comic | { url: string; id: number },
  chapter: Chapter | { slug: number; id: number }
): string {
  if (DOMAIN_TYPE === DomainType.Sub) {
    return `/truyen-tranh/${comic.url}/chuong-${chapter.slug}`;
  }
  return `/truyen-tranh/${comic.url}/${chapter.id}`;
}

export function getChapterDetailUrl2(
  comicUrl: string,
  chapterId: number,
  chapterUrl: string
): string {
  if (DOMAIN_TYPE === DomainType.Sub) {
    return `/truyen-tranh/${comicUrl}/chuong-${chapterUrl}`;
  }
  return `/truyen-tranh/${comicUrl}/${chapterId}`;
}

export function getUrl(path: string): string {
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${config.BASE_URL}${path}`;
  return `${config.BASE_URL}/${path}`;
}

export function getCanonicalUrl(path: string): string {
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${config.BASE_URL}${path}`;
  return `${config.BASE_URL}/${path}`;
}

export function getFullComicUrl(comic: Comic): string {
  if (DOMAIN_TYPE === DomainType.Sub) {
    return `${config.BASE_URL}/truyen-tranh/${comic.url}`;
  }
  return `${config.BASE_URL}/truyen-tranh/${comic.url}-${comic.id}`;
}

export function getFullChapterUrl(comic: Comic, chapter: Chapter): string {
  if (DOMAIN_TYPE === DomainType.Sub) {
    return `${config.BASE_URL}/truyen-tranh/${comic.url}/chuong-${chapter.slug}`;
  }
  return `${config.BASE_URL}/truyen-tranh/${comic.url}/${chapter.id}`;
}
