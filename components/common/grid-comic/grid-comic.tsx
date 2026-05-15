'use client';

import type { Comic } from '@/types';
import { ComicCard, ComicCardV2 } from '../comic-card';

interface GridComicProps {
  title: string;
  listComics: Comic[];
  gridClass?: string;
}

export function GridComic({ title, listComics, gridClass }: GridComicProps) {
  const defaultClass =
    'grid gap-3 grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-6 @6xl:grid-cols-7 mx-2';

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="block-title">{title}</h2>
      </div>
      <div className={gridClass || defaultClass}>
        {listComics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
      {listComics.length === 0 && (
        <div className="text-center py-8 text-gray-500">Không có truyện nào</div>
      )}
    </div>
  );
}

interface ListComicGridProps {
  comics: Comic[];
}

export function ListComicGrid({ comics }: ListComicGridProps) {
  return (
    <div className="grid gap-3 @xl:gap-4 grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {comics.map((comic) => (
        <ComicCardV2 key={comic.id} comic={comic} />
      ))}
    </div>
  );
}
