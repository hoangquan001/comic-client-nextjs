import { Comic } from './comic';

export interface Chapter {
  id: number;
  title?: string;
  slug: number;
  chapterNumber?: number;
  viewCount?: number;
  updateAt?: string;
}

export interface ChapterServer {
  id: number;
  chapterId: number;
  serverName?: string;
  host?: string;
  referer?: string;
  images?: string[];
  code?: string;
  status: number;
  isDefault: number;
  updatedAt: Date;
}

export interface ChapterPage extends Chapter {
  comic: Comic;
  chapterServers: ChapterServer[];
}
