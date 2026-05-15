import { Comic } from './comic';

export interface Page {
  pageNumber: number;
  url: string;
}

export interface ComicList {
  comics: Comic[];
  totalpage: number;
  page: number;
  step: number;
}

export interface ComicTopView {
  dailyComics: Comic[];
  weeklyComics: Comic[];
  monthlyComics: Comic[];
}
