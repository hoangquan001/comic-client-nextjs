import type { MetadataRoute } from 'next';
import { config } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${config.APP_NAME} - Đọc Truyện Tranh Online`,
    short_name: config.APP_NAME,
    description: `Đọc truyện tranh online miễn phí tại ${config.APP_NAME}. Cập nhật manga, manhwa, manhua nhanh và mượt.`,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F86E4C',
    lang: 'vi-VN',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
