import { Chapter } from './chapter';
import { Genre } from './genre';

export interface Comic {
  id: number;
  title: string;
  otherName?: string;
  url: string;
  author?: string;
  description?: string | null;
  coverImage?: string;
  viewCount: number;
  status: number;
  rating: number;
  createAt?: string;
  updateAt: string;
  genres: Genre[];
  chapters?: Chapter[];
  isFollow?: boolean;
  numChapter: number;
  type: boolean;
}
