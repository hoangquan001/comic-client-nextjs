import { NextResponse } from 'next/server';

const TEMP_COMMENTS_API = 'https://metruyenmoi.org/api/comments/comic/52203';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';
  const url = `${TEMP_COMMENTS_API}?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 60 },
    });
    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { status: 500, message: 'Không thể tải bình luận gần đây' },
      { status: 500 }
    );
  }
}
