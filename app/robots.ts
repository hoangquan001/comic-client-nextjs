import type { MetadataRoute } from 'next';
import { config } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/auth/',
    '/api/',
    '/dong-bo-truyen',
    '/lich-su',
    '/tai-khoan/',
    '/theo-doi',
  ];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: privatePaths,
    },
    sitemap: `${config.BASE_URL}/sitemap.xml`,
    host: config.BASE_URL,
  };
}
