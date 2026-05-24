import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client-fetch';
import type {
  Comic,
  ComicList,
  Chapter,
  ChapterPage,
  ChapterServer,
  Character,
  Announcement,
  IServiceResponse,
  TopType,
  ComicStatus,
  SortType,
  UserExpType,
} from '@/types';

function unwrap<T>(res: IServiceResponse<T>): T {
  if ((res.status !== 200 && res.status !== 1) || !res.data) {
    throw new Error(res.message || 'API error');
  }
  return res.data;
}

export function useHotComics(page = 1, step = 30) {
  return useQuery({
    queryKey: ['hotComics', page, step],
    queryFn: () =>
      clientFetch<IServiceResponse<ComicList>>(
        `/hotcomics?page=${page}&step=${step}`
      ).then(unwrap),
  });
}

export function useComics(params: {
  page?: string;
  step?: string;
  genre?: string;
  sort?: string;
  status?: string;
}, initialData?: ComicList | null) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page);
  if (params.step) searchParams.set('step', params.step);
  if (params.genre) searchParams.set('genre', params.genre);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.status) searchParams.set('status', params.status);

  return useQuery({
    queryKey: ['comics', params],
    queryFn: () =>
      clientFetch<IServiceResponse<ComicList>>(
        `/comics?${searchParams.toString()}`
      ).then(unwrap),
    initialData,
  });
}

export function useRecommendComics(initialData?: Comic[] | null) {
  return useQuery({
    queryKey: ['recommendComics'],
    queryFn: () =>
      clientFetch<IServiceResponse<Comic[]>>(`/comic/recommend`).then(unwrap),
    initialData
  }

  );
}

export function useComicById(
  id: string | number | null,
  chaptercount?: number
) {
  return useQuery({
    queryKey: ['comic', id, chaptercount],
    queryFn: () => {
      const params = chaptercount !== undefined ? `?chaptercount=${chaptercount}` : '';
      return clientFetch<IServiceResponse<Comic>>(
        `/comic/${id}${params}`
      ).then(unwrap);
    },
    enabled: !!id,
  });
}

export function useComicsByIds(ids: number[]) {
  return useQuery({
    queryKey: ['comicsByIds', ids],
    queryFn: () =>
      clientFetch<IServiceResponse<Comic[]>>(
        `/comicsbyids?ids=${ids.join(',')}`
      ).then(unwrap),
    enabled: ids.length > 0,
  });
}

export function useChapterImgs(comicKey: string | null, chapterKey: string | null) {
  return useQuery({
    queryKey: ['chapterImgs', comicKey, chapterKey],
    queryFn: () =>
      clientFetch<IServiceResponse<ChapterPage>>(
        `/comic/${comicKey}/chapter/${chapterKey}`
      ).then(unwrap),
    enabled: !!comicKey && !!chapterKey,
  });
}

export function useChapters(comicId: number | null) {
  return useQuery({
    queryKey: ['chapters', comicId],
    queryFn: () =>
      clientFetch<IServiceResponse<Chapter[]>>(
        `/comic/${comicId}/chapters`
      ).then(unwrap),
    enabled: !!comicId,
  });
}

export function useTopComics(type: TopType) {
  return useQuery({
    queryKey: ['topComics', type],
    queryFn: () =>
      clientFetch<IServiceResponse<Comic[]>>(
        `/comic/topview?type=${type}`
      ).then(unwrap),
  });
}

export function useSearchComic(keyword: string) {
  return useQuery({
    queryKey: ['searchComic', keyword],
    queryFn: () =>
      clientFetch<IServiceResponse<Comic[]>>(
        `/comic/search?keyword=${encodeURIComponent(keyword)}`
      ).then(unwrap),
    enabled: keyword.length > 0,
  });
}

export function useComicsByAuthor(author: string, size = 20) {
  return useQuery({
    queryKey: ['comicsByAuthor', author, size],
    queryFn: () =>
      clientFetch<IServiceResponse<Comic[]>>(
        `/comicsbyauthor?author=${encodeURIComponent(author)}&size=${size}`
      ).then(unwrap),
    enabled: !!author,
  });
}

export function useAdvanceSearch(params: {
  page?: number;
  step?: number;
  sort?: number;
  status?: number;
  genres?: string;
  nogenres?: string;
  year?: number;
  keyword?: string;
}) {
  const sp = new URLSearchParams();
  sp.set('page', String(params.page ?? 1));
  sp.set('step', String(params.step ?? 40));
  sp.set('sort', String(params.sort ?? 1));
  sp.set('status', String(params.status ?? -1));
  if (params.genres) sp.set('genres', params.genres);
  if (params.nogenres) sp.set('nogenres', params.nogenres);
  if (params.year && params.year !== -1) sp.set('year', String(params.year));
  if (params.keyword) sp.set('keyword', params.keyword);

  return useQuery({
    queryKey: ['advanceSearch', params],
    queryFn: () =>
      clientFetch<IServiceResponse<ComicList>>(
        `/comic/advance?${sp.toString()}`
      ).then(unwrap),
  });
}

export function useSimilarComic(comicId: number | null) {
  return useQuery({
    queryKey: ['similarComic', comicId],
    queryFn: () =>
      clientFetch<IServiceResponse<Comic[]>>(
        `/comic/similar/${comicId}`
      ).then(unwrap),
    enabled: !!comicId,
  });
}

export function useCharactersByComicId(comicId: number | null) {
  return useQuery({
    queryKey: ['characters', comicId],
    queryFn: () =>
      clientFetch<IServiceResponse<Character[]>>(
        `/comic/characters/${comicId}`
      ).then(unwrap),
    enabled: !!comicId,
  });
}

export function useAnnouncement(initialData?: Announcement[]) {
  return useQuery({
    queryKey: ['announcement'],
    queryFn: () =>
      clientFetch<IServiceResponse<Announcement[]>>(`/announcement`).then(
        unwrap
      ),
    initialData,
  });
}

export function useChapterServer(serverId: number | null) {
  return useQuery({
    queryKey: ['chapterServer', serverId],
    queryFn: () =>
      clientFetch<IServiceResponse<ChapterServer>>(
        `/comic/chapter-server?ServerId=${serverId}`
      ).then(unwrap),
    enabled: !!serverId,
  });
}
