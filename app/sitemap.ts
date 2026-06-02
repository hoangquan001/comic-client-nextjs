import type { MetadataRoute } from 'next';
import { ComicAPI } from '@/lib/api';
import { config } from '@/lib/config';
import { GENRES } from '@/lib/constants/genres';
import type { Comic } from '@/types';

export const revalidate = 3600;

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'hourly', priority: 1 },
  { path: '/tim-truyen', changeFrequency: 'daily', priority: 0.9 },
  { path: '/truyen-hot', changeFrequency: 'hourly', priority: 0.9 },
  { path: '/xep-hang', changeFrequency: 'hourly', priority: 0.85 },
  { path: '/the-loai', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/gioi-thieu', changeFrequency: 'monthly', priority: 0.45 },
  { path: '/lien-he', changeFrequency: 'monthly', priority: 0.35 },
  { path: '/cau-hoi-thuong-gap', changeFrequency: 'monthly', priority: 0.45 },
  { path: '/so-do-website', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/dieu-khoan', changeFrequency: 'yearly', priority: 0.25 },
  { path: '/chinh-sach-bao-mat', changeFrequency: 'yearly', priority: 0.25 },
  { path: '/ban-quyen', changeFrequency: 'yearly', priority: 0.25 },
];

function absoluteUrl(path: string): string {
  return `${config.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function normalizeImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return absoluteUrl(image);
  return `https://cdn1.anhtruyen.com/coverimg/${image}`;
}

async function getSitemapComics(): Promise<Comic[]> {
  try {
    const firstPage = await ComicAPI.getComics({ page: 1, step: 100 });
    const totalPages = Math.min(firstPage?.totalpage || 1, 10);
    const restPages = await Promise.all(
      Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) =>
        ComicAPI.getComics({ page: index + 2, step: 100 }).catch(() => undefined)
      )
    );

    const comics = [
      ...(firstPage?.comics || []),
      ...restPages.flatMap((page) => page?.comics || []),
    ];

    const unique = new Map<number | string, Comic>();
    for (const comic of comics) {
      unique.set(comic.id || comic.url, comic);
    }

    return Array.from(unique.values());
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const comics = await getSitemapComics();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const genreEntries: MetadataRoute.Sitemap = GENRES.filter((genre) => genre.slug).map((genre) => ({
    url: absoluteUrl(`/the-loai/${genre.slug}`),
    lastModified: now,
    changeFrequency: 'daily',
    priority: genre.ageLimit ? 0.45 : 0.75,
  }));

  const comicEntries: MetadataRoute.Sitemap = comics.map((comic) => {
    const image = normalizeImageUrl(comic.coverImage);

    return {
      url: absoluteUrl(`/truyen-tranh/${comic.url}`),
      lastModified: comic.updateAt ? new Date(comic.updateAt) : now,
      changeFrequency: comic.status === 1 ? 'weekly' : 'daily',
      priority: comic.status === 1 ? 0.75 : 0.85,
      images: image ? [image] : undefined,
    };
  });

  return [...staticEntries, ...genreEntries, ...comicEntries];
}
