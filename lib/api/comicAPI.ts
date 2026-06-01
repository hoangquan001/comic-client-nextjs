import { Announcement, ChapterPage, Comic, ComicList, IServiceResponse } from "@/types";
import { publicFetch } from "./server-fetch";

export function unwrap<T>(data: IServiceResponse<T>): T | undefined {
    if (data.status !== 200 && data.status !== 1) {
        return undefined
    }
    return data.data;
}

interface GetComicsParams {
    page: number;
    step?: number;
    genre?: number;
    sort?: number;
    status?: number;
}

interface AdvanceComicsParams {
    page: number;
    step?: number;
    sort?: number;
    status?: number;
    genres?: string;
    nogenres?: string;
    year?: number;
    keyword?: string;
}

function buildQuery(params: Record<string, string | number | undefined>) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    return searchParams.toString();
}

export class ComicAPI {
    static async getComic(idOrSlug: number | string, chaptercount?: number): Promise<Comic | undefined> {
        const query = chaptercount ? `?chaptercount=${chaptercount}` : '';
        return publicFetch<IServiceResponse<Comic>>(`/comic/${idOrSlug}${query}`).then(unwrap);
    }

    static async getComics({
        page,
        step = 30,
        genre = -1,
        sort = 1,
        status = -1,
    }: GetComicsParams): Promise<ComicList | undefined> {
        const query = buildQuery({ page, step, genre, sort, status });
        return publicFetch<IServiceResponse<ComicList>>(`/comics?${query}`)
            .then(unwrap);
    }

    static async getAdvanceComics({ page, step = 30, sort = 1, status = -1, genres, nogenres, year, keyword, }: AdvanceComicsParams): Promise<ComicList | undefined> {
        const query = buildQuery({
            page,
            step,
            sort,
            status,
            genres,
            nogenres,
            year: year && year > 0 ? year : undefined,
            keyword,
        });

        return publicFetch<IServiceResponse<ComicList>>(`/comic/advance?${query}`)
            .then(unwrap);
    }

    static async getHotComics(page: number, step = 30): Promise<ComicList | undefined> {
        const query = buildQuery({ page, step });
        return publicFetch<IServiceResponse<ComicList>>(`/hotcomics?${query}`)
            .then(unwrap);
    }

    static async getComicsByAuthor(author: string, size = 20): Promise<Comic[] | undefined> {
        const query = buildQuery({ author, size });
        return publicFetch<IServiceResponse<Comic[]>>(`/comicsbyauthor?${query}`)
            .then(unwrap);
    }

    static async getRecommendComics(): Promise<Comic[] | undefined> {
        return publicFetch<IServiceResponse<Comic[]>>(`/comic/recommend`)
            .then(unwrap);
    }

    static async getAnouncements(): Promise<Announcement[] | undefined> {
        return publicFetch<IServiceResponse<Announcement[]>>(`/announcement`)
            .then(unwrap);
    }

    static async getChapter({ slug, chapterkey }: { slug: string, chapterkey: string }): Promise<ChapterPage | undefined> {
        return publicFetch<IServiceResponse<ChapterPage>>(`/comic/${slug}/chapter/${chapterkey}`)
            .then(unwrap);
    }



}
