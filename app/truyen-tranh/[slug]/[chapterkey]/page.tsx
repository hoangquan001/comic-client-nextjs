import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateChapterMetadata } from '@/lib/seo/metadata';
import type { ChapterPage } from '@/types';
import ChapterReaderContent from './chapter-reader-content';
import { ComicAPI } from '@/lib/api';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateChapterSchema } from '@/lib/seo/json-ld';

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterkey: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug, chapterkey } = await params;
  try {
    const chapter = await ComicAPI.getChapter({ slug, chapterkey });
    if (!chapter) return { title: 'Không tìm thấy chương' };
    return generateChapterMetadata(chapter.comic, chapter, `/truyen-tranh/${slug}/${chapterkey}`);
  } catch {
    return { title: 'Không tìm thấy chương' };
  }
}

export default async function ChapterReaderPage({ params }: ChapterPageProps) {
  const { slug, chapterkey } = await params;
  let chapterData: ChapterPage;
  try {
    const chapter = await ComicAPI.getChapter({ slug, chapterkey });
    if (!chapter) notFound();
    chapterData = chapter;
  } catch {
    notFound();
  }

  const comic = chapterData.comic;

  if (comic.coverImage && !comic.coverImage.startsWith('https://')) {
    comic.coverImage = 'https://cdn1.anhtruyen.com/coverimg/' + comic.coverImage;
  }

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: comic.title, url: `/truyen-tranh/${comic.url}` },
            {
              name: `Chương ${chapterData.chapterNumber || chapterData.slug}`,
              url: `/truyen-tranh/${slug}/${chapterkey}`,
            },
          ]),
          generateChapterSchema(comic, chapterData, `/truyen-tranh/${slug}/${chapterkey}`),
        ]}
      />
      <ChapterReaderContent chapterData={chapterData} />
    </>
  );
}
