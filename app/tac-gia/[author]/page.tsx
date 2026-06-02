import type { Metadata } from 'next';
import { ComicAPI } from '@/lib/api';
import type { Comic } from '@/types';
import AuthorComicsContent from './author-comics-content';
import { getServerGridType } from '@/lib/utils/cookie';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicListSchema } from '@/lib/seo/json-ld';

interface Props {
  params: Promise<{ author: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  return generatePageMetadata({
    title: `Truyện của tác giả ${decoded}`,
    description: `Danh sách tất cả các bộ truyện tranh của tác giả ${decoded} tại MeTruyenMoi. Cập nhật nhanh các chương mới nhất.`,
    path: `/tac-gia/${author}`,
    keywords: [`truyện của ${decoded}`, `tác giả ${decoded}`, `${decoded} manga`, `${decoded} truyện tranh`],
  });
}

export default async function AuthorComicsPage({ params }: Props) {
  const { author: encodedAuthor } = await params;
  const author = decodeURIComponent(encodedAuthor);
  const gridType = await getServerGridType();

  let initialData: Comic[] | null = null;
  try {
    initialData = await ComicAPI.getComicsByAuthor(author) ?? null;
  } catch {}

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: `Tác giả ${author}`, url: `/tac-gia/${encodedAuthor}` },
          ]),
          generateComicListSchema(initialData || [], `Truyện của tác giả ${author}`),
        ]}
      />
      <AuthorComicsContent
        author={author}
        encodedAuthor={encodedAuthor}
        initialData={initialData}
        gridType={gridType}
      />
    </>
  );
}
