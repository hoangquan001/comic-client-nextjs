export interface IHistoryComic {
    id: number;
    title: string;
    url: string;
    coverImage?: string;
    rating: number;
    updateAt: string;
    chapters?: IHistoryChapter[];
}

export interface IHistoryChapter {
    id: number;
    title?: string;
    slug: number;
}